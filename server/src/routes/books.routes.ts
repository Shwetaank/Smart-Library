import { Router } from 'express';
import { BookController } from '../controllers/book.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  createBookSchema,
  updateBookSchema,
  bookQuerySchema,
} from '../validators/book.validators.js';

const router = Router();

// Get all books
router.get('/', requireAuth, validateRequest(bookQuerySchema), (req, res, next) =>
  req.container.resolve(BookController).list(req, res, next),
);

// Create a new book
router.post(
  '/',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(createBookSchema),
  (req, res, next) => req.container.resolve(BookController).create(req, res, next),
);

// Get a book by ID
router.get('/:id', requireAuth, (req, res, next) =>
  req.container.resolve(BookController).get(req, res, next),
);

// Update a book
router.put(
  '/:id',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(updateBookSchema),
  (req, res, next) => req.container.resolve(BookController).update(req, res, next),
);

// Delete a book
router.delete('/:id', requireAuth, requireRole('LIBRARIAN', 'ADMIN'), (req, res, next) =>
  req.container.resolve(BookController).remove(req, res, next),
);

export default router;
