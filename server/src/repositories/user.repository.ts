import { singleton, inject } from 'tsyringe';
import { Prisma, type PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

@singleton()
export class UserRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async findByExternalId(externalId: string) {
    return this.prisma.user.findUnique({ where: { externalId } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findMany(params: Record<string, unknown>) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: String(search) } },
        { name: { contains: String(search) } },
      ];
    }
    if (role) {
      where.role = String(role);
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page: Number(page), limit: Number(limit) };
  }

  async findById(id: string) {
    const item = await this.prisma.user.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new AppError('User not found', 404);
    return item;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }
}
