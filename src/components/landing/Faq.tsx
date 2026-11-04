import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'O DuoMatch é um app de namoro?',
    a: 'Não. É uma rede social para jogadores de League of Legends encontrarem duo, companhia para jogar e amizades. Não prometemos nem promovemos relacionamentos amorosos.',
  },
  {
    q: 'É gratuito?',
    a: 'Sim. O plano grátis tem perfil completo, até 6 fotos, 20 curtidas por dia, matches e chat ilimitado. O Premium (R$ 4,90/mês, com 3 dias grátis para testar) adiciona curtidas ilimitadas, filtros avançados, ver quem curtiu você e desfazer.',
  },
  {
    q: 'Que fotos posso colocar?',
    a: 'Fotos suas, selfies, fotos jogando, do seu setup, do seu pet, cosplay ou artes de jogo. Não precisa mostrar o rosto. Nudez, conteúdo sexual, violência gráfica e fotos de outras pessoas sem consentimento são proibidos, e toda foto passa por moderação antes de aparecer.',
  },
  {
    q: 'Meu Riot ID aparece no perfil?',
    a: 'Não. Ele é opcional e só aparece para quem deu match com você. Nunca pedimos sua senha da Riot.',
  },
  {
    q: 'Quem pode usar?',
    a: 'Maiores de 18 anos. Sua data de nascimento nunca aparece; a idade só é mostrada se você quiser.',
  },
  {
    q: 'E se alguém for inconveniente?',
    a: 'Você pode desfazer o match, bloquear e denunciar a qualquer momento. Só quem deu match pode te mandar mensagem.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 py-16 md:py-20">
      <div className="container max-w-3xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Perguntas frequentes</h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="border-border/60">
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
