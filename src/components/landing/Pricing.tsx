import Link from 'next/link';
import { BillingNotice, PlanCards } from '@/components/PlanCards';
import { Button } from '@/components/ui/button';

export function Pricing() {
  return (
    <section id="planos" className="scroll-mt-20 py-16 md:py-20">
      <div className="container max-w-4xl space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Planos</p>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Grátis de verdade. Premium se quiser.</h2>
        </div>
        <PlanCards
          freeCta={
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full bg-transparent font-bold">
              <Link href="/cadastro">Começar grátis</Link>
            </Button>
          }
          premiumCta={
            <Button asChild size="lg" className="h-12 w-full rounded-full font-bold">
              <Link href="/cadastro">Criar conta e conhecer</Link>
            </Button>
          }
        />
        <BillingNotice />
      </div>
    </section>
  );
}
