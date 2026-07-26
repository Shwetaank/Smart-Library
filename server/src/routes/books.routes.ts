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

router.get('/', requireAuth, validateRequest(bookQuerySchema), (req, res, next) =>
  req.container.resolve(BookController).list(req, res, next),
);
router.post(
  '/',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(createBookSchema),
  (req, res, next) => req.container.resolve(BookController).create(req, res, next),
);
router.get('/:id', requireAuth, (req, res, next) =>
  req.container.resolve(BookController).get(req, res, next),
);
router.put(
  '/:id',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(updateBookSchema),
  (req, res, next) => req.container.resolve(BookController).update(req, res, next),
);
router.delete('/:id', requireAuth, requireRole('LIBRARIAN', 'ADMIN'), (req, res, next) =>
  req.container.resolve(BookController).remove(req, res, next),
);

export default router;
