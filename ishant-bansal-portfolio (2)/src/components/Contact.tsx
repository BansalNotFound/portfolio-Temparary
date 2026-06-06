import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MangaPanel } from './MangaPanel';
import { soundManager } from '../lib/sound';
import { useLanguage } from '../lib/LanguageContext';
import { GokuModelCanvas } from './GokuModel';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ⚠️ USER ACTION REQUIRED: Paste your Google Apps Script Web App URL here
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwdqLyIVcUV2C-uGZk76cfiCOR99a2Cupxg0-BQm2oIkUJ-4j_P-GSMCLMNyEVzGTsE/exec";
  const powRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  React.useEffect(() => {
    let ctx = gsap.context(() => {
      // Boom animation for background text
      if (bgTextRef.current) {
        gsap.fromTo(bgTextRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1, // Full manga style opacity
            duration: 0.8,
            ease: "elastic.out(1, 0.4)",
            scrollTrigger: {
              trigger: "#contact",
              start: "top 70%",
              end: "bottom 30%",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Convert to JSON
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    };

    setIsSubmitting(true);
    
    try {
      if (GOOGLE_SHEET_URL !== "YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE") {
        await fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(data),
        });
      } else {
        console.warn("Google Sheet URL is not set. Simulating network request...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      form.reset();
      setIsSubmitted(true);
      soundManager.playThud(); // POW! Uses thud sound
      
      // POW Animation
      if (powRef.current) {
          gsap.fromTo(powRef.current, 
              { scale: 0, opacity: 0, rotation: -20 },
              { 
                 scale: 1, 
                 opacity: 1, 
                 rotation: 10,
                 duration: 0.5, 
                 ease: "back.out(2)",
                 onComplete: () => {
                     gsap.to(powRef.current, {
                         scale: 0,
                         opacity: 0,
                         duration: 0.3,
                         delay: 2,
                         onComplete: () => setIsSubmitted(false)
                     });
                 }
              }
          );
      }
    } catch (error) {
      console.error("Transmission failed", error);
      alert("Transmission failed. Please check your comm link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full relative z-20 py-24 px-4 border-t-[8px] border-black">
      <div className="max-w-[1000px] mx-auto relative">
        <div ref={bgTextRef} className="absolute -top-12 -left-6 md:-top-16 md:-left-12 z-40 pointer-events-none transform -rotate-12 origin-center">
            <h2 className="font-impact text-7xl md:text-9xl leading-none text-white [-webkit-text-stroke:2px_#000] sm:[-webkit-text-stroke:4px_#000] italic drop-shadow-[8px_8px_0_#dc2626]">{t('CONTACT')}</h2>
        </div>
        
        <MangaPanel cornerSize="lg" className="border-[6px] border-black shadow-[16px_16px_0_#dc2626]">
          <div className="p-8 md:p-16 flex flex-col md:flex-row gap-12 relative overflow-hidden">
            
             <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-5xl md:text-7xl font-impact uppercase text-black mb-6 leading-none">
                    {t('LETS_JOIN')} <br/>
                    <span className="text-red-600">{t('FORCES')}</span>
                </h2>
                <p className="font-sans text-xl font-bold border-l-4 border-black pl-4 mb-8">
                    {t('READY_TO_BUILD')}
                </p>
                <div className="w-full h-full min-h-[200px] border-4 border-black relative bg-zinc-900 overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("/images/goku_bg.png")' }}>
                   <GokuModelCanvas />
                   <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent z-30 pointer-events-none"></div>
                </div>
             </div>

             <div className="w-full md:w-1/2 relative bg-white border-4 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="font-manga text-2xl uppercase tracking-wider font-bold">{t('ALIAS')}</label>
                        <input type="text" id="name" name="name" required className="w-full p-3 border-2 border-black bg-zinc-100 focus:bg-white focus:outline-none focus:border-red-600 transition-colors font-sans font-bold" placeholder="Your Name" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="font-manga text-2xl uppercase tracking-wider font-bold">{t('COMM_LINK')}</label>
                        <input type="email" id="email" name="email" required className="w-full p-3 border-2 border-black bg-zinc-100 focus:bg-white focus:outline-none focus:border-red-600 transition-colors font-sans font-bold" placeholder="Your Email" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="font-manga text-2xl uppercase tracking-wider font-bold">{t('INTEL')}</label>
                        <textarea id="message" name="message" required rows={4} className="w-full p-3 border-2 border-black bg-zinc-100 focus:bg-white focus:outline-none focus:border-red-600 transition-colors font-sans font-bold resize-none" placeholder="Your Message"></textarea>
                    </div>
                    <button disabled={isSubmitting} type="submit" className={`mt-4 px-8 py-4 bg-red-600 text-white font-impact tracking-widest text-2xl uppercase border-4 border-black shadow-[4px_4px_0_#000] transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover-target hover:translate-y-1 hover:translate-x-1 hover:shadow-none'}`}>
                        {isSubmitting ? 'TRANSMITTING...' : t('TRANSMIT')}
                    </button>
                </form>

                {/* POW! Animation Element */}
                <div 
                  ref={powRef} 
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 ${isSubmitted ? 'block' : 'hidden'}`}
                  style={{ width: '200px', height: '200px' }}
                >
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] filter">
                         <polygon points="50,0 60,30 100,20 70,50 90,90 50,70 10,90 30,50 0,20 40,30" fill="yellow" stroke="black" strokeWidth="3" />
                         <text x="50" y="60" textAnchor="middle" fill="red" stroke="black" strokeWidth="1" className="font-impact" fontSize="24" transform="rotate(-15 50 60)">POW!</text>
                    </svg>
                </div>
             </div>

          </div>
        </MangaPanel>
      </div>
    </section>
  );
}
