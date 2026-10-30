'use client';

import React, { useState } from 'react';
import { DuoProfile } from '@/types';
import { INITIAL_PROFILES } from '@/lib/mockData';
import { Header } from '@/components/Header';
import { DuoCard } from '@/components/DuoCard';
import { MatchModal } from '@/components/MatchModal';
import { SkinSelectorModal } from '@/components/SkinSelectorModal';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const [profiles, setProfiles] = useState<DuoProfile[]>(INITIAL_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<DuoProfile | null>(null);
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('ALL');

  const currentProfile = profiles[currentIndex % profiles.length];

  const handlePass = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleMatch = () => {
    setMatchedProfile(currentProfile);
    setIsMatchOpen(true);
  };

  const handleCloseMatch = () => {
    setIsMatchOpen(false);
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleSelectSkin = (newSplash: string, skinName: string) => {
    setProfiles((prev) =>
      prev.map((p, idx) =>
        idx === currentIndex % profiles.length
          ? { ...p, splashArtUrl: newSplash, skinName }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0F1A20] text-slate-100 flex flex-col items-center justify-start p-4 md:p-8">
      
      {/* Top Airbnb-style Navbar */}
      <Header onOpenSkinSelector={() => setIsSkinModalOpen(true)} />

      {/* Pill Filter Bar */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 mb-6 px-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterRole('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterRole === 'ALL'
                ? 'bg-[#FA9F42] text-[#0F1A20] shadow-sm'
                : 'bg-[#182833] text-slate-300 border border-white/5 hover:bg-[#1f3342]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterRole('PLATINA')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              filterRole === 'PLATINA'
                ? 'bg-[#FA9F42] text-[#0F1A20] shadow-sm'
                : 'bg-[#182833] text-slate-300 border border-white/5 hover:bg-[#1f3342]'
            }`}
          >
            Platina & Acima
          </button>
          <button
            onClick={() => setFilterRole('SUPPORT')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              filterRole === 'SUPPORT'
                ? 'bg-[#FA9F42] text-[#0F1A20] shadow-sm'
                : 'bg-[#182833] text-slate-300 border border-white/5 hover:bg-[#1f3342]'
            }`}
          >
            Suporte
          </button>
          <button
            onClick={() => setFilterRole('MIC')}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              filterRole === 'MIC'
                ? 'bg-[#FA9F42] text-[#0F1A20] shadow-sm'
                : 'bg-[#182833] text-slate-300 border border-white/5 hover:bg-[#1f3342]'
            }`}
          >
            Com Mic
          </button>
        </div>

        <button
          onClick={() => setCurrentIndex(0)}
          title="Reiniciar lista de cartões"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Duo Card */}
      <main className="w-full max-w-md flex flex-col items-center">
        {currentProfile && (
          <DuoCard
            profile={currentProfile}
            onPass={handlePass}
            onMatch={handleMatch}
          />
        )}
      </main>

      {/* Match Reveal Modal */}
      <MatchModal
        profile={matchedProfile}
        isOpen={isMatchOpen}
        onClose={handleCloseMatch}
      />

      {/* Skin Splash Selector Modal */}
      <SkinSelectorModal
        isOpen={isSkinModalOpen}
        onClose={() => setIsSkinModalOpen(false)}
        onSelect={handleSelectSkin}
      />

    </div>
  );
}
