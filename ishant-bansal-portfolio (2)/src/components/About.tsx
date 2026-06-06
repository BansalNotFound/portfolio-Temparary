import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { About3DModel } from './About3DModel';
import { MangaPanel } from './MangaPanel';
import { useLanguage } from '../lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    // Parallax scrolling for huge background text
    gsap.to('.about-huge-bg', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      xPercent: 10,
      ease: "none"
    });

    const lines = gsap.utils.toArray('.about-line');
    lines.forEach((line: any) => {
      gsap.from(line, {
        scrollTrigger: {
          trigger: line,
          start: "top 85%",
        },
        y: 60,
        opacity: 0,
        rotateX: -45,
        duration: 1.2,
        ease: "power4.out"
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full min-h-screen flex items-center justify-center py-40 px-6 z-10 relative text-zinc-900 overflow-hidden">
      
      {/* Abstract blurred shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-black/10 rounded-full blur-[150px] pointer-events-none mix-blend-multiply" />

      <h2 className="about-huge-bg text-[20vw] font-black mb-12 tracking-tighter opacity-[0.03] uppercase mix-blend-overlay absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none whitespace-nowrap font-impact leading-none">
        IDENTITY &bull; ETHOS &bull; MINDSET
      </h2>
      
      <div className="max-w-[1200px] mx-auto relative z-20">
        
        <div className="mb-24">
          <MangaPanel halftone={true} cornerSize="md" className="p-8 pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              <h3 className="text-5xl md:text-8xl font-impact uppercase leading-[0.9] text-black">
                <div className="about-line perspective-1000">{t('CULTIVATING')}</div> 
                <div className="about-line perspective-1000"><span className="text-white bg-black px-2 py-1 transform -skew-x-12 inline-block shadow-[4px_4px_0_#dc2626] my-2">{t('OBSESSION')}</span> {t('WITH')}</div>
                <div className="about-line perspective-1000">{t('IMPACTFUL_SYSTEMS')}</div>
              </h3>
              <div className="md:w-1/3 flex-shrink-0 about-line">
                <p className="text-xl md:text-3xl text-zinc-800 font-manga tracking-wide leading-none p-4 border-2 border-black border-dashed bg-white">
                  私は {PORTFOLIO_DATA.name} <br/> 
                  <span className="text-red-600 font-impact mt-2 block">{PORTFOLIO_DATA.title}.</span>
                </p>
              </div>
            </div>
          </MangaPanel>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 relative z-20">
           {/* Detailed statement */}
          <div className="flex-1 text-2xl md:text-4xl font-manga text-black leading-tight mt-2 space-y-8">
            <p className="about-line bg-white border-4 border-black p-6 shadow-[6px_6px_0_#dc2626]">
              I build logic and craft visual stories. As a first-year undergraduate, I prioritize aggressive learning curves and competitive environments like hackathons.
            </p>
            <p className="about-line border-l-8 border-red-600 pl-6 bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] -rotate-1">
              Currently shaping <span className="font-impact text-red-600 uppercase tracking-widest">Sapien Society</span> to aggregate exceptional talent. I rely on AI-assisted development paradigms, cutting through boilerplate to construct rapid prototypes and enterprise architectures.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <About3DModel />
          </div>
          
        </div>
      </div>
    </section>
  );
}
