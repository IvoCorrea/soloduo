'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Crop, ImagePlus, Loader2, ShieldAlert, Star, Trash2 } from 'lucide-react';
import type { ProfilePhoto } from '@/types';
import { MAX_PHOTOS, PhotoError, preparePhoto } from '@/lib/photos';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Modal } from './ProfileSheet';
import { Photo } from './primitives';

const STATUS_LABEL: Record<ProfilePhoto['status'], string> = {
  local: 'Só você vê',
  pending: 'Em análise',
  approved: 'Aprovada',
  rejected: 'Recusada',
  review_required: 'Em revisão',
};

export function PhotoManager({ photos, onChange }: { photos: ProfilePhoto[]; onChange: (p: ProfilePhoto[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [adjusting, setAdjusting] = useState<string | null>(null);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const errs: string[] = [];
    const next = [...photos];
    for (const file of Array.from(files)) {
      if (next.length >= MAX_PHOTOS) {
        errs.push(`Limite de ${MAX_PHOTOS} fotos atingido.`);
        break;
      }
      try {
        const url = await preparePhoto(file);
        next.push({ id: crypto.randomUUID(), url, focusX: 50, focusY: 50, status: 'local' });
      } catch (e) {
        errs.push(`${file.name}: ${e instanceof PhotoError ? e.message : 'erro inesperado.'}`);
      }
    }
    onChange(next);
    setErrors(errs);
    setBusy(false);
    if (input.current) input.current.value = '';
  };

  const move = (i: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    [next[i], next[to]] = [next[to], next[i]];
    onChange(next);
  };

  const current = photos.find((p) => p.id === adjusting);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: MAX_PHOTOS }, (_, i) => {
          const p = photos[i];
          if (!p) {
            return (
              <button
                key={`empty-${i}`}
                type="button"
                disabled={busy}
                onClick={() => input.current?.click()}
                className="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/50 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {busy && i === photos.length ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                {i === 0 ? 'Foto principal' : 'Adicionar'}
              </button>
            );
          }
          return (
            <div key={p.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
              <Photo photo={p} alt={`Sua foto ${i + 1}`} />
              <span
                className={cn(
                  'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold backdrop-blur-md',
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-black/60 text-white',
                )}
              >
                {i === 0 ? 'Principal' : STATUS_LABEL[p.status]}
              </span>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                {[
                  { icon: ArrowLeft, label: 'Mover para a esquerda', on: () => move(i, i - 1), hide: i === 0 },
                  { icon: Star, label: 'Tornar principal', on: () => move(i, 0), hide: i === 0 },
                  { icon: Crop, label: 'Ajustar enquadramento', on: () => setAdjusting(p.id) },
                  { icon: Trash2, label: 'Excluir foto', on: () => onChange(photos.filter((x) => x.id !== p.id)) },
                  { icon: ArrowRight, label: 'Mover para a direita', on: () => move(i, i + 1), hide: i === photos.length - 1 },
                ]
                  .filter((a) => !a.hide)
                  .map((a) => (
                    <button
                      key={a.label}
                      type="button"
                      onClick={a.on}
                      aria-label={a.label}
                      title={a.label}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md hover:bg-white/30"
                    >
                      <a.icon className="h-3.5 w-3.5" />
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(e) => add(e.target.files)}
      />

      {errors.map((e) => (
        <p key={e} role="alert" className="text-sm font-medium text-destructive">
          {e}
        </p>
      ))}

      <p className="flex gap-2 rounded-2xl border border-border bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldAlert className="h-4 w-4 shrink-0 text-secondary" />
        <span>
          Até {MAX_PHOTOS} fotos (JPEG, PNG ou WebP, até 10 MB). Pode ser você, seu setup, seu pet, cosplay ou arte de jogo.
          Nada de nudez ou conteúdo sexual. Nesta demonstração as fotos ficam só no seu navegador, sem localização (removemos
          os metadados). Quando o servidor estiver ativo, cada foto passa por moderação antes de aparecer para outras pessoas.
        </span>
      </p>

      <Modal open={!!current} onClose={() => setAdjusting(null)} label="Ajustar enquadramento">
        {current && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Ajustar enquadramento</h3>
            <p className="text-sm text-muted-foreground">Toque no ponto que deve ficar no centro do card.</p>
            <button
              type="button"
              className="relative mx-auto block aspect-[3/4] w-64 cursor-crosshair overflow-hidden rounded-3xl bg-muted"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const focusX = Math.round(((e.clientX - r.left) / r.width) * 100);
                const focusY = Math.round(((e.clientY - r.top) / r.height) * 100);
                onChange(photos.map((p) => (p.id === current.id ? { ...p, focusX, focusY } : p)));
              }}
            >
              <Photo photo={current} alt="Pré-visualização" />
              <span
                className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                style={{ left: `${current.focusX}%`, top: `${current.focusY}%` }}
              />
            </button>
            <Button className="w-full rounded-full" onClick={() => setAdjusting(null)}>
              Pronto
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
