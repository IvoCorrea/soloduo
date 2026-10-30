import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'O soloduo é gratuito?',
    a: 'Sim. Dá pra criar o perfil, ver cards e dar match sem pagar nada.',
  },
  {
    q: 'Por que meu Riot ID aparece escondido?',
    a: 'Pra ninguém te adicionar ou te procurar sem você querer. O ID completo só aparece para a outra pessoa quando os dois dão match.',
  },
  {
    q: 'Como vocês sabem que a conta é minha?',
    a: 'Na hora do cadastro pedimos para você trocar o ícone de invocador por um ícone específico. Conferimos pela API da Riot e pronto, depois pode voltar pro seu ícone.',
  },
  {
    q: 'Por que não aparece winrate?',
    a: 'Porque winrate de poucos jogos engana e afasta gente boa. O card mostra só o elo oficial da fila Solo/Duo.',
  },
  {
    q: 'E se eu cair com alguém tóxico?',
    a: 'Você pode bloquear e denunciar. Perfis com muitas denúncias deixam de aparecer no feed.',
  },
  {
    q: 'Funciona em qual servidor?',
    a: 'Por enquanto só no servidor brasileiro (BR1).',
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
