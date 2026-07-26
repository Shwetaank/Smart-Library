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

// Get all genres
router.get('/', requireAuth, validateRequest(genreQuerySchema), (req, res, next) =>
  req.container.resolve(GenreController).list(req, res, next),
);

// Create a new genre
router.post(
  '/',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(createGenreSchema),
  (req, res, next) => req.container.resolve(GenreController).create(req, res, next),
);

// Get a genre by ID
router.get('/:id', requireAuth, (req, res, next) =>
  req.container.resolve(GenreController).get(req, res, next),
);

// Update a genre
router.put(
  '/:id',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(updateGenreSchema),
  (req, res, next) => req.container.resolve(GenreController).update(req, res, next),
);

// Delete a genre
router.delete('/:id', requireAuth, requireRole('LIBRARIAN', 'ADMIN'), (req, res, next) =>
  req.container.resolve(GenreController).remove(req, res, next),
);

export default router;
