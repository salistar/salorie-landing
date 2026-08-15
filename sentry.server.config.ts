// Sentry — cote serveur de la landing.
//
// ⚠️ AUCUN DSN PAR DEFAUT ici, contrairement aux autres composants : le projet
// Sentry `salorie-landing` n'existait pas encore au moment du cablage (l'interface
// de creation de projet se figeait). Le code est donc pret mais INERTE : sans
// SENTRY_DSN, `Sentry.init` n'est jamais appele et rien n'est envoye.
//
// Pour l'activer : creer le projet `salorie-landing` (plateforme Next.js) dans
// l'org salistarcompany, puis poser son DSN dans SENTRY_DSN et
// NEXT_PUBLIC_SENTRY_DSN. Aucun autre changement de code n'est necessaire.
import * as Sentry from '@sentry/nextjs';

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || '';

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
    sendDefaultPii: false,
  });
}
