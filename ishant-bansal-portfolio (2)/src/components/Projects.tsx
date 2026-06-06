import React, { useRef } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Trophy, Cpu } from 'lucide-react';
import { MangaPanel } from './MangaPanel';
import { useLanguage } from '../lib/LanguageContext';
import { VideoModal } from './VideoModal';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);

  useGSAP(() => {
    const projectsCount = PORTFOLIO_DATA.projects.length;
    
    // We add some dramatic scroll-linked typography scaling
    gsap.to('.project-title-huge', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      xPercent: -20,
      ease: "none"
    });

    if (projectsCount > 1) {
      gsap.to(galleryRef.current, {
        x: () => -(galleryRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${galleryRef.current!.scrollWidth - window.innerWidth}`,
          invalidateOnRefresh: true,
        }
      });
    } else {
      gsap.from('.project-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 150,
        opacity: 0,
        rotateX: 10,
        duration: 1.5,
        ease: "power4.out"
      });
    }
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full h-screen relative flex flex-col justify-center bg-transparent z-10 overflow-hidden halftone-bg">
      
      {/* Background massive running text */}
      <div className="absolute top-0 w-[200%] md:w-[150%] left-0 opacity-10 pointer-events-none whitespace-nowrap overflow-hidden z-0">
        <h2 className="project-title-huge text-[25vw] font-black font-manga uppercase text-black tracking-tighter leading-none">
          プロジェクト &bull; SELECTED WORKS &bull; アニメ
        </h2>
      </div>

      <div className="w-full max-w-[1400px] px-6 md:px-12 mb-8 relative z-20 mx-auto">
        <h2 className="text-5xl md:text-8xl font-impact tracking-normal uppercase text-white flex items-center gap-6 shadow-none [-webkit-text-stroke:2px_#000] sm:[-webkit-text-stroke:4px_#000] drop-shadow-[6px_6px_0_#dc2626]">
          <span className="w-8 md:w-24 h-[6px] bg-red-600 inline-block border-2 border-black shadow-[4px_4px_0_#dc2626]"></span> 
          {t('SELECTED_WORKS')}
        </h2>
      </div>

      <div 
        ref={galleryRef} 
        className="flex w-max h-auto items-center z-20 pt-4"
      >
        {PORTFOLIO_DATA.projects.map((project, i) => (
          <div key={i} className="w-screen h-full px-6 md:px-12 flex-shrink-0 flex items-center justify-center pt-8 pb-16">
            <MangaPanel 
              cornerSize="lg" 
              className="project-card w-full max-w-[1300px] border-0 mx-auto" 
              innerClassName="flex flex-col xl:flex-row gap-0 group h-full"
              backContent={
                <div className="flex flex-col h-full items-center justify-center text-center relative z-20">
                  <h3 className="text-4xl md:text-6xl font-impact uppercase text-white mb-6 tracking-wide [text-shadow:4px_4px_0_#dc2626]">{t('CLASSIFIED_INTEL')}</h3>
                  <div className="text-xl md:text-2xl font-manga tracking-wider text-red-500 mb-8">{project.title}</div>
                  <p className="font-sans text-lg md:text-xl text-zinc-300 max-w-2xl bg-white/5 p-6 border-l-4 border-red-600 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    {/* Buttons moved to the front */}
                  </div>
                  <div className="mt-12 text-sm uppercase tracking-widest text-zinc-500 font-manga animate-pulse">
                    {t('CLICK_TO_CLOSE')}
                  </div>
                </div>
              }
            >
              
              <div className="w-full xl:w-[55%] h-[35vh] sm:h-[45vh] xl:h-[600px] bg-black overflow-hidden relative xl:border-r-4 xl:border-black flex items-center justify-center">
              {project.mediaType === 'video' ? (
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700 ease-out"
                  src="https://cdn.pixabay.com/video/2021/04/13/70932-536553257_large.mp4" 
                />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-normal opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out" 
                  style={{ backgroundImage: `url('${project.imageUrl}')` }}
                />
              )}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-transparent mix-blend-overlay" />
                
                {/* Manga action lines effect overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.8)_150%)] pointer-events-none opacity-50" />
              
                <div className="relative z-10 text-center flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <div className="px-6 py-2 bg-red-600 border-4 border-black text-white font-impact tracking-wider text-xl uppercase shadow-[6px_6px_0_#fff] -rotate-3 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#fff] transition-all">
                      {t('CLICK_TO_REVEAL')}
                   </div>
                </div>
              </div>

              {/* The Content Box */}
              <div className="w-full xl:w-[45%] flex flex-col justify-center text-black p-8 md:p-12 xl:p-16 bg-white relative">
                {/* Comic speech bubble tail decoration */}
                <div className="hidden xl:block absolute -left-[24px] top-1/3 w-0 h-0 border-y-[20px] border-y-transparent border-r-[20px] border-r-white z-20"></div>
                
                <h3 className="absolute -top-6 -right-6 text-8xl md:text-9xl text-black/5 font-impact select-none pointer-events-none z-0">
                  {String(i + 1).padStart(2, '0')}
                </h3>

                <div className="mb-6 flex justify-between items-start relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="px-3 py-1 bg-black text-white font-manga text-xl leading-none pt-2 uppercase">{t('MISSION')}</span>
                       <span className="text-red-600 font-impact text-xl tracking-wide uppercase block">{project.subtitle}</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl font-manga tracking-tight uppercase group-hover:text-red-600 transition-colors duration-300 leading-[0.9] mt-2">{project.title}</h3>
                  </div>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="flex-shrink-0 hover-target p-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors group/link shadow-[4px_4px_0_#dc2626]">
                      <ExternalLink className="w-8 h-8 group-hover/link:rotate-45 transition-transform" />
                    </a>
                  )}
                </div>

                <p className="text-zinc-800 mb-6 font-medium text-lg leading-snug font-sans relative z-10 border-l-4 border-black pl-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-8 relative z-10">
                  {project.watchVideoUrl && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveVideo(project.watchVideoUrl!); }}
                      className="flex items-center gap-2 hover-target px-6 py-2 bg-white text-black border-[3px] border-black font-impact tracking-widest text-lg uppercase shadow-[4px_4px_0_#dc2626] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#dc2626] transition-all"
                    >
                      <Play className="w-5 h-5 fill-black" /> WATCH VIDEO
                    </button>
                  )}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover-target px-6 py-2 bg-red-600 text-white font-impact tracking-widest text-lg uppercase border-[3px] border-transparent shadow-[4px_4px_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#000] transition-all">
                      {t('LAUNCH_PROTOCOL')}
                    </a>
                  )}
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                  {project.achievements.map((ach, idx) => (
                    <div key={idx} className="flex gap-4 items-start text-sm md:text-base font-bold text-black font-sans bg-black/5 p-3 border border-black/10">
                      <Trophy className="w-5 h-5 flex-shrink-0 text-red-600" /> 
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                  <div className="w-full flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                    <Cpu className="w-5 h-5 text-black" />
                    <span className="text-lg uppercase font-impact tracking-wiider text-black">Tech Arsenal</span>
                  </div>
                  {project.tech.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-white border-2 border-black text-sm font-bold font-sans text-black hover:bg-red-600 hover:text-white transition-colors cursor-default shadow-[2px_2px_0_#000]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </MangaPanel>
          </div>
        ))}
      </div>

      <VideoModal 
        isOpen={!!activeVideo}
        videoUrl={activeVideo || ''}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}
