import Link from 'next/link';
import { Button } from '@/components/ui/button';

const links = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#privacidade', label: 'Privacidade' },
  { href: '#faq', label: 'FAQ' },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-extrabold text-primary-foreground">
        s
      </span>
      <span className="text-lg font-extrabold tracking-tight">soloduo</span>
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* TODO (Fase 2): trocar por login com Discord via Supabase Auth */}
        <Button asChild className="rounded-full font-bold">
          <Link href="/descobrir">Entrar</Link>
        </Button>
      </div>
    </header>
  );
}
