'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, Heart, Info, Lock, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import type { DemoProfile, Intent } from '@/types';
import { DiscoveryCard } from '@/components/social/DiscoveryCard';
import { Modal, ProfileDetails } from '@/components/social/ProfileSheet';
import { Chip, Photo } from '@/components/social/primitives';
import { MatchModal } from '@/components/MatchModal';
import { Button } from '@/components/ui/button';
import { rankProfiles, type DiscoveryFilters } from '@/lib/discovery';
import { useDemo } from '@/lib/demo-store';
import {
  CHAMPION_SUGGESTIONS,
  FREE_DAILY_LIKES,
  INTENT_INFO,
  INTENTS,
  ROLE_LABEL,
  ROLES,
  TIER_LABEL,
  TIERS,
  TIME_SLOT_LABEL,
  TIME_SLOTS,
} from '@/lib/constants';
import { cn } from '@/lib/utils';

function IntentSelector({ value, onChange }: { value: Intent; onChange: (i: Intent) => void }) {
  return (
    <div role="tablist" aria-label="Modo de descoberta" className="flex rounded-full border border-border bg-card p-1">
      {INTENTS.map((i) => (
        <button
          key={i}
          role="tab"
          aria-selected={value === i}
          onClick={() => onChange(i)}
          className={cn(
            'relative flex-1 rounded-full px-3 py-2 text-sm font-bold transition-colors sm:px-5',
            value === i ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {value === i && (
            <motion.span layoutId="intent-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', damping: 26, stiffness: 300 }} />
          )}
          <span className="relative">{INTENT_INFO[i].label}</span>
        </button>
      ))}
    </div>
  );
}

function PremiumLock() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-bold text-primary">
      <Crown className="h-3 w-3" /> Premium
    </span>
  );
}

