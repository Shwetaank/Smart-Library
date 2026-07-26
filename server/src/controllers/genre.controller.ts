import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { GenreService } from '../services/genre.service.js';
import { buildResponse } from '../utils/response.js';
import { getAuthenticatedUser, getRequiredParam } from '../utils/request.js';

@injectable()
export class GenreController {
  constructor(@inject(GenreService) private readonly genreService: GenreService) {}

  // Get all genres
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.genreService.listGenres(req.query as Record<string, unknown>);
      res.status(200).json(buildResponse('Genres fetched', result));
    } catch (error) {
      next(error);
    }
  };

  // Create a new genre
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const genre = await this.genreService.createGenre(
        req.body as Record<string, unknown>,
        user.id,
      );
      res.status(201).json(buildResponse('Genre created', genre));
    } catch (error) {
      next(error);
    }
  };

  // Get a genre by ID
  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const genre = await this.genreService.getGenre(getRequiredParam(req, 'id'));
      res.status(200).json(buildResponse('Genre fetched', genre));
    } catch (error) {
      next(error);
    }
  };

  // Update an existing genre
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const genre = await this.genreService.updateGenre(
        getRequiredParam(req, 'id'),
        req.body as Record<string, unknown>,
        user.id,
      );
      res.status(200).json(buildResponse('Genre updated', genre));
    } catch (error) {
      next(error);
    }
  };

  // Delete a genre
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      await this.genreService.deleteGenre(getRequiredParam(req, 'id'), user.id);
      res.status(200).json(buildResponse('Genre deleted'));
    } catch (error) {
      next(error);
    }
  };
}
