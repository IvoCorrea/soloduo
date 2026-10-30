'use client';

import { useState } from 'react';
import { Lock, LockOpen, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { maskRiotId } from '@/types';
import { cn } from '@/lib/utils';

const DEMO_ID = 'zicaneto#BR1';

const points = [
  'Antes do match, os outros veem só o começo do seu nome, tipo zic----#b--.',
  'Ninguém consegue te adicionar ou te procurar no op.gg só pelo card.',
  'O ID completo e o seu Discord só aparecem quando os dois dão "Bora duo".',
];

export function Privacy() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="privacidade" className="scroll-mt-20 py-16 md:py-20">
      <div className="container">
        <div className="grid items-center gap-12 rounded-[2rem] border border-border/60 bg-card/40 p-8 md:p-14 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-sm font-bold uppercase tracking-widest text-secondary">Privacidade</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Seu nick fica escondido até dar match
            </h2>
            <ul className="space-y-4">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Demonstração interativa */}
          <div className="mx-auto w-full max-w-sm space-y-4 rounded-3xl border border-border bg-background p-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>{revealed ? 'Depois do match' : 'Antes do match'}</span>
              {revealed ? (
                <LockOpen className="h-4 w-4 text-primary" />
              ) : (
                <Lock className="h-4 w-4 text-secondary" />
              )}
            </div>

            <div
              className={cn(
                'rounded-2xl border p-5 text-center transition-colors duration-300',
                revealed ? 'border-primary/40 bg-primary/10' : 'border-border bg-card',
              )}
            >
              <span className="text-xs font-semibold text-muted-foreground">Riot ID</span>
              <p className="mt-1 text-2xl font-extrabold tracking-wide">
                {revealed ? DEMO_ID : maskRiotId(DEMO_ID)}
              </p>
            </div>

            {revealed ? (
              <Button
                variant="outline"
                className="w-full rounded-full bg-transparent"
                onClick={() => setRevealed(false)}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Esconder de novo
              </Button>
            ) : (
              <Button className="w-full rounded-full font-bold" onClick={() => setRevealed(true)}>
                Simular match
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