function FiltersPanel({
  filters,
  premium,
  onChange,
}: {
  filters: DiscoveryFilters;
  premium: boolean;
  onChange: (f: DiscoveryFilters) => void;
}) {
  const set = (patch: DiscoveryFilters) => onChange({ ...filters, ...patch });
  const select = 'w-full rounded-2xl border border-input bg-card px-3 py-2.5 text-sm disabled:opacity-50';
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Filtros</h3>

      <div className="space-y-2">
        <p className="text-sm font-bold">Rota</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={!filters.role} onClick={() => set({ role: null })}>
            Todas
          </Chip>
          {ROLES.map((r) => (
            <Chip key={r} active={filters.role === r} onClick={() => set({ role: r })}>
              {ROLE_LABEL[r]}
            </Chip>
          ))}
        </div>
      </div>

      <div className={cn('space-y-5 rounded-3xl border border-primary/30 p-4', !premium && 'bg-primary/5')}>
        <div className="flex items-center justify-between">
          <p className="font-bold">Filtros avançados</p>
          <PremiumLock />
        </div>
        <fieldset disabled={!premium} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {(['minTier', 'maxTier'] as const).map((k) => (
              <label key={k} className="space-y-1 text-sm">
                <span className="font-semibold">{k === 'minTier' ? 'Elo mínimo' : 'Elo máximo'}</span>
                <select className={select} value={filters[k] ?? ''} onChange={(e) => set({ [k]: (e.target.value || null) as never })}>
                  <option value="">Qualquer</option>
                  {TIERS.map((t) => (
                    <option key={t} value={t}>
                      {TIER_LABEL[t]}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Campeão favorito</span>
            <select className={select} value={filters.champion ?? ''} onChange={(e) => set({ champion: e.target.value || null })}>
              <option value="">Qualquer</option>
              {CHAMPION_SUGGESTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-semibold">Horário</span>
            <select className={select} value={filters.schedule ?? ''} onChange={(e) => set({ schedule: (e.target.value || null) as never })}>
              <option value="">Qualquer</option>
              {TIME_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {TIME_SLOT_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <Chip active={filters.micOnly} onClick={() => set({ micOnly: !filters.micOnly })} disabled={!premium}>
              Com microfone
            </Chip>
            <Chip active={filters.availableNowOnly} onClick={() => set({ availableNowOnly: !filters.availableNowOnly })} disabled={!premium}>
              Disponível agora
            </Chip>
          </div>
        </fieldset>
        {!premium && (
          <Button asChild className="w-full rounded-full">
            <Link href="/premium">Conhecer o Premium</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function DescobrirPage() {
  const demo = useDemo();
  const { me, mode, filters, premium, swipes, blocked, likesLeft } = demo;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [exitDir, setExitDir] = useState<1 | -1>(1);
  const [matched, setMatched] = useState<DemoProfile | null>(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [upsell, setUpsell] = useState<string | null>(null);

  const ranked = useMemo(
    () =>
      me
        ? rankProfiles(me, demo.profiles, mode, filters, {
            excludedIds: new Set([...Object.keys(swipes), ...blocked]),
          })
        : [],
    [me, demo.profiles, mode, filters, swipes, blocked],
  );
  const top = ranked[0];
  const likedMe = demo.likedMe();

  useEffect(() => setPhotoIndex(0), [top?.profile.id]);

  const decide = useCallback(
    (action: 'like' | 'pass') => {
      if (!top) return;
      const res = demo.swipe(top.profile.id, action);
      if (res === 'limit') {
        setUpsell(`Você usou as ${FREE_DAILY_LIKES} curtidas de hoje. Elas renovam amanhã, ou fique ilimitado com o Premium.`);
        return;
      }
      setExitDir(action === 'like' ? 1 : -1);
      if (res === 'match') setMatched(top.profile);
    },
    [top, demo],
  );

  const undo = useCallback(() => {
    if (!premium) {
      setUpsell('Desfazer a última escolha é um benefício Premium.');
      return;
    }
    setExitDir(-1);
    demo.undo();
  }, [premium, demo]);

  // Atalhos: ← passar, → curtir, ↑/Enter perfil, espaço próxima foto, Z/Backspace desfazer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (matched || openProfile || showFilters || upsell || !top) return;
      if ((e.target as HTMLElement).closest('input, textarea, select')) return;
      const photos = top.profile.photos.length;
      const actions: Record<string, () => void> = {
        ArrowLeft: () => decide('pass'),
        ArrowRight: () => decide('like'),
        ArrowUp: () => setOpenProfile(true),
        Enter: () => setOpenProfile(true),
        ' ': () => setPhotoIndex((i) => (i + 1) % photos),
        z: undo,
        Backspace: undo,
      };
      const fn = actions[e.key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [matched, openProfile, showFilters, upsell, top, decide, undo]);

  if (!me) return null;
  const activeFilters = Object.values(filters).filter(Boolean).length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr] lg:items-start">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <IntentSelector value={mode} onChange={demo.setMode} />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            aria-label="Filtros"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card hover:border-primary/40"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFilters > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        <div className="relative mx-auto aspect-[3/4.2] max-h-[68vh] w-full">
          {ranked[1] && (
            <div className="absolute inset-0 scale-[0.94] overflow-hidden rounded-[28px] opacity-60">
              <Photo photo={ranked[1].profile.photos[0]} alt="" />
            </div>
          )}
          <AnimatePresence custom={exitDir} initial={false}>
            {top ? (
              <DiscoveryCard
                key={top.profile.id}
                profile={top.profile}
                mode={mode}
                reasons={top.reasons}
                photoIndex={photoIndex}
                onPhotoIndex={setPhotoIndex}
                onDecide={decide}
                onOpen={() => setOpenProfile(true)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-border p-8 text-center"
              >
                <p className="text-xl font-bold">Você viu todo mundo por aqui</p>
                <p className="text-muted-foreground">
                  Tente outro modo ou afrouxe os filtros. Nesta demonstração existem poucos perfis.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {activeFilters > 0 && (
                    <Button variant="outline" className="rounded-full" onClick={() => demo.setFilters({})}>
                      Limpar filtros
                    </Button>
                  )}
                  <Button className="rounded-full" onClick={demo.resetDemo}>
                    Recomeçar demonstração
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={undo}
            aria-label="Desfazer última escolha"
            title="Desfazer (Z)"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-amber-300 transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={() => decide('pass')}
            disabled={!top}
            aria-label="Passar"
            title="Passar (←)"
            className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-transform hover:scale-105 hover:text-foreground active:scale-95 disabled:opacity-40"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            onClick={() => decide('like')}
            disabled={!top}
            aria-label="Curtir"
            title="Curtir (→)"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <Heart className="h-7 w-7 fill-current" />
          </button>
          <button
            onClick={() => setOpenProfile(true)}
            disabled={!top}
            aria-label="Ver perfil completo"
            title="Perfil (↑)"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-secondary transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {premium ? 'Curtidas ilimitadas (Premium demo)' : `${likesLeft} de ${FREE_DAILY_LIKES} curtidas restantes hoje`}
        </p>
      </div>

      {/* Painel lateral (desktop) */}
      <aside className="hidden space-y-6 lg:block">
        <section className="space-y-4 rounded-3xl border border-border bg-card/50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Quem curtiu você</h2>
            <PremiumLock />
          </div>
          {likedMe.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ninguém novo por enquanto.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {likedMe.map((p) => (
                <div key={p.id} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                  <Photo photo={p.photos[0]} alt={premium ? p.displayName : ''} className={cn(!premium && 'scale-110 blur-xl')} />
                  {premium ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2 text-sm font-bold">{p.displayName}</span>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-white/80" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {!premium && likedMe.length > 0 && (
            <Button asChild variant="outline" className="w-full rounded-full bg-transparent">
              <Link href="/premium">Ver {likedMe.length} curtida(s) com Premium</Link>
            </Button>
          )}
        </section>

        <section className="space-y-3 rounded-3xl border border-border bg-card/50 p-6 text-sm">
          <h2 className="text-lg font-bold">Atalhos</h2>
          {[
            ['←', 'Passar'],
            ['→', 'Curtir'],
            ['↑ / Enter', 'Perfil completo'],
            ['Espaço', 'Próxima foto'],
            ['Z', 'Desfazer (Premium)'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between text-muted-foreground">
              <span>{v}</span>
              <kbd className="rounded-lg border border-border bg-background px-2 py-0.5 font-mono text-xs text-foreground">{k}</kbd>
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            Modo {INTENT_INFO[mode].label.toLowerCase()}: {INTENT_INFO[mode].description}
          </p>
        </section>
      </aside>

      <Modal open={openProfile && !!top} onClose={() => setOpenProfile(false)} label="Perfil completo" wide>
        {top && (
          <div className="space-y-6">
            <ProfileDetails profile={top.profile} />
            <div className="sticky bottom-0 flex gap-3 bg-background pt-3">
              <Button variant="outline" size="lg" className="h-12 flex-1 rounded-full bg-transparent" onClick={() => { setOpenProfile(false); decide('pass'); }}>
                <X /> Passar
              </Button>
              <Button size="lg" className="h-12 flex-1 rounded-full font-bold" onClick={() => { setOpenProfile(false); decide('like'); }}>
                <Heart className="fill-current" /> Curtir
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showFilters} onClose={() => setShowFilters(false)} label="Filtros">
        <FiltersPanel filters={filters} premium={premium} onChange={demo.setFilters} />
      </Modal>

      <Modal open={!!upsell} onClose={() => setUpsell(null)} label="Premium">
        <div className="space-y-5 pt-2 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Crown className="h-7 w-7" />
          </span>
          <p className="text-lg font-semibold">{upsell}</p>
          <Button asChild size="lg" className="h-12 w-full rounded-full font-bold">
            <Link href="/premium">Ver Premium</Link>
          </Button>
        </div>
      </Modal>

      <MatchModal me={me} profile={matched} onClose={() => setMatched(null)} />
    </div>
  );
}
