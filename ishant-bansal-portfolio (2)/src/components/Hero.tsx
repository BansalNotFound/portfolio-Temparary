import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Hero3DModel } from './Hero3DModel';
import { soundManager } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 }); // wait for preloader
    
    // Split text into spans for staggered reveal
    const nameChars = document.querySelectorAll('.name-char');
    
    tl.fromTo(nameChars, 
      { yPercent: 100, opacity: 0, rotateX: 90 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.05, ease: "back.out(2)" },
      "-=0.8"
    )
    .fromTo('.hero-text-reveal',
      { y: 50, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
      { y: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.2, ease: "power4.out", stagger: 0.2 },
      "-=0.6"
    )
    .fromTo('.social-icon',
      { scale: 0, opacity: 0, rotate: -45 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.8"
    )
    .fromTo('.speech-bubble',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.7, stagger: 0.3, ease: "elastic.out(1, 0.7)" },
      "-=0.2"
    );

    // Safely animated SFX elements sliding into the title panel
    const sfxElements = gsap.utils.toArray('.manga-sfx');
    sfxElements.forEach((sfx: any, index) => {
        gsap.fromTo(sfx, 
            { opacity: 0, x: index % 2 === 0 ? '-100px' : '100px', rotation: index % 2 === 0 ? 15 : -15 },
            {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
                opacity: 1,
                x: '0px',
                rotation: index % 2 === 0 ? -10 : 10,
                ease: "power2.out"
            }
        );
    });

    // Parallax Background Layer
    gsap.to('.parallax-hero-bg', {
        yPercent: 15,
        rotation: 5,
        scale: 1.1,
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
        }
    });

    // Scroll Velocity based action effects
    ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            const velocity = self.getVelocity();
            const speed = Math.abs(velocity);
            
            // Generate hardcore manga feeling: extreme skew and boom when scrolling fast
            const mappedScale = gsap.utils.clamp(1, 2.5, 1 + speed / 800);
            const mappedSkew = gsap.utils.clamp(-35, 35, velocity / 50);

            if (speed > 1000) {
                const now = Date.now();
                // @ts-ignore
                if (!window.lastBoomTime || now - window.lastBoomTime > 400) {
                    soundManager.playThud();
                    // @ts-ignore
                    window.lastBoomTime = now;
                }
            }
        }
    });

  }, { scope: containerRef });

  return (
    <section id="hero-section" ref={containerRef} className="relative w-full min-h-screen flex flex-col justify-center px-2 md:px-4 py-24 overflow-hidden z-10 bg-[#f4f4f0]">
      
      {/* Background Parallax Energy Layer */}
      <div className="absolute inset-[-20%] w-[140%] h-[140%] pointer-events-none z-[15] opacity-20 parallax-hero-bg mix-blend-multiply flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiPjwvcmVjdD48cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9zdmc+')] opacity-30"></div>
        <div className="w-full h-full" style={{ background: 'conic-gradient(from 0deg at 50% 50%, #000 0deg 2deg, transparent 2deg 15deg, #000 15deg 18deg, transparent 18deg 35deg, #000 35deg 37deg, transparent 37deg 60deg, #000 60deg 64deg, transparent 64deg 90deg, #000 90deg 92deg, transparent 92deg 120deg, #000 120deg 121deg, transparent 121deg 150deg, #000 150deg 155deg, transparent 155deg 180deg, #000 180deg 182deg, transparent 182deg 210deg, #000 210deg 215deg, transparent 215deg 240deg, #000 240deg 242deg, transparent 242deg 270deg, #000 270deg 275deg, transparent 275deg 300deg, #000 300deg 305deg, transparent 305deg 330deg, #000 330deg 332deg, transparent 332deg 360deg)' }}></div>
      </div>

      {/* Manga Page Container */}
      <div className="max-w-[1400px] mx-auto w-full border-[8px] border-black bg-white p-2 md:p-4 flex flex-col gap-2 md:gap-4 relative z-30 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
        
        {/* Restored Manga SFX - Safely Positioned at edges OUTSIDE of overflow-hidden panels */}
        <div className="absolute top-[35%] left-[-2%] z-50 manga-sfx pointer-events-none opacity-0 hidden md:block">
            <span className="font-impact text-[10vw] md:text-[6vw] leading-none text-white [-webkit-text-stroke:2px_#000] sm:[-webkit-text-stroke:4px_#000] italic drop-shadow-[6px_6px_0_#000] transform -rotate-12 block">
                BROOOOAAA!!!
            </span>
        </div>
        <div className="absolute top-[42%] right-[-2%] z-50 manga-sfx pointer-events-none opacity-0 hidden md:block">
            <span className="font-impact text-[8vw] md:text-[5vw] leading-none text-black [-webkit-text-stroke:2px_#fff] sm:[-webkit-text-stroke:4px_#fff] italic drop-shadow-[6px_6px_0_#000] transform rotate-[10deg] block">
                BOOOMSH!!
            </span>
        </div>
        
        {/* Floating Speech Bubbles (Manga Vibe) */}
        <div className="absolute top-[12%] left-[-2%] md:left-[-4%] z-40 speech-bubble opacity-0 pointer-events-none hidden md:block">
            <div className="relative bg-white border-[4px] border-black px-6 py-4 rounded-[100%] rounded-br-[0px] font-impact text-2xl md:text-3xl text-black shadow-[4px_4px_0_rgba(0,0,0,1)] transform -rotate-12">
                HEY THERE!
            </div>
        </div>

        <div className="absolute top-[25%] right-[-3%] md:right-[-6%] z-40 speech-bubble opacity-0 pointer-events-none hidden md:block">
            <div className="relative bg-white border-[4px] border-black px-6 py-4 font-impact text-2xl md:text-5xl text-black shadow-[6px_6px_0_rgba(0,0,0,1)] transform rotate-6 border-dashed">
                SCROLL DOWN!!
                <div className="absolute top-[20px] -left-[14px] w-0 h-0 border-b-[20px] border-b-black border-l-[14px] border-l-transparent transform rotate-45"></div>
                <div className="absolute top-[23px] -left-[5px] w-0 h-0 border-b-[15px] border-b-white border-l-[9px] border-l-transparent transform rotate-45"></div>
            </div>
        </div>

        <div className="absolute bottom-[2%] left-[25%] z-40 speech-bubble opacity-0 hidden md:block pointer-events-none">
            <div className="relative bg-white border-[4px] border-black px-8 py-4 rounded-[50%] font-impact text-2xl md:text-3xl text-black shadow-[4px_4px_0_rgba(0,0,0,1)] transform -rotate-6">
                NANI?!
                <div className="absolute top-[-10px] right-[20px] w-0 h-0 border-b-[15px] border-b-black border-r-[15px] border-r-transparent transform -rotate-12"></div>
                <div className="absolute top-[-5px] right-[21px] w-0 h-0 border-b-[10px] border-b-white border-r-[10px] border-r-transparent transform -rotate-12"></div>
            </div>
        </div>

        {/* Page Info */}
        <div className="absolute -top-10 left-0 font-manga text-xl md:text-2xl font-bold uppercase text-black">PAGE 01</div>
        <div className="absolute -top-10 right-0 font-manga text-xl md:text-2xl font-bold uppercase text-black">{PORTFOLIO_DATA.name}</div>

        {/* ROW 1 WRAPPER */}
        <div className="relative w-full group">
          {/* ROW 1: THE TITLE PANEL */}
          <div className="hero-text-reveal w-full border-[6px] border-black relative overflow-hidden flex flex-col justify-center min-h-[30vh] md:min-h-[40vh] bg-white">
            {/* Manga Speed Lines radiating from center - using repeating linear */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 15px)' }}></div>
            
            {/* Title / Name */}
            <div className="relative z-10 p-4 md:p-12 flex flex-col items-center">
                <h1 className="text-[14vw] md:text-[11vw] leading-[0.85] font-impact uppercase flex flex-col items-center text-center relative">
                    <span className="bg-black text-white px-4 md:px-8 pt-4 pb-2 md:pt-6 md:pb-4 transform -skew-x-6 tracking-tight mb-2 md:mb-4">
                      {PORTFOLIO_DATA.name.split(' ')[0]}
                    </span>
                    <span className="bg-white text-black border-[6px] md:border-[10px] border-black px-4 md:px-8 pt-4 pb-2 md:pt-6 md:pb-4 transform skew-x-6 tracking-tighter shadow-[8px_8px_0_#000]">
                      {PORTFOLIO_DATA.name.split(' ')[1] || 'DEV'}
                    </span>
                </h1>
            </div>

            {/* Narrative Box */}
            <div className="absolute top-0 left-0 bg-white border-r-[6px] border-b-[6px] border-black p-2 md:p-4 z-20">
                <p className="font-manga text-xs md:text-xl font-bold uppercase tracking-widest text-black">CHAPTER 1: THE INITIATION</p>
            </div>
          </div>

          {/* Sound Effect (Moved outside overflow-hidden) */}
          <div className="absolute bottom-[-5%] md:bottom-[-10%] right-[10%] md:right-[2%] pointer-events-none transform -rotate-12 group-hover:scale-110 transition-transform duration-500 z-[60]">
              <span className="font-impact text-[12vw] md:text-[8vw] leading-none text-white [-webkit-text-stroke:2px_#000] sm:[-webkit-text-stroke:4px_#000] italic drop-shadow-[4px_4px_0_#000] md:drop-shadow-[5px_5px_0_#000]">
                  BBOOOM!!
              </span>
          </div>
        </div>

        {/* ROW 2: SPLIT PANELS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 min-h-[40vh] md:min-h-[50vh]">
            
            {/* LEFT PANEL: ABTRACT MANGA GRAPHIC */}
            <div className="hero-text-reveal md:col-span-5 border-[6px] border-black relative overflow-hidden bg-black flex items-center justify-center group min-h-[400px]">
                {/* Screentone base */}
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity bg-white" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}></div>
                
                <Hero3DModel />
                
                {/* Intense Speed lines converging to center */}
                <div className="absolute inset-0 opacity-60 z-10 pointer-events-none" style={{ background: 'conic-gradient(from 0deg, #000 0deg 5deg, transparent 5deg 15deg, #000 15deg 20deg, transparent 20deg 35deg, #000 35deg 40deg, transparent 40deg 60deg, #000 60deg 65deg, transparent 65deg 90deg, #000 90deg 95deg, transparent 95deg 120deg, #000 120deg 125deg, transparent 125deg 150deg, #000 150deg 155deg, transparent 155deg 180deg, #000 180deg 185deg, transparent 185deg 210deg, #000 210deg 215deg, transparent 215deg 240deg, #000 240deg 245deg, transparent 245deg 270deg, #000 270deg 275deg, transparent 275deg 300deg, #000 300deg 305deg, transparent 305deg 330deg, #000 330deg 335deg, transparent 335deg 360deg)' }}></div>
                
                {/* Dialogue Bubble */}
                <div className="absolute top-6 right-6 lg:right-10 z-30 transform rotate-3 hover:-rotate-3 transition-transform cursor-crosshair">
                    <div className="bg-white border-[4px] border-black px-4 py-3 md:px-6 md:py-4 rounded-[40px] rounded-br-[0px] font-manga text-lg md:text-2xl font-black leading-none text-center shadow-[4px_4px_0_rgba(0,0,0,1)] text-black">
                        AWAKEN.
                        <div className="absolute -bottom-[14px] right-0 w-0 h-0 border-t-[14px] border-t-black border-l-[20px] border-l-transparent"></div>
                        <div className="absolute -bottom-[8px] right-[3px] w-0 h-0 border-t-[10px] border-t-white border-l-[14px] border-l-transparent"></div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: INFO PANELS */}
            <div className="md:col-span-7 flex flex-col gap-2 md:gap-4">
                
                {/* RIGHT TOP PANEL: DESCRIPTION */}
                <div className="hero-text-reveal flex-1 border-[6px] border-black bg-white p-4 md:p-8 xl:p-12 overflow-hidden relative flex flex-col justify-center min-h-[200px] md:min-h-[250px]">
                    {/* Horizontal action lines */}
                    <div className="absolute inset-0 opacity-15" style={{ background: 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 25px)' }}></div>
                    
                    {/* Descriptive Narrative Box (internal border) */}
                    <div className="border-[4px] border-black p-4 md:p-8 bg-white relative z-10 shadow-[8px_8px_0_rgba(0,0,0,1)]">
                       <p className="text-2xl lg:text-4xl text-black font-manga leading-tight uppercase font-bold text-center md:text-left">
                         Crafting immersive web experiences bridging <br/> 
                         <span className="font-impact text-4xl lg:text-6xl border-b-[6px] border-black pb-1 inline-block mt-2 mb-2 md:mb-0">DATA</span> 
                         <span className="hidden md:inline">&nbsp;&nbsp;AND&nbsp;&nbsp;</span>
                         <span className="inline md:hidden text-lg block my-2 text-black">AND</span>
                         <span className="font-impact text-4xl lg:text-6xl text-white [-webkit-text-stroke:2px_#000] sm:[-webkit-text-stroke:3px_#000] drop-shadow-[5px_5px_0_#000]">DESIGN.</span>
                       </p>
                    </div>
                </div>

                {/* RIGHT BOTTOM PANEL: CALL TO ACTION & SOCIALS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 flex-none h-auto md:h-[160px] xl:h-[180px]">
                    
                    {/* HACKATHON PANEL */}
                    <div className="hero-text-reveal border-[6px] border-black bg-white overflow-hidden relative flex flex-col items-center justify-center p-2 md:p-4 group cursor-pointer hover:bg-black transition-colors duration-300 min-h-[90px] md:min-h-[120px]">
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle, #000 3px, transparent 3.5px)', backgroundSize: '12px 12px' }}></div>
                        <span className="font-manga text-lg lg:text-xl text-black group-hover:text-white uppercase relative z-10 font-bold mb-1 md:mb-2 text-center leading-none tracking-widest">TARGET ACQUIRED:</span>
                        <span className="font-impact text-3xl lg:text-5xl text-black group-hover:text-white relative z-10 text-center transition-all bg-white group-hover:bg-transparent px-2">HACKATHONS</span>
                    </div>
                    
                    {/* SOCIALS PANEL */}
                    <div className="hero-text-reveal border-[6px] border-black bg-black p-2 md:p-4 flex items-center justify-center relative overflow-hidden min-h-[90px] md:min-h-[120px]">
                        {/* Starburst in background for excitement */}
                        <div className="absolute inset-0 opacity-80" style={{ background: 'conic-gradient(from 0deg, transparent 0deg 15deg, #fff 15deg 30deg, transparent 30deg 45deg, #fff 45deg 60deg, transparent 60deg 75deg, #fff 75deg 90deg, transparent 90deg 105deg, #fff 105deg 120deg, transparent 120deg 135deg, #fff 135deg 150deg, transparent 150deg 165deg, #fff 165deg 180deg, transparent 180deg 195deg, #fff 195deg 210deg, transparent 210deg 225deg, #fff 225deg 240deg, transparent 240deg 255deg, #fff 255deg 270deg, transparent 270deg 285deg, #fff 285deg 300deg, transparent 300deg 315deg, #fff 315deg 330deg, transparent 330deg 345deg, #fff 345deg 360deg)' }}></div>
                        
                        <div className="flex gap-4 lg:gap-6 relative z-10 p-3 bg-white border-[4px] border-black shadow-[6px_6px_0_rgba(255,255,255,1)] transform rotate-2 hover:rotate-0 transition-transform">
                            <a href={PORTFOLIO_DATA.contact.github} target="_blank" rel="noreferrer" className="social-icon hover-target text-black hover:text-white hover:bg-black border-[3px] border-transparent hover:border-black p-2 md:p-3 transition-colors rounded-[2px]">
                                <Github className="w-8 h-8 xl:w-10 xl:h-10" />
                            </a>
                            <a href={PORTFOLIO_DATA.contact.linkedin} target="_blank" rel="noreferrer" className="social-icon hover-target text-black hover:text-white hover:bg-black border-[3px] border-transparent hover:border-black p-2 md:p-3 transition-colors rounded-[2px]">
                                <Linkedin className="w-8 h-8 xl:w-10 xl:h-10" />
                            </a>
                            <a href={`mailto:${PORTFOLIO_DATA.contact.email}`} className="social-icon hover-target text-black hover:text-white hover:bg-black border-[3px] border-transparent hover:border-black p-2 md:p-3 transition-colors rounded-[2px]">
                                <Mail className="w-8 h-8 xl:w-10 xl:h-10" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

    </section>
  );
}
