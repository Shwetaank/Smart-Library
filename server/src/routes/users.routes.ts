import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { userQuerySchema, updateUserRoleSchema } from '../validators/user.validators.js';
import { updateProfileSchema } from '../validators/auth.validators.js';

const router = Router();

// Get the authenticated user's profile
router.get('/me', requireAuth, (req, res, next) =>
  req.container.resolve(UserController).profile(req, res, next),
);

// Update the authenticated user's profile
router.put('/me', requireAuth, validateRequest(updateProfileSchema), (req, res, next) =>
  req.container.resolve(UserController).updateProfile(req, res, next),
);

// Get all users
router.get(
  '/',
  requireAuth,
  requireRole('LIBRARIAN', 'ADMIN'),
  validateRequest(userQuerySchema),
  (req, res, next) => req.container.resolve(UserController).list(req, res, next),
);

// Update a user's role
router.put(
  '/:id/role',
  requireAuth,
  requireRole('ADMIN'),
  validateRequest(updateUserRoleSchema),
  (req, res, next) => req.container.resolve(UserController).updateRole(req, res, next),
);

// Delete a user
router.delete('/:id', requireAuth, requireRole('ADMIN'), (req, res, next) =>
  req.container.resolve(UserController).remove(req, res, next),
);

export default router;
