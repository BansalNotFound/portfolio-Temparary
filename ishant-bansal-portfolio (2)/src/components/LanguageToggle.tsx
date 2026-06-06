import React from 'react';
import { useLanguage } from '../lib/LanguageContext';
import { soundManager } from '../lib/sound';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const handleToggle = () => {
    soundManager.init();
    soundManager.playThud();
    toggleLanguage();
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-4 right-[180px] md:top-8 md:right-[220px] z-[9999] bg-white border-[4px] border-black px-4 py-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_#000] shadow-[4px_4px_0_#dc2626] transition-all group font-impact text-xl tracking-wider flex items-center gap-2"
      aria-label="Toggle Language"
    >
      <span className={language === 'en' ? 'text-red-600' : 'text-zinc-400'}>EN</span>
      <span className="text-black">/</span>
      <span className={language === 'ja' ? 'text-red-600 font-manga' : 'text-zinc-400 font-manga'}>JP</span>
    </button>
  );
}
