'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Gamepad2, Globe, Heart, Languages, MapPin, Mic, MicOff, X } from 'lucide-react';
import type { Profile } from '@/types';
import {
  COMM_STYLE_LABEL,
  GAME_MODE_LABEL,
  INTENT_INFO,
  ROLE_LABEL,
  SERVER_LABEL,
  TIME_SLOT_LABEL,
} from '@/lib/constants';
import { getChampionIconUrl } from '@/lib/riot';
import { EloBadge } from './primitives';
import { ProfileGallery } from './ProfileGallery';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">
      {children}
    </span>
  );
}

export function ProfileDetails({ profile, showRiotId = false }: { profile: Profile; showRiotId?: boolean }) {
  const lol = profile.lol;
  const photos = profile.photos.filter((p) => p.status === 'approved' || p.status === 'local');
  return (
    <div className="space-y-8">
      <ProfileGallery photos={photos} name={profile.displayName} />

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {profile.displayName}
          {profile.age !== null && <span className="ml-2 font-semibold text-muted-foreground">{profile.age}</span>}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {profile.pronouns && <span>{profile.pronouns}</span>}
          {profile.region && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {profile.region}
            </span>
          )}
          {lol.availableNow && (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Disponível agora
            </span>
          )}
        </div>
      </div>

      {profile.bio && <p className="whitespace-pre-line text-base leading-relaxed">{profile.bio}</p>}

      <Section title="Procurando">
        <div className="flex flex-wrap gap-2">
          {profile.intents.map((i) => (
            <Pill key={i}>
              <Heart className="h-3.5 w-3.5 text-primary" />
              {INTENT_INFO[i].label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="No Rift">
        <div className="grid gap-3 rounded-3xl border border-border bg-card/60 p-5 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Elo (declarado)</p>
            <EloBadge tier={lol.tier} division={lol.division} className="font-bold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rotas</p>
            <p className="font-bold">
              {ROLE_LABEL[lol.mainRole]}
              {lol.secondaryRole && <span className="font-medium text-muted-foreground"> · {ROLE_LABEL[lol.secondaryRole]}</span>}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Servidor</p>
            <p className="flex items-center gap-1.5 font-bold">
              <Globe className="h-4 w-4" />
              {SERVER_LABEL[lol.server]}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Microfone</p>
            <p className="flex items-center gap-1.5 font-bold">
              {lol.mic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {lol.mic ? 'Usa mic' : 'Sem mic'}
            </p>
          </div>
          {showRiotId && lol.riotId && (
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Riot ID (liberado pelo match, não verificado)</p>
              <p className="font-bold text-primary">{lol.riotId}</p>
            </div>
          )}
        </div>

        {lol.champions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {lol.champions.map((c) => (
              <span key={c} className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getChampionIconUrl(c)} alt="" className="h-7 w-7 rounded-full" />
                {c}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {lol.modes.map((m) => (
            <Pill key={m}>
              <Gamepad2 className="h-3.5 w-3.5 text-secondary" />
              {GAME_MODE_LABEL[m]}
            </Pill>
          ))}
        </div>
      </Section>

      {profile.interests.length > 0 && (
        <Section title="Interesses">
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => (
              <Pill key={i}>{i}</Pill>
            ))}
          </div>
        </Section>
      )}

      <Section title="Rotina">
        <div className="flex flex-wrap gap-2">
          {profile.schedule.map((s) => (
            <Pill key={s}>
              <Clock className="h-3.5 w-3.5" />
              {TIME_SLOT_LABEL[s]}
            </Pill>
          ))}
          <Pill>{COMM_STYLE_LABEL[profile.commStyle]}</Pill>
          {profile.languages.length > 0 && (
            <Pill>
              <Languages className="h-3.5 w-3.5" />
              {profile.languages.join(', ')}
            </Pill>
          )}
        </div>
      </Section>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  label,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] border border-border bg-background p-5 sm:rounded-[28px] sm:p-7 ${wide ? 'sm:max-w-3xl' : 'sm:max-w-md'}`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
