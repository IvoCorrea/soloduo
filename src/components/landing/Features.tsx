import { Crown, Image as ImageIcon, Mic, Users } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Rotas que combinam',
    description: 'ADC com suporte, mid com jungle. Diga qual rota você procura e veja quem completa a sua.',
  },
  {
    icon: Crown,
    title: 'Só o elo, sem winrate',
    description: 'O card mostra o seu elo oficial e nada mais. Ninguém te julga por uma semana ruim.',
  },
  {
    icon: Mic,
    title: 'Vibe e comunicação',
    description: 'Chill, climb ou tryhard. Com mic no Discord ou só pings. Você escolhe com quem combina.',
  },
  {
    icon: ImageIcon,
    title: 'Qualquer skin no card',
    description: 'Use a splash art da sua skin favorita, de qualquer campeão, como capa do seu perfil.',
  },
];

export function Features() {
  return (
    <section className="py-16 md:py-20">
      <div className="container space-y-14">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Feito pra SoloQ</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Tudo que importa pra escolher um duo
          </h2>
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
  );
}
