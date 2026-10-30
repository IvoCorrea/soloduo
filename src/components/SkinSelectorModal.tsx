'use client';

import React from 'react';
import { POPULAR_SKINS, getSplashArtUrl } from '@/lib/riot';
import { X, Palette } from 'lucide-react';

interface SkinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (splashArtUrl: string, skinName: string) => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#14232C] border border-white/15 rounded-[32px] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FA9F42]/15 flex items-center justify-center text-[#FA9F42]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Escolha sua Skin Splash</h3>
              <p className="text-xs text-slate-400">Personalize a arte que vai aparecer no seu card</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto p-1 custom-scrollbar">
          {POPULAR_SKINS.map((skin) => {
            const url = getSplashArtUrl(skin.champion, skin.skinNum);
            return (
              <div
                key={`${skin.champion}-${skin.skinNum}`}
                onClick={() => {
                  onSelect(url, skin.name);
                  onClose();
                }}
                className="cursor-pointer group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#FA9F42] transition-all hover:scale-[1.02]"
              >
                <img
                  src={url}
                  alt={skin.name}
                  className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-xs font-bold text-white leading-tight">
                    {skin.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
