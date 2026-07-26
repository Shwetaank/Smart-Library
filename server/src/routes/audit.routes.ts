import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { auditQuerySchema } from '../validators/audit.validators.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(auditQuerySchema),
  (req, res, next) => req.container.resolve(AuditController).list(req, res, next),
);

export default router;
