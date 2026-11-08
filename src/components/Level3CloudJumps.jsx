import React, { useState, useEffect } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { 
  playBellChime, 
  playSoftBounce, 
  playVictoryFanfare, 
  playCuteMeow, 
  playCloudJump 
} from '../utils/soundEffects';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import { Sparkles, Star, Award, Heart, ArrowRight, RotateCcw, Cloud, Wand2 } from 'lucide-react';

// Fixed list of 5 syllable combinations requested:
// M+A, P+E, S+I, L+O, T+U
const SYLLABLE_PAIRS = [
  {
    consonant: 'M',
    vowel: 'A',
    syllable: 'MA',
    soundHint: 'como en Mamá y Mariposa 🦋',
    color: 'from-pink-400 to-rose-400',
    cloudGlow: 'shadow-pink-300',
  },
  {
    consonant: 'P',
    vowel: 'E',
    syllable: 'PE',
    soundHint: 'como en Pelota y Pececito ⚽',
    color: 'from-amber-400 to-yellow-400',
    cloudGlow: 'shadow-amber-300',
  },
  {
    consonant: 'S',
    vowel: 'I',
    syllable: 'SI',
    soundHint: 'como en Sirena y Silla 🧜‍♀️',
    color: 'from-emerald-400 to-teal-400',
    cloudGlow: 'shadow-emerald-300',
  },
  {
    consonant: 'L',
    vowel: 'O',
    syllable: 'LO',
    soundHint: 'como en Lobo y Loro 🦜',
    color: 'from-sky-400 to-blue-400',
    cloudGlow: 'shadow-sky-300',
  },
  {
    consonant: 'T',
    vowel: 'U',
    syllable: 'TU',
    soundHint: 'como en Tulipán y Tucán 🌷',
    color: 'from-purple-400 to-indigo-400',
    cloudGlow: 'shadow-purple-300',
  },
];

