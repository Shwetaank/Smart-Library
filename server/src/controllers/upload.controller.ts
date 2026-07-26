import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { UploadService } from '../services/upload.service.js';
import { buildResponse } from '../utils/response.js';
import { AppError } from '../utils/appError.js';
import { getRequiredParam } from '../utils/request.js';

@injectable()
export class UploadController {
  constructor(@inject(UploadService) private readonly uploadService: UploadService) {}

  uploadCover = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new AppError('File is required', 400, { file: ['File is required'] });
      }

      const coverUrl = await this.uploadService.uploadCover(req.file);
      const publicCoverUrl = coverUrl.startsWith('/')
        ? `${req.protocol}://${req.get('host')}${coverUrl}`
        : coverUrl;

      res.status(201).json(buildResponse('Cover uploaded', { coverUrl: publicCoverUrl }));
    } catch (error) {
      next(error);
    }
  };

  uploadCoverFromUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { url } = req.body;
      if (!url) {
        throw new AppError('URL is required', 400, { url: ['URL is required'] });
      }

      const coverUrl = await this.uploadService.uploadCoverFromUrl(url);
      const publicCoverUrl = coverUrl.startsWith('/')
        ? `${req.protocol}://${req.get('host')}${coverUrl}`
        : coverUrl;

      res.status(201).json(buildResponse('Cover uploaded from URL', { coverUrl: publicCoverUrl }));
    } catch (error) {
      next(error);
    }
  };

  getSasUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blobName = getRequiredParam(req, 'blobName');
      const url = await this.uploadService.getSasUrl(blobName);
      res.status(200).json(buildResponse('SAS URL generated', { url }));
    } catch (error) {
      next(error);
    }
  };
}
