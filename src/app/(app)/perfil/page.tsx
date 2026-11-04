'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Eye, Pencil } from 'lucide-react';
import type { MyProfile } from '@/types';
import { PhotoManager } from '@/components/social/PhotoManager';
import { AboutSection, IntentPicker, LolSection } from '@/components/social/ProfileSections';
import { ProfileDetails } from '@/components/social/ProfileSheet';
import { Field, inputClass } from '@/components/social/primitives';
import { Button } from '@/components/ui/button';
import { DISPLAY_NAME_MAX } from '@/lib/constants';
import { useDemo } from '@/lib/demo-store';
import { ageFrom, validateProfile } from '@/lib/validation';
import { cn } from '@/lib/utils';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-3xl border border-border bg-card/40 p-5 sm:p-7">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function PerfilPage() {
  const demo = useDemo();
  const router = useRouter();
  const [draft, setDraft] = useState<MyProfile>(demo.me!);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patch = (p: Partial<MyProfile>) => {
    setDraft((d) => ({ ...d, ...p }));
    setSaved(false);
  };

  const save = () => {
    const errs = validateProfile(draft);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    demo.saveMe(draft);
    setSaved(true);
  };

  const preview = { ...draft, age: draft.showAge ? ageFrom(draft.birthDate) : null };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <div className="flex rounded-full border border-border bg-card p-1">
          {(
            [
              ['edit', 'Editar', Pencil],
              ['preview', 'Como os outros veem', Eye],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                tab === k ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'preview' ? (
        <ProfileDetails profile={preview} />
      ) : (
        <>
          <Card title="Fotos">
            <PhotoManager photos={draft.photos} onChange={(photos) => patch({ photos })} />
            {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
          </Card>

          <Card title="Sobre você">
            <Field label="Nome de exibição" error={errors.displayName}>
              <input
                className={inputClass}
                value={draft.displayName}
                maxLength={DISPLAY_NAME_MAX}
                onChange={(e) => patch({ displayName: e.target.value })}
              />
            </Field>
            <AboutSection value={draft} onChange={patch} errors={errors} />
          </Card>

          <Card title="Objetivos">
            <IntentPicker value={draft} onChange={patch} errors={errors} />
          </Card>

          <Card title="League of Legends">
            <LolSection value={draft} onChange={patch} errors={errors} />
          </Card>

          <Card title="Privacidade">
            <label className="flex items-center justify-between gap-4">
              <span>
                <span className="block font-bold">Aparecer na descoberta</span>
                <span className="text-sm text-muted-foreground">Desligado, ninguém novo vê seu perfil. Seus matches continuam.</span>
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 accent-[hsl(var(--primary))]"
                checked={draft.discoverable}
                onChange={(e) => patch({ discoverable: e.target.checked })}
              />
            </label>
          </Card>

          <div className="sticky bottom-20 z-10 flex items-center justify-end gap-3 rounded-full border border-border bg-background/90 p-2 backdrop-blur-md lg:bottom-4">
            {Object.keys(errors).length > 0 && <span className="px-3 text-sm text-destructive">Corrija os campos destacados</span>}
            <Button size="lg" className="rounded-full font-bold" onClick={save}>
              {saved ? <Check /> : null}
              {saved ? 'Salvo' : 'Salvar alterações'}
            </Button>
          </div>

          <Card title="Conta">
            <p className="text-sm text-muted-foreground">E-mail: {draft.email}</p>
            {confirmDelete ? (
              <div className="space-y-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
                <p className="text-sm">Isso apaga perfil, fotos, matches e mensagens deste navegador. Não dá para desfazer.</p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="rounded-full"
                    onClick={() => {
                      demo.deleteAccount();
                      router.replace('/');
                    }}
                  >
                    Excluir tudo
                  </Button>
                  <Button variant="ghost" className="rounded-full" onClick={() => setConfirmDelete(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="rounded-full border-destructive/40 bg-transparent text-destructive" onClick={() => setConfirmDelete(true)}>
                Excluir conta
              </Button>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
