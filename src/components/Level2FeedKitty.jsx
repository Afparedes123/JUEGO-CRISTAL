import React, { useState, useEffect } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { 
  playBellChime, 
  playSoftBounce, 
  playVictoryFanfare, 
  playCuteMeow, 
  playCuteMunch 
} from '../utils/soundEffects';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import { Sparkles, Star, Award, Heart, ArrowRight, RotateCcw, Utensils, Fish } from 'lucide-react';

// Fixed list of 5 letters requested by the user: M, P, S, L, T
const TARGET_LETTERS = [
  { letter: 'M', name: 'M', phonetic: 'eme', soundHint: 'como en Miau y Mamá', distractors: ['N', 'W'] },
  { letter: 'P', name: 'P', phonetic: 'pe', soundHint: 'como en Patita y Pez', distractors: ['B', 'D'] },
  { letter: 'S', name: 'S', phonetic: 'ese', soundHint: 'como en Sol y Sopa', distractors: ['C', 'Z'] },
  { letter: 'L', name: 'L', phonetic: 'ele', soundHint: 'como en Luna y Leche', distractors: ['I', 'T'] },
  { letter: 'T', name: 'T', phonetic: 'te', soundHint: 'como en Tazón y Tigre', distractors: ['F', 'L'] },
];

const BOWL_STYLES = [
  {
    theme: 'pink',
    name: 'Plato Rosa',
    treat: 'Galletitas de Pececito 🐟',
    icon: '🐟',
    bg: 'from-pink-100 via-rose-50 to-pink-200 border-pink-400 text-pink-700 shadow-pink-200',
    rim: 'border-pink-300 bg-pink-500',
    kibble: 'bg-amber-300',
  },
  {
    theme: 'sky',
    name: 'Plato Celeste',
    treat: 'Estrellitas Mágicas ⭐',
    icon: '⭐',
    bg: 'from-sky-100 via-blue-50 to-sky-200 border-sky-400 text-sky-700 shadow-sky-200',
    rim: 'border-sky-300 bg-sky-500',
    kibble: 'bg-yellow-300',
  },
  {
    theme: 'purple',
    name: 'Plato Violeta',
    treat: 'Leche con Corazones 🥛',
    icon: '💖',
    bg: 'from-purple-100 via-fuchsia-50 to-purple-200 border-purple-400 text-purple-700 shadow-purple-200',
    rim: 'border-purple-300 bg-purple-500',
    kibble: 'bg-pink-300',
  },
];

