'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import type { MyProfile } from '@/types';
import { Logo } from '@/components/landing/Navbar';
import { PhotoManager } from '@/components/social/PhotoManager';
import { AboutSection, IntentPicker, LolSection } from '@/components/social/ProfileSections';
import { Field, inputClass } from '@/components/social/primitives';
import { Button } from '@/components/ui/button';
import { DISPLAY_NAME_MAX } from '@/lib/constants';
import { useDemo } from '@/lib/demo-store';
import { accountSchema, basicsSchema, firstError, validateProfile } from '@/lib/validation';

const STEPS = [
  { title: 'Crie sua conta', subtitle: 'Leva menos de dois minutos.' },
  { title: 'Como podemos te chamar?', subtitle: 'O DuoMatch é só para maiores de 18 anos.' },
  { title: 'Suas fotos', subtitle: 'Mostre quem você é: você, seu setup, seu pet, seu cosplay. A primeira é a principal.' },
  { title: 'Conte sobre você', subtitle: 'É o que faz alguém querer jogar com você.' },
  { title: 'Seu League of Legends', subtitle: 'Ajuda a encontrar gente compatível.' },
  { title: 'O que você procura?', subtitle: 'Dá pra mudar a qualquer momento na descoberta.' },
];

const EMPTY: MyProfile = {
  id: 'me',
  email: '',
  birthDate: '',
  showAge: true,
  displayName: '',
  age: null,
  pronouns: '',
  region: '',
  languages: ['Português'],
  bio: '',
  photos: [],
  interests: [],
  commStyle: 'tanto-faz',
  schedule: [],
  intents: [],
  discoverable: true,
  lol: {
    riotId: '',
    server: 'BR1',
    tier: 'GOLD',
    division: 'IV',
    mainRole: 'MID',
    secondaryRole: null,
    champions: [],
    modes: ['ranqueada'],
    mic: true,
    availableNow: false,
  },
};

export default function CadastroPage() {
  const demo = useDemo();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<MyProfile>(EMPTY);
  // A senha nunca é guardada na demonstração (Supabase Auth cuidará disso na Fase 2).
  const [password, setPassword] = useState('');
  const [adult, setAdult] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (demo.ready && demo.me) router.replace('/descobrir');
  }, [demo.ready, demo.me, router]);

  const patch = (p: Partial<MyProfile>) => setDraft((d) => ({ ...d, ...p }));

  const validate = (): Record<string, string> => {
    const all = validateProfile(draft, adult);
    switch (step) {
      case 0:
        return firstError(accountSchema.safeParse({ email: draft.email, password }));
      case 1:
        return firstError(basicsSchema.safeParse({ displayName: draft.displayName, birthDate: draft.birthDate, adultConfirmed: adult }));
      case 2:
        return all.photos ? { photos: all.photos } : {};
      case 3:
        return all.bio ? { bio: all.bio } : {};
      case 4:
        return all.riotId ? { riotId: all.riotId } : {};
      default:
        return all.intents ? { intents: all.intents } : {};
    }
  };

  const next = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (step === STEPS.length - 1) {
      demo.saveMe({ ...draft, schedule: draft.schedule.length ? draft.schedule : ['noite'] });
      router.replace('/descobrir');
      return;
    }
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setDir(-1);
    setStep((s) => s - 1);
  };

  if (!demo.ready || demo.me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col px-5 py-6">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-sm font-semibold text-muted-foreground">
          {step + 1} de {STEPS.length}
        </span>
      </div>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
        />
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: dir * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -40 }}
          transition={{ duration: 0.22 }}
          className="flex-1 space-y-6 py-8"
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{STEPS[step].title}</h1>
            <p className="text-muted-foreground">{STEPS[step].subtitle}</p>
          </div>

          {step === 0 && (
            <div className="space-y-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled
                className="h-12 w-full rounded-full bg-transparent"
                title="Disponível quando o Supabase Auth estiver configurado"
              >
                Continuar com Google (em breve)
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> ou com e-mail <span className="h-px flex-1 bg-border" />
              </div>
              <Field label="E-mail" error={errors.email}>
                <input
                  type="email"
                  autoComplete="email"
                  className={inputClass}
                  value={draft.email}
                  onChange={(e) => patch({ email: e.target.value })}
                />
              </Field>
              <Field label="Senha" hint="Mínimo de 8 caracteres" error={errors.password}>
                <input
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <p className="text-xs text-muted-foreground">
                Demonstração: nenhuma conta é criada em servidor e a senha não é salva. Login, verificação de e-mail e
                recuperação de senha chegam com o Supabase Auth.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <Field label="Nome de exibição" hint="Pode ser apelido" error={errors.displayName}>
                <input
                  className={inputClass}
                  value={draft.displayName}
                  maxLength={DISPLAY_NAME_MAX}
                  placeholder="ex.: Ivo"
                  onChange={(e) => patch({ displayName: e.target.value })}
                />
              </Field>
              <Field label="Data de nascimento" hint="Nunca aparece no perfil" error={errors.birthDate}>
                <input
                  type="date"
                  className={inputClass}
                  value={draft.birthDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => patch({ birthDate: e.target.value })}
                />
              </Field>
              <Field label="" error={errors.adultConfirmed}>
                <label className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
                  <input type="checkbox" className="mt-0.5 h-5 w-5 accent-[hsl(var(--primary))]" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
                  <span>Confirmo que tenho 18 anos ou mais e concordo com os Termos de Uso, a Política de Privacidade e as Regras da Comunidade.</span>
                </label>
              </Field>
            </div>
          )}

          {step === 2 && (
            <>
              <PhotoManager photos={draft.photos} onChange={(photos) => patch({ photos })} />
              {errors.photos && <p className="text-sm font-medium text-destructive">{errors.photos}</p>}
            </>
          )}

          {step === 3 && <AboutSection value={draft} onChange={patch} errors={errors} />}
          {step === 4 && <LolSection value={draft} onChange={patch} errors={errors} />}
          {step === 5 && <IntentPicker value={draft} onChange={patch} errors={errors} />}
        </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 flex gap-3 bg-background py-4">
        {step > 0 && (
          <Button variant="outline" size="lg" className="h-12 rounded-full bg-transparent" onClick={back}>
            <ArrowLeft /> Voltar
          </Button>
        )}
        <Button size="lg" className="h-12 flex-1 rounded-full text-base font-bold" onClick={next}>
          {step === STEPS.length - 1 ? 'Começar a descobrir' : 'Continuar'}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
