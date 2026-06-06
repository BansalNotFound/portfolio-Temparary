import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { soundManager } from '../lib/sound';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      soundManager.playThud();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Manga styled background lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 15px)' }}></div>
      
      <div className="relative w-full max-w-5xl bg-white border-[6px] border-black shadow-[12px_12px_0_#dc2626] flex flex-col z-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-black text-white p-3 flex justify-between items-center border-b-[6px] border-black">
          <div className="font-manga text-xl tracking-widest pl-2">VIDEO PLAYBACK</div>
          <button 
            onClick={onClose}
            className="hover:bg-red-600 transition-colors p-1"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        
        <div className="w-full aspect-video bg-black relative">
          <video 
            src={videoUrl}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
