import { Camera, Flag, Heart, MessageCircle, Swords, Coffee, Users } from 'lucide-react';
import { INTENT_INFO } from '@/lib/constants';

const modes = [
  { icon: Swords, ...INTENT_INFO.competitivo },
  { icon: Coffee, ...INTENT_INFO.casual },
  { icon: Users, ...INTENT_INFO.amizade },
];

const features = [
  {
    icon: Camera,
    title: 'Perfis com fotos de verdade',
    description: 'Você, seu setup, seu pet, seu cosplay. Até 6 fotos, e cada uma passa por moderação antes de aparecer.',
  },
  {
    icon: Heart,
    title: 'Match só com interesse mútuo',
    description: 'Ninguém te chama do nada: a conversa só começa quando os dois curtem.',
  },
  {
    icon: MessageCircle,
    title: 'Chat entre matches',
    description: 'Combine horário, troque o Riot ID e chame pro lobby, tudo sem sair do DuoMatch.',
  },
  {
    icon: Flag,
    title: 'Segurança de verdade',
    description: 'Bloqueio, denúncia e moderação humana. Sem nudez, sem assédio, sem perfil falso.',
  },
];

export function Features() {
  return (
    <>
      <section id="modos" className="scroll-mt-20 py-16 md:py-20">
        <div className="container space-y-14">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Três modos</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Jogue do seu jeito</h2>
            <p className="text-lg text-muted-foreground">
              Troque de modo quando quiser. A recomendação muda junto: elo e rotas no competitivo, modos e horários no casual,
              interesses no modo amizades.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {modes.map((m) => (
              <div key={m.label} className="space-y-4 rounded-[28px] border border-border/60 bg-card/50 p-7 transition-colors hover:border-primary/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <m.icon className="h-6 w-6" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-bold">{m.label}</h3>
                  <p className="text-sm font-semibold text-secondary">{m.short}</p>
                  <p className="leading-relaxed text-muted-foreground">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container space-y-14">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Uma rede social de LoL</p>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Mais que um card de elo</h2>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <f.icon className="h-6 w-6" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold">{f.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
