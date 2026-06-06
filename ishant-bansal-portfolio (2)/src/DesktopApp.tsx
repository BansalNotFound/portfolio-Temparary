import React, { useEffect, useRef, useState } from "react";
import ReactLenis from 'lenis/react';
import {
  WebGLExperience,
  Hero,
  About,
  Skills,
  Projects,
  Experience,
  Footer,
  CustomCursor,
  Preloader,
  ScrollLine,
  MangaModeToggle,
  SpeedLinesOverlay,
  MangaDivider,
  SoundToggle,
  Contact,
  LanguageToggle
} from "./components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundManager } from "./lib/sound";

gsap.registerPlugin(ScrollTrigger);

import { useLanguage } from './lib/LanguageContext';

export default function DesktopApp() {
  const scrollRef = useRef({ current: 0 });
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollRef.current.current = maxScroll > 0 ? scrollY / maxScroll : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <LanguageToggle />
      <SoundToggle />
      <CustomCursor />
      <ScrollLine isInteractable={!loading} />
      <MangaModeToggle />
      <SpeedLinesOverlay />

      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <ReactLenis root options={{ smoothWheel: true, duration: 2.0, touchMultiplier: 2 }}>
        <main className="w-full min-h-screen bg-[#f4f4f0] text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
          <WebGLExperience scrollProgress={scrollRef.current} />
          
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
