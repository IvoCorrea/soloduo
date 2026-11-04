'use client';

import { useState } from 'react';
import type { ProfilePhoto } from '@/types';
import type { Division, EloTier } from '@/types';
import { ELO_EMBLEMS, formatElo } from '@/lib/riot';
import { cn } from '@/lib/utils';

/** Foto com enquadramento e queda para `fallbackUrl` se o arquivo não existir. */
export function Photo({
  photo,
  alt,
  className,
  draggable = false,
}: {
  photo: ProfilePhoto;
  alt: string;
  className?: string;
  draggable?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed && photo.fallbackUrl ? photo.fallbackUrl : photo.url;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      draggable={draggable}
      onError={() => setFailed(true)}
      className={cn('h-full w-full select-none object-cover', className)}
      style={{ objectPosition: `${photo.focusX}% ${photo.focusY}%` }}
    />
  );
}

export function Chip({
  active,
  onClick,
  children,
  className,
  disabled,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-primary bg-primary/15 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EloBadge({ tier, division, className }: { tier: EloTier; division: Division | null; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ELO_EMBLEMS[tier]} alt="" className="h-5 w-5 object-contain" />
      {formatElo(tier, division)}
    </span>
  );
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-bold">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  'w-full rounded-2xl border border-input bg-card px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30';
