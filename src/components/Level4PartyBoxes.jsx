import React, { useState, useEffect } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { 
  playBellChime, 
  playSoftBounce, 
  playVictoryFanfare, 
  playCuteMeow 
} from '../utils/soundEffects';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import { Sparkles, Star, Award, Heart, RotateCcw, PartyPopper, Check, Gift } from 'lucide-react';

// The 4 words requested: GA-TO, PE-LO, LU-NA, CA-SA
const PARTY_WORDS = [
  {
    id: 1,
    word: 'GATO',
    emoji: '🐈',
    label: 'El rey de la fiesta de los mininos',
    syllables: ['GA', 'TO'],
    scrambled: ['TO', 'GA'],
    spokenWord: 'Gato',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 2,
    word: 'PELO',
    emoji: '🧶',
    label: 'Suave y brillante como el de tu gatita',
    syllables: ['PE', 'LO'],
    scrambled: ['LO', 'PE'],
    spokenWord: 'Pelo',
    color: 'from-amber-400 to-yellow-400',
  },
  {
    id: 3,
    word: 'LUNA',
    emoji: '🌙',
    label: 'Ilumina la noche de baile mágico',
    syllables: ['LU', 'NA'],
    scrambled: ['NA', 'LU'],
    spokenWord: 'Luna',
    color: 'from-purple-400 to-indigo-400',
  },
  {
    id: 4,
    word: 'CASA',
    emoji: '🏠',
    label: 'El hogar feliz de Cristal y los mininos',
    syllables: ['CA', 'SA'],
    scrambled: ['SA', 'CA'],
    spokenWord: 'Casa',
    color: 'from-sky-400 to-blue-400',
  },
];

const BOX_DESIGNS = [
  {
    bg: 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 border-pink-400 text-pink-700 shadow-pink-200',
    ribbon: 'bg-pink-500',
  },
  {
    bg: 'bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 border-purple-400 text-purple-700 shadow-purple-200',
    ribbon: 'bg-purple-500',
  },
];

