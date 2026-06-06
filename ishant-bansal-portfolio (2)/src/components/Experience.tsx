import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../lib/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    const cards = gsap.utils.toArray('.exp-card');
    
    cards.forEach((card: any, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        y: 100,
        opacity: 0,
        rotationX: -10,
        duration: 1.2,
        ease: "expo.out"
      });
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full min-h-screen py-32 px-6 z-10 relative flex flex-col items-center bg-transparent">
      
      <div className="max-w-[1200px] w-full flex flex-col items-start gap-16">
        <div className="w-full">
          <div className="inline-block bg-white border-2 border-black px-3 py-1 mb-4 shadow-[4px_4px_0_#000] transform -skew-x-12">
            <p className="text-sm md:text-base text-red-600 font-manga tracking-widest uppercase transform skew-x-12">{t('JOURNEY')}</p>
          </div>
          <h2 className="text-5xl md:text-8xl font-black font-impact tracking-normal uppercase text-black bg-white inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0_#dc2626]">
            {t('EXPERIENCE')}
          </h2>
        </div>

        <div className="w-full flex gap-12 md:gap-24 flex-wrap pb-16">
          {PORTFOLIO_DATA.experience.map((exp, i) => (
            <div key={i} className="exp-card w-full flex flex-col md:flex-row gap-6 md:gap-16 border-4 border-black p-8 bg-white shadow-[8px_8px_0_#000] relative transition-transform duration-300 hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[12px_12px_0_#dc2626]">
              
              {/* Comic bubble tail for first card just for flavor */}
              {i === 0 && (
                <div className="hidden md:block absolute -left-[24px] top-12 w-0 h-0 border-y-[16px] border-y-transparent border-r-[24px] border-r-black z-0"></div>
              )}

              <div className="w-full md:w-[30%] flex-shrink-0 flex flex-col gap-6">
                <div className="inline-block px-4 py-2 bg-red-600 border-2 border-black text-white font-impact tracking-widest text-lg shadow-[4px_4px_0_#000] transform rotate-2 self-start">
                  {exp.date}
                </div>
                {/* Render Custom Manga Image if available */}
                {exp.imageUrl && (
                   <div 
                      className="w-full aspect-[4/3] bg-cover bg-center border-4 border-black shadow-[6px_6px_0_#dc2626] transform -rotate-1 grayscale hover:grayscale-0 transition-all duration-500 ease-out"
                      style={{ backgroundImage: `url('${exp.imageUrl}')` }}
                   />
                )}
              </div>

              <div className="w-full md:w-[70%]">
                <h3 className="text-4xl md:text-6xl font-manga text-black mb-2 leading-none uppercase">{exp.role}</h3>
                <h4 className="text-red-600 mb-8 text-2xl font-impact tracking-normal uppercase">{exp.company}</h4>
                
                <ul className="space-y-4 text-black font-medium text-lg leading-snug border-l-4 border-black pl-4">
                  {exp.description.map((desc, idx) => (
                    <li key={idx} className="flex gap-4 items-start bg-black/5 p-3 border border-black/10">
                      <span className="text-red-600 font-manga text-2xl text-shadow-sm mt-0">&rarr;</span>
                      <span className="flex-1">{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="w-full mt-16 pt-16">
          <div className="inline-block bg-white border-2 border-black px-3 py-1 mb-4 shadow-[4px_4px_0_#000] transform -skew-x-12">
            <p className="text-sm md:text-base text-red-600 font-manga tracking-widest uppercase transform skew-x-12">{t('ACADEMIC_BACKGROUND')}</p>
          </div>
          <h2 className="text-5xl md:text-8xl font-black font-impact tracking-normal uppercase text-black bg-white inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0_#dc2626] mb-12 transform -rotate-1">
            {t('EDUCATION')}
          </h2>

          <div className="w-full flex flex-col md:flex-row gap-12 md:gap-8 flex-wrap">
            {PORTFOLIO_DATA.education.map((edu, i) => (
              <div key={i} className="exp-card w-full md:w-[calc(50%-1rem)] flex flex-col gap-6 border-4 border-black p-8 bg-white shadow-[6px_6px_0_#000] relative hover:-translate-y-2 transition-transform duration-300 group">
                
                <div className="inline-block self-start px-4 py-2 bg-black text-white border-2 border-transparent text-sm font-impact tracking-widest transform -rotate-2 shadow-[4px_4px_0_#dc2626] group-hover:bg-red-600 group-hover:border-black transition-colors">
                  {edu.date}
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-manga text-black mb-2 leading-none uppercase">{edu.degree}</h3>
                  <h4 className="text-red-600 text-xl font-impact uppercase tracking-wide">{edu.institution}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
