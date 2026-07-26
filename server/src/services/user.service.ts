import { inject, singleton } from 'tsyringe';
import { UserRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/appError.js';
import { Roles } from '../constants/roles.js';
import { AuditService } from './audit.service.js';

@singleton()
export class UserService {
  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository,
    @inject(AuditService) private readonly auditService: AuditService,
  ) {}

  // Get an existing user or create a new one
  async getOrCreateUser(externalId: string, email: string, name?: string) {
    const existing = await this.userRepository.findByExternalId(externalId);
    if (existing) {
      return existing;
    }

    return this.userRepository.create({
      externalId,
      email,
      name,
      role: 'USER',
    });
  }

  // Get a user's profile
  async getProfile(id: string) {
    return this.userRepository.findById(id);
  }

  // Update a user's profile
  async updateProfile(id: string, input: Record<string, unknown>) {
    return this.userRepository.update(id, input);
  }

  // Get a list of users
  async listUsers(query: Record<string, unknown>) {
    return this.userRepository.findMany(query);
  }

  // Update a user's role
  async updateRole(id: string, role: string, actorId?: string) {
    if (!Object.values(Roles).includes(role as (typeof Roles)[keyof typeof Roles])) {
      throw new AppError('Invalid role', 400);
    }

    const user = await this.userRepository.update(id, { role });
    await this.auditService.log(
      'USER_ROLE_UPDATED',
      'User',
      JSON.stringify({ userId: id, role }),
      actorId,
    );

    return user;
  }

  // Soft delete a user
  async deleteUser(id: string, actorId?: string) {
    const user = await this.userRepository.softDelete(id);
    await this.auditService.log('USER_DELETED', 'User', JSON.stringify({ userId: id }), actorId);

    return user;
  }
}
