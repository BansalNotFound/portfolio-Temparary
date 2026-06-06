import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_DATA } from '../data';
import { useLanguage } from '../lib/LanguageContext';
import { soundManager } from '../lib/sound';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MobileSkillCoin = ({ skill, i, total }: { skill: string, i: number, total: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Arrange in a grid or spread pattern suitable for mobile
  // Mobile usually needs a taller and narrower spread
  const angle = (i / total) * Math.PI * 2;
  const xRadius = 35 + (i % 2 === 0 ? 5 : -5); // vw
  const yRadius = 35 + (i % 3 === 0 ? 5 : -5); // vh
  
  const x = Math.cos(angle) * xRadius;
  const y = Math.sin(angle) * yRadius;

  const handleClick = () => {
    soundManager.playClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="absolute skill-coin perspective-[1000px] pointer-events-auto"
      style={{
        left: `calc(50% + ${x}vw)`,
        top: `calc(50% + ${y}vh)`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="skill-coin-inner w-[90px] h-[90px] group cursor-pointer" 
        style={{ transformStyle: 'preserve-3d' }}
        onClick={handleClick}
      >
        <div 
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
        >
          {/* Front of coin */}
          <div className="absolute w-full h-full bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_#dc2626] [backface-visibility:hidden] overflow-hidden p-1">
            <div className="absolute inset-0 halftone-bg opacity-30" />
            <span className="relative z-10 font-impact text-sm text-black uppercase rotate-[-10deg] text-center leading-none">{skill}</span>
            <div className="absolute inset-1 border border-dashed border-black/40 rounded-full" />
          </div>
          
          {/* Back of coin */}
          <div className="absolute w-full h-full bg-black border-2 border-red-600 rounded-full flex items-center justify-center shadow-[4px_4px_0_#000] [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden p-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(220,38,38,0.3)_150%)]" />
            <span className="relative z-10 font-manga text-base text-white uppercase text-center leading-none tracking-wider rotate-[5deg]">{skill}</span>
            <div className="absolute inset-1 border border-solid border-red-600/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export function MobileSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const allSkills = [...PORTFOLIO_DATA.skills.languages, ...PORTFOLIO_DATA.skills.frameworks];
  
  useGSAP(() => {
    // Parallax floating effect for coins (inner container)
    gsap.to('.skill-coin-inner', {
      y: 'random(-10, 10)',
      x: 'random(-10, 10)',
      rotationZ: 'random(-10, 10)',
      duration: 'random(3, 5)',
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
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play reverse play reverse',
      },
      left: '50%',
      top: '50%',
      scale: 0.2,
      opacity: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: 'back.out(1.2)'
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full relative min-h-[120vh] py-20 overflow-hidden flex flex-col items-center justify-center bg-transparent halftone-bg">
      <div className="absolute inset-0 z-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(0,0,0,0.03)_20px,rgba(0,0,0,0.03)_40px)] pointer-events-none" />

      <div className="relative z-20 text-center flex flex-col items-center max-w-sm px-4 pointer-events-none mt-[-10vh]">
        <div className="inline-block px-4 py-2 bg-white border-2 border-black text-black font-manga text-xl uppercase tracking-widest mb-4 transform -skew-x-6 shadow-[3px_3px_0_#dc2626]">
          {t('SKILL_SET')}
        </div>
        <h3 className="text-4xl font-impact text-black uppercase tracking-normal leading-[1] mb-6 drop-shadow-[3px_3px_0_#dc2626]">
          <span className="text-white [-webkit-text-stroke:2px_#000]">{t('TOOLKIT_ARSENAL')}</span> <br/>
          {t('FOR_DIGITAL_CREATION')}
        </h3>
        <p className="text-lg font-manga text-black leading-snug bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000] transform rotate-1 pointer-events-auto">
          Tap on the coins to flip them!
        </p>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex items-center justify-center">
        {allSkills.map((skill, i) => (
          <MobileSkillCoin key={i} skill={skill} i={i} total={allSkills.length} />
        ))}
      </div>
    </section>
  );
}
