// Sentry — cote navigateur de la landing. Inerte tant que NEXT_PUBLIC_SENTRY_DSN
// est absent (cf. l'explication complete dans sentry.server.config.ts).
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || '';

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    enabled: process.env.NODE_ENV === 'production',
    tracesSampleRate: 0.1,
    // Pas de Session Replay : la landing est publique, mais rejouer les sessions
    // de visiteurs dans un service tiers n'apporterait rien ici.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
  });
}
