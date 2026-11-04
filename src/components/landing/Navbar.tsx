import { useId } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const links = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#modos', label: 'Modos' },
  { href: '#planos', label: 'Planos' },
  { href: '#faq', label: 'FAQ' },
];

/**
 * Marca DuoMatch: mapa abstrato de 3 rotas. As duas bases em cantos opostos são o duo,
 * ligadas pelas rotas; a faixa diagonal é o rio. Mesmo desenho de src/app/icon.svg e public/logo.svg.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, ''); // ":" quebra url(#...) em alguns navegadores
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0475A" />
          <stop offset="1" stopColor="#B3122E" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <path d="M13 13 L51 51" stroke="#fff" strokeOpacity=".22" strokeWidth="8" strokeLinecap="round" />
      <g fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 41 V20 Q16 16 20 16 H41" />
        <path d="M23 48 H44 Q48 48 48 44 V23" />
        <path d="M21 43 L43 21" />
      </g>
      <circle cx="16" cy="48" r="6" fill="#fff" />
      <circle cx="48" cy="16" r="6" fill="#fff" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoMark className="h-9 w-9" />
      <span className="text-lg font-extrabold tracking-tight">
        Duo<span className="text-primary">Match</span>
      </span>
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

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden rounded-full font-semibold sm:inline-flex">
            <Link href="/descobrir">Entrar</Link>
          </Button>
          <Button asChild className="rounded-full font-bold">
            <Link href="/cadastro">Começar grátis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
