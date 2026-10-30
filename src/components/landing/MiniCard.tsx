import { cn } from '@/lib/utils';

interface MiniCardProps {
  displayName: string;
  elo: string;
  eloIcon: string;
  role: string;
  splash: string;
  vibes: string[];
  className?: string;
  style?: React.CSSProperties;
}

/** Versão compacta e estática do card de duo, usada na landing. */
export function MiniCard({
  displayName,
  elo,
  eloIcon,
  role,
  splash,
  vibes,
  className,
  style,
}: MiniCardProps) {
  return (
    <div
      style={style}
      className={cn(
        'w-64 overflow-hidden rounded-3xl border border-white/10 bg-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]',
        className,
      )}
    >
      <div className="relative h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={splash} alt="" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <span className="text-xl font-extrabold text-white drop-shadow">
            {displayName}
          </span>
          <span className="rounded-lg bg-white/10 px-1.5 py-0.5 text-xs font-bold text-primary backdrop-blur">
            {role}
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={eloIcon} alt="" className="h-6 w-6 object-contain" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-secondary">
            {elo}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {vibes.map((v, i) => (
            <span
              key={v}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wide',
                i === 0
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-secondary/30 bg-secondary/10 text-secondary',
              )}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
