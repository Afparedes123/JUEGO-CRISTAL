// ============================================================================
// AUDIO MANAGER - SISTEMA DE AUDIO GLOBAL ESTRICTO PARA CRISTAL
// ============================================================================
// Reglas estrictas:
// 1. playBGM(): Música de fondo instrumental muy suave (caja de música/magia).
// 2. playVoice(audioIdOrText): DETIENE cualquier voz anterior de inmediato
//    antes de reproducir la nueva. Todas las voces se dirigen a Cristal.
// 3. playSFX(audioId): Efectos de sonido instantáneos sin latencia
//    (burbujas, campanas, aplausos, brillos, maullidos).
// ============================================================================

import { normalizeTextForLookup, AUDIO_MANIFEST, resolveAudioForText } from '../utils/speech';

class GlobalAudioManager {
  constructor() {
    this.audioCtx = null;
    this.bgmOscillators = [];
    this.bgmGainNode = null;
    this.isBgmPlaying = false;
    this.bgmVolume = 0.25; // Suave para no tapar la voz

    // Voz
    this.currentVoiceAudio = null;
    this.isVoiceSpeaking = false;
    this.voiceVolume = 1.0;
    this.currentVoiceCallback = null;

    // Efectos de sonido
    this.sfxVolume = 0.7;

    // Listeners reactivos para la UI
    this.listeners = new Set();

    // Precargar audio context en primer toque
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.getAudioContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
    }
  }

  // Inicializa o reanuda Web Audio API
  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(data) {
    this.listeners.forEach((fn) => fn(data));
  }

  // ==========================================================================
  // 1. BGM: Música de fondo instrumental suave (Caja de Música / Arpa Mágica)
  // Generada en tiempo real mediante síntesis aditiva y envolventes suaves,
  // garantizando 0 descargas, bucle continuo y ambiente de fantasía pastel.
  // ==========================================================================
  playBGM() {
    if (this.isBgmPlaying) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.isBgmPlaying = true;
    this.notify({ isBgmPlaying: true });

    // Master Gain para BGM
    this.bgmGainNode = ctx.createGain();
    this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, ctx.currentTime);
    this.bgmGainNode.connect(ctx.destination);

    // Melodía mágica en escala pentatónica de hadas (Caja de música / Arpa)
    // C5, E5, G5, A5, B5, C6 (Do, Mi, Sol, La, Si, Do agudo)
    const notes = [
      523.25, 659.25, 783.99, 880.0, 987.77, 1046.5,
      880.0, 783.99, 659.25, 783.99, 1046.5, 987.77
    ];
    let step = 0;

    const playNextMusicBoxNote = () => {
      if (!this.isBgmPlaying || !this.audioCtx) return;

      const freq = notes[step % notes.length];
      step++;

      const now = this.audioCtx.currentTime;

      // Oscilador senoidal puro (sonido de campana celestial / celesta)
      const osc = this.audioCtx.createOscillator();
      const oscHarmonic = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Armónico sutil para brillo cristalino
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, now);

      // Envolvente de decaimiento de caja de música (ataque percusivo + cola suave)
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(noteGain);
      oscHarmonic.connect(noteGain);
      noteGain.connect(this.bgmGainNode);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + 1.8);
      oscHarmonic.stop(now + 1.8);

      // Cadencia suave de caja de música (cada 550ms)
      this.bgmTimeout = setTimeout(playNextMusicBoxNote, 550);
    };

    playNextMusicBoxNote();
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
    if (this.bgmGainNode && this.audioCtx) {
      try {
        this.bgmGainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.3);
      } catch (e) {
        // Ignorar
      }
    }
    this.notify({ isBgmPlaying: false });
  }

  setBGMVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmGainNode && this.audioCtx) {
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.audioCtx.currentTime);
    }
    this.notify({ bgmVolume: this.bgmVolume });
  }

  // ==========================================================================
  // 2. PLAYVOICE: Gestión estricta de voces dirigidas a Cristal
  // DETIENE inmediatamente cualquier audio o voz en curso antes de sonar.
  // ==========================================================================
  playVoice(audioIdOrText, options = {}) {
    // REGLA CRUCIAL: Detener cualquier voz anterior de inmediato
    this.stopVoice();

    if (!audioIdOrText) return;

    // 1. Resolver archivo de audio pregrabado (MP3 latino de alta fidelidad)
    let audioUrl = null;
    if (AUDIO_MANIFEST[audioIdOrText]) {
      audioUrl = AUDIO_MANIFEST[audioIdOrText];
    } else {
      audioUrl = resolveAudioForText(audioIdOrText);
    }

    this.isVoiceSpeaking = true;
    this.notify({ isVoiceSpeaking: true, currentText: audioIdOrText });
    if (options.onStart) options.onStart();

    // Si encontramos el archivo MP3 dedicado
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        this.currentVoiceAudio = audio;
        audio.volume = options.volume ?? this.voiceVolume;

        audio.onended = () => {
          this.isVoiceSpeaking = false;
          this.currentVoiceAudio = null;
          this.notify({ isVoiceSpeaking: false });
          if (options.onEnd) options.onEnd();
        };

        audio.onerror = (err) => {
          console.warn('Error cargando MP3 de voz, pasando a síntesis como respaldo:', err);
          this.currentVoiceAudio = null;
          this.playVoiceSynthesisFallback(audioIdOrText, options);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play bloqueado por navegador, usando síntesis:', err);
            this.currentVoiceAudio = null;
            this.playVoiceSynthesisFallback(audioIdOrText, options);
          });
        }
        return;
      } catch (e) {
        console.warn('Error en Audio():', e);
      }
    }

    // 2. Respaldo por Web Speech API si no se encuentra archivo MP3
    this.playVoiceSynthesisFallback(audioIdOrText, options);
  }

  // Detiene completamente la voz actual sin solapamientos
  stopVoice() {
    if (this.currentVoiceAudio) {
      try {
        this.currentVoiceAudio.pause();
        this.currentVoiceAudio.currentTime = 0;
        this.currentVoiceAudio.onended = null;
        this.currentVoiceAudio.onerror = null;
      } catch (e) {
        // Ignorar
      }
      this.currentVoiceAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // Ignorar
      }
    }

    this.isVoiceSpeaking = false;
    this.notify({ isVoiceSpeaking: false });
  }

  // Respaldo sintético si no hay MP3
  playVoiceSynthesisFallback(text, options = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (options.onEnd) options.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = options.rate ?? 0.95;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? this.voiceVolume;

    const voices = window.speechSynthesis.getVoices();
    const latin = voices.find(
      (v) =>
        v.lang &&
        (v.lang.toLowerCase().includes('es-mx') ||
          v.lang.toLowerCase().includes('es-us') ||
          v.lang.toLowerCase().includes('es-419'))
    );
    if (latin) utterance.voice = latin;

    utterance.onstart = () => {
      this.isVoiceSpeaking = true;
      this.notify({ isVoiceSpeaking: true, currentText: text });
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isVoiceSpeaking = false;
      this.notify({ isVoiceSpeaking: false });
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      this.isVoiceSpeaking = false;
      this.notify({ isVoiceSpeaking: false });
      if (options.onEnd) options.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  setVoiceVolume(volume) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
    if (this.currentVoiceAudio) {
      this.currentVoiceAudio.volume = this.voiceVolume;
    }
    this.notify({ voiceVolume: this.voiceVolume });
  }

  // ==========================================================================
  // 3. PLAY SFX: Efectos de sonido (Botones, Magia, Refuerzos Positivos)
  // Generados mediante Web Audio API para reproducirse al instante sin lag.
  // ==========================================================================
  playSFX(sfxId) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (sfxId) {
      // Sonido de burbuja suave / botón de juguete
      case 'bubble':
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

        gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      // Campanita brillante de hadas
      case 'bell':
      case 'chime': {
        [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + idx * 0.04;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.18 * this.sfxVolume, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.85);
        });
        break;
      }

      // Ráfaga de destellos y polvillo mágico (al tocar a las gatitas o al botón)
      case 'sparkle':
      case 'magic': {
        const scale = [587.33, 739.99, 880.0, 1174.66, 1479.98, 1760.0, 2349.32];
        scale.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const delay = now + idx * 0.035;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, delay);

          gain.gain.setValueAtTime(0.15 * this.sfxVolume, delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, delay + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(delay);
          osc.stop(delay + 0.5);
        });
        break;
      }

      // Maullido cariñoso de gatita mágica
      case 'meow':
      case 'purr': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';

        // Curva de maullido tierno: sube y luego baja suavemente
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.linearRampToValueAtTime(840, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.42);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.22 * this.sfxVolume, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
        break;
      }

      // Aplausos y celebración estelar
      case 'applause':
      case 'celebration': {
        // Acorde mayor de triunfo
        const chords = [523.25, 659.25, 783.99, 1046.5];
        chords.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.25);
        });
        break;
      }

      // Candado bloqueado / rebote elástico sin castigo
      case 'lock':
      case 'wobble': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(190, now + 0.15);

        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      // Recolección de ovillo de lana (moneda mágica)
      case 'yarn':
      case 'coin': {
        [987.77, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.2 * this.sfxVolume, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.4);
        });
        break;
      }

      default:
        // Clic por defecto
        this.playSFX('bubble');
        break;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.notify({ sfxVolume: this.sfxVolume });
  }
}

export const audioManager = new GlobalAudioManager();
