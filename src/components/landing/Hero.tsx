import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ELO_EMBLEMS, getSplashArtUrl } from '@/lib/riot';
import { MiniCard } from './MiniCard';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Brilhos de fundo */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative grid items-center gap-16 py-16 md:py-20 lg:grid-cols-2">
        <div className="space-y-8">
          <Badge
            variant="outline"
            className="gap-1.5 rounded-full border-secondary/30 bg-secondary/10 px-3 py-1 text-secondary"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Seu Riot ID só aparece depois do match
          </Badge>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Chega de cair com troll na SoloQ.{' '}
            <span className="text-primary">Encontre seu duo.</span>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Jogadores do seu elo, com rotas que combinam com a sua e a mesma vibe: chill,
            climb ou tryhard. Deu match, vocês trocam o Riot ID e vão pra fila.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* TODO (Fase 2): login com Discord */}
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base font-bold">
              <Link href="/descobrir">
                Encontrar meu duo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border bg-transparent px-7 text-base font-semibold"
            >
              <a href="#como-funciona">Como funciona</a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Gratuito · Servidor BR · Só a fila Solo/Duo
          </p>
        </div>

        {/* Pilha de cards de exemplo */}
        <div className="relative mx-auto hidden h-[480px] w-full max-w-lg sm:block">
          <MiniCard
            displayName="Lu"
            elo="Ouro I"
            eloIcon={ELO_EMBLEMS.GOLD}
            role="SUP"
            splash={getSplashArtUrl('Lulu', 27)}
            vibes={['CHILL', 'SEM MIC']}
            className="absolute left-0 top-16 w-60 animate-float opacity-60 [--r:-9deg]"
            style={{ animationDelay: '1.5s' }}
          />
          <MiniCard
            displayName="Mari"
            elo="Esmeralda IV"
            eloIcon={ELO_EMBLEMS.EMERALD}
            role="ADC"
            splash={getSplashArtUrl('Jinx', 40)}
            vibes={['CLIMB', 'COM MIC']}
            className="absolute right-0 top-16 w-60 animate-float opacity-60 [--r:9deg]"
            style={{ animationDelay: '3s' }}
          />
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
            <MiniCard
              displayName="Ivo"
              elo="Platina III"
              eloIcon={ELO_EMBLEMS.PLATINUM}
              role="JG"
              splash={getSplashArtUrl('Viego', 0)}
              vibes={['CHILL', 'TRYHARD']}
              className="w-72 animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
