import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { ReservationService } from '../services/reservation.service.js';
import { buildResponse } from '../utils/response.js';
import { getAuthenticatedUser, getRequiredParam } from '../utils/request.js';

@injectable()
export class ReservationController {
  constructor(@inject(ReservationService) private readonly reservationService: ReservationService) {}

  // Create a new reservation
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const reservation = await this.reservationService.placeHold(user.id, req.body.bookId);
      res.status(201).json(buildResponse('Reservation created', reservation));
    } catch (error) {
      next(error);
    }
  };

  // Cancel an existing reservation
  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const id = getRequiredParam(req, 'id');
      const reservation = await this.reservationService.cancelHold(user.id, id);
      res.status(200).json(buildResponse('Reservation cancelled', reservation));
    } catch (error) {
      next(error);
    }
  };

  // Fulfill a reservation
  fulfill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const id = getRequiredParam(req, 'id');
      const reservation = await this.reservationService.fulfillHold(id, user.id);
      res.status(200).json(buildResponse('Reservation fulfilled', reservation));
    } catch (error) {
      next(error);
    }
  };

  // Get all reservations for the authenticated user
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const reservations = await this.reservationService.listReservations(user.id);
      res.status(200).json(buildResponse('Reservations fetched', reservations));
    } catch (error) {
      next(error);
    }
  };
}