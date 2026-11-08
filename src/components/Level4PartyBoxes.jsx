import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import KittenGuide from './KittenGuide';
import VictoryModal from './VictoryModal';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import {
  Sparkles,
  RotateCcw,
  PartyPopper,
  Volume2,
} from 'lucide-react';

// Las 4 palabras de la fiesta: GA-TO, PE-LO, LU-NA, CA-SA
const PARTY_WORDS = [
  {
    id: 1,
    word: 'GATO',
    lowerWord: 'gato',
    emoji: '🐈',
    label: 'El rey de la fiesta de los mininos',
    syllables: ['GA', 'TO'],
    scrambled: ['TO', 'GA'],
    spokenWord: 'Gato',
    winAudio: 'lvl4_word_gato',
    askAudio: 'lvl4_ask_gato',
  },
  {
    id: 2,
    word: 'PELO',
    lowerWord: 'pelo',
    emoji: '🧶',
    label: 'Suave y brillante como el de tu gatita',
    syllables: ['PE', 'LO'],
    scrambled: ['LO', 'PE'],
    spokenWord: 'Pelo',
    winAudio: 'lvl4_word_pelo',
    askAudio: 'lvl4_ask_pelo',
  },
  {
    id: 3,
    word: 'LUNA',
    lowerWord: 'luna',
    emoji: '🌙',
    label: 'Ilumina la noche de baile mágico',
    syllables: ['LU', 'NA'],
    scrambled: ['NA', 'LU'],
    spokenWord: 'Luna',
    winAudio: 'lvl4_word_luna',
    askAudio: 'lvl4_ask_luna',
  },
  {
    id: 4,
    word: 'CASA',
    lowerWord: 'casa',
    emoji: '🏠',
    label: 'El hogar feliz de Cristal y las haditas',
    syllables: ['CA', 'SA'],
    scrambled: ['SA', 'CA'],
    spokenWord: 'Casa',
    winAudio: 'lvl4_word_casa',
    askAudio: 'lvl4_ask_casa',
  },
];

const BOX_DESIGNS = [
  {
    bg: 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 border-pink-400 text-pink-700 shadow-pink-200',
  },
  {
    bg: 'bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 border-purple-400 text-purple-700 shadow-purple-200',
  },
];

