import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { soundManager } from '../lib/sound';
import { Preloader3D } from './Preloader3D';

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const handleEnter = () => {
    soundManager.init();
    soundManager.playThud(); // Dramatic entry sound
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut',
      onComplete: () => {
        onComplete();
        window.dispatchEvent(new Event('appStarted'));
      }
    });
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Simulate loading progress
      const tl = gsap.timeline({
        onComplete: () => {
          setLoaded(true);
          gsap.to(buttonRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        }
      });

      tl.to({ value: 0 }, {
        value: 100,
        duration: 2.5,
        ease: 'power3.out',
        onUpdate: function() {
          setProgress(Math.round(this.targets()[0].value));
        }
      })
      .to(textRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: 'power3.inOut'
      }, "-=0.5");
      
    }, containerRef);
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col items-center justify-center text-white overflow-hidden"
    >
      <Preloader3D />
      <div className="overflow-hidden mb-8 relative z-10 pointer-events-none">
        <h1 ref={textRef} className="text-5xl md:text-8xl font-black tracking-tighter uppercase font-display">
          Building <br/> <span className="text-red-500 italic">Experience</span>
        </h1>
      </div>
      <div className="absolute bottom-12 right-12 text-6xl md:text-9xl font-mono font-black opacity-10 pointer-events-none z-10">
        <span ref={counterRef}>{progress}</span>%
      </div>
      
      {/* Click to Enter Button */}
      <button 
        ref={buttonRef}
        onClick={handleEnter}
        disabled={!loaded}
        className="absolute bottom-24 opacity-0 scale-50 px-8 py-4 bg-red-600 text-white font-impact text-2xl md:text-4xl uppercase tracking-widest border-4 border-black shadow-[6px_6px_0_#000] hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all cursor-pointer z-50"
      >
        CLICK TO ENTER
      </button>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-10">
        <div 
          className="h-full bg-red-600" 
          style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        />
      </div>
    </div>
  );
}
