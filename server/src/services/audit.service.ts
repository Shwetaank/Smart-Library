import { inject, singleton } from 'tsyringe';
import { AuditRepository } from '../repositories/audit.repository.js';

@singleton()
export class AuditService {
  constructor(@inject(AuditRepository) private readonly auditRepository: AuditRepository) {}

  async log(action: string, entity: string, details?: string, userId?: string) {
    return this.auditRepository.create({
      action,
      entity,
      details,
      userId,
    });
  }

  async listLogs(query: Record<string, unknown>) {
    return this.auditRepository.findMany(query);
  }
}
