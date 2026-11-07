import React, { useState, useEffect } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { playBellChime, playSoftBounce, playVictoryFanfare, playCuteMeow } from '../utils/soundEffects';
import { fireVictoryConfetti, fireBubbleSparkles } from '../utils/confetti';
import { Sparkles, Star, Award, RotateCcw, ArrowLeft, Heart } from 'lucide-react';

const PUZZLES = [
  {
    id: 1,
    word: 'GATO',
    clue: '🐱',
    label: 'El animalito mágico que hace miau',
    parts: ['G', '_', 'T', 'O'],
    missingIndex: 1,
    correctVowel: 'A',
    options: ['E', 'A', 'U'],
  },
  {
    id: 2,
    word: 'LUNA',
    clue: '🌙',
    label: 'Brilla en la noche en el cielo',
    parts: ['L', '_', 'N', 'A'],
    missingIndex: 1,
    correctVowel: 'U',
    options: ['O', 'I', 'U'],
  },
  {
    id: 3,
    word: 'SOL',
    clue: '☀️',
    label: 'Nos da luz y calor cada día',
    parts: ['S', '_', 'L'],
    missingIndex: 1,
    correctVowel: 'O',
    options: ['A', 'O', 'E'],
  },
  {
    id: 4,
    word: 'MIAU',
    clue: '🐾',
    label: 'La voz mágica de tu gatita',
    parts: ['M', '_', 'A', 'U'],
    missingIndex: 1,
    correctVowel: 'I',
    options: ['I', 'O', 'E'],
  },
  {
    id: 5,
    word: 'ESTRELLA',
    clue: '⭐',
    label: 'Pide un deseo mágico brillante',
    parts: ['_', 'S', 'T', 'R', 'E', 'L', 'L', 'A'],
    missingIndex: 0,
    correctVowel: 'E',
    options: ['A', 'E', 'U'],
  },
];

