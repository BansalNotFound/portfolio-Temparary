import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import { CenterGokuModel } from './CenterGokuModel';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    gsap.from('.footer-header-char', {
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 80%",
      },
      yPercent: 100,
      opacity: 0,
      rotateX: 90,
      duration: 1,
      stagger: 0.05,
      ease: "back.out(1.5)"
    });
  }, { scope: footerRef });

  const titleChars = t('LETS_TALK').split('');

  return (
    <footer ref={footerRef} className="w-full relative z-10 bg-transparent pt-32 pb-12 overflow-hidden px-6 md:px-12">
      
      {/* Background grain or texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col items-center">
        
        <div className="mb-8 transform -rotate-1 perspective-[1000px] w-full flex justify-center">
          <h2 className="text-[8vw] md:text-[5.5vw] font-black font-impact tracking-normal uppercase text-black leading-none flex flex-nowrap justify-center gap-[0.5vw] md:gap-[1vw]">
            {titleChars.map((char, i) => (
               <span key={i} className={`footer-header-char inline-flex items-center justify-center bg-white border-[3px] md:border-4 border-black text-black shadow-[3px_3px_0_#dc2626] sm:shadow-[6px_6px_0_#dc2626] px-[1.5vw] md:px-[1.5vw] py-[0.5vw] md:py-[1vw] transform ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'} ${char === ' ' ? 'w-[2vw] md:w-[3vw] bg-transparent border-none shadow-none' : ''}`}>
                 {char}
               </span>
            ))}
          </h2>
        </div>

        {/* Center Goku Model overlapping the grid */}
        <CenterGokuModel />

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 pt-16 mt-8 relative z-30">
          <div className="max-w-md">
            <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] relative">
              {/* Comic balloon tail */}
              <div className="absolute -bottom-[20px] left-10 w-0 h-0 border-x-[12px] border-x-transparent border-t-[20px] border-t-white z-10"></div>
              <div className="absolute -bottom-[26px] left-[36px] w-0 h-0 border-x-[16px] border-x-transparent border-t-[26px] border-t-black z-0"></div>
              <p className="text-xl md:text-3xl font-bold font-manga text-black leading-tight uppercase relative z-20">
                {t('FOOTER_DESC')}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:items-end justify-start gap-6 pt-8 md:pt-0">
            <a 
              href={`mailto:${PORTFOLIO_DATA.contact.email}`}
              className="hover-target group flex items-center gap-4 bg-white border-4 border-black p-4 md:p-6 shadow-[6px_6px_0_#dc2626] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#dc2626] transition-all"
            >
              <span className="text-4xl md:text-6xl font-impact tracking-normal text-black group-hover:text-red-600 transition-colors uppercase">
                {t('GET_IN_TOUCH')} 
              </span>
              <span className="p-3 bg-red-600 border-2 border-black group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-8 h-8 text-white" />
              </span>
            </a>

          </div>
        </div>
        
        <div className="w-full bg-white border-4 border-black p-4 flex flex-col md:flex-row justify-between items-center text-black text-sm md:text-lg font-manga uppercase tracking-widest shadow-[4px_4px_0_#000]">
          <p>© 2026 {PORTFOLIO_DATA.name} &bull; {t('MADE_WITH_PASSION')}</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href={PORTFOLIO_DATA.contact.github} target="_blank" rel="noreferrer" className="hover-target hover:text-red-600 transition-colors bg-black text-white px-4 py-1 border-2 border-transparent hover:border-red-600 hover:bg-white hover:text-black">GitHub</a>
            <a href={PORTFOLIO_DATA.contact.linkedin} target="_blank" rel="noreferrer" className="hover-target hover:text-red-600 transition-colors bg-black text-white px-4 py-1 border-2 border-transparent hover:border-red-600 hover:bg-white hover:text-black">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
