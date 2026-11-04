'use client';

/**
 * Estado de DEMONSTRAÇÃO, salvo só no localStorage do navegador.
 * Na Fase 2 cada ação vira uma chamada ao Supabase (RLS + validação no servidor);
 * nada aqui é fonte de verdade para limites, Premium ou moderação.
 */
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ChatMessage, DemoProfile, Intent, MyProfile } from '@/types';
import type { DiscoveryFilters } from './discovery';
import { DEMO_PROFILES, DEMO_REPLIES } from './mockData';
import { FREE_DAILY_LIKES, TRIAL_DAYS } from './constants';
import { ageFrom } from './validation';

const KEY = 'duomatch-demo-v1';
const MESSAGE_MAX = 1000;

export interface MatchEntry {
  profileId: string;
  at: number;
  unread: number;
}

interface State {
  me: MyProfile | null;
  mode: Intent;
  filters: DiscoveryFilters;
  premium: boolean;
  trialEndsAt: number | null;
  trialUsed: boolean; // um teste por conta (no servidor: por usuário e por meio de pagamento)
  swipes: Record<string, 'like' | 'pass'>;
  history: string[];
  likes: { day: string; count: number };
  matches: MatchEntry[];
  messages: Record<string, ChatMessage[]>;
  blocked: string[];
  reports: Array<{ profileId: string; reason: string; at: number }>;
}

const today = () => new Date().toISOString().slice(0, 10);

const initial: State = {
  me: null,
  mode: 'competitivo',
  filters: {},
  premium: false,
  trialEndsAt: null,
  trialUsed: false,
  swipes: {},
  history: [],
  likes: { day: today(), count: 0 },
  matches: [],
  messages: {},
  blocked: [],
  reports: [],
};

const uid = () => Math.random().toString(36).slice(2, 10);

function useDemoState() {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* estado corrompido: começa do zero */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Cota cheia (fotos grandes). O estado continua válido em memória.
      console.warn('[DuoMatch] Não foi possível salvar a demonstração no localStorage.');
    }
  }, [state, ready]);

  const likesToday = state.likes.day === today() ? state.likes.count : 0;
  const trialActive = state.trialEndsAt !== null && Date.now() < state.trialEndsAt;
  const premium = state.premium || trialActive;
  const likesLeft = premium ? Infinity : Math.max(0, FREE_DAILY_LIKES - likesToday);

  const profileById = useCallback((id: string) => DEMO_PROFILES.find((p) => p.id === id), []);

  const swipe = useCallback(
    (id: string, action: 'like' | 'pass'): 'match' | 'ok' | 'limit' => {
      if (action === 'like' && likesLeft <= 0) return 'limit';
      const isMatch = action === 'like' && !!profileById(id)?.likesYou;
      setState((s) => ({
        ...s,
        swipes: { ...s.swipes, [id]: action },
        history: [...s.history, id].slice(-20),
        likes:
          action === 'like'
            ? { day: today(), count: (s.likes.day === today() ? s.likes.count : 0) + 1 }
            : s.likes,
        matches:
          isMatch && !s.matches.some((m) => m.profileId === id)
            ? [{ profileId: id, at: Date.now(), unread: 0 }, ...s.matches]
            : s.matches,
      }));
      return isMatch ? 'match' : 'ok';
    },
    [likesLeft, profileById],
  );

  const undo = useCallback((): string | null => {
    const last = state.history[state.history.length - 1];
    if (!last || !premium) return null;
    // Desfazer não desfaz match já criado: o outro lado também já foi notificado.
    if (state.matches.some((m) => m.profileId === last)) return null;
    setState((s) => {
      const swipes = { ...s.swipes };
      const wasLike = swipes[last] === 'like';
      delete swipes[last];
      return {
        ...s,
        swipes,
        history: s.history.slice(0, -1),
        likes: wasLike ? { ...s.likes, count: Math.max(0, s.likes.count - 1) } : s.likes,
      };
    });
    return last;
  }, [state.history, premium, state.matches]);

  const sendMessage = useCallback((profileId: string, raw: string) => {
    const text = raw.trim().slice(0, MESSAGE_MAX);
    if (!text) return;
    const msg: ChatMessage = { id: uid(), from: 'me', text, at: Date.now() };
    setState((s) => ({ ...s, messages: { ...s.messages, [profileId]: [...(s.messages[profileId] ?? []), msg] } }));

    // Resposta automática de demonstração, só uma vez por conversa.
    setTimeout(() => {
      setState((s) => {
        const thread = s.messages[profileId] ?? [];
        if (thread.some((m) => m.from === 'them') || !s.matches.some((m) => m.profileId === profileId)) return s;
        const reply: ChatMessage = {
          id: uid(),
          from: 'them',
          text: DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)],
          at: Date.now(),
        };
        return {
          ...s,
          messages: { ...s.messages, [profileId]: [...thread, reply] },
          matches: s.matches.map((m) => (m.profileId === profileId ? { ...m, unread: m.unread + 1 } : m)),
        };
      });
    }, 1500);
  }, []);

  const removeMatch = (s: State, id: string): State => {
    const messages = { ...s.messages };
    delete messages[id];
    return { ...s, matches: s.matches.filter((m) => m.profileId !== id), messages };
  };

  return {
    ready,
    ...state,
    premium,
    trialActive,
    // Filtros avançados só valem com Premium ativo (no servidor, a mesma regra é obrigatória).
    filters: premium ? state.filters : { role: state.filters.role },
    likesLeft,
    profiles: DEMO_PROFILES,
    profileById,
    swipe,
    undo,
    sendMessage,
    // Idade pública é derivada; a data de nascimento nunca sai do perfil privado.
    saveMe: (me: MyProfile) =>
      setState((s) => ({ ...s, me: { ...me, age: me.showAge ? ageFrom(me.birthDate) : null } })),
    setMode: (mode: Intent) => setState((s) => ({ ...s, mode })),
    setFilters: (filters: DiscoveryFilters) => setState((s) => ({ ...s, filters })),
    setPremium: (on: boolean) => setState((s) => ({ ...s, premium: on, trialEndsAt: on ? s.trialEndsAt : null })),
    startTrial: () =>
      setState((s) =>
        s.trialUsed || s.premium ? s : { ...s, trialUsed: true, trialEndsAt: Date.now() + TRIAL_DAYS * 86_400_000 },
      ),
    markRead: (id: string) =>
      setState((s) => ({ ...s, matches: s.matches.map((m) => (m.profileId === id ? { ...m, unread: 0 } : m)) })),
    unmatch: (id: string) => setState((s) => removeMatch(s, id)),
    block: (id: string) => setState((s) => ({ ...removeMatch(s, id), blocked: [...new Set([...s.blocked, id])] })),
    report: (id: string, reason: string) =>
      setState((s) => ({ ...s, reports: [...s.reports, { profileId: id, reason, at: Date.now() }] })),
    likedMe: (): DemoProfile[] =>
      DEMO_PROFILES.filter((p) => p.likesYou && !state.swipes[p.id] && !state.blocked.includes(p.id)),
    resetDemo: () => setState({ ...initial, me: state.me }),
    deleteAccount: () => setState(initial),
  };
}

type Store = ReturnType<typeof useDemoState>;
const Ctx = createContext<Store | null>(null);

export function DemoStoreProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={useDemoState()}>{children}</Ctx.Provider>;
}

export function useDemo(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useDemo precisa estar dentro de <DemoStoreProvider>');
  return s;
}
