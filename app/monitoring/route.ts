/**
 * Le tunnel Sentry, écrit à la main — parce que celui du SDK ne marche plus.
 * ---------------------------------------------------------------------------
 * Les bloqueurs de publicité coupent les requêtes vers `*.sentry.io`. Sans
 * relais, une partie des erreurs NAVIGATEUR disparaît sans laisser de trace :
 * pas d'échec visible, juste moins d'erreurs — la pire forme de silence. Et sur
 * une landing, le navigateur est le seul endroit où quelque chose peut casser.
 *
 * ⚠ `tunnelRoute` EST UNE OPTION WEBPACK, ET NEXT 16 COMPILE AVEC TURBOPACK.
 * Vérifié dans le SDK (10.74.0) : `_sentryRewritesTunnelPath` n'est défini que
 * dans son `config/webpack.js`. Sous Turbopack, la clé est lue, acceptée, et
 * sans le moindre effet — aucun avertissement.
 *
 * ⚠ UNE ROUTE PUBLIQUE QUI REPOST LE CORPS RECU EST UN RELAIS OUVERT.
 * L'enveloppe annonce son DSN dans sa première ligne ; on ne fait pas confiance
 * à ce qu'elle annonce. On le compare au nôtre — hôte ET numéro de projet — et
 * l'URL d'amont est reconstruite depuis le NÔTRE, jamais depuis le sien.
 *
 * Jumeau testé de `web/app/monitoring/route.ts` (sept tests, dont trois
 * attaques : hôte pirate, même SaaS autre région, autre projet du même hôte).
 * Ce dépôt-ci n'a pas de suite de tests ; toute correction ici doit passer
 * d'abord par là-bas.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Le seul DSN autorisé : celui de la landing, comme côté navigateur. */
const DSN_ATTENDU =
  process.env.NEXT_PUBLIC_SENTRY_DSN
  || 'https://ba5afdbccf4e2cff9c74a38366c5fd68@o4509622074081280.ingest.de.sentry.io/4511913674342480';

/** Une enveloppe d'erreur pèse quelques kilo-octets ; 1 Mo est déjà très large. */
const TAILLE_MAX = 1_000_000;

type Cible = { hote: string; projet: string };

function lireDsn(dsn: string): Cible | null {
  try {
    const u = new URL(dsn);
    const projet = u.pathname.replace(/^\//, '');
    if (!u.hostname || !/^\d+$/.test(projet)) return null;
    return { hote: u.hostname, projet };
  } catch {
    return null;
  }
}

const NOTRE_CIBLE = lireDsn(DSN_ATTENDU);

export async function POST(req: NextRequest) {
  try {
    const enveloppe = await req.text();
    if (!enveloppe || enveloppe.length > TAILLE_MAX) {
      return new NextResponse(null, { status: 413 });
    }

    const [entete] = enveloppe.split('\n', 1);
    const annonce = lireDsn(JSON.parse(entete)?.dsn ?? '');

    if (!annonce || !NOTRE_CIBLE
        || annonce.hote !== NOTRE_CIBLE.hote
        || annonce.projet !== NOTRE_CIBLE.projet) {
      return new NextResponse(null, { status: 403 });
    }

    const amont = `https://${NOTRE_CIBLE.hote}/api/${NOTRE_CIBLE.projet}/envelope/`;
    const r = await fetch(amont, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-sentry-envelope' },
      body: enveloppe,
    });

    return new NextResponse(null, { status: r.status });
  } catch {
    // Un rapport d'erreur perdu ne doit jamais provoquer une erreur de plus.
    return new NextResponse(null, { status: 204 });
  }
}
