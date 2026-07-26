import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { UserService } from '../services/user.service.js';
import { buildResponse } from '../utils/response.js';
import { getAuthenticatedUser, getRequiredParam } from '../utils/request.js';

@injectable()
export class UserController {
  constructor(@inject(UserService) private readonly userService: UserService) {}

  profile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authUser = getAuthenticatedUser(req);
      const user = await this.userService.getProfile(authUser.id);
      res.status(200).json(buildResponse('Profile fetched', user));
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authUser = getAuthenticatedUser(req);
      const user = await this.userService.updateProfile(
        authUser.id,
        req.body as Record<string, unknown>,
      );
      res.status(200).json(buildResponse('Profile updated', user));
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.listUsers(req.query as Record<string, unknown>);
      res.status(200).json(buildResponse('Users fetched', users));
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authUser = getAuthenticatedUser(req);
      const id = getRequiredParam(req, 'id');
      const user = await this.userService.updateRole(id, req.body.role as string, authUser.id);
      res.status(200).json(buildResponse('Role updated', user));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authUser = getAuthenticatedUser(req);
      const id = getRequiredParam(req, 'id');
      await this.userService.deleteUser(id, authUser.id);
      res.status(200).json(buildResponse('User deleted'));
    } catch (error) {
      next(error);
    }
  };
}
