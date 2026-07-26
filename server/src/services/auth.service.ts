import jwt, { type SignOptions } from 'jsonwebtoken';
import { inject, singleton } from 'tsyringe';
import type { User } from '@prisma/client';
import { env } from '../config/env.js';
import { Roles } from '../constants/roles.js';
import { AppError } from '../utils/appError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { UserRepository } from '../repositories/user.repository.js';

export type AuthUser = Omit<User, 'passwordHash'>;

export interface AppJwtPayload extends jwt.JwtPayload {
  sub: string;
  email: string;
  name?: string;
  role: string;
}

// Remove sensitive fields before returning user data
function sanitizeUser(user: User): AuthUser {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

@singleton()
export class AuthService {
  constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

  // Generate a JWT for the authenticated user
  signToken(user: AuthUser): string {
    const options: SignOptions = {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
      issuer: env.jwtIssuer,
      audience: env.jwtAudience,
    };

    return jwt.sign(
      {
        email: user.email,
        name: user.name ?? undefined,
        role: user.role,
      },
      env.jwtSecret,
      {
        ...options,
        subject: user.id,
      },
    );
  }

  // Verify and decode a JWT
  verifyToken(token: string): AppJwtPayload {
    try {
      return jwt.verify(token, env.jwtSecret, {
        issuer: env.jwtIssuer,
        audience: env.jwtAudience,
        algorithms: ['HS256'],
      }) as AppJwtPayload;
    } catch {
      throw new AppError('Invalid or expired token', 401);
    }
  }

  // Authenticate a user with email and password
  async login(email: string, password: string) {
    console.log(`User attempting to log in: ${email}`);

    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user || !user.isActive || user.deletedAt) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const safeUser = sanitizeUser(user);
    return {
      token: this.signToken(safeUser),
      user: safeUser,
    };
  }

  // Register a new user
  async register(input: { email: string; password: string; name?: string }) {
    const email = input.email.toLowerCase();
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new AppError('Email is already registered', 409, {
        email: ['Email is already registered'],
      });
    }

    const user = await this.userRepository.create({
      externalId: email,
      email,
      name: input.name?.trim() || undefined,
      role: Roles.USER,
      passwordHash: await hashPassword(input.password),
    });

    const safeUser = sanitizeUser(user);
    return {
      token: this.signToken(safeUser),
      user: safeUser,
    };
  }

  // Get the authenticated user from a JWT
  async getAuthenticatedUser(token: string) {
    const payload = this.verifyToken(token);
    const user = await this.userRepository.findById(payload.sub);

    if (!user.isActive || user.deletedAt) {
      throw new AppError('User account is inactive', 401);
    }

    return sanitizeUser(user);
  }
}
