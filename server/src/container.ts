import { container } from 'tsyringe';
import { BlobServiceClient } from '@azure/storage-blob';
import { prisma } from './prisma/client.js';
import { env } from './config/env.js';

// Repositories
import { AuditRepository } from './repositories/audit.repository.js';
import { BookRepository } from './repositories/book.repository.js';
import { GenreRepository } from './repositories/genre.repository.js';
import { LoanRepository } from './repositories/loan.repository.js';
import { ReservationRepository } from './repositories/reservation.repository.js';
import { UserRepository } from './repositories/user.repository.js';

// Services
import { AuditService } from './services/audit.service.js';
import { AuthService } from './services/auth.service.js';
import { BookService } from './services/book.service.js';
import { GenreService } from './services/genre.service.js';
import { LoanService } from './services/loan.service.js';
import { ReservationService } from './services/reservation.service.js';
import { UploadService } from './services/upload.service.js';
import { UserService } from './services/user.service.js';

// Controllers
import { AuditController } from './controllers/audit.controller.js';
import { AuthController } from './controllers/auth.controller.js';
import { BookController } from './controllers/book.controller.js';
import { GenreController } from './controllers/genre.controller.js';
import { LoanController } from './controllers/loan.controller.js';
import { ReservationController } from './controllers/reservation.controller.js';
import { UploadController } from './controllers/upload.controller.js';
import { UserController } from './controllers/user.controller.js';

// Register Prisma Client
container.register('PrismaClient', { useValue: prisma });

export function initialize() {
  return container;
}

// Register Blob Service Client
container.register<BlobServiceClient>('BlobServiceClient', {
  useFactory: () => BlobServiceClient.fromConnectionString(env.azureBlobConnectionString),
});

// Repositories
container.registerSingleton(AuditRepository);
container.registerSingleton(BookRepository);
container.registerSingleton(GenreRepository);
container.registerSingleton(LoanRepository);
container.registerSingleton(ReservationRepository);
container.registerSingleton(UserRepository);

// Services
container.registerSingleton(AuditService);
container.registerSingleton(AuthService);
container.registerSingleton(BookService);
container.registerSingleton(GenreService);
container.registerSingleton(LoanService);
container.registerSingleton(ReservationService);
container.registerSingleton(UploadService);
container.registerSingleton(UserService);

// Controllers
container.registerSingleton(AuditController);
container.registerSingleton(AuthController);
container.registerSingleton(BookController);
container.registerSingleton(GenreController);
container.registerSingleton(LoanController);
container.registerSingleton(ReservationController);
container.registerSingleton(UploadController);
container.registerSingleton(UserController);

export default container;
