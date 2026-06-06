import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../lib/sound';

export function ScrollLine({ isInteractable = true }: { isInteractable?: boolean }) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const progressPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const LINE_COUNT = 7;
  const lineOffsets = [-15, -10, -5, 0, 5, 10, 15];

  const isInteractableRef = useRef(isInteractable);
  useEffect(() => {
    isInteractableRef.current = isInteractable;
  }, [isInteractable]);

  useEffect(() => {
    let animationFrameId: number;
    let mouse = { x: 50, y: window.innerHeight / 2 };
    let control = { x: 50, y: window.innerHeight / 2 };
    let xBase = window.innerWidth < 768 ? 24 : 48;
    
    const tension = 0.05;
    const friction = 0.65;
    let velocity = 0;
    let prevDx = 1000; // start outside

    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteractableRef.current) return;
      
      const dx = e.clientX - xBase;
      
      if (Math.abs(dx) < 150 && Math.abs(prevDx) >= 150) {
         soundManager.playGuitarPluck(Math.random() * 4 - 2);
      }
      if (Math.abs(dx) >= 150 && Math.abs(prevDx) < 150) {
         soundManager.playGuitarPluck(Math.random() * 4 + 3); 
      }
      prevDx = dx;

      if (Math.abs(dx) < 150) {
        mouse.x = xBase + dx * 0.8; 
        mouse.y = e.clientY;
      } else {
        mouse.x = xBase;
      }
    };

    const handleResize = () => {
      xBase = window.innerWidth < 768 ? 24 : 48;
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const prog = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;
      setProgress(prog);
    };

    const render = () => {
      const dx = mouse.x - control.x;
      velocity += dx * tension;
      velocity *= friction;
      control.x += velocity;
      
      control.y += (mouse.y - control.y) * 0.1;

      if (pathRefs.current.length === LINE_COUNT) {
        const svgHeight = window.innerHeight;
        
        lineOffsets.forEach((offset, i) => {
            const startX = xBase + offset;
            const cx = control.x + offset * 0.8;
            const d = `M ${startX} 0 Q ${cx} ${control.y} ${startX} ${svgHeight}`;
            
            if (pathRefs.current[i]) pathRefs.current[i]!.setAttribute('d', d);
            if (progressPathRefs.current[i]) progressPathRefs.current[i]!.setAttribute('d', d);
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    render();
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[40]">
      <svg className="w-full h-full">
        <defs>
          <mask id="progress-mask">
            <rect 
              x="0" 
              y="0" 
              width="100%" 
              height={`${progress * 100}%`} 
              fill="white" 
            />
          </mask>
        </defs>
        
        {lineOffsets.map((_, i) => (
          <path
            key={`bg-${i}`}
            ref={(el) => { pathRefs.current[i] = el; }}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}
        
        {lineOffsets.map((_, i) => (
          <path
            key={`fg-${i}`}
            ref={(el) => { progressPathRefs.current[i] = el; }}
            fill="none"
            stroke="#dc2626"
            strokeWidth={i === 3 ? "3" : "1.5"}
            strokeLinecap="round"
            mask="url(#progress-mask)"
          />
        ))}
      </svg>
    </div>
  );
}

