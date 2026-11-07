import React, { useState, useEffect, useRef } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { playBellChime, playBubblePop, playSoftBounce, playVictoryFanfare, playCuteMeow } from '../utils/soundEffects';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import { Sparkles, Star, Award, RotateCcw, ArrowRight, Heart } from 'lucide-react';

const VOWELS = [
  { char: 'A', name: 'A', color: 'from-pink-400 to-rose-400 border-pink-300 text-pink-900' },
  { char: 'E', name: 'E', color: 'from-amber-300 to-yellow-400 border-yellow-200 text-amber-900' },
  { char: 'I', name: 'I', color: 'from-emerald-300 to-teal-400 border-emerald-200 text-emerald-900' },
  { char: 'O', name: 'O', color: 'from-sky-300 to-blue-400 border-sky-200 text-sky-900' },
  { char: 'U', name: 'U', color: 'from-purple-400 to-indigo-400 border-purple-300 text-purple-900' },
];

const CONSONANTS = ['M', 'P', 'S', 'L', 'T', 'D', 'B', 'R', 'N'];

const BUBBLE_COLORS = [
  'bg-gradient-to-br from-pink-200/90 via-pink-100/70 to-pink-300/80 border-pink-300 text-pink-800',
  'bg-gradient-to-br from-purple-200/90 via-purple-100/70 to-purple-300/80 border-purple-300 text-purple-800',
  'bg-gradient-to-br from-sky-200/90 via-sky-100/70 to-sky-300/80 border-sky-300 text-sky-800',
  'bg-gradient-to-br from-yellow-200/90 via-amber-100/70 to-amber-300/80 border-amber-300 text-amber-800',
  'bg-gradient-to-br from-emerald-200/90 via-teal-100/70 to-teal-300/80 border-teal-300 text-teal-800',
];

