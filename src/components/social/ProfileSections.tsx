'use client';

import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import type { MyProfile, Role } from '@/types';
import {
  APEX_TIERS,
  BIO_MAX,
  CHAMPION_SUGGESTIONS,
  COMM_STYLE_LABEL,
  DIVISIONS,
  GAME_MODE_LABEL,
  GAME_MODES,
  INTENT_INFO,
  INTENTS,
  INTEREST_SUGGESTIONS,
  LANGUAGE_SUGGESTIONS,
  ROLE_LABEL,
  ROLES,
  SERVER_LABEL,
  SERVERS,
  TIER_LABEL,
  TIERS,
  TIME_SLOT_LABEL,
  TIME_SLOTS,
} from '@/lib/constants';
import { getChampionIconUrl } from '@/lib/riot';
import { cn } from '@/lib/utils';
import { Chip, Field, inputClass, toggle } from './primitives';

type Props = {
  value: MyProfile;
  onChange: (patch: Partial<MyProfile>) => void;
  errors?: Record<string, string>;
};

const patchLol = (value: MyProfile, onChange: Props['onChange'], patch: Partial<MyProfile['lol']>) =>
  onChange({ lol: { ...value.lol, ...patch } });

/** Lista livre com sugestões: o usuário não fica preso às opções prontas. */
function FreeList({
  values,
  suggestions,
  onChange,
  placeholder,
  max = 12,
}: {
  values: string[];
  suggestions: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  const [draft, setDraft] = useState('');
  const custom = values.filter((v) => !suggestions.includes(v));
  const addDraft = () => {
    const v = draft.trim().replace(/[<>]/g, '').slice(0, 30);
    if (v && !values.includes(v) && values.length < max) onChange([...values, v]);
    setDraft('');
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[...suggestions, ...custom].map((s) => (
          <Chip
            key={s}
            active={values.includes(s)}
            disabled={!values.includes(s) && values.length >= max}
            onClick={() => onChange(toggle(values, s))}
          >
            {values.includes(s) && <Check className="h-3.5 w-3.5" />}
            {s}
          </Chip>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          maxLength={30}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addDraft();
            }
          }}
        />
        <button
          type="button"
          onClick={addDraft}
          aria-label="Adicionar"
          className="flex w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card hover:border-primary/50"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export function IntentPicker({ value, onChange, errors }: Props) {
  return (
    <Field label="O que você procura?" hint="Escolha uma ou mais" error={errors?.intents}>
      <div className="grid gap-3">
        {INTENTS.map((i) => {
          const active = value.intents.includes(i);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ intents: toggle(value.intents, i) })}
              className={cn(
                'flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-colors',
                active ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span>
                <span className="block font-bold">{INTENT_INFO[i].label}</span>
                <span className="text-sm text-muted-foreground">{INTENT_INFO[i].description}</span>
              </span>
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border',
                  active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                )}
              >
                {active && <Check className="h-4 w-4" />}
              </span>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export function BioField({ value, onChange, errors }: Props) {
  return (
    <Field label="Bio" hint={`${value.bio.length}/${BIO_MAX}`} error={errors?.bio}>
      <textarea
        className={cn(inputClass, 'min-h-[140px] resize-y')}
        value={value.bio}
        maxLength={BIO_MAX}
        placeholder={'Conta um pouco de você: como gosta de jogar, o que curte fora do Rift… 🎮'}
        onChange={(e) => onChange({ bio: e.target.value })}
      />
    </Field>
  );
}

export function AboutSection({ value, onChange, errors }: Props) {
  return (
    <div className="space-y-6">
      <BioField value={value} onChange={onChange} errors={errors} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pronomes" hint="Opcional">
          <input
            className={inputClass}
            value={value.pronouns}
            maxLength={20}
            placeholder="ex.: ela/dela"
            onChange={(e) => onChange({ pronouns: e.target.value.replace(/[<>]/g, '') })}
          />
        </Field>
        <Field label="Região aproximada" hint="Opcional">
          <input
            className={inputClass}
            value={value.region}
            maxLength={40}
            placeholder="ex.: Recife, PE"
            onChange={(e) => onChange({ region: e.target.value.replace(/[<>]/g, '') })}
          />
        </Field>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
        <span>
          <span className="block font-bold">Mostrar minha idade</span>
          <span className="text-sm text-muted-foreground">A data de nascimento nunca aparece no perfil.</span>
        </span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-[hsl(var(--primary))]"
          checked={value.showAge}
          onChange={(e) => onChange({ showAge: e.target.checked })}
        />
      </label>

      <Field label="Interesses" hint="Escolha ou escreva os seus">
        <FreeList
          values={value.interests}
          suggestions={INTEREST_SUGGESTIONS}
          onChange={(interests) => onChange({ interests })}
          placeholder="Outro interesse…"
        />
      </Field>

      <Field label="Idiomas">
        <FreeList
          values={value.languages}
          suggestions={LANGUAGE_SUGGESTIONS}
          onChange={(languages) => onChange({ languages })}
          placeholder="Outro idioma…"
          max={6}
        />
      </Field>

      <Field label="Comunicação">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(COMM_STYLE_LABEL) as MyProfile['commStyle'][]).map((c) => (
            <Chip key={c} active={value.commStyle === c} onClick={() => onChange({ commStyle: c })}>
              {COMM_STYLE_LABEL[c]}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Quando você costuma jogar?" error={errors?.schedule}>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((s) => (
            <Chip key={s} active={value.schedule.includes(s)} onClick={() => onChange({ schedule: toggle(value.schedule, s) })}>
              {TIME_SLOT_LABEL[s]}
            </Chip>
          ))}
        </div>
      </Field>
    </div>
  );
}

function RolePicker({ value, onPick, allowNone }: { value: Role | null; onPick: (r: Role | null) => void; allowNone?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {allowNone && (
        <Chip active={value === null} onClick={() => onPick(null)}>
          Nenhuma
        </Chip>
      )}
      {ROLES.map((r) => (
        <Chip key={r} active={value === r} onClick={() => onPick(r)}>
          {ROLE_LABEL[r]}
        </Chip>
      ))}
    </div>
  );
}

export function LolSection({ value, onChange, errors }: Props) {
  const lol = value.lol;
  const set = (patch: Partial<MyProfile['lol']>) => patchLol(value, onChange, patch);
  const [champDraft, setChampDraft] = useState('');
  const isApex = APEX_TIERS.includes(lol.tier);

  const addChampion = (key: string) => {
    const k = key.replace(/[^A-Za-z]/g, '');
    if (k && !lol.champions.includes(k) && lol.champions.length < 5) set({ champions: [...lol.champions, k] });
    setChampDraft('');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Riot ID" hint="Opcional · só aparece depois do match" error={errors?.riotId}>
          <input
            className={inputClass}
            value={lol.riotId}
            placeholder="Nome#BR1"
            maxLength={22}
            onChange={(e) => set({ riotId: e.target.value })}
          />
        </Field>
        <Field label="Servidor">
          <select className={inputClass} value={lol.server} onChange={(e) => set({ server: e.target.value as typeof lol.server })}>
            {SERVERS.map((s) => (
              <option key={s} value={s}>
                {SERVER_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <p className="-mt-3 text-xs text-muted-foreground">
        Nunca pedimos sua senha da Riot. Elo e Riot ID informados aqui são declarados por você e não recebem selo de verificação.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Elo">
          <select
            className={inputClass}
            value={lol.tier}
            onChange={(e) => {
              const tier = e.target.value as typeof lol.tier;
              set({ tier, division: APEX_TIERS.includes(tier) ? null : lol.division ?? 'IV' });
            }}
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                {TIER_LABEL[t]}
              </option>
            ))}
          </select>
        </Field>
        {!isApex && (
          <Field label="Divisão">
            <div className="flex gap-2">
              {DIVISIONS.map((d) => (
                <Chip key={d} active={lol.division === d} onClick={() => set({ division: d })} className="flex-1 justify-center">
                  {d}
                </Chip>
              ))}
            </div>
          </Field>
        )}
      </div>

      <Field label="Rota principal">
        <RolePicker value={lol.mainRole} onPick={(r) => r && set({ mainRole: r, secondaryRole: lol.secondaryRole === r ? null : lol.secondaryRole })} />
      </Field>
      <Field label="Rota secundária">
        <RolePicker value={lol.secondaryRole} allowNone onPick={(r) => set({ secondaryRole: r === lol.mainRole ? null : r })} />
      </Field>

      <Field label="Campeões favoritos" hint={`${lol.champions.length}/5`}>
        <div className="flex flex-wrap gap-2">
          {lol.champions.map((c) => (
            <span key={c} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 py-1 pl-1 pr-2 text-sm font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getChampionIconUrl(c)} alt="" className="h-6 w-6 rounded-full" />
              {c}
              <button type="button" aria-label={`Remover ${c}`} onClick={() => set({ champions: lol.champions.filter((x) => x !== c) })}>
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <input
          className={inputClass}
          list="champions"
          value={champDraft}
          disabled={lol.champions.length >= 5}
          placeholder="Digite um campeão e aperte Enter"
          onChange={(e) => {
            setChampDraft(e.target.value);
            if (CHAMPION_SUGGESTIONS.includes(e.target.value)) addChampion(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addChampion(champDraft);
            }
          }}
        />
        <datalist id="champions">
          {CHAMPION_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>

      <Field label="Modos preferidos">
        <div className="flex flex-wrap gap-2">
          {GAME_MODES.map((m) => (
            <Chip key={m} active={lol.modes.includes(m)} onClick={() => set({ modes: toggle(lol.modes, m) })}>
              {GAME_MODE_LABEL[m]}
            </Chip>
          ))}
        </div>
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { key: 'mic' as const, label: 'Uso microfone', desc: 'Call no Discord ou no client' },
          { key: 'availableNow' as const, label: 'Disponível agora', desc: 'Aparece em destaque no casual' },
        ].map((o) => (
          <label key={o.key} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
            <span>
              <span className="block font-bold">{o.label}</span>
              <span className="text-sm text-muted-foreground">{o.desc}</span>
            </span>
            <input
              type="checkbox"
              className="h-5 w-5 accent-[hsl(var(--primary))]"
              checked={lol[o.key]}
              onChange={(e) => set({ [o.key]: e.target.checked })}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
