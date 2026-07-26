import 'reflect-metadata';
import { createServer } from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

let isShuttingDown = false;
let server: ReturnType<typeof createServer> | null = null;

// Start the HTTP server
const startServer = (port: number): void => {
  const currentServer = createServer(app);

  // Handle server startup errors
  currentServer.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`
┌──────────────────────────────────────────────────────────────┐
│ ⚠️  Port ${port} is already in use. Trying port ${port + 1}... │
└──────────────────────────────────────────────────────────────┘
`);
      startServer(port + 1);
      return;
    }

    console.error(`
┌──────────────────────────────────────────────────────────────┐
│ ❌ SERVER FAILED TO START                                    │
├──────────────────────────────────────────────────────────────┤
│ Error : ${error.message}
│ Code  : ${error.code ?? 'UNKNOWN'}
└──────────────────────────────────────────────────────────────┘
`);

    process.exit(1);
  });

  currentServer.listen(port, () => {
    server = currentServer;

    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     📚 SmartLibrary Backend API                     ║
╠══════════════════════════════════════════════════════════════════════╣
║ 🚀 Status        : Running                                          ║
║ 🌍 Environment   : ${env.nodeEnv.padEnd(48)}║
║ 🔌 Port          : ${String(port).padEnd(48)}║
║ 🌐 Base URL      : http://localhost:${port}/api/v1${' '.repeat(
      Math.max(0, 25 - String(port).length),
    )}║
║ ❤️ Health Check  : http://localhost:${port}/health${' '.repeat(
      Math.max(0, 24 - String(port).length),
    )}║
║ 🕒 Started At    : ${new Date().toLocaleString().padEnd(48)}║
╠══════════════════════════════════════════════════════════════════════╣
║ Ready to accept incoming requests...                               ║
╚══════════════════════════════════════════════════════════════════════╝
`);
  });
};

// Gracefully shut down the server
const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`
┌──────────────────────────────────────────────────────────────┐
│ 🛑 Graceful Shutdown Initiated                               │
├──────────────────────────────────────────────────────────────┤
│ Signal : ${signal.padEnd(46)}│
│ Status : Closing active connections...                       │
└──────────────────────────────────────────────────────────────┘
`);

  if (server) {
    server.close(() => {
      console.log(`
┌──────────────────────────────────────────────────────────────┐
│ ✅ SmartLibrary stopped successfully.                        │
│ 👋 Goodbye!                                                  │
└──────────────────────────────────────────────────────────────┘
`);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Handle termination signals
process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error(`
┌──────────────────────────────────────────────────────────────┐
│ ❌ Uncaught Exception                                        │
├──────────────────────────────────────────────────────────────┤
│ ${error.stack ?? error.message}
└──────────────────────────────────────────────────────────────┘
`);

  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error(`
┌──────────────────────────────────────────────────────────────┐
│ ❌ Unhandled Promise Rejection                               │
├──────────────────────────────────────────────────────────────┤
│ ${reason instanceof Error ? reason.stack : String(reason)}
└──────────────────────────────────────────────────────────────┘
`);

  process.exit(1);
});

// Start the application
startServer(env.port);