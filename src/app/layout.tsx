import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { DemoStoreProvider } from '@/lib/demo-store';
import './globals.css';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const description =
  'Conheça jogadores, faça amizades e encontre companhia para jogar League of Legends. Perfis com fotos, matches e chat. Grátis para começar.';

export const metadata: Metadata = {
  title: 'DuoMatch — Encontre seu duo ideal no LoL',
  description,
  keywords: ['duo lol', 'achar duo league of legends', 'amigos para jogar lol', 'duo ranqueada', 'DuoMatch'],
  openGraph: {
    title: 'DuoMatch — Encontre seu duo ideal no LoL',
    description,
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${fontSans.variable} dark`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {/* TODO (Fase 4): GA4 + Google Ads só depois do consentimento (LGPD), via banner de cookies. */}
        <DemoStoreProvider>{children}</DemoStoreProvider>
      </body>
    </html>
  );
}
