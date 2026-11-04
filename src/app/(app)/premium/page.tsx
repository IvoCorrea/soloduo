'use client';

import { Crown, Lock, Timer } from 'lucide-react';
import { BillingNotice, PlanCards } from '@/components/PlanCards';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/lib/demo-store';
import { TRIAL_DAYS } from '@/lib/constants';

export default function PremiumPage() {
  const { premium, setPremium, trialActive, trialEndsAt, trialUsed, startTrial } = useDemo();
  const trialEnd = trialEndsAt ? new Date(trialEndsAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-3 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Crown className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">DuoMatch Premium</h1>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Mais controle sobre quem aparece pra você. O plano grátis continua completo para fazer matches e conversar.
        </p>
      </div>

      {trialActive && (
        <div className="flex items-center gap-3 rounded-3xl border border-secondary/40 bg-secondary/10 p-4 text-sm">
          <Timer className="h-5 w-5 shrink-0 text-secondary" />
          <span>
            Seu teste grátis (simulado) termina em <strong>{trialEnd}</strong>. Depois disso os recursos Premium são desligados.
          </span>
        </div>
      )}

      <PlanCards
        premiumCta={
          <div className="space-y-3">
            <Button size="lg" disabled className="h-12 w-full rounded-full font-bold">
              <Lock /> Assinar em breve
            </Button>
            <p className="text-center text-xs text-muted-foreground">Pagamentos ainda não estão ativos. Nenhuma cobrança é feita.</p>
          </div>
        }
      />

      <BillingNotice />

      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed border-secondary/40 bg-secondary/5 p-5 sm:flex-row">
        <div>
          <p className="font-bold">Testar os recursos Premium</p>
          <p className="text-sm text-muted-foreground">Só nesta demonstração, sem pagamento. Liga filtros avançados, desfazer e quem curtiu você.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {!trialUsed && !premium && (
            <Button variant="secondary" className="rounded-full" onClick={startTrial}>
              Simular teste de {TRIAL_DAYS} dias
            </Button>
          )}
          <Button variant={premium ? 'outline' : 'secondary'} className="rounded-full" onClick={() => setPremium(!premium)}>
            {premium ? 'Desligar simulação' : 'Simular assinatura'}
          </Button>
        </div>
      </div>
    </div>
  );
}