export default function Level3CloudJumps({ onCompleteLevel, onGoToLevel4 }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4
  const [isMerged, setIsMerged] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSyllables, setCompletedSyllables] = useState([]);
  const [dialogue, setDialogue] = useState(
    'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Vamos a formar sílabas'
  );

  const currentPair = SYLLABLE_PAIRS[currentStep];

  // Requirement:
  // "Al iniciar, el audio de la gatita guía debe instruir:
  // 'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Vamos a formar sílabas'."
  useEffect(() => {
    const welcomeInstruction =
      'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Vamos a formar sílabas';
    setDialogue(welcomeInstruction);

    const timer = setTimeout(() => {
      kittenVoice.speak(welcomeInstruction);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Handle the "¡Juntar!" button click
  const handleMergeClouds = (event) => {
    if (isMerged || isJumping || isCompleted) return;

    // Trigger spring jump sound & animations
    playCloudJump();
    setIsJumping(true);
    setIsMerged(true);

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    setTimeout(() => {
      playBellChime();
      playCuteMeow();
      fireBubbleSparkles(clickX, clickY - 60);

      // Requirement:
      // "Configura el audio para que lea la sílaba completa en voz alta (ej. '¡MA!')
      // mientras un gatito salta sobre la nube."
      const syllableText = `¡${currentPair.syllable}!`;
      setDialogue(`¡${currentPair.syllable}! ✨ Formaste la sílaba ${currentPair.syllable} (${currentPair.soundHint})`);

      kittenVoice.speak(syllableText);

      if (!completedSyllables.includes(currentPair.syllable)) {
        setCompletedSyllables((prev) => [...prev, currentPair.syllable]);
      }
    }, 350);

    // After animation, prepare next step or level completion
    setTimeout(() => {
      const nextStep = currentStep + 1;

      // Requirement:
      // "Usa las combinaciones: M+A, P+E, S+I, L+O, T+U. Al completar todas, la gatita dirá:
      // '¡Qué inteligente eres, Cristal! Ya casi llegamos a la gran fiesta', y se desbloquea el Nivel 4."
      if (nextStep >= SYLLABLE_PAIRS.length) {
        setTimeout(() => {
          setIsCompleted(true);
          playVictoryFanfare();
          fireVictoryConfetti();

          const victoryText =
            '¡Qué inteligente eres, Cristal! Ya casi llegamos a la gran fiesta';
          setDialogue(victoryText);
          kittenVoice.speak(victoryText);

          if (onCompleteLevel) onCompleteLevel();
        }, 1200);
      }
    }, 1800);
  };

  const handleNextSyllable = () => {
    if (currentStep < SYLLABLE_PAIRS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsMerged(false);
      setIsJumping(false);
      const nextPair = SYLLABLE_PAIRS[currentStep + 1];
      const nextMsg = `Ahora juntemos la nube ${nextPair.consonant} con la nube ${nextPair.vowel}. ¡Presiona Juntar!`;
      setDialogue(nextMsg);
      kittenVoice.speak(nextMsg);
    }
  };

  const handleResetLevel = () => {
    setCurrentStep(0);
    setIsMerged(false);
    setIsJumping(false);
    setIsCompleted(false);
    setCompletedSyllables([]);

    const welcomeInstruction =
      'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Vamos a formar sílabas';
    setDialogue(welcomeInstruction);
    kittenVoice.speak(welcomeInstruction);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto">
      {/* Top Header & Progress */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-sky-200 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            {onGoToLevel4 && (
              <button
                onClick={onGoToLevel4}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
              >
                ← Mapa
              </button>
            )}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-sm">
              Isla 5
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
              <span>Saltos en las Nubes</span>
              <Cloud className="w-5 h-5 text-sky-500 fill-sky-200" />
            </h2>
          </div>

          {/* 5 Syllable Progress Badges */}
          <div className="flex items-center gap-2 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
            <span className="text-xs sm:text-sm font-bold text-sky-800">Sílabas mágicas:</span>
            <div className="flex items-center gap-1.5">
              {SYLLABLE_PAIRS.map((item, idx) => {
                const isDone = completedSyllables.includes(item.syllable) || idx < currentStep || isCompleted;
                const isCurrent = idx === currentStep && !isDone;

                return (
                  <div
                    key={item.syllable}
                    className={`px-2 py-0.5 rounded-lg font-black text-xs sm:text-sm font-mono transition-all transform ${
                      isDone
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm scale-105'
                        : isCurrent
                        ? 'bg-amber-400 text-amber-950 ring-4 ring-yellow-200 scale-110 animate-bounce'
                        : 'bg-white border-2 border-dashed border-sky-300 text-sky-300'
                    }`}
                  >
                    {item.syllable}
                  </div>
                );
              })}
            </div>
            <span className="font-extrabold text-sky-700 ml-1 text-sm sm:text-base">
              {Math.min(completedSyllables.length, 5)}/5
            </span>
          </div>
        </div>

        {/* Kitten Guide with Speech Bubble */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={
            isCompleted || isJumping
              ? '/kitten-cloud-jump.jpg'
              : '/kitten-guide.jpg'
          }
          onKittenClick={() => {
            playCuteMeow();
            if (isMerged) {
              kittenVoice.speak(`¡${currentPair.syllable}!`);
            } else {
              kittenVoice.speak(
                `Cristal, pulsa el botón ¡Juntar! para unir la ${currentPair.consonant} y la ${currentPair.vowel}.`
              );
            }
          }}
        />
      </div>

      {/* Main Interactive Cloud Arena */}
      <div className="relative w-full my-3 min-h-[380px] sm:min-h-[420px] rounded-3xl bg-gradient-to-b from-sky-200/70 via-pink-100/60 to-purple-100/70 border-4 border-white shadow-inner flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        
        {/* Background Rainbow & Stars */}
        <div className="absolute top-4 left-8 text-yellow-300 opacity-60 pointer-events-none animate-star-twinkle">
          <Star className="w-8 h-8 fill-yellow-200" />
        </div>
        <div className="absolute top-10 right-10 text-pink-300 opacity-70 pointer-events-none animate-star-twinkle delay-700">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-r from-pink-300/40 via-yellow-200/40 to-sky-300/40 rounded-full blur-xl pointer-events-none"></div>

        {/* Jumping Kitten Character on Top of the Clouds */}
        <div className="relative h-28 sm:h-36 flex items-center justify-center z-20">
          <div
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 transform ${
              isJumping
                ? 'scale-125 -translate-y-6 rotate-6 animate-bounce ring-4 ring-yellow-300'
                : 'animate-float-slow'
            }`}
          >
            <img
              src="/kitten-cloud-jump.jpg"
              alt="Gatita saltarina de las nubes"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Jump Sound & Sparkle Badge */}
          {isJumping && (
            <div className="absolute -top-2 right-4 bg-yellow-400 text-yellow-950 font-black text-xs px-3 py-1 rounded-full shadow-lg animate-pop-scale flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>¡SALTO MÁGICO!</span>
            </div>
          )}
        </div>

        {/* The Two Clouds (Separate vs Merged) */}
        <div className="w-full max-w-2xl my-3 flex items-center justify-center min-h-[160px] relative">
          
          {/* SEPARATE CLOUDS STATE */}
          {!isMerged && (
            <div className="flex items-center justify-center gap-6 sm:gap-14 w-full transition-all duration-500">
              {/* Cloud 1: Consonant */}
              <div className="relative group animate-float-medium">
                {/* Cloud fluffy styling */}
                <div className="relative w-36 sm:w-44 h-28 sm:h-32 bg-white/95 rounded-full border-4 border-sky-200 shadow-xl flex items-center justify-center p-3 bubble-glow">
                  {/* Fluffy cloud lobes */}
                  <div className="absolute -top-4 left-4 w-16 h-16 bg-white/95 rounded-full border-t-4 border-l-4 border-sky-200 pointer-events-none"></div>
                  <div className="absolute -top-6 right-6 w-20 h-20 bg-white/95 rounded-full border-t-4 border-r-4 border-sky-200 pointer-events-none"></div>

                  <div className="relative z-10 text-center">
                    <span className="text-5xl sm:text-6xl font-black text-sky-700 font-mono drop-shadow-sm">
                      {currentPair.consonant}
                    </span>
                    <span className="block text-xs font-bold text-sky-600 uppercase tracking-wider">
                      Consonante
                    </span>
                  </div>
                </div>
              </div>

              {/* Magical Plus Indicator between clouds */}
              <div className="flex flex-col items-center justify-center z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-2xl flex items-center justify-center shadow-lg animate-pulse">
                  +
                </div>
              </div>

              {/* Cloud 2: Vowel */}
              <div className="relative group animate-float-slow">
                <div className="relative w-36 sm:w-44 h-28 sm:h-32 bg-white/95 rounded-full border-4 border-pink-200 shadow-xl flex items-center justify-center p-3 bubble-glow">
                  <div className="absolute -top-4 left-4 w-16 h-16 bg-white/95 rounded-full border-t-4 border-l-4 border-pink-200 pointer-events-none"></div>
                  <div className="absolute -top-6 right-6 w-20 h-20 bg-white/95 rounded-full border-t-4 border-r-4 border-pink-200 pointer-events-none"></div>

                  <div className="relative z-10 text-center">
                    <span className="text-5xl sm:text-6xl font-black text-pink-600 font-mono drop-shadow-sm">
                      {currentPair.vowel}
                    </span>
                    <span className="block text-xs font-bold text-pink-500 uppercase tracking-wider">
                      Vocal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MERGED CLOUD STATE */}
          {isMerged && (
            <div 
              onClick={() => {
                playBellChime();
                kittenVoice.speak(`¡${currentPair.syllable}!`);
              }}
              className="relative cursor-pointer animate-pop-scale"
              title="¡Toca para escuchar la sílaba de nuevo!"
            >
              {/* Giant Glowing Cloud */}
              <div className="relative w-64 sm:w-80 h-32 sm:h-36 bg-gradient-to-r from-white via-pink-50 to-white rounded-full border-4 border-yellow-300 shadow-2xl flex items-center justify-center p-4 ring-8 ring-yellow-200/60">
                <div className="absolute -top-6 left-8 w-24 h-24 bg-white rounded-full border-t-4 border-l-4 border-yellow-300 pointer-events-none"></div>
                <div className="absolute -top-8 right-10 w-28 h-28 bg-white rounded-full border-t-4 border-r-4 border-yellow-300 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-yellow-400 animate-spin" />
                    <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 font-mono tracking-widest drop-shadow-sm">
                      {currentPair.syllable}
                    </span>
                    <Sparkles className="w-7 h-7 text-yellow-400 animate-spin" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-purple-700 mt-1">
                    ✨ ¡Sílabas Mágicas: {currentPair.syllable}! ✨
                  </span>
                </div>
              </div>

              {/* Sound clue */}
              <div className="text-center mt-3">
                <span className="inline-block bg-white/90 text-purple-800 text-xs sm:text-sm font-bold px-4 py-1 rounded-full shadow-sm border border-purple-200">
                  {currentPair.soundHint}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: "¡Juntar!" or "¡Siguiente Nube!" */}
        <div className="mt-4 z-20 flex flex-col sm:flex-row items-center gap-3">
          {!isMerged ? (
            <button
              onClick={handleMergeClouds}
              className="group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-3xl font-black text-xl sm:text-2xl text-white bg-gradient-to-r from-sky-500 via-pink-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 shadow-xl shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
            >
              <Wand2 className="w-6 h-6 text-yellow-300 group-hover:rotate-45 transition-transform" />
              <span>¡Juntar!</span>
              <Sparkles className="w-6 h-6 text-yellow-300 group-hover:scale-125 transition-transform" />
            </button>
          ) : currentStep < SYLLABLE_PAIRS.length - 1 ? (
            <button
              onClick={handleNextSyllable}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-3xl font-extrabold text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              <span>¡Siguiente Nube!</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="bg-emerald-100 text-emerald-800 font-extrabold px-6 py-2 rounded-2xl border border-emerald-300 text-sm">
              🌟 ¡Completaste todas las combinaciones de nubes!
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={handleResetLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-sm font-bold border border-sky-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-sky-500" />
          <span>Reiniciar Nivel 3</span>
        </button>

        <div className="text-xs sm:text-sm font-semibold text-sky-800 bg-sky-100/80 px-4 py-2 rounded-2xl">
          <span>Combinación {currentStep + 1} de 5: {currentPair.consonant} + {currentPair.vowel} = {currentPair.syllable} ☁️</span>
        </div>
      </div>

      {/* Victory Modal when all 5 syllables are formed! */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-scale">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-sky-300 shadow-2xl overflow-hidden">
            {/* Kitten on Rainbow Cloud Picture */}
            <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border-4 border-yellow-300 shadow-xl mb-4 bg-sky-50">
              <img
                src="/kitten-cloud-jump.jpg"
                alt="Gatita feliz saltando sobre las nubes"
                className="w-full h-full object-cover animate-bounce"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm mb-2 border border-yellow-300">
              <Award className="w-4 h-4 text-yellow-600" />
              <span>¡Nivel 3 Superado con Éxito!</span>
            </div>

            {/* Requirement audio statement shown in text */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-purple-600 to-pink-600 leading-tight mb-2">
              ¡Qué inteligente eres, Cristal!
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-700 mb-6">
              Ya casi llegamos a la gran fiesta. ¡Uniste todas las nubes mágicas y formaste las sílabas a la perfección! ☁️✨
            </p>

            {/* Syllables Ribbon */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {SYLLABLE_PAIRS.map((item) => (
                <div
                  key={item.syllable}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-sky-400 to-purple-500 text-white font-black text-base font-mono shadow-md"
                >
                  {item.syllable}
                </div>
              ))}
            </div>

            {/* Actions: Next Level 4 or replay */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGoToLevel4}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white font-extrabold text-lg py-3.5 px-6 rounded-2xl shadow-lg shadow-sky-200 active:scale-95 transition-all"
              >
                <span>¡Ir al Nivel 4!</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleResetLevel}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base py-3.5 px-5 rounded-2xl border border-slate-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Saltar de nuevo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
