import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { LoanService } from '../services/loan.service.js';
import { buildResponse } from '../utils/response.js';
import { getAuthenticatedUser } from '../utils/request.js';

@injectable()
export class LoanController {
  constructor(@inject(LoanService) private readonly loanService: LoanService) {}

  // Borrow a book
  borrow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const loan = await this.loanService.borrowBook(user.id, req.body.bookId);
      res.status(201).json(buildResponse('Book borrowed', loan));
    } catch (error) {
      next(error);
    }
  };

  // Return a borrowed book
  return = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const loan = await this.loanService.returnBook(user.id, req.body.loanId);
      res.status(200).json(buildResponse('Book returned', loan));
    } catch (error) {
      next(error);
    }
  };

  // Renew an active loan
  renew = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const loan = await this.loanService.renewLoan(user.id, req.body.loanId);
      res.status(200).json(buildResponse('Loan renewed', loan));
    } catch (error) {
      next(error);
    }
  };

  // Get user's loan history
  history = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const loans = await this.loanService.getLoanHistory(user.id);
      res.status(200).json(buildResponse('Loan history fetched', loans));
    } catch (error) {
      next(error);
    }
  };
}
