import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from './Navbar';

export function FinalCta() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-16 text-center text-primary-foreground md:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="relative mx-auto max-w-xl space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
              Seu próximo duo está na fila
            </h2>
            <p className="text-lg font-medium opacity-80">
              Crie seu perfil em menos de dois minutos.
            </p>
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-brand-dark px-8 text-base font-bold text-white hover:bg-brand-dark/90"
            >
              <Link href="/cadastro">
                Começar grátis
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="container space-y-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Logo />
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {/* TODO (Fase 2): criar Termos, Privacidade e Regras da Comunidade (revisão jurídica) */}
            <Link href="/termos" className="hover:text-foreground">
              Termos de uso
            </Link>
            <Link href="/privacidade" className="hover:text-foreground">
              Política de privacidade
            </Link>
            <Link href="/regras" className="hover:text-foreground">
              Regras da comunidade
            </Link>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <p>© {new Date().getFullYear()} DuoMatch. Plataforma para maiores de 18 anos.</p>
          {/* Aviso exigido pelas políticas da Riot Games para projetos de terceiros */}
          <p>
            DuoMatch isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views or
            opinions of Riot Games or anyone officially involved in producing or managing Riot
            Games properties. Riot Games, and all associated properties are trademarks or
            registered trademarks of Riot Games, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
