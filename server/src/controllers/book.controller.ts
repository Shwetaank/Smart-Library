import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { BookService } from '../services/book.service.js';
import { buildResponse } from '../utils/response.js';
import { getAuthenticatedUser, getRequiredParam } from '../utils/request.js';

@injectable()
export class BookController {
  constructor(@inject(BookService) private readonly bookService: BookService) {}

  // Get all books
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.bookService.listBooks(req.query as Record<string, unknown>);
      res.status(200).json(buildResponse('Books fetched', result));
    } catch (error) {
      next(error);
    }
  };

  // Create a new book
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = getAuthenticatedUser(req);
      const book = await this.bookService.createBook(req.body as Record<string, unknown>, user.id);
      res.status(201).json(buildResponse('Book created', book));
    } catch (error) {
      next(error);
    }
  };

  // Get a book by ID
  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredParam(req, 'id');
      const book = await this.bookService.getBook(id);
      res.status(200).json(buildResponse('Book fetched', book));
    } catch (error) {
      next(error);
    }
  };

  // Update an existing book
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredParam(req, 'id');
      const user = getAuthenticatedUser(req);
      const book = await this.bookService.updateBook(
        id,
        req.body as Record<string, unknown>,
        user.id,
      );
      res.status(200).json(buildResponse('Book updated', book));
    } catch (error) {
      next(error);
    }
  };

  // Delete a book
  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getRequiredParam(req, 'id');
      const user = getAuthenticatedUser(req);
      await this.bookService.deleteBook(id, user.id);
      res.status(200).json(buildResponse('Book deleted'));
    } catch (error) {
      next(error);
    }
  };
}
