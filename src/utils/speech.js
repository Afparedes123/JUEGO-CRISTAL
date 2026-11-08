// Voice System - Voz Femenina Latina Humanizada (Estudio MP3 + Fallback SpeechSynthesis)

/**
 * Normaliza cualquier texto para comparación insensible a mayúsculas,
 * tildes, signos de puntuación y espacios extras.
 */
export function normalizeTextForLookup(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos / diacríticos
    .replace(/[¡!¿?.,:;\-—_()"'`]/g, '') // Quita signos ortográficos
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Catálogo maestro de frases y sus archivos de audio de voz humana latina (.mp3)
 */
export const AUDIO_MANIFEST = {
  // Bienvenida / Inicio
  'welcome': '/audio/welcome.mp3',
  'home_hint': '/audio/home_hint.mp3',
  'mascot_intro': '/audio/mascot_intro.mp3',
  'voice_test': '/audio/voice_test.mp3',
  'lock_lvl2': '/audio/lock_lvl2.mp3',
  'lock_lvl3': '/audio/lock_lvl3.mp3',
  'lock_lvl4': '/audio/lock_lvl4.mp3',

  // Nivel 1: Atrapa la Vocal
  'lvl1_intro': '/audio/lvl1_intro.mp3',
  'lvl1_win': '/audio/lvl1_win.mp3',
  'lvl1_vowel_a': '/audio/lvl1_vowel_a.mp3',
  'lvl1_vowel_e': '/audio/lvl1_vowel_e.mp3',
  'lvl1_vowel_i': '/audio/lvl1_vowel_i.mp3',
  'lvl1_vowel_o': '/audio/lvl1_vowel_o.mp3',
  'lvl1_vowel_u': '/audio/lvl1_vowel_u.mp3',
  'vocal_a': '/audio/vocal_a.mp3',
  'vocal_e': '/audio/vocal_e.mp3',
  'vocal_i': '/audio/vocal_i.mp3',
  'vocal_o': '/audio/vocal_o.mp3',
  'vocal_u': '/audio/vocal_u.mp3',
  'lvl1_consonant_hint': '/audio/lvl1_consonant_hint.mp3',

  // Nivel 2: Alimenta al Minino
  'lvl2_intro': '/audio/lvl2_intro.mp3',
  'lvl2_correct': '/audio/lvl2_correct.mp3',
  'lvl2_ask_m': '/audio/lvl2_ask_m.mp3',
  'lvl2_ask_p': '/audio/lvl2_ask_p.mp3',
  'lvl2_ask_s': '/audio/lvl2_ask_s.mp3',
  'lvl2_ask_l': '/audio/lvl2_ask_l.mp3',
  'lvl2_ask_t': '/audio/lvl2_ask_t.mp3',
  'lvl2_wrong': '/audio/lvl2_wrong.mp3',
  'lvl2_win': '/audio/lvl2_win.mp3',

  // Nivel 3: Saltos en las Nubes
  'lvl3_intro': '/audio/lvl3_intro.mp3',
  'lvl3_ma': '/audio/lvl3_ma.mp3',
  'lvl3_pe': '/audio/lvl3_pe.mp3',
  'lvl3_si': '/audio/lvl3_si.mp3',
  'lvl3_lo': '/audio/lvl3_lo.mp3',
  'lvl3_tu': '/audio/lvl3_tu.mp3',
  'lvl3_merge_ma': '/audio/lvl3_merge_ma.mp3',
  'lvl3_merge_pe': '/audio/lvl3_merge_pe.mp3',
  'lvl3_merge_si': '/audio/lvl3_merge_si.mp3',
  'lvl3_merge_lo': '/audio/lvl3_merge_lo.mp3',
  'lvl3_merge_tu': '/audio/lvl3_merge_tu.mp3',
  'lvl3_win': '/audio/lvl3_win.mp3',

  // Nivel 4: Fiesta Gatuna - Ordena las cajas
  'lvl4_intro': '/audio/lvl4_intro.mp3',
  'lvl4_word_gato': '/audio/lvl4_word_gato.mp3',
  'lvl4_word_pelo': '/audio/lvl4_word_pelo.mp3',
  'lvl4_word_luna': '/audio/lvl4_word_luna.mp3',
  'lvl4_word_casa': '/audio/lvl4_word_casa.mp3',
  'lvl4_ask_gato': '/audio/lvl4_ask_gato.mp3',
  'lvl4_ask_pelo': '/audio/lvl4_ask_pelo.mp3',
  'lvl4_ask_luna': '/audio/lvl4_ask_luna.mp3',
  'lvl4_ask_casa': '/audio/lvl4_ask_casa.mp3',
  'lvl4_wrong': '/audio/lvl4_wrong.mp3',
  'lvl4_win': '/audio/lvl4_win.mp3',

  // Fase 2: Mapa Mágico y Casa de las Gatitas
  'splash_welcome': '/audio/splash_welcome.mp3',
  'map_welcome': '/audio/map_welcome.mp3',
  'map_locked': '/audio/map_locked.mp3',
  'reward_welcome': '/audio/reward_welcome.mp3',
  'reward_thanks': '/audio/reward_thanks.mp3',
  'reward_need_more': '/audio/reward_need_more.mp3',

  // Fase 3: Minijuegos de Trazos, Burbujas y Caldero
  'trace_welcome': '/audio/trace_welcome.mp3',
  'trace_win': '/audio/trace_win.mp3',
  'bubbles_welcome': '/audio/bubbles_welcome.mp3',
  'bubbles_fail': '/audio/bubbles_fail.mp3',
  'cauldron_welcome': '/audio/cauldron_welcome.mp3',
  'cauldron_win': '/audio/cauldron_win.mp3',
  'win_yarn_modal': '/audio/win_yarn_modal.mp3',
};

/**
 * Resuelve la URL del archivo de audio .mp3 humano latino según el texto
 */
export function resolveAudioForText(text, explicitKey = null) {
  if (explicitKey && AUDIO_MANIFEST[explicitKey]) {
    return AUDIO_MANIFEST[explicitKey];
  }

  const n = normalizeTextForLookup(text);
  if (!n) return null;

  // Fase 3: Minijuegos
  if (n.includes('vamos a dibujar la letra a sigue la luz magica')) return '/audio/trace_welcome.mp3';
  if (n.includes('que hermoso dibujas cristal')) return '/audio/trace_win.mp3';
  if (n.includes('ayudanos a atrapar las burbujas que suenan como ma')) return '/audio/bubbles_welcome.mp3';
  if (n.includes('ups esa no es intenta buscar la que suena ma')) return '/audio/bubbles_fail.mp3';
  if (n.includes('vamos a hacer magia construye la palabra me-sa') || n.includes('palabra mesa')) return '/audio/cauldron_welcome.mp3';
  if (n.includes('magia pura cristal eres muy inteligente')) return '/audio/cauldron_win.mp3';
  if (n.includes('ganaste un ovillo magico para nuestras gatitas cristal')) return '/audio/win_yarn_modal.mp3';

  // Fase 2: Mapa Mágico y Casa de las Gatitas
  if (n.includes('toca el boton brillante para jugar con nosotras')) return '/audio/splash_welcome.mp3';
  if (n.includes('elige a donde vamos hoy')) return '/audio/map_welcome.mp3';
  if (n.includes('aun no cristal primero terminemos el nivel anterior')) return '/audio/map_locked.mp3';
  if (n.includes('gracias por jugar cristal que quieres regalarnos hoy')) return '/audio/reward_welcome.mp3';
  if (n.includes('gracias cristal nos encanta')) return '/audio/reward_thanks.mp3';
  if (n.includes('necesitamos ganar mas ovillos')) return '/audio/reward_need_more.mp3';

  // Inicio & Guía
  if (n.includes('soy tu nueva amiga gatita') || n.includes('vamos a jugar y aprender juntas')) return '/audio/welcome.mp3';
  if (n.includes('haz clic en el gran boton rosa')) return '/audio/home_hint.mp3';
  if (n.includes('soy tu amiga gatita vamos a leer')) return '/audio/mascot_intro.mp3';
  if (n.includes('esta es mi nueva voz') || n.includes('te quiero mucho') || n.includes('mi voz de gatita')) return '/audio/voice_test.mp3';
  
  // Bloqueos de niveles en Header
  if (n.includes('bloquear el nivel 2')) return '/audio/lock_lvl2.mp3';
  if (n.includes('bloquear el nivel 3')) return '/audio/lock_lvl3.mp3';
  if (n.includes('bloquear la gran fiesta') || n.includes('bloquear el nivel 4')) return '/audio/lock_lvl4.mp3';

  // Nivel 1: Atrapa la vocal
  if (n.includes('atrapa solo las vocales')) return '/audio/lvl1_intro.mp3';
  if (n.includes('eres increible cristal') || n.includes('vamos al siguiente nivel')) return '/audio/lvl1_win.mp3';
  if (n.includes('la a muy bien')) return '/audio/lvl1_vowel_a.mp3';
  if (n.includes('la e muy bien')) return '/audio/lvl1_vowel_e.mp3';
  if (n.includes('la i muy bien')) return '/audio/lvl1_vowel_i.mp3';
  if (n.includes('la o muy bien')) return '/audio/lvl1_vowel_o.mp3';
  if (n.includes('la u muy bien')) return '/audio/lvl1_vowel_u.mp3';
  if (n === 'vocal a') return '/audio/vocal_a.mp3';
  if (n === 'vocal e') return '/audio/vocal_e.mp3';
  if (n === 'vocal i') return '/audio/vocal_i.mp3';
  if (n === 'vocal o') return '/audio/vocal_o.mp3';
  if (n === 'vocal u') return '/audio/vocal_u.mp3';
  if (n.includes('esa es la letra') && n.includes('sigue buscando las vocales')) {
    const match = n.match(/letra ([a-z])/);
    if (match) {
      const letter = match[1].toUpperCase();
      return `/audio/lvl1_consonant_${letter}.mp3`;
    }
    return '/audio/lvl1_consonant_hint.mp3';
  }

  // Nivel 2: Alimenta al minino
  if (n.includes('gatitos tienen hambre me ayudas a encontrar')) return '/audio/lvl2_intro.mp3';
  if (n.includes('que rico gracias cristal')) return '/audio/lvl2_correct.mp3';
  if (n.includes('felices y bien alimentados') || n.includes('desbloqueaste el nivel 3')) return '/audio/lvl2_win.mp3';
  if ((n.includes('hambre') || n.includes('pide')) && n.includes('letra m')) return '/audio/lvl2_ask_m.mp3';
  if ((n.includes('hambre') || n.includes('pide')) && n.includes('letra p')) return '/audio/lvl2_ask_p.mp3';
  if ((n.includes('hambre') || n.includes('pide')) && n.includes('letra s')) return '/audio/lvl2_ask_s.mp3';
  if ((n.includes('hambre') || n.includes('pide')) && n.includes('letra l')) return '/audio/lvl2_ask_l.mp3';
  if ((n.includes('hambre') || n.includes('pide')) && n.includes('letra t')) return '/audio/lvl2_ask_t.mp3';
  if (n.includes('ese plato tiene la letra') || n.includes('casi cristal')) return '/audio/lvl2_wrong.mp3';

  // Nivel 3: Saltos en las Nubes
  if (n.includes('mira las nubes') && n.includes('hacemos magia')) return '/audio/lvl3_intro.mp3';
  if (n === 'ma') return '/audio/lvl3_ma.mp3';
  if (n === 'pe') return '/audio/lvl3_pe.mp3';
  if (n === 'si') return '/audio/lvl3_si.mp3';
  if (n === 'lo') return '/audio/lvl3_lo.mp3';
  if (n === 'tu') return '/audio/lvl3_tu.mp3';
  if (n.includes('juntemos la nube m') || (n.includes('juntar') && n.includes(' m ') && n.includes(' a '))) return '/audio/lvl3_merge_ma.mp3';
  if (n.includes('juntemos la nube p') || (n.includes('juntar') && n.includes(' p ') && n.includes(' e '))) return '/audio/lvl3_merge_pe.mp3';
  if (n.includes('juntemos la nube s') || (n.includes('juntar') && n.includes(' s ') && n.includes(' i '))) return '/audio/lvl3_merge_si.mp3';
  if (n.includes('juntemos la nube l') || (n.includes('juntar') && n.includes(' l ') && n.includes(' o '))) return '/audio/lvl3_merge_lo.mp3';
  if (n.includes('juntemos la nube t') || (n.includes('juntar') && n.includes(' t ') && n.includes(' u '))) return '/audio/lvl3_merge_tu.mp3';
  if (n.includes('inteligente eres cristal')) return '/audio/lvl3_win.mp3';

  // Nivel 4: Fiesta Gatuna
  if (n.includes('fiesta gatuna')) return '/audio/lvl4_intro.mp3';
  if (n.includes('gato muy bien cristal')) return '/audio/lvl4_word_gato.mp3';
  if (n.includes('pelo muy bien cristal')) return '/audio/lvl4_word_pelo.mp3';
  if (n.includes('luna muy bien cristal')) return '/audio/lvl4_word_luna.mp3';
  if (n.includes('casa muy bien cristal')) return '/audio/lvl4_word_casa.mp3';
  if (n.includes('ordenemos las cajas para formar gato')) return '/audio/lvl4_ask_gato.mp3';
  if (n.includes('ordenemos las cajas para formar pelo')) return '/audio/lvl4_ask_pelo.mp3';
  if (n.includes('ordenemos las cajas para formar luna')) return '/audio/lvl4_ask_luna.mp3';
  if (n.includes('ordenemos las cajas para formar casa')) return '/audio/lvl4_ask_casa.mp3';
  if (n.includes('no pasa nada cristal')) return '/audio/lvl4_wrong.mp3';
  if (n.includes('lo lograste cristal') || n.includes('mejor amiga de los gatitos')) return '/audio/lvl4_win.mp3';

  return null;
}

class KittenVoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentAudio = null;
    this.voices = [];
    this.selectedVoice = null;
    this.currentUtterance = null;
    this.pitch = 1.0; 
    this.rate = 0.98;  
    this.volume = 1.0;
    this.listeners = new Set();
    this.isSpeaking = false;
    this.lastSpokenText = '';
    this.lastAudioKey = null;
    this.useStudioVoice = true; // Por defecto siempre usa la voz humana de estudio

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

  getAvailableLatinVoices() {
    if (!this.voices || this.voices.length === 0) {
      if (this.synth) this.voices = this.synth.getVoices();
    }
    
    const spanishVoices = this.voices.filter(v => 
      v.lang && (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spa'))
    );

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

    if (lang.includes('es-mx') || lang.includes('mexic')) score += 50;
    else if (lang.includes('es-us') || lang.includes('united states')) score += 48;
    else if (lang.includes('es-co') || lang.includes('colomb')) score += 47;
    else if (lang.includes('es-419') || lang.includes('latin')) score += 46;
    else if (lang.includes('es-ar') || lang.includes('argent')) score += 45;
    else if (lang.includes('es-cl') || lang.includes('chile')) score += 44;
    else if (lang.includes('es-pe') || lang.includes('peru')) score += 43;
    else if (lang.includes('es-es') || lang.includes('spain')) score += 10;

    if (name.includes('natural') || name.includes('neural') || name.includes('online')) score += 40;
    if (name.includes('google')) score += 30;
    if (name.includes('microsoft')) score += 25;
    if (name.includes('apple') || name.includes('siri')) score += 25;

    const latinFemaleNames = [
      'dalia', 'salma', 'paulina', 'paola', 'soledad', 'jimena', 
      'camila', 'mia', 'mía', 'victoria', 'francisca', 'catalina',
      'sabina', 'laura', 'sofia', 'sofía', 'elena', 'hilda', 'rosa'
    ];
    if (latinFemaleNames.some(kw => name.includes(kw))) {
      score += 35;
    }

    if (name.includes('espeak') || name.includes('desktop') || name.includes('compact')) {
      score -= 30;
    }

    return score;
  }

  pickBestLatinVoice() {
    const latinVoices = this.getAvailableLatinVoices();
    if (!latinVoices || latinVoices.length === 0) return null;

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

  formatNaturalSpeech(text) {
    if (!text) return '';
    return text
      .replace(/GA-TO/gi, 'Gato')
      .replace(/PE-LO/gi, 'Pelo')
      .replace(/LU-NA/gi, 'Luna')
      .replace(/CA-SA/gi, 'Casa')
      .replace(/M\s*\+\s*A/gi, 'M con A')
      .replace(/P\s*\+\s*E/gi, 'P con E')
      .replace(/S\s*\+\s*I/gi, 'S con I')
      .replace(/L\s*\+\s*O/gi, 'L con O')
      .replace(/T\s*\+\s*U/gi, 'T con U')
      .replace(/[🐱🐾✨⭐💖🐟🥛🎉📦🎈👑]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Reproduce el audio humano latino prioritariamente (.mp3)
   * Si no existe archivo de audio, utiliza SpeechSynthesis como respaldo.
   */
  speak(text, options = {}) {
    this.cancel();

    this.lastSpokenText = text;
    this.lastAudioKey = options.audioKey || null;

    // 1. Intentar reproducir audio humano pregrabado si useStudioVoice está activo
    if (this.useStudioVoice !== false) {
      const audioUrl = resolveAudioForText(text, options.audioKey);
      if (audioUrl) {
        try {
          const audio = new Audio(audioUrl);
          this.currentAudio = audio;
          audio.volume = options.volume ?? this.volume;

          this.isSpeaking = true;
          this.notify({ isSpeaking: true, text, source: 'studio' });
          if (options.onStart) options.onStart();

          audio.onended = () => {
            this.isSpeaking = false;
            this.currentAudio = null;
            this.notify({ isSpeaking: false, text, source: 'studio' });
            if (options.onEnd) options.onEnd();
          };

          audio.onerror = (err) => {
            console.warn('Fallo al cargar audio MP3, usando síntesis como respaldo:', err);
            this.currentAudio = null;
            this.speakWithSynthesis(text, options);
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Reproducción de audio bloqueada por el navegador:', err);
              this.currentAudio = null;
              this.speakWithSynthesis(text, options);
            });
          }
          return;
        } catch (e) {
          console.warn('Error al instanciar Audio():', e);
        }
      }
    }

    // 2. Si no hay audio pregrabado o falló, utilizar SpeechSynthesis
    this.speakWithSynthesis(text, options);
  }

  speakWithSynthesis(text, options = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis no está soportado en este navegador.');
      return;
    }

    const naturalText = this.formatNaturalSpeech(text);
    const utterance = new SpeechSynthesisUtterance(naturalText);
    this.currentUtterance = utterance;

    if (!this.selectedVoice) {
      this.pickBestLatinVoice();
    }
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
      utterance.lang = this.selectedVoice.lang || 'es-MX';
    } else {
      utterance.lang = 'es-MX';
    }

    utterance.pitch = options.pitch ?? this.pitch;
    utterance.rate = options.rate ?? this.rate;
    utterance.volume = options.volume ?? this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.notify({ isSpeaking: true, text: naturalText, source: 'synth' });
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notify({ isSpeaking: false, text: naturalText, source: 'synth' });
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Error de voz sintética:', event);
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
      this.speak(this.lastSpokenText, { audioKey: this.lastAudioKey });
    }
  }

  cancel() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // Ignorar
      }
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignorar
      }
      this.currentUtterance = null;
    }

    this.isSpeaking = false;
    this.notify({ isSpeaking: false, text: '' });
  }

  setPitch(newPitch) {
    this.pitch = Math.max(0.8, Math.min(1.3, newPitch));
  }

  setRate(newRate) {
    this.rate = Math.max(0.8, Math.min(1.2, newRate));
  }
}

export const kittenVoice = new KittenVoiceService();
