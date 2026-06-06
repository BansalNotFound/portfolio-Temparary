import React, { useState, useEffect } from 'react';

export function MangaModeToggle() {
    const [isMangaMode, setIsMangaMode] = useState(false);

    useEffect(() => {
        if (isMangaMode) {
            document.documentElement.classList.add('manga-mode-active');
        } else {
            document.documentElement.classList.remove('manga-mode-active');
        }
    }, [isMangaMode]);

    return (
        <>
            {isMangaMode && (
                <div 
                    className="fixed inset-0 pointer-events-none z-[9998] opacity-25 mix-blend-multiply" 
                    style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)', backgroundSize: '10px 10px' }}
                ></div>
            )}
            <button 
                onClick={() => setIsMangaMode(!isMangaMode)}
                className="fixed top-4 right-4 md:top-8 md:right-8 z-[9999] bg-white text-black border-[4px] border-black px-4 py-2 font-impact text-xl md:text-2xl uppercase shadow-[4px_4px_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#000] transition-all cursor-crosshair flex items-center gap-2"
            >
                <div className={`w-3 h-3 rounded-full border-2 border-black ${isMangaMode ? 'bg-black' : 'bg-red-600'}`}></div>
                {isMangaMode ? 'COLOR: OFF' : 'MANGA: ON'}
            </button>
        </>
    );
}
