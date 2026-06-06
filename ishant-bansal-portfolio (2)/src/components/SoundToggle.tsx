import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../lib/sound';

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  // Initialize on first mount if not muted, but normally requires user interaction
  // We'll trust the button click to do it.
  
  const toggleSound = () => {
    soundManager.init(); // Ensure context is started
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
        soundManager.playPageTurn(); // Audio feedback
    }
  };

  return (
    <button 
      onClick={toggleSound}
      className="fixed top-6 left-6 z-50 bg-white border-4 border-black p-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_#000] shadow-[4px_4px_0_#dc2626] transition-all group"
      aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-black" />
      ) : (
        <Volume2 className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
