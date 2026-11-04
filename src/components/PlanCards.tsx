import { Check, Crown } from 'lucide-react';
import { FREE_DAILY_LIKES, PREMIUM_PRICE, TRIAL_DAYS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const FREE_FEATURES = [
  'Cadastro e perfil social completos',
  'Até 6 fotos',
  'Descoberta nos 3 modos',
  `${FREE_DAILY_LIKES} curtidas por dia`,
  'Filtro por rota',
  'Matches e chat ilimitado entre matches',
  'Bloqueio e denúncia',
];

export const PREMIUM_FEATURES = [
  'Curtidas ilimitadas*',
  'Ver quem curtiu você',
  'Desfazer a última escolha',
  'Filtros avançados de elo',
  'Filtro por campeão favorito',
  'Filtros de disponibilidade, microfone e horário',
];

export function PlanCards({ freeCta, premiumCta }: { freeCta?: React.ReactNode; premiumCta?: React.ReactNode }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-[28px] border border-border bg-card/50 p-7">
        <div>
          <p className="font-bold text-muted-foreground">Grátis</p>
          <p className="mt-2 text-4xl font-extrabold">R$ 0</p>
          <p className="text-sm text-muted-foreground">Para sempre</p>
        </div>
        <ul className="flex-1 space-y-3">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex gap-3 text-sm">
              <Check className="h-5 w-5 shrink-0 text-secondary" />
              {f}
            </li>
          ))}
        </ul>
        {freeCta}
      </div>

      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] border border-primary/50 bg-gradient-to-b from-primary/15 to-card/50 p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/25 blur-3xl" />
        <div className="relative">
          <p className="flex items-center gap-2 font-bold text-primary">
            <Crown className="h-4 w-4" /> Premium
          </p>
          <p className="mt-2 text-4xl font-extrabold">
            {PREMIUM_PRICE}
            <span className="text-base font-semibold text-muted-foreground">/mês</span>
          </p>
          <p className="mt-1 inline-flex rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-bold text-secondary">
            {TRIAL_DAYS} dias grátis para testar
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Tudo do grátis, mais:</p>
        </div>
        <ul className={cn('relative flex-1 space-y-3')}>
          {PREMIUM_FEATURES.map((f) => (
            <li key={f} className="flex gap-3 text-sm">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
        <div className="relative">{premiumCta}</div>
      </div>
    </div>
  );
}

export function BillingNotice() {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      Teste grátis de {TRIAL_DAYS} dias, uma vez por conta. Se não cancelar antes do fim do teste, a assinatura começa
      automaticamente e avisamos por e-mail um dia antes da primeira cobrança. Depois, cobrança mensal recorrente de{' '}
      {PREMIUM_PRICE}, renovada automaticamente na mesma data de cada mês até você cancelar.
      Cancele quando quiser pelo seu perfil: o Premium continua até o fim do período já pago e não há multa. O Premium não
      muda o limite de fotos. *Curtidas ilimitadas estão sujeitas a controles contra abuso e automação.
    </p>
  );
}
