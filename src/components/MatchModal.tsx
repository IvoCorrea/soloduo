'use client';

import React, { useState } from 'react';
import { DuoProfile } from '@/types';
import { Check, Copy, ExternalLink, Sparkles, X } from 'lucide-react';

interface MatchModalProps {
  profile: DuoProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  profile,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !profile) return null;

  const handleCopyRiotId = () => {
    navigator.clipboard.writeText(profile.realRiotId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14232C] border border-white/15 rounded-[32px] p-7 shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FA9F42]/15 border border-[#FA9F42]/30 text-[#FA9F42] font-black text-xs uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          Sinergia Confirmada!
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-black text-white">Deu Match! 🎉</h2>
          <p className="text-sm text-slate-300">
            Vocês dois querem jogar juntos. Os detalhes de contato foram revelados:
          </p>
        </div>

        {/* Real Riot ID Box */}
        <div className="bg-[#0F1A20] p-4 rounded-2xl border border-[#FA9F42]/30 flex items-center justify-between shadow-inner">
          <div className="text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Riot ID Completo
            </span>
            <span className="text-lg font-black text-white tracking-wide">
              {profile.realRiotId}
            </span>
          </div>

          <button
            onClick={handleCopyRiotId}
            className="px-4 py-2 rounded-xl bg-[#FA9F42] hover:bg-[#e89035] text-[#0F1A20] font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#FA9F42]/15 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>

        {/* Discord Tag */}
        <div className="bg-[#0F1A20] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Discord
            </span>
            <span className="text-sm font-bold text-[#80A1D4]">
              {profile.discordTag}
            </span>
          </div>

          <a
            href={`https://discord.com`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-[#80A1D4]/15 hover:bg-[#80A1D4]/25 text-[#80A1D4] border border-[#80A1D4]/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            Abrir
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
        >
          Continuar Buscando
        </button>
      </div>
    </div>
  );
};
