'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ProfilePhoto } from '@/types';
import { cn } from '@/lib/utils';
import { Photo } from './primitives';

/**
 * Galeria do perfil completo: foto grande à esquerda e coluna com as próximas à direita.
 * Clicar numa miniatura leva a foto para o destaque.
 */
export function ProfileGallery({ photos, name, className }: { photos: ProfilePhoto[]; name: string; className?: string }) {
  const [active, setActive] = useState(0);
  if (!photos.length) return null;
  const current = photos[Math.min(active, photos.length - 1)];
  const others = photos.map((p, i) => ({ p, i })).filter(({ i }) => i !== active);
  const visible = others.slice(0, 3);
  const hidden = others.length - visible.length;

  return (
    <div className={cn('grid h-[420px] gap-2.5 sm:h-[520px]', others.length ? 'grid-cols-[2fr_1fr]' : 'grid-cols-1', className)}>
      <div className="relative overflow-hidden rounded-3xl bg-muted">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Photo photo={current} alt={`Foto de ${name}`} />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          {active + 1}/{photos.length}
        </span>
      </div>

      {others.length > 0 && (
        <div className="grid grid-rows-3 gap-2.5">
          {visible.map(({ p, i }, n) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              className="group relative overflow-hidden rounded-3xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Photo photo={p} alt="" className="transition-transform duration-500 group-hover:scale-105" />
              {n === visible.length - 1 && hidden > 0 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-xl font-bold text-white">
                  +{hidden}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
