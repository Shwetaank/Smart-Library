import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { createRateLimiter } from '../middlewares/rateLimit.js';
import { validateRequest } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';

const router = Router();
const loginRateLimit = createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 30 });

router.post(
  '/login',
  loginRateLimit,
  validateRequest(loginSchema),
  (req, res, next) => req.container.resolve(AuthController).login(req, res, next),
);
router.post(
  '/register',
  loginRateLimit,
  validateRequest(registerSchema),
  (req, res, next) => req.container.resolve(AuthController).register(req, res, next),
);

export default router;
