import { Howl, Howler } from 'howler';

class SoundManager {
  private static instance: SoundManager;
  public isMuted: boolean = false;
  
  private bgm: Howl | null = null;
  private initialized: boolean = false;

  private constructor() {
    // Always default to ON as requested, ignoring previous local storage state on fresh load
    this.isMuted = false;
    Howler.mute(false);

    // PRELOAD the music here so it's ready when the user clicks 'enter'
    this.bgm = new Howl({ 
      src: ['/sounds/suzume.mp3'], 
      volume: 0.5,
      loop: true,
      preload: true
    });
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public init() {
    if (this.initialized) return;
    
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }

    if (!this.isMuted && this.bgm) {
      this.bgm.play();
    }

    this.initialized = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    
    // Ensure BGM plays if unmuted
    if (!this.isMuted && this.bgm && !this.bgm.playing()) {
      this.bgm.play();
    }
    
    try {
      localStorage.setItem('portfolio_muted', this.isMuted.toString());
    } catch (e) {}

    return this.isMuted;
  }

  // No-op the old sound effects to prevent code breakage
  public playHover() {}
  public playClick() {}
  public playPageTurn() {}
  public playSwoosh() {}
  public playThud() {}

  // Synthesize a guitar string pluck
  public playGuitarPluck(detune: number = 0) {
    if (this.isMuted) return;
    try {
      const ctx = Howler.ctx;
      if (!ctx || ctx.state !== 'running') return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Base frequency A3 (220 Hz), adjusted by detune half-steps
      osc.frequency.setValueAtTime(220 * Math.pow(2, detune / 12), t);
      
      // Decay envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(t);
      osc.stop(t + 1.0);
    } catch(e) {}
  }
}
export const soundManager = SoundManager.getInstance();
