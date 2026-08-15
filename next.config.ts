import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const config: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

// Plugin de build Sentry : il enveloppe le rendu serveur et les routes, et
// injecte le DSN dans le bundle navigateur — c'est donc au BUILD que tout se
// joue, pas au demarrage du conteneur.
//
// Le televersement des source maps demanderait un SENTRY_AUTH_TOKEN, non
// configure : sans lui le build passe, les piles d'appel sont simplement
// minifiees dans Sentry.
export default withSentryConfig(config, {
  org: 'salistarcompany',
  project: 'salorie-landing',
  silent: !process.env.CI,
  // Fait transiter les requetes Sentry par le site : les bloqueurs de publicite
  // coupent les appels directs vers *.sentry.io, on perdrait des erreurs.
  tunnelRoute: '/monitoring',
  // Retire les traces de debogage du SDK du bundle. Remplace `disableLogger`,
  // deprecie et supprime dans une version a venir.
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
