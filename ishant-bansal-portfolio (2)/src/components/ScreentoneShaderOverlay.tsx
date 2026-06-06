import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScreentoneShaderOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
       ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
           if (overlayRef.current) {
               // Base dot size oscillates slightly based on scroll depth to simulate varied density
               const dotSize = gsap.utils.clamp(0.5, 3.5, 0.5 + Math.abs(Math.sin(self.progress * Math.PI * 4)) * 3);
               
               overlayRef.current.style.setProperty('--dot-base', `${dotSize}px`);
               overlayRef.current.style.setProperty('--dot-edge', `${dotSize + 0.5}px`);
           }
        }
      });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 pointer-events-none z-[9985] mix-blend-multiply opacity-10"
      style={{
          '--dot-base': '1px',
          '--dot-edge': '1.5px',
          backgroundImage: 'radial-gradient(circle, #000 var(--dot-base), transparent var(--dot-edge))',
          backgroundSize: '12px 12px',
      } as React.CSSProperties}
    />
  );
}
