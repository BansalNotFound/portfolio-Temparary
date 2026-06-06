import React from 'react';
import { useLanguage } from '../lib/LanguageContext';

export function DesktopBanner() {
  const { t } = useLanguage();
  
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 pointer-events-none origin-right transform">
      <div className="bg-red-600 text-white border-y-2 border-l-2 border-black py-4 px-1 shadow-[-4px_4px_0_#000] flex items-center justify-center">
        <span 
          className="font-impact text-sm tracking-[0.3em] uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {t('BEST_ON_DESKTOP') || 'BEST EXPERIENCED ON DESKTOP'}
        </span>
      </div>
    </div>
  );
}
