export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.15; // Low volume for calm sounds

        // Initialize on first user interaction (required by browsers)
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playJump() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Soft rising tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Sine wave for smooth, calm sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);

        // Gentle envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playScore() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Gentle chime (two notes)
        const playNote = (freq, startTime, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.volume * 0.8, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Two harmonious notes
        playNote(523, now, 0.2); // C5
        playNote(659, now + 0.08, 0.25); // E5
    }

    playDeath() {
        if (!this.enabled || !this.initialized) return;

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Subtle descending tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);

        // Gentle fade
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.6, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }
}
