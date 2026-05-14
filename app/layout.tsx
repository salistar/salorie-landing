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
  openGraph: {
    title: 'Salorie — AI-powered Calorie & Nutrition Tracker',
    description:
      'Scanne ton repas, suis tes calories et atteins tes objectifs santé.',
    url: 'https://salorie.salistar.com',
    siteName: 'Salorie',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salorie — AI-powered Calorie & Nutrition Tracker',
    description: 'Scanne ton repas avec l\'IA et suis tes objectifs.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
