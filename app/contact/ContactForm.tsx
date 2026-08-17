'use client';

import { useState } from 'react';

const PRIMARY = '#298f50';
const PRIMARY_DARK = '#1f6b3c';

/**
 * Formulaire de contact de salorie.com. Poste sur /api/contact, qui relaie
 * vers le tableau de bord de salistar.com.
 *
 * Le lien `mailto:` reste affiche en dessous : sur mobile et en navigation
 * privee, un `mailto:` sans client mail configure est un clic dans le vide —
 * mais pour qui a Gmail sous la main, c'est le chemin le plus direct.
 */
export function ContactForm() {
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  async function soumettre(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    const d = new FormData(e.currentTarget);
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.get('name'),
          email: d.get('email'),
          subject: d.get('subject'),
          message: d.get('message'),
          website: d.get('website'),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        setErreur(data.error || 'Envoi impossible. Réessaie dans un instant.');
        return;
      }
      setEnvoye(true);
    } catch {
      setErreur('Serveur injoignable. Écris-nous à support@salorie.com.');
    } finally {
      setEnvoi(false);
    }
  }

  if (envoye) {
    return (
      <div
        style={{
          border: `1px solid ${PRIMARY}`,
          background: '#f0fdf4',
          borderRadius: 12,
          padding: 24,
          textAlign: 'center',
        }}
      >
        <p style={{ fontWeight: 700, color: PRIMARY_DARK, marginBottom: 6 }}>Message envoyé</p>
        <p style={{ color: '#475569', fontSize: 14 }}>
          Nous répondons généralement sous 24 h, à l’adresse que tu as indiquée.
        </p>
      </div>
    );
  }

  const champ: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #cbd5e1',
    fontSize: 15,
    fontFamily: 'inherit',
    marginBottom: 14,
    background: '#fff',
    color: '#1e293b',
  };

  return (
    <form onSubmit={soumettre}>
      {/* Piege a robots : invisible, jamais annonce aux lecteurs d'ecran. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1 }}
      />

      <div style={{ display: 'grid', gap: 0, gridTemplateColumns: '1fr 1fr' }}>
        <input name="name" placeholder="Nom" style={{ ...champ, marginRight: 7 }} />
        <input name="email" type="email" required placeholder="Email" style={champ} />
      </div>

      <input name="subject" placeholder="Sujet" style={champ} />

      <textarea
        name="message"
        required
        rows={6}
        minLength={10}
        placeholder="Ton message"
        style={{ ...champ, resize: 'vertical' }}
      />

      {erreur && (
        <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: 12 }} role="alert">
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={envoi}
        style={{
          width: '100%',
          padding: '13px 20px',
          borderRadius: 999,
          border: 'none',
          background: PRIMARY,
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          cursor: envoi ? 'default' : 'pointer',
          opacity: envoi ? 0.65 : 1,
        }}
      >
        {envoi ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
