'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Crown, Flame, Loader2, MessageCircle, UserRound } from 'lucide-react';
import { Logo } from '@/components/landing/Navbar';
import { Photo } from '@/components/social/primitives';
import { useDemo } from '@/lib/demo-store';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/descobrir', label: 'Descobrir', icon: Flame },
  { href: '/matches', label: 'Matches', icon: MessageCircle },
  { href: '/perfil', label: 'Perfil', icon: UserRound },
  { href: '/premium', label: 'Premium', icon: Crown },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, me, matches, premium } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const unread = matches.reduce((n, m) => n + m.unread, 0);

  // Sem perfil completo não há descoberta (na Fase 2 isto vira verificação no servidor).
  useEffect(() => {
    if (ready && !me) router.replace('/cadastro');
  }, [ready, me, router]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-64">
      {/* Barra lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/60 bg-card/40 p-5 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition-colors',
                pathname.startsWith(n.href) ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
              {n.href === '/matches' && unread > 0 && (
                <span className="ml-auto rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
        <Link href="/perfil" className="flex items-center gap-3 rounded-2xl border border-border p-3 hover:border-primary/40">
          <span className="h-10 w-10 overflow-hidden rounded-full bg-muted">{me.photos[0] && <Photo photo={me.photos[0]} alt="" />}</span>
          <span className="min-w-0">
            <span className="block truncate font-bold">{me.displayName}</span>
            <span className="text-xs text-muted-foreground">{premium ? 'Premium (demo)' : 'Plano grátis'}</span>
          </span>
        </Link>
      </aside>

      <div className="border-b border-secondary/20 bg-secondary/10 px-4 py-2 text-center text-xs font-medium text-secondary">
        Modo demonstração: perfis fictícios e dados salvos só neste navegador.
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:pb-10">{children}</main>

      {/* Navegação inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-semibold',
              pathname.startsWith(n.href) ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <n.icon className="h-5 w-5" />
            {n.label}
            {n.href === '/matches' && unread > 0 && (
              <span className="absolute right-[30%] top-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
