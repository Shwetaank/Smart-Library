import { singleton, inject } from 'tsyringe';
import type { PrismaClient } from '@prisma/client';

@singleton()
export class AuditRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(data: Record<string, unknown>) {
    return this.prisma.auditLog.create({ data: data as never });
  }

  async findMany(params: Record<string, unknown>) {
    const { page = 1, limit = 10, entity, userId } = params;
    const skip = (Number(page) - 1) * Number(limit);
    const where: Record<string, unknown> = {};
    if (entity !== undefined && entity !== null) {
      where.entity = typeof entity === 'string' ? entity : JSON.stringify(entity);
    }
    if (userId !== undefined && userId !== null) {
      where.userId = typeof userId === 'string' || typeof userId === 'number'
        ? String(userId)
        : JSON.stringify(userId);
    }
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { items, total, page: Number(page), limit: Number(limit) };
  }
}
