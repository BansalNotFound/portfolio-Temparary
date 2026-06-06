import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Set initial centering offsets
      gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
      gsap.set(followerRef.current, { xPercent: -50, yPercent: -50 });

      const onMouseMove = (e: MouseEvent) => {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.05,
          ease: 'power3.out'
        });
        gsap.to(followerRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power3.out'
        });
      };

      const onMouseEnterLink = () => {
        gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: "#000", duration: 0.2 });
        gsap.to(followerRef.current, { scale: 1.5, borderColor: "#dc2626", rotation: 45, duration: 0.2 });
      };

      const onMouseLeaveLink = () => {
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: "#dc2626", duration: 0.2 });
        gsap.to(followerRef.current, { scale: 1, borderColor: "#000", rotation: 0, duration: 0.2 });
      };

      window.addEventListener('mousemove', onMouseMove);
      
      const elements = document.querySelectorAll('a, button, .hover-target');
      elements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        elements.forEach((el) => {
          el.removeEventListener('mouseenter', onMouseEnterLink);
          el.removeEventListener('mouseleave', onMouseLeaveLink);
        });
      };
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-3 h-3 bg-red-600 rounded-full pointer-events-none z-[10002]"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border-[2px] border-black rounded-full pointer-events-none z-[10001] flex items-center justify-center bg-white/20 backdrop-invert"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="w-[4px] h-[4px] bg-black rounded-full"></div>
      </div>
    </>
  );
}
