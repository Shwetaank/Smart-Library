import { inject, singleton } from 'tsyringe';
import { BookRepository } from '../repositories/book.repository.js';
import { GenreRepository } from '../repositories/genre.repository.js';
import { AppError } from '../utils/appError.js';
import { AuditService } from './audit.service.js';

@singleton()
export class BookService {
  constructor(
    @inject(BookRepository) private readonly bookRepository: BookRepository,
    @inject(GenreRepository) private readonly genreRepository: GenreRepository,
    @inject(AuditService) private readonly auditService: AuditService,
  ) {}

  async createBook(input: Record<string, unknown>, actorId?: string) {
    await this.genreRepository.findById(String(input.genreId));

    const availableCopies = Number(input.quantity ?? 1);
    const book = await this.bookRepository.create({
      ...input,
      quantity: availableCopies,
      availableCopies,
    });
    await this.auditService.log('BOOK_CREATED', 'Book', JSON.stringify({ bookId: book.id }), actorId);
    return book;
  }

  async listBooks(query: Record<string, unknown>) {
    return this.bookRepository.findMany(query);
  }

  async getBook(id: string) {
    return this.bookRepository.findById(id);
  }

  async updateBook(id: string, input: Record<string, unknown>, actorId?: string) {
    const existing = await this.bookRepository.findById(id);
    const qty = input.quantity !== undefined ? Number(input.quantity) : existing.quantity;
    const borrowedCopies = existing.quantity - existing.availableCopies;
    if (qty < borrowedCopies) {
      throw new AppError('Quantity cannot be less than currently borrowed copies', 400);
    }

    if (input.genreId) {
      await this.genreRepository.findById(String(input.genreId));
    }

    const availableCopies = input.quantity !== undefined ? qty - borrowedCopies : existing.availableCopies;

    const book = await this.bookRepository.update(id, {
      ...input,
      quantity: qty,
      availableCopies,
    });
    await this.auditService.log('BOOK_UPDATED', 'Book', JSON.stringify({ bookId: id }), actorId);
    return book;
  }

  async deleteBook(id: string, actorId?: string) {
    const book = await this.bookRepository.softDelete(id);
    await this.auditService.log('BOOK_DELETED', 'Book', JSON.stringify({ bookId: id }), actorId);
    return book;
  }
}
