import * as appInsights from 'applicationinsights';
import { env } from './env.js';

export function initializeAppInsights(): void {
  if (!env.appInsightsConnectionString) {
    return;
  }

  if (!appInsights.defaultClient) {
    appInsights.setup(env.appInsightsConnectionString).setAutoCollectConsole(true).start();
  }
}
