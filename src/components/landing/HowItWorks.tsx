import { BadgeCheck, Palette, Swords } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: BadgeCheck,
    title: 'Vincule sua conta',
    description:
      'Informe seu Riot ID e confirme que a conta é sua. Puxamos o elo direto da Riot, sem ninguém mentir patente.',
  },
  {
    icon: Palette,
    title: 'Monte seu card',
    description:
      'Escolha a splash art de qualquer skin, sua rota, seus 3 campeões e a vibe com que você joga.',
  },
  {
    icon: Swords,
    title: 'Dê match e jogue',
    description:
      'Passe ou chame pro duo. Se os dois quiserem, o Riot ID é revelado e é só mandar o convite.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 py-16 md:py-20">
      <div className="container space-y-14">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Como funciona</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Do cadastro à fila em três passos
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card
              key={step.title}
              className="rounded-3xl border-border/60 bg-card/60 shadow-none transition-colors hover:border-primary/30"
            >
              <CardContent className="space-y-5 p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-6 w-6" />
                  </span>
                  <span className="text-5xl font-extrabold text-muted/80">{i + 1}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
