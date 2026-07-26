import { inject, injectable } from 'tsyringe';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { AuditService } from '../services/audit.service.js';
import { buildResponse } from '../utils/response.js';

@injectable()
export class AuditController {
  constructor(@inject(AuditService) private readonly auditService: AuditService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const logs = await this.auditService.listLogs(req.query as Record<string, unknown>);
      res.status(200).json(buildResponse('Audit logs fetched', logs));
    } catch (error) {
      next(error);
    }
  };
}
