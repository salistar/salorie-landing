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

  /**
   * ⚠ CE SITE NE SERT PLUS RIEN : TOUT PART VERS SALORIE.COM.
   * ---------------------------------------------------------------------
   * Ce dépôt est l'ANCÊTRE de la landing, fusionnée depuis dans
   * `web/app/(landing)` du dépôt principal. Les deux sites se ressemblaient,
   * mais pas leurs liens de téléchargement :
   *
   *   salorie.com            `meta?.apk?.url ?? APK_URL` → la dernière release
   *   salorie.salistar.com   `v1.0.0` EN DUR             → l'APK du 9 juin 2026
   *
   * Un visiteur arrivant ici repartait donc avec un binaire antérieur au
   * consentement d'amitié, au correctif de la faille Premium et à Health
   * Connect. Rien ne le signalait : un lien codé en dur qui répond 200 a l'air
   * parfaitement sain. C'est exactement le défaut que `releaseMeta.ts` avait
   * corrigé côté salorie.com, resté entier sur son jumeau.
   *
   * Deux landings, c'était deux fois la maintenance et une chance sur deux de
   * corriger la bonne. On ne corrige plus celle-ci : on l'éteint.
   *
   * ⚠ POURQUOI ICI ET PAS DANS CADDY, QUI SERAIT SA PLACE.
   * Une redirection de domaine appartient au reverse proxy — et c'est là que
   * vit déjà celle de `www.salorie.com`. Mais le Caddyfile de srv3 n'est
   * versionné dans AUCUN dépôt : l'y écrire produirait une règle que personne
   * ne peut relire ni retrouver. Écrite ici, elle se relit, se teste et se
   * révoque comme du code. Contrepartie assumée : le conteneur doit continuer
   * à tourner pour émettre ses 308. Le retirer pour de bon demande une ligne
   * dans le Caddyfile, et cette ligne-là n'est pas à moi.
   *
   * `permanent: true` = 308 : la méthode et le corps sont conservés, et les
   * moteurs transfèrent le référencement. Les URL déposées à la Play Console
   * (politique de confidentialité, suppression de compte) restent donc
   * valides, redirigées vers leurs jumelles.
   */
  async redirects() {
    return [
      {
        source: '/:chemin*',
        destination: 'https://salorie.com/:chemin*',
        permanent: true,
      },
    ];
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
