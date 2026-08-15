// Sentry — cote navigateur de la landing.
//
// Ce fichier remplace `sentry.client.config.ts` : Next.js 15.5 le declare
// deprecie et il cesse purement et simplement d'etre charge sous Turbopack, qui
// devient le bundler par defaut. Le renommer maintenant evite une panne
// silencieuse — la surveillance navigateur se serait arretee sans rien casser
// au build.
import * as Sentry from '@sentry/nextjs';

const dsn =
  process.env.NEXT_PUBLIC_SENTRY_DSN ||
  'https://ba5afdbccf4e2cff9c74a38366c5fd68@o4509622074081280.ingest.de.sentry.io/4511913674342480';

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

// Rattache les erreurs a la navigation en cours dans l'App Router : sans cela,
// une erreur survenue pendant un changement de page est classee sur l'URL
// precedente.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
