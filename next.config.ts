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

// Plugin de build Sentry. Il s'applique meme sans DSN : il enveloppe simplement
// le code, et l'init reste inerte tant que SENTRY_DSN est absent (cf.
// sentry.server.config.ts). Le televersement des source maps demanderait un
// SENTRY_AUTH_TOKEN, non configure — sans lui le build passe normalement.
export default withSentryConfig(config, {
  org: 'salistarcompany',
  project: 'salorie-landing',
  silent: !process.env.CI,
  // Fait transiter les requetes Sentry par le site : les bloqueurs de publicite
  // coupent les appels directs vers *.sentry.io, on perdrait des erreurs.
  tunnelRoute: '/monitoring',
  disableLogger: true,
});
