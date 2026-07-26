import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import {
  borrowLoanSchema,
  returnLoanSchema,
  renewLoanSchema,
} from '../validators/loan.validators.js';

const router = Router();

router.post(
  '/borrow',
  requireAuth,
  validateRequest(borrowLoanSchema),
  (req, res, next) => req.container.resolve(LoanController).borrow(req, res, next),
);
router.post(
  '/return',
  requireAuth,
  validateRequest(returnLoanSchema),
  (req, res, next) => req.container.resolve(LoanController).return(req, res, next),
);
router.post(
  '/renew',
  requireAuth,
  validateRequest(renewLoanSchema),
  (req, res, next) => req.container.resolve(LoanController).renew(req, res, next),
);
router.get(
  '/history',
  requireAuth,
  (req, res, next) => req.container.resolve(LoanController).history(req, res, next),
);

export default router;
