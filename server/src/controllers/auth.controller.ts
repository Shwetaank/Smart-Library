import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { buildResponse } from '../utils/response.js';
import { AuthService } from '../services/auth.service.js';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const session = await this.authService.login(email, password);

      res.status(200).json(buildResponse('Authenticated', session));
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const session = await this.authService.register(
        req.body as { email: string; password: string; name?: string },
      );

      res.status(201).json(buildResponse('Registered', session));
    } catch (error) {
      next(error);
    }
  };
}
