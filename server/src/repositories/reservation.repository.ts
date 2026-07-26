import { singleton, inject } from 'tsyringe';
import { Prisma, type PrismaClient } from '@prisma/client';
import { AppError } from '../utils/appError.js';

@singleton()
export class ReservationRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(data: Prisma.ReservationCreateInput) {
    return this.prisma.reservation.create({ data });
  }

  async findManyByUser(userId: string) {
    return this.prisma.reservation.findMany({ where: { userId, deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const item = await this.prisma.reservation.findFirst({ where: { id, deletedAt: null } });
    if (!item) throw new AppError('Reservation not found', 404);
    return item;
  }

  async update(id: string, data: Prisma.ReservationUpdateInput) {
    return this.prisma.reservation.update({ where: { id }, data });
  }
}
