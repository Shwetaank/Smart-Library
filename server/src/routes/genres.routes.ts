import { Router } from 'express';
import { GenreController } from '../controllers/genre.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  createGenreSchema,
  genreQuerySchema,
  updateGenreSchema,
} from '../validators/genre.validators.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  validateRequest(genreQuerySchema),
  (req, res, next) => req.container.resolve(GenreController).list(req, res, next),
);
router.post(
  '/',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(createGenreSchema),
  (req, res, next) => req.container.resolve(GenreController).create(req, res, next),
);
router.get(
  '/:id',
  requireAuth,
  (req, res, next) => req.container.resolve(GenreController).get(req, res, next),
);
router.put(
  '/:id',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(updateGenreSchema),
  (req, res, next) => req.container.resolve(GenreController).update(req, res, next),
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  (req, res, next) => req.container.resolve(GenreController).remove(req, res, next),
);

export default router;
