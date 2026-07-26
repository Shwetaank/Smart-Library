import dotenv from 'dotenv';

dotenv.config();

// Application environment configuration
interface EnvConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  corsOrigin: string;
  azureBlobConnectionString: string;
  azureBlobContainer: string;
  allowLocalCoverFallback: boolean;
  jwtSecret: string;
  jwtIssuer: string;
  jwtAudience: string;
  jwtExpiresIn: string;
  appInsightsConnectionString?: string;
}

// Read an environment variable with an optional fallback value
function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (value === undefined || value === '') {
    return fallback ?? '';
  }

  return value;
}

// Export validated application configuration
export const env: EnvConfig = {
  // Server configuration
  port: Number(getEnv('PORT', '5000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),

  // Database connection
  databaseUrl: getEnv('DATABASE_URL'),

  // Frontend origin for CORS
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),

  // Azure Blob Storage configuration
  azureBlobConnectionString: getEnv('AZURE_BLOB_CONNECTION_STRING', 'UseDevelopmentStorage=true'),
  azureBlobContainer: getEnv('AZURE_BLOB_CONTAINER', 'library-covers'),

  // Enable local cover image fallback during development
  allowLocalCoverFallback: getEnv('ALLOW_LOCAL_COVER_FALLBACK', 'false') === 'true',

  // JWT authentication settings
  jwtSecret: getEnv('JWT_SECRET', 'smartlibrary-development-secret-change-me'),
  jwtIssuer: getEnv('JWT_ISSUER', 'smartlibrary-api'),
  jwtAudience: getEnv('JWT_AUDIENCE', 'smartlibrary-client'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '8h'),

  // Azure Application Insights (optional)
  appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || undefined,
};
