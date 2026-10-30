import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Privacy } from '@/components/landing/Privacy';
import { Features } from '@/components/landing/Features';
import { Faq } from '@/components/landing/Faq';
import { FinalCta, Footer } from '@/components/landing/FinalCta';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Privacy />
        <Features />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
