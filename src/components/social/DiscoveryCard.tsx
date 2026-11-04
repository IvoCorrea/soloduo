'use client';

import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { Info, Mic, MicOff, Server as ServerIcon, Sparkles } from 'lucide-react';
import type { Intent, Profile } from '@/types';
import { INTENT_INFO, ROLE_LABEL, SERVER_LABEL } from '@/lib/constants';
import { EloBadge, Photo, Tag } from './primitives';

const SWIPE_DISTANCE = 120;
const SWIPE_VELOCITY = 600;

export const cardVariants = {
  enter: { scale: 0.95, opacity: 0, y: 12 },
  center: { scale: 1, opacity: 1, y: 0, x: 0, rotate: 0 },
  exit: (dir: 1 | -1) => ({ x: dir * 640, rotate: dir * 18, opacity: 0, transition: { duration: 0.32 } }),
};

export function DiscoveryCard({
  profile,
  mode,
  reasons,
  photoIndex,
  onPhotoIndex,
  onDecide,
  onOpen,
}: {
  profile: Profile;
  mode: Intent;
  reasons: string[];
  photoIndex: number;
  onPhotoIndex: (i: number) => void;
  onDecide: (action: 'like' | 'pass') => void;
  onOpen: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-14, 14]);
  const likeOpacity = useTransform(x, [30, SWIPE_DISTANCE], [0, 1]);
  const passOpacity = useTransform(x, [-SWIPE_DISTANCE, -30], [1, 0]);
  const photos = profile.photos.filter((p) => p.status === 'approved');
  const photo = photos[Math.min(photoIndex, photos.length - 1)];

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onDecide('like');
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onDecide('pass');
  };

  // Toque na metade esquerda/direita troca de foto (onTap não dispara depois de arrastar).
  const handleTap = (e: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
    const el = e.currentTarget as HTMLElement | null;
    if (!el || (e.target as HTMLElement).closest('button')) return;
    const rect = el.getBoundingClientRect();
    const left = info.point.x - window.scrollX - rect.left < rect.width / 2;
    onPhotoIndex(left ? Math.max(0, photoIndex - 1) : Math.min(photos.length - 1, photoIndex + 1));
  };

  const lol = profile.lol;

  return (
    <motion.article
      className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-[28px] border border-white/10 bg-card shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      aria-label={`Perfil de ${profile.displayName}`}
    >
      {photo && <Photo key={photo.id} photo={photo} alt={`Foto de ${profile.displayName}`} className="animate-in fade-in duration-300" />}

      {/* Indicador de fotos */}
      {photos.length > 1 && (
        <div className="absolute inset-x-3 top-3 flex gap-1.5">
          {photos.map((p, i) => (
            <span key={p.id} className={`h-1 flex-1 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/35'}`} />
          ))}
        </div>
      )}

      {/* Carimbos de swipe */}
      <motion.span
        style={{ opacity: likeOpacity }}
        className="pointer-events-none absolute left-6 top-10 -rotate-12 rounded-xl border-4 border-secondary px-3 py-1 text-3xl font-black uppercase tracking-wider text-secondary"
      >
        Curtir
      </motion.span>
      <motion.span
        style={{ opacity: passOpacity }}
        className="pointer-events-none absolute right-6 top-10 rotate-12 rounded-xl border-4 border-white/80 px-3 py-1 text-3xl font-black uppercase tracking-wider text-white/90"
      >
        Passar
      </motion.span>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 text-white">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-3xl font-extrabold tracking-tight">
              {profile.displayName}
              {profile.age !== null && <span className="ml-2 font-semibold text-white/80">{profile.age}</span>}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-white/75">
              {lol.availableNow ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Disponível agora
                </>
              ) : (
                profile.region
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpen}
            aria-label="Abrir perfil completo"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Tag>
            <EloBadge tier={lol.tier} division={lol.division} />
          </Tag>
          <Tag>{ROLE_LABEL[lol.mainRole]}</Tag>
          <Tag>
            <ServerIcon className="h-3 w-3" />
            {SERVER_LABEL[lol.server]}
          </Tag>
          <Tag>{lol.mic ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}</Tag>
          <Tag className="bg-primary/30">{INTENT_INFO[mode].label}</Tag>
        </div>

        <p className="line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-white/85">{profile.bio}</p>

        {reasons.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
            <Sparkles className="h-3.5 w-3.5" />
            {reasons.slice(0, 2).join(' · ')}
          </p>
        )}
      </div>
    </motion.article>
  );
}
