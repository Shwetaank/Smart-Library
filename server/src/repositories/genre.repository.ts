import { singleton, inject } from 'tsyringe';
import { Prisma, type PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

@singleton()
export class GenreRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(data: Prisma.GenreCreateInput) {
    return this.prisma.genre.create({ data });
  }

  async findMany(params: Record<string, unknown>) {
    const { page = 1, limit = 50, search } = params;
    const skip = (Number(page) - 1) * Number(limit);
    const where: Prisma.GenreWhereInput = { deletedAt: null };

    if (search) {
      where.name = { contains: String(search) };
    }

    const [items, total] = await Promise.all([
      this.prisma.genre.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { name: 'asc' },
      }),
      this.prisma.genre.count({ where }),
    ]);

    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: string) {
    const item = await this.prisma.genre.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new AppError('Genre not found', 404);
    return item;
  }

  async update(id: string, data: Prisma.GenreUpdateInput) {
    await this.findById(id);
    return this.prisma.genre.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    await this.findById(id);
    const activeBookCount = await this.prisma.book.count({ where: { genreId: id, deletedAt: null } });
    if (activeBookCount > 0) {
      throw new AppError('Cannot delete genre with active books', 400);
    }

    return this.prisma.genre.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
