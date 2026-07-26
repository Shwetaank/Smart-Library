import { singleton, inject } from 'tsyringe';
import { Prisma, type PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

@singleton()
export class LoanRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(data: Prisma.LoanCreateInput) {
    return this.prisma.loan.create({ data });
  }

  async findActiveByUserAndBook(userId: string, bookId: string) {
    return this.prisma.loan.findFirst({
      where: { userId, bookId, status: 'ACTIVE', deletedAt: null },
    });
  }

  async findById(id: string) {
    const item = await this.prisma.loan.findFirst({ where: { id, deletedAt: null }, include: { book: true } });
    if (!item) throw new AppError('Loan not found', 404);
    return item;
  }

  async findManyByUser(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { book: true },
    });
  }

  async countActiveByUser(userId: string) {
    return this.prisma.loan.count({ where: { userId, status: 'ACTIVE', deletedAt: null } });
  }

  async update(id: string, data: Prisma.LoanUpdateInput) {
    return this.prisma.loan.update({ where: { id }, data });
  }

  async withTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(callback);
  }
}
