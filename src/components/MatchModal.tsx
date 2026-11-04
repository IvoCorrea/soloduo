'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, MessageCircle } from 'lucide-react';
import type { Profile } from '@/types';
import { Photo } from '@/components/social/primitives';
import { Button } from '@/components/ui/button';

const BURST = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

export function MatchModal({ me, profile, onClose }: { me: Profile; profile: Profile | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.lol.riotId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Deu match"
        >
          <div className="relative w-full max-w-sm space-y-7 text-center">
            <div className="relative mx-auto flex h-40 w-64 items-center justify-center">
              {BURST.map((a, i) => (
                <motion.span
                  key={i}
                  className={`absolute h-2 w-2 rounded-full ${i % 2 ? 'bg-primary' : 'bg-secondary'}`}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * 150, y: Math.sin(a) * 110, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 1.1, delay: 0.25, ease: 'easeOut' }}
                />
              ))}
              {[me, profile].map((p, i) => (
                <motion.div
                  key={p.id}
                  className="absolute h-36 w-28 overflow-hidden rounded-3xl border-4 border-background shadow-2xl"
                  initial={{ x: i ? 120 : -120, rotate: 0, opacity: 0 }}
                  animate={{ x: i ? 40 : -40, rotate: i ? 8 : -8, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 160 }}
                >
                  {p.photos[0] && <Photo photo={p.photos[0]} alt={p.displayName} />}
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-2">
              <h2 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
                Deu match!
              </h2>
              <p className="text-muted-foreground">Você e {profile.displayName} querem jogar juntos.</p>
            </motion.div>

            {profile.lol.riotId && (
              <div className="flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Riot ID liberado</p>
                  <p className="text-lg font-extrabold">{profile.lol.riotId}</p>
                </div>
                <Button size="sm" variant="secondary" className="rounded-full" onClick={copy}>
                  {copied ? <Check /> : <Copy />}
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <Button asChild size="lg" className="h-12 w-full rounded-full text-base font-bold">
                <Link href={`/matches?c=${profile.id}`}>
                  <MessageCircle />
                  Mandar mensagem
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="h-12 w-full rounded-full text-base" onClick={onClose}>
                Continuar descobrindo
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