export default function Level2FeedKitty({ onCompleteLevel, onGoToLevel3 }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4 for M, P, S, L, T
  const [bowls, setBowls] = useState([]);
  const [dialogue, setDialogue] = useState(
    '¡Cristal, los gatitos tienen hambre! ¿Me ayudas a encontrar el plato con la letra correcta?'
  );
  const [wobbleIndex, setWobbleIndex] = useState(null);
  const [celebratingIndex, setCelebratingIndex] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEating, setIsEating] = useState(false);

  const currentTarget = TARGET_LETTERS[currentStep];

  // Requirement:
  // "Al entrar al nivel, el audio de la gatita guía debe decir:
  // '¡Cristal, los gatitos tienen hambre! ¿Me ayudas a encontrar el plato con la letra correcta?'."
  useEffect(() => {
    const welcomeText =
      '¡Cristal, los gatitos tienen hambre! ¿Me ayudas a encontrar el plato con la letra correcta?';
    setDialogue(welcomeText);

    const timer = setTimeout(() => {
      kittenVoice.speak(welcomeText);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Setup bowls whenever currentStep changes
  useEffect(() => {
    if (isCompleted || !currentTarget) return;

    // Create 3 bowl options: 1 correct + 2 distractors, shuffled
    const options = [
      { letter: currentTarget.letter, isCorrect: true },
      { letter: currentTarget.distractors[0], isCorrect: false },
      { letter: currentTarget.distractors[1], isCorrect: false },
    ];

    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const assignedBowls = options.map((opt, idx) => ({
      ...opt,
      style: BOWL_STYLES[idx % BOWL_STYLES.length],
    }));

    setBowls(assignedBowls);
    setCelebratingIndex(null);
    setWobbleIndex(null);
    setIsEating(false);
  }, [currentStep, isCompleted]);

  // Handle clicking on a food bowl
  const handleBowlClick = (bowl, index, event) => {
    if (celebratingIndex !== null || isEating || isCompleted) return;

    if (bowl.isCorrect) {
      // Requirement:
      // "Cuando Cristal haga clic en el plato correcto, la gatita dirá con entusiasmo:
      // '¡Qué rico! ¡Gracias Cristal!'."
      playCuteMunch();
      playBellChime();
      playCuteMeow();

      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;
      fireBubbleSparkles(clickX, clickY);

      setCelebratingIndex(index);
      setIsEating(true);

      const thankYouText = '¡Qué rico! ¡Gracias Cristal!';
      setDialogue(thankYouText);

      kittenVoice.speak(thankYouText);

      const nextStep = currentStep + 1;

      // Requirement:
      // "Haz una lista fija de 5 letras (M, P, S, L, T). Al terminar las 5, desbloquea el Nivel 3."
      if (nextStep >= TARGET_LETTERS.length) {
        setTimeout(() => {
          setIsCompleted(true);
          playVictoryFanfare();
          fireVictoryConfetti();

          const victoryMessage =
            '¡Miau! ¡Los gatitos están felices y bien alimentados gracias a ti, Cristal! ¡Desbloqueaste el Nivel 3!';
          setDialogue(victoryMessage);
          kittenVoice.speak(victoryMessage);

          if (onCompleteLevel) onCompleteLevel();
        }, 1500);
      } else {
        setTimeout(() => {
          setCurrentStep(nextStep);
          // Kitten asks for next letter
          const nextLetterObj = TARGET_LETTERS[nextStep];
          const nextSpeech = `¡Ahora el gatito tiene hambre de la letra ${nextLetterObj.letter}! ¿Dónde está su plato?`;
          setDialogue(`¡Ahora el minino pide la letra ${nextLetterObj.letter}! (${nextLetterObj.soundHint})`);
          setTimeout(() => {
            kittenVoice.speak(nextSpeech);
          }, 300);
        }, 1800);
      }
    } else {
      // Non-punishing gentle wobble feedback for reading difficulties
      playSoftBounce();
      setWobbleIndex(index);
      setTimeout(() => setWobbleIndex(null), 600);

      const reminder = `¡Ese plato tiene la letra ${bowl.letter}! Recuerda Cristal: el gatito quiere comer del plato con la letra ${currentTarget.letter}.`;
      setDialogue(reminder);
      kittenVoice.speak(
        `Ese plato tiene la letra ${bowl.letter}. El gatito pide la letra ${currentTarget.letter}. ¡Vamos, tú puedes encontrarlo!`
      );
    }
  };

  const handleResetLevel = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setIsEating(false);
    setCelebratingIndex(null);
    setWobbleIndex(null);

    const welcomeText =
      '¡Cristal, los gatitos tienen hambre! ¿Me ayudas a encontrar el plato con la letra correcta?';
    setDialogue(welcomeText);
    kittenVoice.speak(welcomeText);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto">
      {/* Top Header & Level Bar */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-purple-200 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-sm">
              Nivel 2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
              <span>Alimenta al Minino</span>
              <Utensils className="w-5 h-5 text-pink-500" />
            </h2>
          </div>

          {/* Letter Progress (5 fixed letters: M, P, S, L, T) */}
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            <span className="text-xs sm:text-sm font-bold text-purple-700">Mininos felices:</span>
            <div className="flex items-center gap-1.5">
              {TARGET_LETTERS.map((item, idx) => (
                <div
                  key={item.letter}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm transition-all transform ${
                    idx < currentStep || isCompleted
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-md scale-110'
                      : idx === currentStep
                      ? 'bg-amber-400 text-amber-950 ring-4 ring-yellow-200 scale-115 animate-bounce font-black'
                      : 'bg-white border-2 border-dashed border-purple-200 text-purple-300'
                  }`}
                  title={`Letra ${item.letter}`}
                >
                  {idx < currentStep || isCompleted ? '✓' : item.letter}
                </div>
              ))}
            </div>
            <span className="font-extrabold text-purple-700 ml-1 text-sm sm:text-base">
              {Math.min(currentStep, 5)}/5
            </span>
          </div>
        </div>

        {/* Kitten Guide with Speech Bubble */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={
            isCompleted
              ? '/kitten-celebration.jpg'
              : isEating
              ? '/kitten-feeding.jpg'
              : '/kitten-guide.jpg'
          }
          onKittenClick={() => {
            playCuteMeow();
            if (currentTarget && !isCompleted) {
              kittenVoice.speak(
                `¡Cristal! El gatito tiene hambre y busca el plato con la letra ${currentTarget.letter}.`
              );
            } else {
              kittenVoice.repeat();
            }
          }}
        />
      </div>

      {/* Centerpiece: The Kitten with the Letter Sign (El gatito pide una letra en un cartel) */}
      <div className="w-full my-3 flex flex-col items-center">
        {/* Sign with Requested Letter */}
        <div className="relative group cursor-pointer mb-2 animate-float-medium">
          {/* Wooden / Pastel Cute Signboard */}
          <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-4 sm:p-6 border-4 border-amber-300 shadow-xl max-w-md mx-auto text-center relative overflow-hidden">
            {/* Cute cat ears on top of the sign */}
            <div className="absolute -top-3 left-10 w-6 h-6 bg-amber-200 border-t-2 border-l-2 border-amber-400 rotate-45 rounded-sm"></div>
            <div className="absolute -top-3 right-10 w-6 h-6 bg-amber-200 border-t-2 border-r-2 border-amber-400 -rotate-45 rounded-sm"></div>

            <p className="text-xs sm:text-sm font-black text-amber-800 tracking-wider uppercase mb-1 flex items-center justify-center gap-1.5">
              <span>🐾</span>
              <span>El gatito tiene hambre y pide la letra:</span>
              <span>🐾</span>
            </p>

            {/* Giant Target Letter displayed with both uppercase and lowercase for reading clarity */}
            <div className="flex items-center justify-center gap-3 my-2">
              <span className="text-6xl sm:text-7xl font-black text-purple-700 drop-shadow-md tracking-normal font-mono">
                {currentTarget?.letter}
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-pink-600 font-mono">
                {currentTarget?.letter.toLowerCase()}
              </span>
            </div>

            {/* Phonetic / Context Clue for Reading Support */}
            <div className="inline-flex items-center gap-1.5 bg-white/90 text-amber-900 px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-sm border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span>Pista mágica: {currentTarget?.soundHint}</span>
            </div>
          </div>
        </div>

        {/* The 3 Food Bowls (3 platos de comida con letras diferentes) */}
        <div className="w-full max-w-3xl my-4">
          <p className="text-center text-sm sm:text-base font-bold text-slate-700 mb-4 flex items-center justify-center gap-1.5">
            <span>👇</span>
            <span>Cristal, toca el plato con la letra</span>
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-lg text-lg font-black font-mono">
              {currentTarget?.letter}
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 px-2">
            {bowls.map((bowl, index) => {
              const isWobbling = wobbleIndex === index;
              const isCelebrating = celebratingIndex === index;

              return (
                <div
                  key={`${bowl.letter}-${index}`}
                  onClick={(e) => handleBowlClick(bowl, index, e)}
                  className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl border-4 cursor-pointer select-none transition-all duration-200 transform ${
                    bowl.style.bg
                  } ${
                    isWobbling
                      ? 'animate-soft-bounce ring-4 ring-yellow-400'
                      : isCelebrating
                      ? 'scale-110 ring-4 ring-emerald-400 bg-emerald-50 border-emerald-400'
                      : 'hover:scale-105 active:scale-95 hover:shadow-xl'
                  }`}
                  title={`Plato con la letra ${bowl.letter}`}
                >
                  {/* Bowl Rim & Top Food View */}
                  <div className="relative w-28 h-20 sm:w-32 sm:h-24 rounded-full bg-white/90 border-4 border-slate-200/80 shadow-inner flex flex-col items-center justify-center overflow-hidden mb-2">
                    {/* Food / Treats Inside */}
                    <div className="text-2xl sm:text-3xl mb-0.5 animate-float-slow">
                      {bowl.style.icon}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                      {bowl.style.treat}
                    </span>

                    {/* Eating Sparkle Effect */}
                    {isCelebrating && (
                      <div className="absolute inset-0 bg-emerald-400/30 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                      </div>
                    )}
                  </div>

                  {/* Bowl Base with Giant Letter Label */}
                  <div className="w-full text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md border-2 border-slate-200 font-black text-4xl sm:text-5xl font-mono text-slate-800 group-hover:text-pink-600 transition-colors">
                      {bowl.letter}
                    </div>
                    <div className="text-xs font-bold text-slate-600 mt-1">
                      Letra <span className="font-extrabold uppercase">{bowl.letter}</span>
                    </div>
                  </div>

                  {/* Positive Click Feedback Badge */}
                  {isCelebrating && (
                    <div className="absolute -top-3 bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>¡Correcto!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={handleResetLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-sm font-bold border border-purple-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-purple-500" />
          <span>Reiniciar Nivel 2</span>
        </button>

        <div className="text-xs sm:text-sm font-semibold text-purple-700 bg-purple-100/80 px-4 py-2 rounded-2xl">
          <span>Minino actual: letra {currentTarget?.letter} ({currentStep + 1} de 5) 🐾</span>
        </div>
      </div>

      {/* Victory Modal when all 5 letters are fed! */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-scale">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-purple-300 shadow-2xl overflow-hidden">
            {/* Kitten Feeding Joy Picture */}
            <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-yellow-300 shadow-xl mb-4 bg-pink-50">
              <img
                src="/kitten-feeding.jpg"
                alt="Minino feliz y bien alimentado por Cristal"
                className="w-full h-full object-cover animate-bounce"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm mb-2 border border-yellow-300">
              <Award className="w-4 h-4 text-yellow-600" />
              <span>¡Nivel 2 Superado con Éxito!</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 leading-tight mb-2">
              ¡Miau! ¡Los mininos están felices!
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-700 mb-6">
              Alimentaste a los gatitos con las 5 letras mágicas (M, P, S, L, T). ¡Eres una cuidadora genial, Cristal! 🐱💖
            </p>

            {/* List of 5 fed letters */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {TARGET_LETTERS.map((item) => (
                <div
                  key={item.letter}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md animate-pulse"
                >
                  {item.letter}
                </div>
              ))}
            </div>

            {/* Actions: Proceed to Level 3 or replay */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGoToLevel3}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold text-lg py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-all"
              >
                <span>¡Ir al Nivel 3!</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleResetLevel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base py-3.5 px-5 rounded-2xl border border-slate-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Alimentar de nuevo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
