// Web Speech API Voice System - Optimizado para Voz Femenina Latina Natural y Fluida

class KittenVoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.currentUtterance = null;
    // Tono natural 1.0 (evita que la voz suene distorsionada, ardilla o robotizada)
    this.pitch = 1.0; 
    // Velocidad fluida y humana (0.96 - 1.0)
    this.rate = 0.98;  
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
    this.pickBestLatinVoice();
  }

  /**
   * Obtiene todas las voces en español disponibles en el dispositivo,
   * priorizando América Latina.
   */
  getAvailableLatinVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }
    
    // Filtrar todas las voces en español
    const spanishVoices = this.voices.filter(v => 
      v.lang && (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spa'))
    );

    // Ordenar: Voces Latinas Naturales/Neurales primero, luego otras de Latinoamérica, y al final España
    return spanishVoices.sort((a, b) => {
      const scoreA = this.calculateVoiceScore(a);
      const scoreB = this.calculateVoiceScore(b);
      return scoreB - scoreA;
    });
  }

  calculateVoiceScore(voice) {
    let score = 0;
    const lang = (voice.lang || '').toLowerCase();
    const name = (voice.name || '').toLowerCase();

    // 1. Prioridad máxima: Países de América Latina
    if (lang.includes('es-mx') || lang.includes('mexico') || lang.includes('méxico')) score += 50;
    else if (lang.includes('es-us') || lang.includes('united states') || lang.includes('estados unidos')) score += 48;
    else if (lang.includes('es-co') || lang.includes('colombia')) score += 47;
    else if (lang.includes('es-419') || lang.includes('latin') || lang.includes('latinoamérica')) score += 46;
    else if (lang.includes('es-ar') || lang.includes('argentina')) score += 45;
    else if (lang.includes('es-cl') || lang.includes('chile')) score += 44;
    else if (lang.includes('es-pe') || lang.includes('peru') || lang.includes('perú')) score += 43;
    else if (lang.includes('es-es') || lang.includes('spain') || lang.includes('españa')) score += 10; // Menos prioridad para acento ibérico

    // 2. Voces neuronales / naturales (mucho más humanas y fluidas)
    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 40;
    if (name.includes('google')) score += 30;
    if (name.includes('microsoft')) score += 25;
    if (name.includes('apple') || name.includes('siri')) score += 25;

    // 3. Nombres de mujeres latinas reconocidas en TTS
    const latinFemaleNames = [
      'dalia', 'salma', 'paulina', 'paola', 'soledad', 'jimena', 
      'camila', 'mia', 'mía', 'victoria', 'francisca', 'catalina',
      'sabina', 'laura', 'sofia', 'sofía', 'elena', 'hilda', 'rosa',
      'female', 'mujer', 'chica', 'femenino'
    ];
    if (latinFemaleNames.some(kw => name.includes(kw))) {
      score += 35;
    }

    // Penalizar voces sintéticas viejas conocidas como robóticas si hay alternativas
    if (name.includes('espeak') || name.includes('desktop') || name.includes('compact')) {
      score -= 30;
    }

    return score;
  }

  pickBestLatinVoice() {
    const latinVoices = this.getAvailableLatinVoices();
    if (!latinVoices || latinVoices.length === 0) return null;

    // Verificar si el usuario ya guardó una voz preferida
    if (typeof localStorage !== 'undefined') {
      const savedVoiceURI = localStorage.getItem('cristal_preferred_voice');
      if (savedVoiceURI) {
        const found = latinVoices.find(v => v.voiceURI === savedVoiceURI || v.name === savedVoiceURI);
        if (found) {
          this.selectedVoice = found;
          return found;
        }
      }
    }

    // Seleccionar la voz latina con mayor puntuación
    this.selectedVoice = latinVoices[0];
    return this.selectedVoice;
  }

  setVoiceByURI(voiceURI) {
    const found = this.voices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    if (found) {
      this.selectedVoice = found;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('cristal_preferred_voice', found.voiceURI || found.name);
      }
      this.notify({ selectedVoice: found });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state) {
    this.listeners.forEach(fn => fn(state));
  }

  /**
   * Limpia el texto para que la voz lo pronuncie de forma humana y cariñosa
   */
  formatNaturalSpeech(text) {
    if (!text) return '';
    let cleaned = text
      .replace(/GA-TO/gi, 'Gato')
      .replace(/PE-LO/gi, 'Pelo')
      .replace(/LU-NA/gi, 'Luna')
      .replace(/CA-SA/gi, 'Casa')
      .replace(/M\s*\+\s*A/gi, 'M con A')
      .replace(/P\s*\+\s*E/gi, 'P con E')
      .replace(/S\s*\+\s*I/gi, 'S con I')
      .replace(/L\s*\+\s*O/gi, 'L con O')
      .replace(/T\s*\+\s*U/gi, 'T con U')
      .replace(/[🐱🐾✨⭐💖🐟🥛🎉📦🎈👑]/g, '') // Quitar emojis que los lectores a veces deletrean
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned;
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis no está soportado en este navegador.');
      return;
    }

    // Cancelar cualquier audio anterior limpiamente
    this.cancel();

    const naturalText = this.formatNaturalSpeech(text);
    this.lastSpokenText = naturalText;

    const utterance = new SpeechSynthesisUtterance(naturalText);
    this.currentUtterance = utterance; // Evitar bug de garbage collection en Chrome

    // Asegurar selección de voz latina
    if (!this.selectedVoice) {
      this.pickBestLatinVoice();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
      utterance.lang = this.selectedVoice.lang || 'es-MX';
    } else {
      utterance.lang = 'es-MX';
    }

    // Tono natural (1.0) para sonar como una mujer real, fluida y cariñosa
    utterance.pitch = options.pitch ?? this.pitch;
    utterance.rate = options.rate ?? this.rate;
    utterance.volume = options.volume ?? this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify({ isSpeaking: true, text: naturalText });
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text: naturalText });
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Error de voz:', event);
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text: naturalText, error: event.error });
      if (options.onError) options.onError(event);
    };

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
    this.pitch = Math.max(0.8, Math.min(1.3, newPitch));
  }

  setRate(newRate) {
    this.rate = Math.max(0.8, Math.min(1.2, newRate));
  }
}

export const kittenVoice = new KittenVoiceService();
