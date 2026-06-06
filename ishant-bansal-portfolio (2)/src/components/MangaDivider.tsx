import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { soundManager } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

export function MangaDivider({ title, chapter }: { title: string, chapter: string }) {
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: dividerRef.current,
        start: 'top 80%',
        onEnter: () => {
           soundManager.playPageTurn();
        },
        onEnterBack: () => {
           soundManager.playPageTurn();
        }
      });
    }, dividerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={dividerRef} className="w-full h-24 md:h-32 border-y-[6px] border-black flex items-center justify-center bg-white relative z-20 overflow-hidden halftone-bg">
      <div className="absolute top-1/2 -left-[10%] w-[120%] h-[4px] bg-black transform -rotate-[1deg]"></div>
      <div className="absolute top-1/2 -left-[10%] w-[120%] h-[2px] bg-red-600 transform rotate-[1deg] translate-y-3"></div>
      <div className="z-10 bg-black text-white px-8 md:px-12 py-3 font-impact text-3xl md:text-5xl italic shadow-[6px_6px_0_#dc2626] transform -skew-x-12 flex items-center gap-4 border-2 border-white cursor-crosshair group hover:shadow-[4px_4px_0_#000] hover:translate-y-1 hover:translate-x-1 transition-all">
         <span className="text-red-500 font-manga text-xl md:text-2xl not-italic uppercase tracking-widest">{chapter}</span>
         <span>{title}</span>
      </div>
    </div>
  );
}
