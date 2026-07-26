import { singleton, inject } from 'tsyringe';
import type { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

@singleton()
export class BookRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(data: Record<string, unknown>) {
    return this.prisma.book.create({ data: data as never });
  }

  async findMany(params: Record<string, unknown>) {
    const {
      page = 1,
      limit = 10,
      search,
      genreId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { deletedAt: null };
    if (search !== undefined && search !== null) {
      const searchStr = typeof search === 'string' || typeof search === 'number' ? String(search) : '';
      if (searchStr) {
        where.OR = [
          { title: { contains: searchStr } },
          { author: { contains: searchStr } },
          { isbn: { contains: searchStr } },
        ];
      }
    }
    if (genreId !== undefined && genreId !== null) {
      const genreIdStr = typeof genreId === 'string' || typeof genreId === 'number'
        ? String(genreId)
        : undefined;
      if (genreIdStr) {
        where.genreId = genreIdStr;
      }
    }

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [String(sortBy)]: String(sortOrder) },
        include: { genre: true },
      }),
      this.prisma.book.count({ where }),
    ]);

    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: string) {
    const item = await this.prisma.book.findFirst({
      where: { id, deletedAt: null },
      include: { genre: true },
    });
    if (!item) throw new AppError('Book not found', 404);
    return item;
  }

  async update(id: string, data: Record<string, unknown>) {
    return this.prisma.book.update({ where: { id }, data: data as never });
  }

  async softDelete(id: string) {
    return this.prisma.book.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
