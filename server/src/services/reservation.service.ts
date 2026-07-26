import { inject, singleton } from 'tsyringe';
import { ReservationRepository } from '../repositories/reservation.repository.js';
import { BookRepository } from '../repositories/book.repository.js';
import { AppError } from '../utils/appError.js';
import { AuditService } from './audit.service.js';

@singleton()
export class ReservationService {
  constructor(
    @inject(ReservationRepository) private readonly reservationRepository: ReservationRepository,
    @inject(BookRepository) private readonly bookRepository: BookRepository,
    @inject(AuditService) private readonly auditService: AuditService,
  ) {}

  async placeHold(userId: string, bookId: string) {
    const book = await this.bookRepository.findById(bookId);
    if (book.availableCopies > 0) {
      throw new AppError('Book is available now; reservation not needed', 400);
    }

    const reservation = await this.reservationRepository.create({
      user: { connect: { id: userId } },
      book: { connect: { id: bookId } },
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await this.auditService.log(
      'RESERVATION_CREATED',
      'Reservation',
      JSON.stringify({ reservationId: reservation.id, bookId }),
      userId,
    );
    return reservation;
  }

  async cancelHold(userId: string, reservationId: string) {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (reservation.userId !== userId) throw new AppError('Unauthorized', 403);
    const updatedReservation = await this.reservationRepository.update(reservationId, { status: 'CANCELLED' });
    await this.auditService.log('RESERVATION_CANCELLED', 'Reservation', JSON.stringify({ reservationId }), userId);
    return updatedReservation;
  }

  async fulfillHold(reservationId: string, actorId?: string) {
    const reservation = await this.reservationRepository.findById(reservationId);
    if (reservation.status === 'FULFILLED') throw new AppError('Reservation already fulfilled', 400);
    const updatedReservation = await this.reservationRepository.update(reservationId, {
      status: 'FULFILLED',
      fulfilledAt: new Date(),
    });
    await this.auditService.log(
      'RESERVATION_FULFILLED',
      'Reservation',
      JSON.stringify({ reservationId }),
      actorId,
    );
    return updatedReservation;
  }

  async listReservations(userId: string) {
    return this.reservationRepository.findManyByUser(userId);
  }
}
