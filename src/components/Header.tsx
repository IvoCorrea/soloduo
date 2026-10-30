'use client';

import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSkinSelector: () => void;
  onlineCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSkinSelector,
  onlineCount = 142,
}) => {
  return (
    <header className="w-full max-w-4xl flex items-center justify-between py-4 px-6 rounded-3xl bg-[#14232C]/80 backdrop-blur-md border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] mb-8">
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#FA9F42] flex items-center justify-center font-black text-[#0F1A20] text-xl shadow-lg shadow-[#FA9F42]/20">
          s
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            soloduo
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#80A1D4]/15 text-[#80A1D4] font-bold border border-[#80A1D4]/20">
              BR
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Matchmaking com respeito e sem rage</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSkinSelector}
          className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 flex items-center gap-2 transition-all active:scale-95"
        >
          <Palette className="w-4 h-4 text-[#FA9F42]" />
          <span>Trocar Skin Splash</span>
        </button>

        <div className="h-7 w-[1px] bg-white/10 mx-1 hidden sm:block" />

        {/* Current User Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#0F1A20] border border-white/5">
          <div className="w-7 h-7 rounded-full bg-[#80A1D4]/20 flex items-center justify-center text-xs font-black text-[#80A1D4]">
            EU
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white leading-none">ivo----#b--</p>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {onlineCount} online
            </p>
          </div>
        </div>
      </div>

    </header>
  );
};
