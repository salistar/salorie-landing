// Point d'entree d'instrumentation de Next.js : execute une fois au demarrage du
// serveur. Les bundles Node et Edge sont distincts — d'ou les deux imports.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// Erreurs de rendu des Server Components, que le try/catch classique n'attrape pas.
export { captureRequestError as onRequestError } from '@sentry/nextjs';
