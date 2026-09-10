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
  // ⚠ `tunnelRoute` A ETE RETIREE D'ICI, ET CE N'EST PAS UN ABANDON.
  // Elle faisait transiter les requetes Sentry par le site, les bloqueurs de
  // publicite coupant les appels directs vers *.sentry.io. Mais cette option
  // n'agit QUE par le plugin webpack du SDK (`_sentryRewritesTunnelPath`, dans
  // son seul `config/webpack.js`) : sous Turbopack — le bundler de Next 16 —
  // elle est lue, acceptee, et sans le moindre effet. La laisser ici ferait
  // croire a une protection qui n'existe plus.
  //
  // Le tunnel est donc ecrit a la main : `app/monitoring/route.ts` pour le
  // relais, `tunnel: '/monitoring'` dans `instrumentation-client.ts` pour que
  // le navigateur l'emprunte.
  // Retire les traces de debogage du SDK du bundle. Remplace `disableLogger`,
  // deprecie et supprime dans une version a venir.
  webpack: {
    treeshake: { removeDebugLogging: true },
  },
});
