import { Router } from 'express';
import { ReservationController } from '../controllers/reservation.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { createReservationSchema } from '../validators/reservation.validators.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  (req, res, next) => req.container.resolve(ReservationController).list(req, res, next),
);
router.post(
  '/',
  requireAuth,
  validateRequest(createReservationSchema),
  (req, res, next) => req.container.resolve(ReservationController).create(req, res, next),
);
router.delete(
  '/:id',
  requireAuth,
  (req, res, next) => req.container.resolve(ReservationController).cancel(req, res, next),
);
router.post(
  '/:id/fulfill',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  (req, res, next) => req.container.resolve(ReservationController).fulfill(req, res, next),
);

export default router;
