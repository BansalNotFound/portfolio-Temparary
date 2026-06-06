import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function MobileFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.footer-header-char', {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
      },
      yPercent: 50,
      opacity: 0,
      rotateX: 45,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.5)"
    });
  }, { scope: footerRef });

  const titleChars = t('LETS_TALK').split('');

  return (
    <footer ref={footerRef} className="w-full relative z-10 bg-transparent pt-20 pb-8 overflow-hidden px-4">
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-md mx-auto flex flex-col items-center">
        
        <div className="mb-12 transform -rotate-2 perspective-[1000px]">
          <h2 className="text-[9vw] font-black font-impact tracking-normal uppercase text-black leading-none flex flex-wrap justify-center gap-1">
            {titleChars.map((char, i) => (
               <span key={i} className={`footer-header-char inline-flex items-center justify-center bg-white border-2 border-black text-black shadow-[3px_3px_0_#dc2626] px-2 py-1 transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} ${char === ' ' ? 'w-2 bg-transparent border-none shadow-none' : ''}`}>
                 {char}
               </span>
            ))}
          </h2>
        </div>

        {/* Removed CenterGokuModel for mobile performance and cleaner layout */}

        <div className="w-full flex flex-col gap-8 mb-16 relative z-30">
          <div className="w-full">
            <div className="bg-white border-2 border-black p-5 shadow-[4px_4px_0_#000] relative">
              {/* Comic balloon tail */}
              <div className="absolute -bottom-[16px] left-6 w-0 h-0 border-x-[10px] border-x-transparent border-t-[16px] border-t-white z-10"></div>
              <div className="absolute -bottom-[20px] left-[22px] w-0 h-0 border-x-[12px] border-x-transparent border-t-[20px] border-t-black z-0"></div>
              <p className="text-lg font-bold font-manga text-black leading-snug uppercase relative z-20">
                {t('FOOTER_DESC')}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-6 mt-4">
            <a 
              href={`mailto:${PORTFOLIO_DATA.contact.email}`}
              className="hover-target w-full group flex justify-between items-center bg-white border-2 border-black p-4 shadow-[4px_4px_0_#dc2626] active:translate-y-1 active:translate-x-1 active:shadow-[1px_1px_0_#dc2626] transition-all"
            >
              <span className="text-3xl font-impact tracking-normal text-black uppercase">
                {t('GET_IN_TOUCH')} 
              </span>
              <span className="p-2 bg-red-600 border-2 border-black">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </span>
            </a>
          </div>
        </div>
        
        <div className="w-full bg-white border-2 border-black p-4 flex flex-col items-center gap-4 text-black text-xs font-manga uppercase tracking-widest shadow-[3px_3px_0_#000]">
          <p className="text-center">© 2026 {PORTFOLIO_DATA.name} &bull; {t('MADE_WITH_PASSION')}</p>
          <div className="flex gap-6">
            <a href={PORTFOLIO_DATA.contact.github} target="_blank" rel="noreferrer" className="hover-target bg-black text-white px-3 py-1 border border-transparent active:border-red-600 active:bg-white active:text-black">GitHub</a>
            <a href={PORTFOLIO_DATA.contact.linkedin} target="_blank" rel="noreferrer" className="hover-target bg-black text-white px-3 py-1 border border-transparent active:border-red-600 active:bg-white active:text-black">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
