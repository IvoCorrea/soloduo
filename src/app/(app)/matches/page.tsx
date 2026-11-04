'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Ban, Copy, Flag, HeartOff, MessageCircle, MoreVertical, Send, UserRound } from 'lucide-react';
import type { DemoProfile } from '@/types';
import { Modal, ProfileDetails } from '@/components/social/ProfileSheet';
import { Chip, Photo } from '@/components/social/primitives';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/lib/demo-store';
import { cn } from '@/lib/utils';

const REPORT_REASONS = ['Fotos impróprias', 'Perfil falso ou fotos de outra pessoa', 'Assédio ou ofensas', 'Spam ou golpe', 'Parece ser menor de idade', 'Outro'];
// Anti-spam simples no cliente; o limite real fica no servidor (Fase 2).
const BURST_LIMIT = 5;
const BURST_WINDOW_MS = 10_000;

function Chat({ profile, onBack }: { profile: DemoProfile; onBack: () => void }) {
  const demo = useDemo();
  const thread = demo.messages[profile.id] ?? [];
  const [text, setText] = useState('');
  const [warn, setWarn] = useState('');
  const [menu, setMenu] = useState(false);
  const [dialog, setDialog] = useState<'profile' | 'report' | 'block' | 'unmatch' | null>(null);
  const [reason, setReason] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    demo.markRead(profile.id);
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id, thread.length]);

  const send = () => {
    const recent = thread.filter((m) => m.from === 'me' && Date.now() - m.at < BURST_WINDOW_MS).length;
    if (recent >= BURST_LIMIT) {
      setWarn('Calma! Muitas mensagens em pouco tempo. Espere alguns segundos.');
      return;
    }
    setWarn('');
    demo.sendMessage(profile.id, text);
    setText('');
  };

  const close = () => setDialog(null);

  return (
    <div className="flex h-[calc(100vh-180px)] flex-col overflow-hidden rounded-3xl border border-border bg-card/40 lg:h-[calc(100vh-120px)]">
      <header className="flex items-center gap-3 border-b border-border p-3">
        <button onClick={onBack} aria-label="Voltar" className="rounded-full p-2 hover:bg-accent lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button onClick={() => setDialog('profile')} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted">
            <Photo photo={profile.photos[0]} alt="" />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-bold">{profile.displayName}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {profile.lol.riotId ? `Riot ID: ${profile.lol.riotId}` : 'Sem Riot ID informado'}
            </span>
          </span>
        </button>
        {profile.lol.riotId && (
          <button
            onClick={() => navigator.clipboard.writeText(profile.lol.riotId)}
            aria-label="Copiar Riot ID"
            title="Copiar Riot ID"
            className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
        <div className="relative">
          <button onClick={() => setMenu((m) => !m)} aria-label="Mais opções" aria-expanded={menu} className="rounded-full p-2 hover:bg-accent">
            <MoreVertical className="h-5 w-5" />
          </button>
          {menu && (
            <div className="absolute right-0 top-11 z-20 w-52 overflow-hidden rounded-2xl border border-border bg-popover py-1 shadow-xl" onMouseLeave={() => setMenu(false)}>
              {[
                { k: 'profile' as const, icon: UserRound, label: 'Ver perfil' },
                { k: 'unmatch' as const, icon: HeartOff, label: 'Desfazer match' },
                { k: 'block' as const, icon: Ban, label: 'Bloquear' },
                { k: 'report' as const, icon: Flag, label: 'Denunciar' },
              ].map((o) => (
                <button
                  key={o.k}
                  onClick={() => {
                    setMenu(false);
                    setDialog(o.k);
                  }}
                  className={cn('flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent', o.k !== 'profile' && 'text-destructive')}
                >
                  <o.icon className="h-4 w-4" />
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {thread.length === 0 && (
          <div className="mx-auto max-w-xs space-y-2 py-10 text-center text-sm text-muted-foreground">
            <p className="text-base font-semibold text-foreground">Vocês deram match!</p>
            <p>Diga oi, combine um horário ou chame pro lobby. Seja gentil: denúncias de assédio levam a suspensão.</p>
          </div>
        )}
        {thread.map((m) => (
          <div key={m.id} className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
            <p
              className={cn(
                'max-w-[78%] whitespace-pre-line break-words rounded-3xl px-4 py-2.5 text-sm',
                m.from === 'me' ? 'rounded-br-lg bg-primary text-primary-foreground' : 'rounded-bl-lg bg-muted',
              )}
            >
              {m.text}
            </p>
          </div>
        ))}
        <div ref={bottom} />
      </div>

      <form
        className="space-y-1 border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        {warn && <p className="px-2 text-xs text-destructive">{warn}</p>}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            placeholder="Escreva uma mensagem…"
            aria-label="Mensagem"
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <Button type="submit" size="icon" className="h-11 w-11 rounded-full" disabled={!text.trim()} aria-label="Enviar">
            <Send />
          </Button>
        </div>
      </form>

      <Modal open={dialog === 'profile'} onClose={close} label="Perfil" wide>
        <ProfileDetails profile={profile} showRiotId />
      </Modal>

      <Modal open={dialog === 'unmatch' || dialog === 'block'} onClose={close} label="Confirmar">
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold">{dialog === 'block' ? `Bloquear ${profile.displayName}?` : `Desfazer match com ${profile.displayName}?`}</h3>
          <p className="text-sm text-muted-foreground">
            {dialog === 'block'
              ? 'Vocês deixam de se ver na descoberta e a conversa é apagada. A pessoa não é avisada.'
              : 'A conversa é apagada para os dois.'}
          </p>
          <Button
            variant="destructive"
            className="w-full rounded-full"
            onClick={() => {
              if (dialog === 'block') demo.block(profile.id);
              else demo.unmatch(profile.id);
              close();
              onBack();
            }}
          >
            {dialog === 'block' ? 'Bloquear' : 'Desfazer match'}
          </Button>
        </div>
      </Modal>

      <Modal open={dialog === 'report'} onClose={close} label="Denunciar">
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-bold">Denunciar {profile.displayName}</h3>
          <div className="flex flex-wrap gap-2">
            {REPORT_REASONS.map((r) => (
              <Chip key={r} active={reason === r} onClick={() => setReason(r)}>
                {r}
              </Chip>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Nesta demonstração a denúncia fica registrada só no seu navegador. Com o servidor ativo, ela vai para a fila de moderação.
          </p>
          <Button
            className="w-full rounded-full"
            disabled={!reason}
            onClick={() => {
              demo.report(profile.id, reason);
              demo.block(profile.id);
              close();
              onBack();
            }}
          >
            Denunciar e bloquear
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function MatchesInner() {
  const demo = useDemo();
  const router = useRouter();
  const current = useSearchParams().get('c');
  const list = demo.matches
    .map((m) => ({ m, p: demo.profileById(m.profileId) }))
    .filter((x): x is { m: (typeof demo.matches)[number]; p: DemoProfile } => !!x.p);
  const active = list.find((x) => x.p.id === current)?.p;
  const open = (id: string | null) => router.replace(id ? `/matches?c=${id}` : '/matches');

  if (!list.length) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-20 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold">Nenhum match ainda</h1>
        <p className="text-muted-foreground">Quando alguém que você curtiu curtir você de volta, a conversa aparece aqui.</p>
        <Button asChild className="rounded-full">
          <Link href="/descobrir">Descobrir jogadores</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      <div className={cn('space-y-4', active && 'hidden lg:block')}>
        <h1 className="text-2xl font-bold">Matches</h1>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {list.map(({ p }) => (
            <button key={p.id} onClick={() => open(p.id)} className="w-20 shrink-0 space-y-1 text-center">
              <span className={cn('block aspect-[3/4] overflow-hidden rounded-2xl border-2', current === p.id ? 'border-primary' : 'border-transparent')}>
                <Photo photo={p.photos[0]} alt="" />
              </span>
              <span className="block truncate text-xs font-semibold">{p.displayName}</span>
            </button>
          ))}
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Mensagens</h2>
        <ul className="space-y-1">
          {list.map(({ m, p }) => {
            const last = demo.messages[p.id]?.at(-1);
            return (
              <li key={p.id}>
                <button
                  onClick={() => open(p.id)}
                  className={cn('flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-accent', current === p.id && 'bg-accent')}
                >
                  <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                    <Photo photo={p.photos[0]} alt="" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{p.displayName}</span>
                    <span className={cn('block truncate text-sm', m.unread ? 'font-semibold text-foreground' : 'text-muted-foreground')}>
                      {last ? `${last.from === 'me' ? 'Você: ' : ''}${last.text}` : 'Novo match! Diga oi 👋'}
                    </span>
                  </span>
                  {m.unread > 0 && <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-label="Não lida" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {active ? (
        <Chat key={active.id} profile={active} onBack={() => open(null)} />
      ) : (
        <div className="hidden items-center justify-center rounded-3xl border border-dashed border-border text-muted-foreground lg:flex">
          Escolha uma conversa
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense>
      <MatchesInner />
    </Suspense>
  );
}
