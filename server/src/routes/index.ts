import { Router } from 'express';
import authRoutes from './auth.routes.js';
import booksRoutes from './books.routes.js';
import genresRoutes from './genres.routes.js';
import loansRoutes from './loans.routes.js';
import reservationsRoutes from './reservations.routes.js';
import usersRoutes from './users.routes.js';
import uploadsRoutes from './uploads.routes.js';
import auditRoutes from './audit.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/genres', genresRoutes);
router.use('/loans', loansRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/users', usersRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/health', healthRoutes);

export default router;
