import { Camera, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Camera,
    title: 'Monte seu perfil',
    description:
      'Até 6 fotos, uma bio do seu jeito, elo, rotas, campeões favoritos e os horários em que você joga.',
  },
  {
    icon: Heart,
    title: 'Curta quem combina',
    description:
      'Escolha o modo (competitivo, casual ou amizades) e passe pelos perfis. Curta ou passe com um toque ou arrastando.',
  },
  {
    icon: MessageCircle,
    title: 'Deu match? Conversem',
    description:
      'Quando a curtida é mútua, o chat abre e o Riot ID é liberado. Aí é só chamar pro lobby.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-20 py-16 md:py-20">
      <div className="container space-y-14">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Como funciona</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Do cadastro ao lobby em três passos
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
