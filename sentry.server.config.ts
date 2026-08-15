// Sentry — cote serveur de la landing.
//
// Le DSN est en clair : ce n'est pas un secret, il est en ecriture seule et
// prevu pour etre embarque dans le bundle navigateur. Le mettre en dur evite le
// circuit `gh secret set`, qui a deja enregistre des chaines vides sur ce projet.
// L'environnement reste prioritaire si on veut rediriger vers un autre projet.
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