export default function Level3MagicWords({ onBackToLevel2 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedWords, setSolvedWords] = useState([]);
  const [selectedVowel, setSelectedVowel] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dialogue, setDialogue] = useState(
    '¡Bienvenida al Nivel 3, Cristal! Elige la vocal que falta para completar la palabra mágica.'
  );

  const currentPuzzle = PUZZLES[currentIndex];

  useEffect(() => {
    const welcome =
      '¡Bienvenida al Nivel 3, Cristal! Elige la vocal mágica que completa la palabra.';
    setDialogue(welcome);
    setTimeout(() => {
      kittenVoice.speak(welcome);
    }, 400);
  }, []);

  const handleSelectOption = (vowel, event) => {
    setSelectedVowel(vowel);

    if (vowel === currentPuzzle.correctVowel) {
      playBellChime();
      playCuteMeow();

      const rect = event.currentTarget.getBoundingClientRect();
      fireBubbleSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);

      const completedWord = currentPuzzle.word;
      const praise = `¡Sí! ¡La palabra es ${completedWord}! ¡Muy bien leído, Cristal!`;
      setDialogue(praise);
      kittenVoice.speak(`¡Excelente! ¡${completedWord}! ¡Muy bien leído Cristal!`);

      if (!solvedWords.includes(currentPuzzle.id)) {
        setSolvedWords((prev) => [...prev, currentPuzzle.id]);
      }

      setTimeout(() => {
        if (currentIndex < PUZZLES.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedVowel(null);
        } else {
          setIsCompleted(true);
          playVictoryFanfare();
          fireVictoryConfetti();
          const finalSpeech =
            '¡Felicidades Cristal! ¡Completaste todos los niveles de los Gatitos Mágicos! ¡Eres una súper lectora!';
          setDialogue(finalSpeech);
          kittenVoice.speak(finalSpeech);
        }
      }, 1500);
    } else {
      playSoftBounce();
      const retryText = `Casi, Cristal. Probemos otra vocal para completar la palabra.`;
      setDialogue(retryText);
      kittenVoice.speak(`Casi, Cristal. Prueba con otra vocal para formar la palabra.`);
      setTimeout(() => setSelectedVowel(null), 800);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSolvedWords([]);
    setSelectedVowel(null);
    setIsCompleted(false);
    const msg = '¡Vamos a practicar de nuevo las palabras mágicas, Cristal!';
    setDialogue(msg);
    kittenVoice.speak(msg);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-2 px-3 sm:px-6 w-full max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/85 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-indigo-200 shadow-sm mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-sm">
              Nivel 3
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-wide">
              Palabras Mágicas 🐱📖
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToLevel2}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Nivel 2</span>
            </button>
          </div>
        </div>

        {/* Kitten Guide with Speech Bubble */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={isCompleted ? '/kitten-celebration.jpg' : '/kitten-guide.jpg'}
        />
      </div>

      {/* Main Puzzle Card */}
      <div className="w-full my-4 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-4 border-indigo-200 shadow-xl text-center">
        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {PUZZLES.map((p, idx) => (
            <div
              key={p.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                idx === currentIndex
                  ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110'
                  : solvedWords.includes(p.id)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-100 text-indigo-400'
              }`}
            >
              {solvedWords.includes(p.id) ? '✓' : idx + 1}
            </div>
          ))}
        </div>

        {/* Clue Emoji & Label */}
        <div className="text-6xl sm:text-7xl mb-2 animate-float-medium select-none">
          {currentPuzzle.clue}
        </div>
        <p className="text-base sm:text-lg font-bold text-indigo-800 mb-6">
          {currentPuzzle.label}
        </p>

        {/* Word Display with Missing Vowel Slot */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          {currentPuzzle.parts.map((char, index) => {
            const isMissing = index === currentPuzzle.missingIndex;
            const isFilled = isMissing && solvedWords.includes(currentPuzzle.id);

            return (
              <div
                key={index}
                className={`w-14 h-16 sm:w-20 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-5xl font-extrabold shadow-md transition-all font-mono ${
                  isMissing
                    ? isFilled
                      ? 'bg-emerald-400 text-white border-4 border-emerald-300 animate-pop-scale'
                      : 'bg-yellow-50 text-yellow-600 border-4 border-dashed border-yellow-400 animate-pulse'
                    : 'bg-gradient-to-b from-indigo-50 to-pink-50 text-indigo-950 border-2 border-indigo-200'
                }`}
              >
                {isMissing ? (isFilled ? currentPuzzle.correctVowel : '?') : char}
              </div>
            );
          })}
        </div>

        {/* Vowel Choices */}
        <div className="max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-600 mb-3">
            ✨ Toca la vocal que completa la palabra:
          </p>
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {currentPuzzle.options.map((vowel) => {
              const isSelected = selectedVowel === vowel;
              const isCorrect = vowel === currentPuzzle.correctVowel && isSelected;

              return (
                <button
                  key={vowel}
                  onClick={(e) => handleSelectOption(vowel, e)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl font-extrabold text-3xl sm:text-4xl shadow-lg border-4 transition-all transform active:scale-95 font-mono ${
                    isCorrect
                      ? 'bg-emerald-500 border-emerald-400 text-white scale-110'
                      : 'bg-gradient-to-br from-pink-400 via-indigo-400 to-purple-500 border-white text-white hover:scale-105 hover:shadow-indigo-300'
                  }`}
                >
                  {vowel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grand Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-scale">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center border-4 border-indigo-300 shadow-2xl overflow-hidden">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-yellow-300 shadow-xl mb-4 bg-pink-50">
              <img
                src="/kitten-celebration.jpg"
                alt="Gatita Mágica Celebrando con Cristal"
                className="w-full h-full object-cover animate-bounce"
              />
            </div>

            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm mb-2 border border-yellow-300">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>¡Gran Diploma de Lectora Mágica!</span>
            </div>

            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-2">
              ¡Felicidades, Cristal! 🐱👑
            </h2>

            <p className="text-base sm:text-lg font-bold text-slate-700 mb-6">
              ¡Completaste los 3 niveles de los Gatitos Mágicos! Eres una súper campeona de la lectura.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Jugar Nivel 3 de nuevo</span>
              </button>

              <button
                onClick={onBackToLevel2}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-2xl border border-slate-200 transition-all"
              >
                <span>Ir al Nivel 2</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
