'use client';

// Dernier filet de l'App Router : il attrape les erreurs de rendu du layout
// racine, que ni `error.tsx` ni le try/catch serveur ne voient. Sans ce fichier,
// une landing qui casse au rendu affiche un ecran blanc et Sentry ne recoit
// rien — le build le signalait explicitement a chaque compilation.
//
// Il REMPLACE le layout racine quand il s'affiche : d'ou les balises <html> et
// <body>, et des styles en ligne plutot que Tailwind — si le CSS global n'a pas
// charge, c'est precisement le genre de panne qui amene ici.
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b1120',
          color: '#e2e8f0',
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            Une erreur est survenue
          </h1>
          <p style={{ lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.5rem' }}>
            Le probleme a ete signale automatiquement. Reessaie dans un instant,
            ou ecris-nous a{' '}
            <a href="mailto:support@salorie.com" style={{ color: '#7dd3fc' }}>
              support@salorie.com
            </a>
            .
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              background: '#38bdf8',
              color: '#0b1120',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Retour a l&apos;accueil
          </a>
        </main>
      </body>
    </html>
  );
}
