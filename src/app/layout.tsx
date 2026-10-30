import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'soloduo — Encontre seu Duo no LoL',
  description: 'Matchmaking de League of Legends com respeito, sinergia de rotas e sem toxicidade.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#0F1A20] text-slate-100 antialiased selection:bg-[#FA9F42] selection:text-[#0F1A20]">
        {children}
      </body>
    </html>
  );
}
