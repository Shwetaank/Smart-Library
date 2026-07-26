import 'reflect-metadata';
import { createServer } from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

let isShuttingDown = false;
let server: ReturnType<typeof createServer> | null = null;

const startServer = (port: number): void => {
  const currentServer = createServer(app);

  currentServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
      startServer(port + 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  currentServer.listen(port, () => {
    server = currentServer;
    console.log(`Server listening on port ${port}`);
  });
};

const shutdown = async (): Promise<void> => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;
  console.log('Gracefully shutting down');
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer(env.port);
