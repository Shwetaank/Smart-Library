import dotenv from 'dotenv';

dotenv.config();

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

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    return fallback ?? '';
  }
  return value;
}

export const env: EnvConfig = {
  port: Number(getEnv('PORT', '5000')),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  databaseUrl: getEnv(
    'DATABASE_URL',
    'sqlserver://localhost:1433;database=smartlibrary;user=sa;password=YourStrongPassword;encrypt=true;trustServerCertificate=true',
  ),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
  azureBlobConnectionString: getEnv('AZURE_BLOB_CONNECTION_STRING', 'UseDevelopmentStorage=true'),
  azureBlobContainer: getEnv('AZURE_BLOB_CONTAINER', 'library-covers'),
  allowLocalCoverFallback: getEnv('ALLOW_LOCAL_COVER_FALLBACK', 'false') === 'true',
  jwtSecret: getEnv('JWT_SECRET', 'smartlibrary-development-secret-change-me'),
  jwtIssuer: getEnv('JWT_ISSUER', 'smartlibrary-api'),
  jwtAudience: getEnv('JWT_AUDIENCE', 'smartlibrary-client'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '8h'),
  appInsightsConnectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || undefined,
};
