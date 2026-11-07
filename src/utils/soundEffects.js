// Sound effects using Web Audio API (100% self-contained, no external asset dependency)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a sparkling fairy bell chime for vowel pops
 */
export function playBellChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7 (magical pentatonic sparkle)

  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + index * 0.04);

    gain.gain.setValueAtTime(0, now + index * 0.04);
    gain.gain.linearRampToValueAtTime(0.25, now + index * 0.04 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.04 + 0.9);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + index * 0.04);
    osc.stop(now + index * 0.04 + 0.9);
  });
}

/**
 * Play a cute bubble pop sound
 */
export function playBubblePop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

/**
 * Gentle friendly bounce sound for consonants (non-punishing, encouraging)
 */
export function playSoftBounce() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  // Pleasant cartoon wobble/spring sound
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.linearRampToValueAtTime(320, now + 0.08);
  osc.frequency.linearRampToValueAtTime(280, now + 0.16);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/**
 * Play celebratory magical victory fanfare
 */
export function playVictoryFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const melody = [
    { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
    { freq: 659.25, time: 0.12, dur: 0.12 }, // E5
    { freq: 783.99, time: 0.24, dur: 0.12 }, // G5
    { freq: 1046.5, time: 0.36, dur: 0.35 }, // C6
    { freq: 880.00, time: 0.65, dur: 0.15 }, // A5
    { freq: 1046.5, time: 0.80, dur: 0.55 }, // C6 long
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gain.gain.setValueAtTime(0, now + note.time);
    gain.gain.linearRampToValueAtTime(0.3, now + note.time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.time);
    osc.stop(now + note.time + note.dur);
  });
}

/**
 * Adorable kitten meow sound synthesized
 */
export function playCuteMeow() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // "Mee-ooww" pitch curve
  osc.frequency.setValueAtTime(550, now);
  osc.frequency.linearRampToValueAtTime(780, now + 0.12);
  osc.frequency.exponentialRampToValueAtTime(480, now + 0.35);

  gain.gain.setValueAtTime(0.0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.38);
}

/**
 * Cute eating / crunch sound when the kitten eats the treat bowl
 */
export function playCuteMunch() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [0, 0.1, 0.22].forEach((offset) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420 + Math.random() * 80, now + offset);
    osc.frequency.exponentialRampToValueAtTime(180, now + offset + 0.08);

    gain.gain.setValueAtTime(0.2, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + offset);
    osc.stop(now + offset + 0.08);
  });
}

/**
 * Play a bouncy spring jump sound when the kitten jumps on the cloud
 */
export function playCloudJump() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.exponentialRampToValueAtTime(680, now + 0.22);
  osc.exponentialRampToValueAtTime(520, now + 0.35);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.38);
}
