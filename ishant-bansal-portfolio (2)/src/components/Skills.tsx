import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_DATA } from '../data';
import { useLanguage } from '../lib/LanguageContext';
import { soundManager } from '../lib/sound';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const allSkills = [...PORTFOLIO_DATA.skills.languages, ...PORTFOLIO_DATA.skills.frameworks];
  
  useGSAP(() => {
    // Parallax floating effect for coins (inner container)
    gsap.to('.skill-coin-inner', {
      y: 'random(-20, 20)',
      x: 'random(-20, 20)',
      rotationZ: 'random(-15, 15)',
      duration: 'random(2, 4)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        amount: 2,
        from: 'random'
      }
    });

    // Spread and collapse animation triggered by scroll
    gsap.from('.skill-coin', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        toggleActions: 'play reverse play reverse',
      },
      left: '50%',
      top: '50%',
      scale: 0.2,
      opacity: 0,
      stagger: 0.02,
      duration: 1,
      ease: 'back.out(1.2)'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full relative min-h-[140vh] py-32 overflow-hidden flex flex-col items-center justify-center bg-transparent halftone-bg">
      
      {/* Manga Speed Lines Background Overlay */}
      <div className="absolute inset-0 z-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.03)_20px,rgba(0,0,0,0.03)_40px)] pointer-events-none" />

      {/* Central Content */}
      <div className="relative z-20 text-center flex flex-col items-center max-w-3xl px-6 pointer-events-none">
        <div className="inline-block px-6 py-2 bg-white border-[3px] border-black text-black font-manga text-2xl md:text-4xl uppercase tracking-widest mb-6 transform -skew-x-12 shadow-[4px_4px_0_#dc2626]">
          {t('SKILL_SET')}
        </div>
        <h3 className="text-5xl md:text-8xl font-impact text-black uppercase tracking-normal leading-[0.9] mb-8 drop-shadow-[4px_4px_0_#dc2626] sm:drop-shadow-[8px_8px_0_#dc2626]">
          <span className="text-white [-webkit-text-stroke:3px_#000]">{t('TOOLKIT_ARSENAL')}</span> <br/>
          {t('FOR_DIGITAL_CREATION')}
        </h3>
        <p className="text-xl md:text-3xl font-manga text-black leading-snug max-w-2xl bg-white border-4 border-black p-4 shadow-[6px_6px_0_#000] transform rotate-1 pointer-events-auto">
          {t('SKILLS_DESC')}
        </p>
      </div>

      {/* Orbiting Coins Setup */}
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex items-center justify-center">
        {allSkills.map((skill, i) => {
          // Circular / Elliptical distribution
          const angle = (i / allSkills.length) * Math.PI * 2;
          
          // Spread coins much wider throughout the section
          const xRadius = 42 + (i % 3 === 0 ? 6 : i % 2 === 0 ? -4 : 3); // 38vw to 48vw
          const yRadius = 40 + (i % 2 === 0 ? 5 : i % 3 === 0 ? -3 : 2); // 37vh to 45vh
          
          const x = Math.cos(angle) * xRadius;
          const y = Math.sin(angle) * yRadius;
          
          return (
            <div 
              key={i}
              className="absolute skill-coin perspective-[1000px] pointer-events-auto"
              style={{
                left: `calc(50% + ${x}vw)`,
                top: `calc(50% + ${y}vh)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="skill-coin-inner w-[110px] h-[110px] md:w-[140px] md:h-[140px] group cursor-pointer" 
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                <div className="relative w-full h-full transition-transform duration-[1200ms] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* Front of coin */}
                  <div className="absolute w-full h-full bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_#dc2626] [backface-visibility:hidden] overflow-hidden p-2">
                    <div className="absolute inset-0 halftone-bg opacity-30" />
                    <span className="relative z-10 font-impact text-lg md:text-xl text-black uppercase rotate-[-10deg] text-center leading-none">{skill}</span>
                    {/* Coin rim detail */}
                    <div className="absolute inset-2 border-2 border-dashed border-black/40 rounded-full" />
                  </div>
                  
                  {/* Back of coin */}
                  <div className="absolute w-full h-full bg-black border-4 border-red-600 rounded-full flex items-center justify-center shadow-[6px_6px_0_#000] [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden p-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(220,38,38,0.3)_150%)]" />
                    <span className="relative z-10 font-manga text-xl md:text-2xl text-white uppercase text-center leading-none tracking-wider rotate-[5deg]">{skill}</span>
                    <div className="absolute inset-2 border-2 border-solid border-red-600/40 rounded-full" />
                  </div>
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
    </section>
  );
}
