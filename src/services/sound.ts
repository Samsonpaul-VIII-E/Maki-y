/**
 * Web Audio API Acoustic & Ultrasound Synthesizer
 * Provides mechanical keyboard clacks, CRT high-voltage hum,
 * and high-frequency ultrasound pulse relay (19kHz) for covert air-gapped mesh transmission.
 */

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null;
  public enabled: boolean = true;
  
  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Mechanical switch acoustic click
  public playKeyClick(type: 'blue' | 'brown' | 'relay' = 'blue') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = type === 'blue' ? 3200 : type === 'brown' ? 1800 : 850;
      filter.Q.value = 4.0;

      const now = this.audioCtx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'blue' ? 4400 : 2100, now);
      osc.frequency.exponentialRampToValueAtTime(type === 'blue' ? 800 : 400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // CRT power hum and terminal beep
  public playTerminalBeep(freq: number = 880, duration: number = 0.06) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const now = this.audioCtx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // ignore
    }
  }

  // Harmonic cyber success chime
  public playSuccess() {
    if (!this.enabled) return;
    this.playTerminalBeep(587.33, 0.08); // D5
    setTimeout(() => this.playTerminalBeep(880.00, 0.12), 60); // A5
  }

  // Warning buzz
  public playWarning() {
    if (!this.enabled) return;
    this.playTerminalBeep(240, 0.15);
  }

  // Secure memory wipe noise
  public playWipe() {
    if (!this.enabled) return;
    this.playKeyClick('relay');
    setTimeout(() => this.playTerminalBeep(180, 0.2), 40);
  }

  // Covert Ultrasound Sonar Pulse (19,200 Hz - sub-audible to human ear, detectable by microphone FFT)
  public transmitUltrasonicPulse(frequency: number = 19200, duration: number = 0.18): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.initCtx();
        if (!this.audioCtx) return resolve(false);

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const now = this.audioCtx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.setValueAtTime(0.12, now + duration - 0.02);
        gain.gain.linearRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
        setTimeout(() => resolve(true), duration * 1000);
      } catch {
        resolve(false);
      }
    });
  }
}

export const sound = new SoundSynthesizer();
