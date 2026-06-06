import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SpeedLinesOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let ctx = gsap.context(() => {
       let fadeOutTimeout: ReturnType<typeof setTimeout>;

       ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          
          if (velocity > 100) {
              const targetOpacity = gsap.utils.clamp(0.05, 0.4, velocity / 3000);
              const scaleY = gsap.utils.clamp(1, 1.5, 1 + velocity / 2000);
              
              gsap.to(overlay, {
                opacity: targetOpacity,
                duration: 0.1,
                ease: "none",
                overwrite: "auto"
              });

              gsap.to(svgRef.current, {
                scaleY: scaleY,
                duration: 0.1,
                ease: "none",
                overwrite: "auto"
              });

              clearTimeout(fadeOutTimeout);
              fadeOutTimeout = setTimeout(() => {
                 gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                  });
                 gsap.to(svgRef.current, {
                    scaleY: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                 });
              }, 50);
          }
        }
      });
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  const lines = useMemo(() => {
      const arr = Array.from({ length: 60 });
      let seed = 42; // Initial seed
      return arr.map((_, i) => {
         // Simple pseudo-random number generator
         seed = (seed * 9301 + 49297) % 233280;
         const rand = seed / 233280; 
         
         const x = rand * 100; 
         const width = (rand * 2) + 1; 
         const opacity = (rand * 0.4) + 0.1; 
         return (
             <rect 
                key={i} 
                x={`${x}%`} 
                y="-10%" 
                width={width} 
                height="120%" 
                fill="#ffffff" 
                opacity={opacity} 
            />
         );
      });
  }, []);

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 pointer-events-none z-[9990] opacity-0 flex items-center justify-center mix-blend-difference overflow-hidden"
    >
        <svg ref={svgRef} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            {lines}
        </svg>
    </div>
  );
}
