// Web Speech API Voice System for Magical Kitten

class KittenVoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.currentUtterance = null;
    this.pitch = 1.55; // High pitch for cute child/kitten persona
    this.rate = 0.93;  // Calm, clear articulation for reading difficulties
    this.volume = 1.0;
    this.listeners = new Set();
    this.isSpeaking = false;
    this.lastSpokenText = '';

    if (this.synth) {
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    this.pickBestKittenVoice();
  }

  pickBestKittenVoice() {
    if (!this.voices || this.voices.length === 0) return null;

    // Filter Spanish voices
    const spanishVoices = this.voices.filter(v => 
      v.lang && (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spa'))
    );

    // Prefer feminine Spanish voices
    const femaleKeywords = ['monica', 'mónica', 'paulina', 'helena', 'lucia', 'lucía', 'sabina', 'laura', 'rosa', 'mia', 'mía', 'victoria', 'francisca', 'paloma', 'jimena', 'sofia', 'sofía', 'elvira', 'female', 'mujer', 'chica', 'natural'];

    let bestVoice = spanishVoices.find(v => {
      const name = v.name.toLowerCase();
      return femaleKeywords.some(keyword => name.includes(keyword));
    });

    // If no explicit female Spanish voice found, take Google / Microsoft / Apple Spanish voice
    if (!bestVoice && spanishVoices.length > 0) {
      bestVoice = spanishVoices.find(v => v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Apple')) || spanishVoices[0];
    }

    // Fallback to any high-quality female voice or first available
    if (!bestVoice) {
      bestVoice = this.voices.find(v => femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))) || this.voices[0];
    }

    this.selectedVoice = bestVoice;
    return bestVoice;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state) {
    this.listeners.forEach(fn => fn(state));
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // Cancel any active speech cleanly
    this.cancel();

    this.lastSpokenText = text;

    // Create fresh utterance
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance; // Prevent garbage collection bug in Chromium/Safari

    // Ensure voice is assigned
    if (!this.selectedVoice) {
      this.initVoices();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Configure cute kitten voice parameters
    utterance.lang = (this.selectedVoice && this.selectedVoice.lang) || 'es-ES';
    utterance.pitch = options.pitch ?? this.pitch;
    utterance.rate = options.rate ?? this.rate;
    utterance.volume = options.volume ?? this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify({ isSpeaking: true, text });
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text });
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      // Ignore user cancellation errors
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Speech error:', event);
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text, error: event.error });
      if (options.onError) options.onError(event);
    };

    // Chrome bug workaround: sometimes speech freezes if paused
    if (this.synth.paused) {
      this.synth.resume();
    }

    this.synth.speak(utterance);
  }

  repeat() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text: '' });
    }
  }

  setPitch(newPitch) {
    this.pitch = Math.max(0.5, Math.min(2.0, newPitch));
  }

  setRate(newRate) {
    this.rate = Math.max(0.5, Math.min(2.0, newRate));
  }
}

export const kittenVoice = new KittenVoiceService();
