import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { soundManager } from '../lib/sound';

interface MangaPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cornerSize?: 'sm' | 'md' | 'lg' | 'none';
  halftone?: boolean;
  className?: string;
  innerClassName?: string;
  backContent?: React.ReactNode;
}

export function MangaPanel({
  children,
  cornerSize = 'none',
  halftone = false,
  className = '',
  innerClassName = '',
  backContent,
  ...props
}: MangaPanelProps) {
  const cornerClass = 
    cornerSize === 'sm' ? 'cut-corner-sm' : 
    cornerSize === 'lg' ? 'cut-corner-lg' : 
    cornerSize === 'md' ? 'cut-corner' : '';

  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Play thud on interaction
    soundManager.init();
    soundManager.playThud();
    
    if (!backContent) {
      if (props.onClick) props.onClick(e);
      return;
    }
    
    setIsFlipped(!isFlipped);
    
    // Page turn transition using GSAP
    gsap.to(containerRef.current, {
      rotationY: isFlipped ? 0 : -180,
      duration: 0.8,
      ease: "power3.inOut",
    });

    gsap.to(wrapperRef.current, {
      scale: isFlipped ? 1 : 1.05,
      zIndex: isFlipped ? 1 : 50,
      duration: 0.8,
      ease: "power3.inOut",
    });

    if (props.onClick) props.onClick(e);
  };

  if (!backContent) {
    return (
      <div 
        className={`relative manga-shadow bg-white ${cornerClass} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {halftone && (
          <div className="absolute inset-0 opacity-15 pointer-events-none halftone-bg w-full h-full"></div>
        )}
        <div className={`relative z-10 w-full h-full flex flex-col ${innerClassName}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
        ref={wrapperRef}
        className={`relative [perspective:2000px] ${className} cursor-pointer`}
        onClick={handleClick}
        {...props}
    >
      <div 
        ref={containerRef} 
        className={`relative w-full h-full [transform-style:preserve-3d] min-h-full transition-transform`}
        style={{ transformOrigin: 'center' }}
      >
        {/* Front Face */}
        <div 
          className={`relative [backface-visibility:hidden] manga-shadow bg-white border-[6px] border-black ${cornerClass}`}
        >
          {halftone && (
            <div className="absolute inset-0 opacity-15 pointer-events-none halftone-bg w-full h-full"></div>
          )}
          <div className={`relative z-10 w-full h-full flex flex-col ${innerClassName}`}>
            {children}
          </div>
        </div>
        
        {/* Back Face */}
        <div 
          className={`absolute inset-0 [backface-visibility:hidden] manga-shadow bg-black text-white border-[6px] border-white ${cornerClass}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
           {/* Add manga action lines to back face */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg, #fff 0, #fff 2px, transparent 2px, transparent 15px)' }}></div>
           
           <div className={`relative z-10 w-full h-full p-8 md:p-12 overflow-y-auto overflow-x-hidden custom-scrollbar ${innerClassName}`}>
              {backContent}
           </div>
        </div>
      </div>
    </div>
  );
}