export default function Level4PartyBoxes({ onRestartAll }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  const [currentStep, setCurrentStep] = useState(0); // 0 a 3 para las 4 palabras
  const [placedSyllables, setPlacedSyllables] = useState([]);
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [dialogue, setDialogue] = useState(
    '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedWords, setCompletedWords] = useState([]);

  const slotsRef = useRef(null);
  const timersRef = useRef([]);

  const currentItem = PARTY_WORDS[currentStep];

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Audio inicial al entrar al nivel
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('lvl4_intro');
    }, 350);

    return () => {
      clearTimeout(timer);
      clearAllTimers();
    };
  }, [audioManager]);

  // Inicializar las cajas disponibles para la palabra actual
  useEffect(() => {
    if (isCompleted || !currentItem) return;

    setAvailableBoxes(
      currentItem.scrambled.map((syl, idx) => ({
        id: `${syl}-${idx}-${Date.now()}`,
        syllable: syl,
        lower: syl.toLowerCase(),
        design: BOX_DESIGNS[idx % BOX_DESIGNS.length],
      }))
    );
    setPlacedSyllables([]);
    setIsEvaluating(false);
    setIsCorrect(false);
    setIsWobbling(false);
  }, [currentStep, isCompleted, currentItem]);

  // Al tocar una caja disponible abajo: pronuncia la sílaba limpia y la sube
  const handleSelectBox = (boxItem) => {
    if (isEvaluating || placedSyllables.length >= 2) return;

    const newPlaced = [...placedSyllables, boxItem];
    const newAvailable = availableBoxes.filter((b) => b.id !== boxItem.id);

    setPlacedSyllables(newPlaced);
    setAvailableBoxes(newAvailable);

    audioManager.playSFX('pop');
    // Si es la primera caja colocada, pronuncia la sílaba limpia (ej. syl_ga, syl_to)
    if (newPlaced.length === 1) {
      audioManager.playVoice(`syl_${boxItem.lower}`);
    }

    // Si ya colocó las 2 cajas, evaluar la palabra formada
    if (newPlaced.length === 2) {
      setIsEvaluating(true);
      evaluateWord(newPlaced);
    }
  };

  // Permitir devolver una caja colocada antes de poner la segunda
  const handleReturnBox = (boxItem) => {
    if (isEvaluating) return;
    setPlacedSyllables(placedSyllables.filter((b) => b.id !== boxItem.id));
    setAvailableBoxes([...availableBoxes, boxItem]);
    audioManager.playSFX('bubble');
  };

  // Evaluar si las 2 cajas forman la palabra correcta
  const evaluateWord = (placed) => {
    const formedWord = placed.map((b) => b.syllable).join('');
    const expectedWord = currentItem.syllables.join('');

    if (formedWord === expectedWord) {
      // ¡ACIERTO!
      setIsCorrect(true);
      audioManager.playSFX('celebration');
      registrarAcierto(currentItem.word);

      try {
        if (slotsRef.current) {
          const rect = slotsRef.current.getBoundingClientRect();
          fireBubbleSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      } catch (e) {
        // Ignorar
      }

      const praiseText = `¡${currentItem.spokenWord}! (${currentItem.syllables.join(
        ' - '
      )}) ¡Muy bien, Cristal!`;
      setDialogue(praiseText);
      audioManager.playVoice(currentItem.winAudio);

      const updatedWords = completedWords.includes(currentItem.word)
        ? completedWords
        : [...completedWords, currentItem.word];
      setCompletedWords(updatedWords);

      const nextStep = currentStep + 1;

      if (nextStep >= PARTY_WORDS.length) {
        const winTimer = setTimeout(() => {
          setIsCompleted(true);
          audioManager.playSFX('celebration');
          audioManager.playVoice('lvl4_win');
          try {
            fireVictoryConfetti();
          } catch (e) {
            // Ignorar
          }
        }, 2500);
        timersRef.current.push(winTimer);
      } else {
        const nextWordTimer = setTimeout(() => {
          setCurrentStep(nextStep);
          const nextWordItem = PARTY_WORDS[nextStep];
          const nextAsk = `¡Ahora ordenemos las sílabas para formar ${nextWordItem.spokenWord}! (${nextWordItem.label})`;
          setDialogue(nextAsk);
          audioManager.playVoice(nextWordItem.askAudio);
        }, 2600);
        timersRef.current.push(nextWordTimer);
      }
    } else {
      // ORDEN INVERTIDO: Regresar cajas suavemente con ánimo dulce
      setIsWobbling(true);
      audioManager.playSFX('wobble');
      registrarFallo(currentItem.word);

      const comfortingText =
        'No pasa nada, Cristal, ¡vamos a intentarlo otra vez!';
      setDialogue(comfortingText);
      audioManager.playVoice('lvl4_wrong');

      const resetTimer = setTimeout(() => {
        setAvailableBoxes(
          currentItem.scrambled.map((syl, idx) => ({
            id: `${syl}-${idx}-${Date.now()}`,
            syllable: syl,
            lower: syl.toLowerCase(),
            design: BOX_DESIGNS[idx % BOX_DESIGNS.length],
          }))
        );
        setPlacedSyllables([]);
        setIsWobbling(false);
        setIsEvaluating(false);
      }, 1500);
      timersRef.current.push(resetTimer);
    }
  };

  const handleJumpToWord = (idx) => {
    clearAllTimers();
    const targetWord = PARTY_WORDS[idx];
    setCurrentStep(idx);
    setDialogue(
      `¡Ordenemos las sílabas para formar ${targetWord.spokenWord}! (${targetWord.label})`
    );
    audioManager.playSFX('bubble');
    audioManager.playVoice(targetWord.askAudio);
  };

  const handleResetLevel = () => {
    clearAllTimers();
    setCurrentStep(0);
    setCompletedWords([]);
    setIsCompleted(false);
    setIsEvaluating(false);
    setIsCorrect(false);
    setIsWobbling(false);

    const welcome =
      '¡Cristal, es hora de la fiesta gatuna! Ayúdame a ordenar las cajas para descubrir las palabras mágicas.';
    setDialogue(welcome);
    audioManager.playVoice('lvl4_intro');
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[88vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto select-none">
      {/* HEADER SUPERIOR Y PROGRESO */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 border-2 border-amber-200 shadow-sm mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioManager.playSFX('bubble');
                if (onRestartAll) onRestartAll();
                else navegarA('map');
              }}
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
            >
              ← Mapa
            </button>
            <span className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm px-3 py-1 rounded-xl shadow-sm flex items-center gap-1">
              <PartyPopper className="w-4 h-4" />
              Isla 8
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-1.5">
              <span>Fiesta de Lectura</span>
              <span>🎁🎈</span>
            </h2>
          </div>

          {/* Progreso de las 4 Palabras (Clicables) */}
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 hidden sm:inline">Palabras:</span>
            <div className="flex items-center gap-1">
              {PARTY_WORDS.map((w, idx) => {
                const isDone =
                  completedWords.includes(w.word) ||
                  idx < currentStep ||
                  isCompleted;
                const isCurrent = idx === currentStep;

                return (
                  <button
                    key={w.word}
                    type="button"
                    onClick={() => handleJumpToWord(idx)}
                    className={`px-2.5 py-1 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-yellow-300 scale-110 shadow-sm'
                        : isDone
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm'
                        : 'bg-white border border-amber-300 text-amber-700'
                    }`}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>
            <span className="font-extrabold text-amber-800 ml-1 text-xs sm:text-sm">
              {Math.min(completedWords.length, 4)}/4
            </span>
          </div>
        </div>

        {/* Guía con Hadita Lulú Realista */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={isCorrect || isCompleted ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
          onKittenClick={() => {
            audioManager.playVoice(currentItem.askAudio);
          }}
        />
      </div>

      {/* ESCENARIO PRINCIPAL DE LA FIESTA DE PALABRAS */}
      <div className="relative w-full my-2 min-h-[390px] rounded-3xl bg-gradient-to-b from-amber-100/80 via-pink-100/70 to-purple-100/80 border-4 border-white shadow-lg flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
        {/* Globos y destellos festivos */}
        <div className="absolute top-2 left-5 text-2xl sm:text-3xl pointer-events-none">
          🎈
        </div>
        <div className="absolute top-3 right-6 text-2xl sm:text-3xl pointer-events-none">
          ✨
        </div>

        {/* Imagen / Emoji de la palabra + Botón para escuchar */}
        <div className="text-center z-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => audioManager.playVoice(currentItem.askAudio)}
            className="cursor-pointer w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-lg border-4 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl hover:scale-105 active:scale-95 transition-transform mb-1.5"
            title="Toca para escuchar la palabra objetivo"
          >
            {currentItem?.emoji}
          </button>
          <button
            type="button"
            onClick={() => audioManager.playVoice(currentItem.askAudio)}
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-black text-purple-900 bg-white/85 px-3.5 py-1 rounded-full border border-purple-200 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-pink-600" />
            <span>
              Forma: {currentItem?.word} ({currentItem?.lowerWord})
            </span>
          </button>
        </div>

        {/* CASILLAS DE DESTINO: Donde se colocan las 2 sílabas (SIN ETIQUETA QUE TAPE EL TEXTO) */}
        <div
          ref={slotsRef}
          className="w-full max-w-md my-3 flex items-center justify-center gap-4 sm:gap-6 z-10"
        >
          {[0, 1].map((slotIndex) => {
            const placedBox = placedSyllables[slotIndex];

            return (
              <button
                key={slotIndex}
                type="button"
                onClick={() => placedBox && handleReturnBox(placedBox)}
                className={`relative w-32 h-28 sm:w-40 sm:h-32 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center justify-center select-none cursor-pointer ${
                  placedBox
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 ring-4 ring-emerald-300 shadow-xl'
                      : isWobbling
                      ? 'bg-rose-100 border-rose-400 text-rose-800 animate-wiggle ring-4 ring-rose-300'
                      : 'bg-white border-pink-400 text-pink-700 shadow-xl'
                    : 'bg-white/70 border-dashed border-purple-300 text-purple-400'
                }`}
                title={
                  placedBox
                    ? 'Toca para devolver esta sílaba'
                    : `Espacio para sílaba ${slotIndex + 1}`
                }
              >
                {placedBox ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black tracking-wide leading-none">
                        {placedBox.syllable}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold opacity-85 leading-none">
                        {placedBox.lower}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60 mt-1">
                      toca para cambiar
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-2 opacity-75">
                    <span className="text-2xl sm:text-3xl">🎁</span>
                    <span className="text-xs font-extrabold text-purple-500 mt-1">
                      Sílaba {slotIndex + 1}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SÍLABAS PARA ELEGIR ABAJO: 100% DESPEJADAS SIN NINGÚN CÍRCULO "CAJA" ENCIMA */}
        <div className="w-full max-w-md text-center z-10">
          <p className="text-xs sm:text-sm font-extrabold text-purple-900 mb-2 flex items-center justify-center gap-1.5">
            <span>👇</span>
            <span>Cristal, toca las sílabas en orden para formar {currentItem?.word}:</span>
          </p>

          <div className="flex items-center justify-center gap-5 sm:gap-8 min-h-[115px]">
            {availableBoxes.map((boxItem) => (
              <button
                key={boxItem.id}
                type="button"
                onClick={() => handleSelectBox(boxItem)}
                className={`relative w-32 h-28 sm:w-36 sm:h-32 rounded-3xl border-4 flex flex-col items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer ${boxItem.design.bg}`}
                title={`Elegir la sílaba ${boxItem.syllable}`}
              >
                {/* Sílaba completamente despejada y grande en Mayúscula y Minúscula */}
                <div className="flex items-baseline justify-center gap-2">
                  <span className="font-black text-4xl sm:text-5xl leading-none tracking-wide">
                    {boxItem.syllable}
                  </span>
                  <span className="font-bold text-2xl sm:text-3xl opacity-85 leading-none">
                    {boxItem.lower}
                  </span>
                </div>

                <span className="mt-2 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/80 text-purple-800 shadow-sm">
                  ▲ Toca para subir
                </span>
              </button>
            ))}

            {availableBoxes.length === 0 && !isCorrect && (
              <div className="text-sm font-bold text-purple-700 animate-pulse">
                ✨ Comprobando la palabra mágica...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTROLES INFERIORES */}
      <div className="flex items-center justify-between w-full pt-1">
        <button
          type="button"
          onClick={handleResetLevel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold border border-amber-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-amber-500" />
          <span>Reiniciar Fiesta</span>
        </button>

        <div className="text-xs sm:text-sm font-extrabold text-amber-900 bg-amber-100/90 px-4 py-2 rounded-2xl border border-amber-200">
          <span>
            Palabra {currentStep + 1} de 4: {currentItem?.spokenWord} (
            {currentItem?.syllables.join(' + ')}) 🐈🎁
          </span>
        </div>
      </div>

      {/* PANTALLA DE VICTORIA FINAL */}
      {isCompleted && (
        <VictoryModal
          title="¡Lo lograste, Cristal!"
          subtitle="¡Formaste GATO, PELO, LUNA y CASA! Eres una gran campeona de la lectura."
          levelIdToUnlock="mision8"
          yarnReward={5}
          onReturnToMap={() => {
            if (onRestartAll) onRestartAll();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