export default function Level1Vowels({ onCompleteLevel, onGoToLevel2 }) {
  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [wobblingId, setWobblingId] = useState(null);
  const [poppingId, setPoppingId] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [caughtVowels, setCaughtVowels] = useState([]);
  const [dialogue, setDialogue] = useState('Cristal, atrapa solo las vocales, como la A, E, I, O, U.');
  
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const nextBubbleId = useRef(1);

  // Requirement: "Al iniciar el nivel, la gatita debe decir en audio: 'Cristal, atrapa solo las vocales, como la A, E, I, O, U'."
  useEffect(() => {
    const welcomeAudio = 'Cristal, atrapa solo las vocales, como la A, E, I, O, U.';
    setDialogue(welcomeAudio);
    
    // Give half-second before speaking so user is ready
    const timer = setTimeout(() => {
      kittenVoice.speak(welcomeAudio);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Helper to generate a bubble
  const createBubble = (forceVowel = false, startY = null) => {
    const isVowel = forceVowel || Math.random() < 0.55;
    let letter = '';
    
    if (isVowel) {
      const v = VOWELS[Math.floor(Math.random() * VOWELS.length)];
      letter = v.char;
    } else {
      letter = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    }

    const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
    const x = 5 + Math.random() * 80; // 5% to 85%
    const y = startY !== null ? startY : (90 + Math.random() * 15); // start near bottom
    const speed = 0.25 + Math.random() * 0.25; // gentle float speed for ease of clicking
    const drift = (Math.random() - 0.5) * 0.4;
    const size = 80 + Math.floor(Math.random() * 20); // 80px to 100px

    return {
      id: nextBubbleId.current++,
      letter,
      isVowel,
      color,
      x,
      y,
      speed,
      drift,
      size,
    };
  };

  // Initialize pool of floating bubbles
  useEffect(() => {
    const initialBubbles = [];
    // Ensure we start with at least 3 vowels on screen
    initialBubbles.push(createBubble(true, 75));
    initialBubbles.push(createBubble(true, 55));
    initialBubbles.push(createBubble(true, 35));
    initialBubbles.push(createBubble(false, 70));
    initialBubbles.push(createBubble(false, 50));
    initialBubbles.push(createBubble(false, 30));
    initialBubbles.push(createBubble(false, 85));

    setBubbles(initialBubbles);
  }, []);

  // Animation loop to float bubbles gently upward
  useEffect(() => {
    if (isCompleted) return;

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 16.66, 2.0); // normalize frame step
      lastTime = currentTime;

      setBubbles((prevBubbles) => {
        return prevBubbles.map((bubble) => {
          let newY = bubble.y - (bubble.speed * 0.45 * dt);
          let newX = bubble.x + (Math.sin(bubble.y * 0.05) * bubble.drift * dt);

          // Bounce off left/right edges
          if (newX < 4) newX = 4;
          if (newX > 86) newX = 86;

          // If float off top, respawn at bottom
          if (newY < -15) {
            return createBubble(Math.random() < 0.6, 102);
          }

          return {
            ...bubble,
            y: newY,
            x: newX,
          };
        });
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCompleted]);

  // Click on a bubble
  const handleBubbleClick = (bubble, event) => {
    if (isCompleted) return;

    // Requirement:
    // "Al hacer clic en una vocal, la burbuja explota con partículas brillantes y un efecto de sonido de campanita."
    if (bubble.isVowel) {
      playBubblePop();
      playBellChime();

      // Confetti burst right at bubble location
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;
      fireBubbleSparkles(clickX, clickY);

      setPoppingId(bubble.id);

      const newScore = score + 1;
      setScore(newScore);
      setCaughtVowels((prev) => [...prev, bubble.letter]);

      // Remove popped bubble and spawn a replacement after short delay
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setPoppingId(null);

        // Spawn replacement
        setBubbles((prev) => [...prev, createBubble(Math.random() < 0.55, 105)]);
      }, 250);

      // Check if reached 5 vowels
      // Requirement:
      // "Al conseguir 5 vocales correctas, la gatita dice en audio: '¡Miau! ¡Eres increíble, Cristal! Vamos al siguiente nivel' y se desbloquea el Nivel 2."
      if (newScore >= 5) {
        setIsCompleted(true);
        const victoryText = '¡Miau! ¡Eres increíble, Cristal! Vamos al siguiente nivel';
        setDialogue(victoryText);

        setTimeout(() => {
          playVictoryFanfare();
          fireVictoryConfetti();
          kittenVoice.speak(victoryText);
          if (onCompleteLevel) onCompleteLevel();
        }, 300);
      } else {
        const compliments = [
          `¡Genial, Cristal! Atrapaste la vocal ${bubble.letter}.`,
          `¡Muy bien! La ${bubble.letter} es una vocal mágica.`,
          `¡Fantástico! Ya llevas ${newScore} de 5 vocales.`,
          `¡Bravo Cristal! La letra ${bubble.letter} brilla para ti.`,
        ];
        const randomPraise = compliments[Math.floor(Math.random() * compliments.length)];
        setDialogue(randomPraise);
        kittenVoice.speak(`¡La ${bubble.letter}! ¡Muy bien Cristal!`);
      }
    } else {
      // Requirement:
      // "Si hace clic en una consonante, solo rebota sin error."
      playSoftBounce();
      setWobblingId(bubble.id);
      setTimeout(() => setWobblingId(null), 600);

      const reminderText = `¡Esa es la letra ${bubble.letter}! Recuerda Cristal: busca solo las vocales A, E, I, O, U.`;
      setDialogue(reminderText);
      kittenVoice.speak(`Esa es la letra ${bubble.letter}. ¡Sigue buscando las vocales A, E, I, O, U!`);
    }
  };

  const handleResetLevel = () => {
    setScore(0);
    setCaughtVowels([]);
    setIsCompleted(false);
    const text = 'Cristal, atrapa solo las vocales, como la A, E, I, O, U.';
    setDialogue(text);
    kittenVoice.speak(text);

    // Reset bubbles
    const initial = [];
    initial.push(createBubble(true, 75));
    initial.push(createBubble(true, 55));
    initial.push(createBubble(true, 35));
    initial.push(createBubble(false, 70));
    initial.push(createBubble(false, 50));
    initial.push(createBubble(false, 30));
    initial.push(createBubble(false, 85));
    setBubbles(initial);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto">
      {/* Top Header & Progress */}
      <div className="w-full">
        {/* Level Tag & Goal */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-pink-200 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-pink-500 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-sm">
              Nivel 1
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide">
              Atrapa la Vocal ✨
            </h2>
          </div>

          {/* Star Counter (0 to 5) */}
          <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200">
            <span className="text-sm font-bold text-pink-700">Vocales atrapadas:</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all transform ${
                    i < score
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-yellow-900 shadow-md scale-110 animate-bounce'
                      : 'bg-white border-2 border-dashed border-pink-300 text-pink-300'
                  }`}
                >
                  <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${i < score ? 'fill-yellow-400 text-yellow-600' : ''}`} />
                </div>
              ))}
            </div>
            <span className="font-extrabold text-pink-600 ml-1 text-base">{score}/5</span>
          </div>
        </div>

        {/* Visual Vowel Helper Reference Bar (Dyslexia-friendly visual cue) */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 px-3 bg-gradient-to-r from-pink-100/90 via-purple-100/90 to-blue-100/90 rounded-2xl border border-pink-200 shadow-inner mb-3">
          <span className="text-xs sm:text-sm font-bold text-purple-800 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-pink-500" />
            Vocales mágicas:
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            {VOWELS.map((v) => (
              <span
                key={v.char}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm border-2 border-pink-300 text-pink-600 font-extrabold text-base sm:text-xl flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer"
                title={`Vocal ${v.char}`}
                onClick={() => {
                  playBellChime();
                  kittenVoice.speak(`Vocal ${v.char}`);
                }}
              >
                {v.char}
              </span>
            ))}
          </div>
        </div>

        {/* Kitten Guide with Speech Bubble */}
        <KittenGuide 
          currentDialogue={dialogue}
          customImage={isCompleted ? '/kitten-celebration.jpg' : '/kitten-guide.jpg'}
        />
      </div>

      {/* Main Interactive Floating Bubble Sky */}
      <div 
        ref={containerRef}
        className="relative w-full h-[460px] sm:h-[500px] my-3 rounded-3xl bg-gradient-to-b from-sky-100/80 via-pink-100/60 to-purple-100/80 border-4 border-white/80 shadow-inner overflow-hidden select-none"
      >
        {/* Background Clouds & Rainbow Sparkles */}
        <div className="absolute top-6 left-10 w-24 h-8 bg-white/60 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute top-16 right-12 w-32 h-10 bg-white/60 rounded-full blur-sm pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/3 w-40 h-12 bg-white/50 rounded-full blur-sm pointer-events-none"></div>

        {/* Floating Bubbles */}
        {bubbles.map((bubble) => {
          const isWobbling = wobblingId === bubble.id;
          const isPopping = poppingId === bubble.id;

          return (
            <button
              key={bubble.id}
              onClick={(e) => handleBubbleClick(bubble, e)}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 flex flex-col items-center justify-center font-extrabold transition-transform duration-100 cursor-pointer shadow-lg bubble-glow active:scale-90 ${bubble.color} ${
                isWobbling ? 'animate-soft-bounce ring-4 ring-yellow-400/70' : ''
              } ${isPopping ? 'scale-125 opacity-0 transition-all duration-300' : 'hover:scale-105'}`}
              title={`Toca para atrapar la letra ${bubble.letter}`}
            >
              {/* Bubble Highlight / Gloss */}
              <div className="absolute top-2 left-2 w-5 h-3 rounded-full bg-white/70 transform -rotate-45 pointer-events-none"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-white/50 pointer-events-none"></div>

              {/* Big bold letter formatted for maximum readability */}
              <span className="text-3xl sm:text-4xl font-extrabold tracking-normal drop-shadow-sm pointer-events-none select-none">
                {bubble.letter}
              </span>
              <span className="text-xs font-bold opacity-70 pointer-events-none">
                {bubble.letter.toLowerCase()}
              </span>

              {/* Sparkle icon indicator for extra magic */}
              <div className="absolute -top-1 -right-1 text-yellow-300 opacity-60">
                <Sparkles className="w-4 h-4" />
              </div>
            </button>
          );
        })}

        {/* Instruction overlay watermark if needed */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-600 border border-white pointer-events-none shadow-sm">
          💡 Toca las burbujas que tengan vocales (A, E, I, O, U)
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={handleResetLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-sm font-bold border border-pink-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-pink-500" />
          <span>Reiniciar Nivel 1</span>
        </button>

        <div className="text-sm font-semibold text-pink-700 bg-pink-100/80 px-4 py-2 rounded-2xl">
          {score < 5 ? (
            <span>¡Te faltan {5 - score} {5 - score === 1 ? 'vocal' : 'vocales'} para ganar! 🐱</span>
          ) : (
            <span className="font-bold text-pink-800">¡Nivel 1 Completado! 🎉</span>
          )}
        </div>
      </div>

      {/* Victory Modal when 5 vowels are caught! */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-scale">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-pink-300 shadow-2xl overflow-hidden">
            {/* Background sparkle glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-pink-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-yellow-200 rounded-full blur-2xl"></div>

            {/* Celebratory Kitten Picture */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-yellow-300 shadow-xl mb-4 bg-pink-50">
              <img 
                src="/kitten-celebration.jpg" 
                alt="Gatita celebrando la victoria de Cristal" 
                className="w-full h-full object-cover animate-bounce"
              />
            </div>

            {/* Victory Title */}
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm mb-2 border border-yellow-300">
              <Award className="w-4 h-4 text-yellow-600" />
              <span>¡Nivel 1 Superado con Éxito!</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 leading-tight mb-2">
              ¡Miau! ¡Eres increíble, Cristal!
            </h2>

            <p className="text-lg font-bold text-slate-700 mb-6">
              ¡Atrapaste 5 vocales mágicas y desbloqueaste el Nivel 2! 🌟
            </p>

            {/* Caught Vowels Ribbon */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {caughtVowels.slice(0, 5).map((char, index) => (
                <div
                  key={index}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md animate-pulse"
                >
                  {char}
                </div>
              ))}
            </div>

            {/* Actions: Next Level & Replay */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGoToLevel2}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 text-white font-extrabold text-lg py-3.5 px-6 rounded-2xl shadow-lg shadow-pink-200 active:scale-95 transition-all"
              >
                <span>¡Ir al Nivel 2!</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleResetLevel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base py-3.5 px-5 rounded-2xl border border-slate-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Jugar de nuevo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
