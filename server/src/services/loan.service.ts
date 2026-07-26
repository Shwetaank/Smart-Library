import { inject, singleton } from 'tsyringe';
import { LoanRepository } from '../repositories/loan.repository.js';
import { BookRepository } from '../repositories/book.repository.js';
import { AppError } from '../utils/appError.js';
import { AuditService } from './audit.service.js';

@singleton()
export class LoanService {
  constructor(
    @inject(LoanRepository) private readonly loanRepository: LoanRepository,
    @inject(BookRepository) private readonly bookRepository: BookRepository,
    @inject(AuditService) private readonly auditService: AuditService,
  ) {}

  async borrowBook(userId: string, bookId: string) {
    const book = await this.bookRepository.findById(bookId);
    if (book.availableCopies <= 0) throw new AppError('No available copies', 400);

    const existingActive = await this.loanRepository.findActiveByUserAndBook(userId, bookId);
    if (existingActive) throw new AppError('Book already borrowed', 400);

    const activeLoans = await this.loanRepository.countActiveByUser(userId);
    if (activeLoans >= 5) throw new AppError('Maximum active loans exceeded', 400);

    const loan = await this.loanRepository.withTransaction(async (tx) => {
      const lockedBook = await tx.book.findUnique({ where: { id: bookId } });
      if (!lockedBook || lockedBook.availableCopies <= 0) throw new AppError('No available copies', 400);

      const loan = await tx.loan.create({
        data: {
          userId,
          bookId,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          fineAmount: 0,
        },
      });

      await tx.book.update({ where: { id: bookId }, data: { availableCopies: { decrement: 1 } } });
      return loan;
    });
    await this.auditService.log('BOOK_BORROWED', 'Loan', JSON.stringify({ loanId: loan.id, bookId }), userId);
    return loan;
  }

  async returnBook(userId: string, loanId: string) {
    const loan = await this.loanRepository.findById(loanId);
    if (loan.userId !== userId) throw new AppError('Unauthorized', 403);
    if (loan.status === 'RETURNED') throw new AppError('Loan already returned', 400);

    const fineAmount = this.calculateFine(loan.dueDate, new Date());
    const updatedLoan = await this.loanRepository.withTransaction(async (tx) => {
      const updatedLoan = await tx.loan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnedAt: new Date(),
          fineAmount,
        },
      });
      await tx.book.update({ where: { id: loan.bookId }, data: { availableCopies: { increment: 1 } } });
      return updatedLoan;
    });
    await this.auditService.log('BOOK_RETURNED', 'Loan', JSON.stringify({ loanId }), userId);
    return updatedLoan;
  }

  async renewLoan(userId: string, loanId: string) {
    const loan = await this.loanRepository.findById(loanId);
    if (loan.userId !== userId) throw new AppError('Unauthorized', 403);
    if (loan.renewedCount >= 1) throw new AppError('Loan already renewed once', 400);

    const updatedLoan = await this.loanRepository.update(loanId, {
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      renewedCount: { increment: 1 },
    });
    await this.auditService.log('LOAN_RENEWED', 'Loan', JSON.stringify({ loanId }), userId);
    return updatedLoan;
  }

  async getLoanHistory(userId: string) {
    return this.loanRepository.findManyByUser(userId);
  }

  private calculateFine(dueDate: Date, returnedAt: Date): number {
    const diffDays = Math.max(0, Math.ceil((returnedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    return diffDays * 5;
  }
}
