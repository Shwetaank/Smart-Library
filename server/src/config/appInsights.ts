import * as appInsights from 'applicationinsights';
import { env } from './env.js';

// Initialize Azure Application Insights for monitoring and telemetry
export function initializeAppInsights(): void {
  // Skip initialization if no connection string is configured
  if (!env.appInsightsConnectionString) {
    return;
  }

  // Prevent multiple Application Insights instances
  if (!appInsights.defaultClient) {
    appInsights.setup(env.appInsightsConnectionString).setAutoCollectConsole(true).start();
  }
}