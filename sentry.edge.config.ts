// Sentry — runtime Edge de la landing (middleware). Bundle distinct du bundle
// Node : sans ce fichier, le middleware serait muet.
import * as Sentry from '@sentry/nextjs';

const dsn =
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://ba5afdbccf4e2cff9c74a38366c5fd68@o4509622074081280.ingest.de.sentry.io/4511913674342480';

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    sendDefaultPii: false,
  });
}
