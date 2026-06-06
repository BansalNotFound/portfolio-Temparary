import React, { useState } from "react";
import ReactLenis from 'lenis/react';
import {
  Hero,
  About,
  MobileSkills as Skills,
  Projects,
  Experience,
  MobileFooter as Footer,
  Preloader,
  MangaModeToggle,
  MangaDivider,
  SoundToggle,
  Contact,
  LanguageToggle,
  DesktopBanner
} from "./components";
import { useLanguage } from './lib/LanguageContext';

export default function MobileApp() {
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  return (
    <>
      <DesktopBanner />
      <LanguageToggle />
      <SoundToggle />
      <MangaModeToggle />
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <ReactLenis root options={{ smoothWheel: true, duration: 1.5, touchMultiplier: 2 }}>
        <main className="w-full min-h-screen bg-[#f4f4f0] text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
          <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
            <Hero />
            <MangaDivider chapter={t('EPISODE_01')} title={t('ORIGIN_STORY')} />
            <About />
            <MangaDivider chapter={t('EPISODE_02')} title={t('ARSENAL')} />
            <Skills />
            <MangaDivider chapter={t('EPISODE_03')} title={t('BATTLE_LOGS')} />
            <Projects />
            <MangaDivider chapter={t('EPISODE_04')} title={t('EXP_POINTS')} />
            <Experience />
            <MangaDivider chapter={t('FINAL_STAGE')} title={t('CONTINUE')} />
            <Contact />
            <Footer />
          </div>
        </main>
      </ReactLenis>
    </>
  );
}
