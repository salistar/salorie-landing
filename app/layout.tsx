import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Salorie — AI-powered Calorie & Nutrition Tracker',
  description:
    'Scanne ton repas, suis tes calories et atteins tes objectifs santé. Salorie utilise l\'IA Gemini pour analyser ta nourriture en temps réel.',
  keywords: [
    'salorie', 'calorie tracker', 'nutrition app', 'AI food scanner',
    'fitness app', 'health tracking', 'macros tracker',
  ],
  authors: [{ name: 'Idriss Kriouile', url: 'https://salistar.com' }],
  metadataBase: new URL('https://salorie.salistar.com'),
  icons: { icon: '/favicon.svg', apple: '/icon.png' },
  alternates: { canonical: 'https://salorie.com/' },
  openGraph: {
    title: 'Salorie — AI-powered Calorie & Nutrition Tracker',
    description:
      'Scanne ton repas, suis tes calories et atteins tes objectifs santé.',
    url: 'https://salorie.salistar.com',
    siteName: 'Salorie',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: '/og.png', width: 1024, height: 500, alt: 'Salorie' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salorie — AI-powered Calorie & Nutrition Tracker',
    description: 'Scanne ton repas avec l\'IA et suis tes objectifs.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
