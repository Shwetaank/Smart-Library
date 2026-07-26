import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'node:path';
import { env } from './config/env.js';
import { initializeAppInsights } from './config/appInsights.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import routes from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import container from './container.js';

export function createApp(appContainer = container) {
  initializeAppInsights();

  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use('/covers', express.static(path.join(process.cwd(), 'uploads', 'covers')));

  app.use((req, res, next) => {
    req.container = appContainer;
    next();
  });

  app.use('/health', healthRoutes);
  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
