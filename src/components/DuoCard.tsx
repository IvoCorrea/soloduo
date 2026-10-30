'use client';

import React from 'react';
import { DuoProfile } from '@/types';
import { Lock, X, Zap, Volume2, VolumeX } from 'lucide-react';

interface DuoCardProps {
  profile: DuoProfile;
  onPass: () => void;
  onMatch: () => void;
  onSelectSkin?: () => void;
}

export const DuoCard: React.FC<DuoCardProps> = ({
  profile,
  onPass,
  onMatch,
}) => {
  return (
    <div className="relative w-full max-w-md rounded-[32px] overflow-hidden bg-[#14232C] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
      
      {/* Top Section: Full Skin Splash Art */}
      <div className="relative w-full h-[360px] bg-slate-900 overflow-hidden group">
        <img
          src={profile.splashArtUrl}
          alt={profile.skinName}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />

        {/* Subtle Dark Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14232C] via-transparent to-black/30" />

        {/* Privacy Pill (Explaining Riot ID Masking) */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F1A20]/80 backdrop-blur-md border border-white/10 text-[11px] text-[#80A1D4] font-medium shadow-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>Riot ID só no match</span>
        </div>

        {/* Skin Name */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/90 font-semibold truncate max-w-[200px]">
          {profile.skinName}
        </div>

        {/* Bottom Overlay on Splash Art (Matches sketch layout: Name, Elo Emblem, Role) */}
        <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-white tracking-wide drop-shadow-md">
                {profile.displayName}
              </span>
              {profile.isOnline && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-[#14232C]" title="Online" />
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium">Buscando duo agora</p>
          </div>

          {/* Elo Emblem + Role Icon Badge */}
          <div className="flex items-center gap-2 bg-[#0F1A20]/85 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex items-center gap-1.5">
              <img
                src={profile.eloIconUrl}
                alt={profile.eloDisplay}
                className="w-7 h-7 object-contain drop-shadow"
              />
              <span className="text-xs font-black text-[#80A1D4] tracking-wider uppercase">
                {profile.eloDisplay}
              </span>
            </div>

            <div className="h-4 w-[1px] bg-white/20" />

            {/* Role Code (JG, MID, ADC, SUP, TOP) */}
            <div className="w-6 h-6 flex items-center justify-center font-bold text-xs bg-white/10 rounded-lg text-[#FA9F42]">
              {profile.role.slice(0, 3)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Bio, Vibes & Champion Pool */}
      <div className="p-6 space-y-5 bg-[#14232C]">
        
        {/* Bio / Motivation */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Sobre o Jogador
          </label>
          <p className="text-sm font-medium text-slate-200 leading-relaxed bg-[#0F1A20]/60 p-3.5 rounded-2xl border border-white/5">
            {profile.bio}
          </p>
        </div>

        {/* Vibes / Mental Tags (CHILL, CLIMB, TRYHARD) */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Estilo & Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.vibes.map((vibe, idx) => {
              const isHighlight = idx === 0;
              const isAccent = idx === 1;
              return (
                <span
                  key={vibe}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase border ${
                    isHighlight
                      ? 'bg-[#FA9F42]/15 text-[#FA9F42] border-[#FA9F42]/30'
                      : isAccent
                      ? 'bg-[#80A1D4]/15 text-[#80A1D4] border-[#80A1D4]/30'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}
                >
                  {vibe}
                </span>
              );
            })}
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase border bg-white/5 text-slate-400 border-white/5 flex items-center gap-1">
              {profile.hasMic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#80A1D4]" />
                  Com Mic
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  Sem Mic
                </>
              )}
            </span>
          </div>
        </div>

        {/* Top 3 Champion Pool (Bottom row from the user's sketch) */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <label className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
            Pool de Campeões
          </label>
          <div className="flex items-center gap-3">
            {profile.championPool.map((champ) => (
              <div
                key={champ.key}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-[#0F1A20] border border-white/5 hover:border-white/15 transition-all"
              >
                <img
                  src={champ.iconUrl}
                  alt={champ.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <span className="text-xs font-semibold text-slate-300">{champ.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls: Passar vs Bora Duo (Clean Airbnb Style) */}
        <div className="pt-2 flex items-center gap-4">
          <button
            onClick={onPass}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-[#0F1A20] hover:bg-[#182833] border border-white/10 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <X className="w-5 h-5 text-slate-400" />
            Passar
          </button>

          <button
            onClick={onMatch}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-[#FA9F42] hover:bg-[#e89035] text-[#0F1A20] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FA9F42]/20 transition-transform active:scale-95"
          >
            <Zap className="w-5 h-5 fill-current" />
            Bora Duo!
          </button>
        </div>

      </div>
    </div>
  );
};