export default function Level4PartyBoxes({ onRestartAll }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 3 for the 4 words
  const [placedSyllables, setPlacedSyllables] = useState([]); // array of syllables chosen
  const [availableBoxes, setAvailableBoxes] = useState([]); // boxes still on bottom
  const [dialogue, setDialogue] = useState(
    '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);

  const currentItem = PARTY_WORDS[currentStep];

  // Requirement:
  // "El audio inicial de la gatita debe decir:
  // '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas'."
  useEffect(() => {
    const welcome =
      '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas';
    setDialogue(welcome);

    const timer = setTimeout(() => {
      kittenVoice.speak(welcome);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  // Initialize available boxes for the current word
  useEffect(() => {
    if (isCompleted || !currentItem) return;

    setAvailableBoxes(
      currentItem.scrambled.map((syl, idx) => ({
        id: `${syl}-${idx}-${Date.now()}`,
        syllable: syl,
        design: BOX_DESIGNS[idx % BOX_DESIGNS.length],
      }))
    );
    setPlacedSyllables([]);
    setIsEvaluating(false);
    setIsCorrect(false);
    setIsWobbling(false);
  }, [currentStep, isCompleted]);

  // Handle clicking on an available box to place it
  const handleSelectBox = (boxItem) => {
    if (isEvaluating || placedSyllables.length >= 2) return;

    const newPlaced = [...placedSyllables, boxItem];
    const newAvailable = availableBoxes.filter((b) => b.id !== boxItem.id);

    setPlacedSyllables(newPlaced);
    setAvailableBoxes(newAvailable);
    playBellChime();

    // If both slots are now filled, evaluate!
    if (newPlaced.length === 2) {
      setIsEvaluating(true);
      evaluateWord(newPlaced);
    }
  };

  // Allow returning a placed box if user clicks it before second placement
  const handleReturnBox = (boxItem) => {
    if (isEvaluating) return;
    setPlacedSyllables(placedSyllables.filter((b) => b.id !== boxItem.id));
    setAvailableBoxes([...availableBoxes, boxItem]);
    playSoftBounce();
  };

  // Validation Logic
  // Requirement:
  // "al ordenar las cajas correctamente (ej. GA-TO), la voz debe leer la palabra completa con alegría: '¡Gato! ¡Muy bien, Cristal!'.
  // Si se equivoca, las cajas regresan suavemente y la voz debe sonar muy dulce y comprensiva: 'No pasa nada, Cristal, ¡vamos a intentarlo otra vez!'."
  const evaluateWord = (placed) => {
    const formedWord = placed.map((b) => b.syllable).join('');
    const expectedWord = currentItem.syllables.join('');

    if (formedWord === expectedWord) {
      // SUCCESS!
      setIsCorrect(true);
      playBellChime();
      playCuteMeow();

      // Confetti burst on the word slots
      const el = document.getElementById('slots-container');
      if (el) {
        const rect = el.getBoundingClientRect();
        fireBubbleSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }

      const praiseText = `¡${currentItem.spokenWord}! ¡Muy bien, Cristal!`;
      setDialogue(praiseText);

      kittenVoice.speak(praiseText);

      if (!completedWords.includes(currentItem.word)) {
        setCompletedWords((prev) => [...prev, currentItem.word]);
      }

      const nextStep = currentStep + 1;

      // Check if all 4 words are completed!
      if (nextStep >= PARTY_WORDS.length) {
        setTimeout(() => {
          setIsCompleted(true);
          playVictoryFanfare();
          fireVictoryConfetti();

          // Requirement:
          // "Al terminar, muestra una pantalla final de victoria con confeti y el audio final:
          // '¡Lo lograste, Cristal! Eres la mejor amiga de los gatitos. ¡Miau!'."
          const finalVictorySpeech =
            '¡Lo lograste, Cristal! Eres la mejor amiga de los gatitos. ¡Miau!';
          setDialogue(finalVictorySpeech);
          kittenVoice.speak(finalVictorySpeech);
        }, 1600);
      } else {
        // Next word
        setTimeout(() => {
          setCurrentStep(nextStep);
          const nextWordItem = PARTY_WORDS[nextStep];
          const nextAsk = `¡Ahora ordenemos las cajas para formar ${nextWordItem.spokenWord}! (${nextWordItem.label})`;
          setDialogue(nextAsk);
          setTimeout(() => {
            kittenVoice.speak(
              `¡Ahora ordenemos las cajas para formar ${nextWordItem.spokenWord}!`
            );
          }, 300);
        }, 1800);
      }
    } else {
      // MISTAKE / RETRY
      setIsWobbling(true);
      playSoftBounce();

      // Requirement:
      // "Si se equivoca, las cajas regresan suavemente y la voz debe sonar muy dulce y comprensiva:
      // 'No pasa nada, Cristal, ¡vamos a intentarlo otra vez!'."
      const comfortingText =
        'No pasa nada, Cristal, ¡vamos a intentarlo otra vez!';
      setDialogue(comfortingText);

      kittenVoice.speak(comfortingText);

      // Gently return the boxes to the bottom
      setTimeout(() => {
        setAvailableBoxes(
          currentItem.scrambled.map((syl, idx) => ({
            id: `${syl}-${idx}-${Date.now()}`,
            syllable: syl,
            design: BOX_DESIGNS[idx % BOX_DESIGNS.length],
          }))
        );
        setPlacedSyllables([]);
        setIsWobbling(false);
        setIsEvaluating(false);
      }, 1400);
    }
  };

  const handleResetLevel = () => {
    setCurrentStep(0);
    setCompletedWords([]);
    setIsCompleted(false);
    setIsEvaluating(false);
    setIsCorrect(false);
    setIsWobbling(false);

    const welcome =
      '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas';
    setDialogue(welcome);
    kittenVoice.speak(welcome);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto">
      {/* Top Header & Progress */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-amber-200 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            {onRestartAll && (
              <button
                onClick={onRestartAll}
                className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
              >
                ← Mapa
              </button>
            )}
            <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-sm flex items-center gap-1.5">
              <PartyPopper className="w-4 h-4" />
              Isla 8
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide flex items-center gap-2">
              <span>Fiesta de Lectura - Ordena las cajas</span>
              <span>🎁🎈</span>
            </h2>
          </div>

          {/* Progress of 4 Words */}
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <span className="text-xs sm:text-sm font-bold text-amber-900">Palabras mágicas:</span>
            <div className="flex items-center gap-1.5">
              {PARTY_WORDS.map((w, idx) => {
                const isDone = completedWords.includes(w.word) || idx < currentStep || isCompleted;
                const isCurrent = idx === currentStep && !isDone;

                return (
                  <div
                    key={w.word}
                    className={`px-2 py-0.5 rounded-lg font-black text-xs sm:text-sm font-mono transition-all transform ${
                      isDone
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm scale-105'
                        : isCurrent
                        ? 'bg-amber-400 text-amber-950 ring-4 ring-yellow-200 scale-110 animate-bounce'
                        : 'bg-white border-2 border-dashed border-amber-300 text-amber-300'
                    }`}
                  >
                    {w.word}
                  </div>
                );
              })}
            </div>
            <span className="font-extrabold text-amber-800 ml-1 text-sm sm:text-base">
              {Math.min(completedWords.length, 4)}/4
            </span>
          </div>
        </div>

        {/* Kitten Guide with Speech Bubble */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={
            isCompleted
              ? '/kitten-party-boxes.jpg'
              : isCorrect
              ? '/kitten-party-boxes.jpg'
              : '/kitten-guide.jpg'
          }
          onKittenClick={() => {
            playCuteMeow();
            kittenVoice.repeat();
          }}
        />
      </div>

      {/* Main Party Box Arena */}
      <div className="relative w-full my-3 min-h-[420px] rounded-3xl bg-gradient-to-b from-amber-100/70 via-pink-100/60 to-purple-100/70 border-4 border-white shadow-inner flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
        
        {/* Festive Balloons and Garlands */}
        <div className="absolute top-2 left-6 text-3xl animate-float-slow pointer-events-none select-none">
          🎈
        </div>
        <div className="absolute top-4 right-8 text-3xl animate-float-medium pointer-events-none select-none">
          ✨
        </div>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-80 h-24 bg-gradient-to-r from-amber-300/30 via-pink-300/30 to-purple-300/30 rounded-full blur-xl pointer-events-none"></div>

        {/* Word Picture & Clue (Representative Emoji) */}
        <div className="text-center z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white shadow-lg border-4 border-amber-300 flex items-center justify-center text-5xl sm:text-6xl animate-float-medium mb-2">
            {currentItem?.emoji}
          </div>
          <p className="text-base sm:text-lg font-black text-purple-900 tracking-wide">
            {currentItem?.label}
          </p>
        </div>

        {/* Target Slots: Where the boxes land to form the word */}
        <div 
          id="slots-container"
          className="w-full max-w-md my-4 flex items-center justify-center gap-4 sm:gap-6"
        >
          {[0, 1].map((slotIndex) => {
            const placedBox = placedSyllables[slotIndex];

            return (
              <div
                key={slotIndex}
                onClick={() => placedBox && handleReturnBox(placedBox)}
                className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center justify-center select-none cursor-pointer ${
                  placedBox
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 ring-4 ring-emerald-300 shadow-xl'
                      : isWobbling
                      ? 'bg-rose-100 border-rose-400 text-rose-800 animate-soft-bounce ring-4 ring-rose-300'
                      : 'bg-white border-pink-400 text-pink-700 shadow-lg scale-100'
                    : 'bg-white/60 border-dashed border-purple-300 text-purple-300'
                }`}
                title={placedBox ? 'Toca para regresar esta caja' : 'Espacio para sílaba'}
              >
                {/* Gift Bow decoration if filled */}
                {placedBox && (
                  <div className="absolute -top-3 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md animate-pop-scale">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                )}

                {placedBox ? (
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-wider drop-shadow-sm animate-pop-scale">
                    {placedBox.syllable}
                  </span>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 opacity-60">
                    <span className="text-3xl">📦</span>
                    <span className="text-xs font-bold text-purple-400 mt-1">
                      Caja {slotIndex + 1}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scrambled Boxes to choose from on the bottom */}
        <div className="w-full max-w-md text-center z-10">
          <p className="text-xs sm:text-sm font-bold text-slate-700 mb-3 flex items-center justify-center gap-1.5">
            <span>👇</span>
            <span>Cristal, toca las cajas en orden para formar la palabra:</span>
          </p>

          <div className="flex items-center justify-center gap-4 sm:gap-6 min-h-[120px]">
            {availableBoxes.map((boxItem) => (
              <button
                key={boxItem.id}
                onClick={() => handleSelectBox(boxItem)}
                className={`relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center font-black text-4xl sm:text-5xl font-mono shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer ${boxItem.design.bg}`}
                title={`Tocar la caja ${boxItem.syllable}`}
              >
                {/* Ribbon strip */}
                <div className={`absolute -top-3 px-3 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase shadow-sm ${boxItem.design.ribbon}`}>
                  Caja
                </div>

                <span>{boxItem.syllable}</span>
                <span className="text-[11px] font-bold opacity-60 tracking-normal font-sans">
                  toca para subir
                </span>
              </button>
            ))}

            {availableBoxes.length === 0 && !isCorrect && (
              <div className="text-sm font-bold text-purple-700 animate-pulse">
                ✨ Revisando las cajas mágicas...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between w-full pt-2">
        <button
          onClick={handleResetLevel}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-sm font-bold border border-amber-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <span>Reiniciar Nivel 4</span>
        </button>

        <div className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100/80 px-4 py-2 rounded-2xl">
          <span>Palabra {currentStep + 1} de 4: {currentItem?.spokenWord} 🐈🎁</span>
        </div>
      </div>

      {/* FINAL VICTORY SCREEN (GRAND CELEBRATION MODAL) */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-pop-scale">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-yellow-300 shadow-2xl overflow-hidden">
            {/* Background Festive Lights */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-pink-200 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-yellow-200 rounded-full blur-2xl pointer-events-none"></div>

            {/* Grand Party Kitten Picture */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full overflow-hidden border-4 border-yellow-300 shadow-2xl mb-4 bg-pink-50 ring-8 ring-yellow-200/50">
              <img
                src="/kitten-party-boxes.jpg"
                alt="Gatita en la Fiesta Gatuna con Cristal"
                className="w-full h-full object-cover animate-bounce"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-yellow-950 px-4 py-1.5 rounded-full font-black text-sm mb-2 shadow-sm">
              <Award className="w-5 h-5 text-yellow-900" />
              <span>👑 ¡GRAN CAMPEONA DE LA LECTURA!</span>
            </div>

            {/* Requirement statement: "¡Lo lograste, Cristal! Eres la mejor amiga de los gatitos. ¡Miau!" */}
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 leading-tight mb-2">
              ¡Lo lograste, Cristal!
            </h2>

            <p className="text-lg font-extrabold text-slate-700 mb-6">
              Eres la mejor amiga de los gatitos. ¡Miau! 🐱💖🎉
            </p>

            {/* The 4 Words Formed in the Party */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {PARTY_WORDS.map((w) => (
                <div
                  key={w.word}
                  className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-2 text-center shadow-sm"
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <p className="font-black text-purple-800 text-sm font-mono mt-1">
                    {w.word}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions: Replay or Celebrate */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleResetLevel}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white font-extrabold text-lg py-3.5 px-6 rounded-2xl shadow-xl shadow-pink-200 active:scale-95 transition-all"
              >
                <PartyPopper className="w-5 h-5" />
                <span>¡Jugar la Fiesta otra vez!</span>
              </button>

              <button
                onClick={() => {
                  if (onRestartAll) onRestartAll();
                  else handleResetLevel();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base py-3.5 px-5 rounded-2xl border border-slate-200 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
