import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import KittenGuide from './KittenGuide';
import VictoryModal from './VictoryModal';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import {
  RotateCcw,
  PartyPopper,
  Volume2,
  ArrowRight,
} from 'lucide-react';

// 4 NIVELES DE CAJAS PROGRESIVAS: 2 Sílabas, Más 2 Sílabas, 3 Sílabas y 4 Sílabas
const PARTY_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: 2 Sílabas (Inicial)',
    words: [
      { word: 'GATO', lowerWord: 'gato', emoji: '🐈', label: 'El rey de la fiesta de los mininos', syllables: ['GA', 'TO'], scrambled: ['TO', 'GA'], spokenWord: 'Gato', winAudio: 'lvl4_word_gato' },
      { word: 'PELO', lowerWord: 'pelo', emoji: '🧶', label: 'Suave y brillante como el de tu gatita', syllables: ['PE', 'LO'], scrambled: ['LO', 'PE'], spokenWord: 'Pelo', winAudio: 'lvl4_word_pelo' },
      { word: 'LUNA', lowerWord: 'luna', emoji: '🌙', label: 'Ilumina la noche de baile mágico', syllables: ['LU', 'NA'], scrambled: ['NA', 'LU'], spokenWord: 'Luna', winAudio: 'lvl4_word_luna' },
      { word: 'CASA', lowerWord: 'casa', emoji: '🏠', label: 'El hogar feliz de Cristal y las haditas', syllables: ['CA', 'SA'], scrambled: ['SA', 'CA'], spokenWord: 'Casa', winAudio: 'lvl4_word_casa' },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: 2 Sílabas (D, N, B, F, R, V)',
    words: [
      { word: 'DADO', lowerWord: 'dado', emoji: '🎲', label: 'Cubo mágico para jugar', syllables: ['DA', 'DO'], scrambled: ['DO', 'DA'], spokenWord: 'Dado', winAudio: 'word_dado' },
      { word: 'NUBE', lowerWord: 'nube', emoji: '☁️', label: 'Suave y blanca en el cielo', syllables: ['NU', 'BE'], scrambled: ['BE', 'NU'], spokenWord: 'Nube', winAudio: 'word_nube' },
      { word: 'BOTA', lowerWord: 'bota', emoji: '👢', label: 'Calzado para saltar charcos', syllables: ['BO', 'TA'], scrambled: ['TA', 'BO'], spokenWord: 'Bota', winAudio: 'word_bota' },
      { word: 'FOCA', lowerWord: 'foca', emoji: '🦭', label: 'Aplaude feliz en el mar', syllables: ['FO', 'CA'], scrambled: ['CA', 'FO'], spokenWord: 'Foca', winAudio: 'word_foca' },
      { word: 'ROSA', lowerWord: 'rosa', emoji: '🌹', label: 'Flor hermosa y perfumada', syllables: ['RO', 'SA'], scrambled: ['SA', 'RO'], spokenWord: 'Rosa', winAudio: 'word_rosa' },
      { word: 'VACA', lowerWord: 'vaca', emoji: '🐮', label: 'Nos da leche en la granja', syllables: ['VA', 'CA'], scrambled: ['CA', 'VA'], spokenWord: 'Vaca', winAudio: 'word_vaca' },
      { word: 'VELA', lowerWord: 'vela', emoji: '🕯️', label: 'Brilla en el pastel de fiesta', syllables: ['VE', 'LA'], scrambled: ['LA', 'VE'], spokenWord: 'Vela', winAudio: 'word_vela' },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: 3 Sílabas (Trisílabas)',
    words: [
      { word: 'PELOTA', lowerWord: 'pelota', emoji: '⚽', label: 'Tres sílabas: PE - LO - TA', syllables: ['PE', 'LO', 'TA'], scrambled: ['TA', 'PE', 'LO'], spokenWord: 'Pelota', winAudio: 'word_pelota' },
      { word: 'PALOMA', lowerWord: 'paloma', emoji: '🕊️', label: 'Tres sílabas: PA - LO - MA', syllables: ['PA', 'LO', 'MA'], scrambled: ['MA', 'PA', 'LO'], spokenWord: 'Paloma', winAudio: 'word_paloma' },
      { word: 'CAMISA', lowerWord: 'camisa', emoji: '👕', label: 'Tres sílabas: CA - MI - SA', syllables: ['CA', 'MI', 'SA'], scrambled: ['SA', 'CA', 'MI'], spokenWord: 'Camisa', winAudio: 'word_camisa' },
      { word: 'MALETA', lowerWord: 'maleta', emoji: '🧳', label: 'Tres sílabas: MA - LE - TA', syllables: ['MA', 'LE', 'TA'], scrambled: ['TA', 'MA', 'LE'], spokenWord: 'Maleta', winAudio: 'word_maleta' },
      { word: 'TOMATE', lowerWord: 'tomate', emoji: '🍅', label: 'Tres sílabas: TO - MA - TE', syllables: ['TO', 'MA', 'TE'], scrambled: ['TE', 'TO', 'MA'], spokenWord: 'Tomate', winAudio: 'word_tomate' },
      { word: 'ZAPATO', lowerWord: 'zapato', emoji: '👟', label: 'Tres sílabas: ZA - PA - TO', syllables: ['ZA', 'PA', 'TO'], scrambled: ['TO', 'ZA', 'PA'], spokenWord: 'Zapato', winAudio: 'word_zapato' },
      { word: 'CONEJO', lowerWord: 'conejo', emoji: '🐰', label: 'Tres sílabas: CO - NE - JO', syllables: ['CO', 'NE', 'JO'], scrambled: ['JO', 'CO', 'NE'], spokenWord: 'Conejo', winAudio: 'word_conejo' },
      { word: 'JIRAFA', lowerWord: 'jirafa', emoji: '🦒', label: 'Tres sílabas: JI - RA - FA', syllables: ['JI', 'RA', 'FA'], scrambled: ['FA', 'JI', 'RA'], spokenWord: 'Jirafa', winAudio: 'word_jirafa' },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: 4 Sílabas (Polisílabas)',
    words: [
      { word: 'MARIPOSA', lowerWord: 'mariposa', emoji: '🦋', label: 'Cuatro sílabas: MA - RI - PO - SA', syllables: ['MA', 'RI', 'PO', 'SA'], scrambled: ['PO', 'MA', 'SA', 'RI'], spokenWord: 'Mariposa', winAudio: 'word_mariposa' },
      { word: 'CARAMELO', lowerWord: 'caramelo', emoji: '🍬', label: 'Cuatro sílabas: CA - RA - ME - LO', syllables: ['CA', 'RA', 'ME', 'LO'], scrambled: ['ME', 'CA', 'LO', 'RA'], spokenWord: 'Caramelo', winAudio: 'word_caramelo' },
      { word: 'ELEFANTE', lowerWord: 'elefante', emoji: '🐘', label: 'Cuatro sílabas: E - LE - FAN - TE', syllables: ['E', 'LE', 'FAN', 'TE'], scrambled: ['FAN', 'E', 'TE', 'LE'], spokenWord: 'Elefante', winAudio: 'word_elefante' },
      { word: 'BICICLETA', lowerWord: 'bicicleta', emoji: '🚲', label: 'Cuatro sílabas: BI - CI - CLE - TA', syllables: ['BI', 'CI', 'CLE', 'TA'], scrambled: ['CLE', 'BI', 'TA', 'CI'], spokenWord: 'Bicicleta', winAudio: 'word_bicicleta' },
      { word: 'CHOCOLATE', lowerWord: 'chocolate', emoji: '🍫', label: 'Cuatro sílabas: CHO - CO - LA - TE', syllables: ['CHO', 'CO', 'LA', 'TE'], scrambled: ['LA', 'CHO', 'TE', 'CO'], spokenWord: 'Chocolate', winAudio: 'word_chocolate' },
    ],
  },
];

const BOX_DESIGNS = [
  { bg: 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 border-pink-400 text-pink-700 shadow-pink-200' },
  { bg: 'bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-200 border-purple-400 text-purple-700 shadow-purple-200' },
  { bg: 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 border-amber-400 text-amber-800 shadow-amber-200' },
  { bg: 'bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200 border-sky-400 text-sky-800 shadow-sky-200' },
];

export default function Level4PartyBoxes({ onRestartAll }) {
  const { audioManager, registrarAcierto, registrarFallo, sumarOvillos, navegarA } = useGame();

  const [levelIdx, setLevelIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [placedSyllables, setPlacedSyllables] = useState([]);
  const [availableBoxes, setAvailableBoxes] = useState([]);
  const [dialogue, setDialogue] = useState(
    '¡Cristal, es hora de la fiesta de lectura! Ordena las sílabas para descubrir palabras de 2, 3 y 4 sílabas.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWobbling, setIsWobbling] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [isCompletedAll, setIsCompletedAll] = useState(false);

  const slotsRef = useRef(null);
  const timersRef = useRef([]);

  const currentLevel = PARTY_LEVELS[levelIdx];
  const currentItem = currentLevel.words[currentStep] || currentLevel.words[0];
  const numSlots = currentItem.syllables.length;

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Inicializar las cajas disponibles para la palabra actual y pronunciar
  useEffect(() => {
    if (isCompletedAll || levelModal || !currentItem) return;
    clearAllTimers();

    setAvailableBoxes(
      currentItem.scrambled.map((syl, idx) => ({
        id: `${syl}-${idx}-${Date.now()}-${Math.random()}`,
        syllable: syl,
        lower: syl.toLowerCase(),
        design: BOX_DESIGNS[idx % BOX_DESIGNS.length],
      }))
    );
    setPlacedSyllables([]);
    setIsEvaluating(false);
    setIsCorrect(false);
    setIsWobbling(false);

    const t = setTimeout(() => {
      audioManager.playVoice(currentItem.winAudio);
    }, 300);
    timersRef.current.push(t);

    return () => clearAllTimers();
  }, [levelIdx, currentStep, isCompletedAll, levelModal, currentItem, audioManager]);

  const handleSelectBox = (boxItem) => {
    if (isEvaluating || placedSyllables.length >= numSlots) return;

    const newPlaced = [...placedSyllables, boxItem];
    const newAvailable = availableBoxes.filter((b) => b.id !== boxItem.id);

    setPlacedSyllables(newPlaced);
    setAvailableBoxes(newAvailable);
    audioManager.playSFX('pop');

    if (newPlaced.length < numSlots) {
      // Si aún faltan sílabas por colocar, pronuncia la sílaba limpia
      audioManager.playVoice(`syl_${boxItem.lower}`);
    } else {
      // Ya colocó todas las sílabas de la palabra: evaluar sin montar el audio de la última sílaba
      setIsEvaluating(true);
      evaluateWord(newPlaced);
    }
  };

  const handleReturnBox = (boxItem) => {
    if (isEvaluating) return;
    setPlacedSyllables(placedSyllables.filter((b) => b.id !== boxItem.id));
    setAvailableBoxes([...availableBoxes, boxItem]);
    audioManager.playSFX('bubble');
  };

  const evaluateWord = (placed) => {
    clearAllTimers();
    const formedWord = placed.map((b) => b.syllable).join('');
    const expectedWord = currentItem.syllables.join('');

    if (formedWord === expectedWord) {
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

      const nextStep = currentStep + 1;

      if (nextStep < currentLevel.words.length) {
        const nextWordTimer = setTimeout(() => {
          setCurrentStep(nextStep);
          const nextWordItem = currentLevel.words[nextStep];
          setDialogue(`¡Ahora ordenemos las sílabas para formar ${nextWordItem.spokenWord}!`);
        }, 2500);
        timersRef.current.push(nextWordTimer);
      } else {
        sumarOvillos(3);
        const endLevelTimer = setTimeout(() => {
          if (levelIdx + 1 < PARTY_LEVELS.length) {
            audioManager.playSFX('celebration');
            setLevelModal(true);
          } else {
            audioManager.playSFX('celebration');
            audioManager.playVoice('lvl4_win');
            try {
              fireVictoryConfetti();
            } catch (e) {
              // Ignorar
            }
            setIsCompletedAll(true);
          }
        }, 2500);
        timersRef.current.push(endLevelTimer);
      }
    } else {
      setIsWobbling(true);
      audioManager.playSFX('wobble');
      registrarFallo(currentItem.word);

      const comfortingText =
        'No pasa nada, Cristal, ¡vamos a intentarlo en el orden correcto!';
      setDialogue(comfortingText);
      audioManager.playVoice('lvl4_wrong');

      const resetTimer = setTimeout(() => {
        setAvailableBoxes(
          currentItem.scrambled.map((syl, idx) => ({
            id: `${syl}-${idx}-${Date.now()}-${Math.random()}`,
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

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[90vh] py-2 px-3 sm:px-5 w-full max-w-5xl mx-auto select-none">
      {/* HEADER SUPERIOR Y SELECTOR DE LOS 4 NIVELES DE COMPLEJIDAD */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border-2 border-amber-200 shadow-sm mb-2">
          <button
            type="button"
            onClick={() => {
              clearAllTimers();
              audioManager.stopVoice();
              audioManager.playSFX('bubble');
              if (onRestartAll) onRestartAll();
              else navegarA('map');
            }}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
          >
            ← Mapa
          </button>

          {/* Selector de los 4 Niveles (2, 3 y 4 sílabas) */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {PARTY_LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  clearAllTimers();
                  setLevelIdx(idx);
                  setCurrentStep(0);
                  setLevelModal(false);
                }}
                className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                  idx === levelIdx
                    ? 'bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white shadow-sm scale-105'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {lvl.name}
              </button>
            ))}
          </div>

          <span className="font-extrabold text-amber-800 text-xs sm:text-sm bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            Palabra {currentStep + 1}/{currentLevel.words.length} 🎁
          </span>
        </div>

        {/* Pestañas de palabras del nivel actual */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
          {currentLevel.words.map((w, idx) => (
            <button
              key={w.word}
              type="button"
              onClick={() => {
                clearAllTimers();
                setCurrentStep(idx);
              }}
              className={`px-2.5 py-1 rounded-xl font-black text-xs transition-all cursor-pointer ${
                idx === currentStep
                  ? 'bg-amber-400 text-amber-950 ring-2 ring-yellow-300 scale-105 shadow-sm'
                  : idx < currentStep
                  ? 'bg-emerald-400 text-white'
                  : 'bg-white border border-amber-300 text-amber-800'
              }`}
            >
              {w.emoji} {w.word}
            </button>
          ))}
        </div>

        {/* Guía con Hadita Lulú */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={isCorrect || isCompletedAll ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
          onKittenClick={() => {
            audioManager.playVoice(currentItem.winAudio);
          }}
        />
      </div>

      {/* ESCENARIO PRINCIPAL DE LA FIESTA DE PALABRAS */}
      <div className="relative w-full my-1.5 min-h-[360px] rounded-3xl bg-gradient-to-b from-amber-100/80 via-pink-100/70 to-purple-100/80 border-4 border-white shadow-lg flex flex-col items-center justify-between p-4 sm:p-5 overflow-hidden">
        {/* Imagen / Emoji de la palabra + Botón para escuchar */}
        <div className="text-center z-10 flex flex-col items-center">
          <button
            type="button"
            onClick={() => audioManager.playVoice(currentItem.winAudio)}
            className="cursor-pointer w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-white shadow-lg border-4 border-amber-300 flex items-center justify-center text-4xl sm:text-5xl hover:scale-105 active:scale-95 transition-transform mb-1 p-3"
          >
            {currentItem?.emoji}
          </button>
          <button
            type="button"
            onClick={() => audioManager.playVoice(currentItem.winAudio)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-purple-900 bg-white/85 px-3.5 py-1 rounded-full border border-purple-200 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-pink-600" />
            <span>
              Forma ({numSlots} sílabas): {currentItem?.word} ({currentItem?.lowerWord})
            </span>
          </button>
        </div>

        {/* CASILLAS DE DESTINO (2, 3 o 4 sílabas, 100% despejadas) */}
        <div
          ref={slotsRef}
          className="w-full max-w-2xl my-2.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 z-10"
        >
          {Array.from({ length: numSlots }).map((_, slotIndex) => {
            const placedBox = placedSyllables[slotIndex];

            return (
              <button
                key={slotIndex}
                type="button"
                onClick={() => placedBox && handleReturnBox(placedBox)}
                className={`relative w-24 h-24 sm:w-32 sm:h-28 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center justify-center select-none cursor-pointer ${
                  placedBox
                    ? isCorrect
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 ring-4 ring-emerald-300 shadow-xl'
                      : isWobbling
                      ? 'bg-rose-100 border-rose-400 text-rose-800 animate-wiggle ring-4 ring-rose-300'
                      : 'bg-white border-pink-400 text-pink-700 shadow-xl'
                    : 'bg-white/70 border-dashed border-purple-300 text-purple-400'
                }`}
              >
                {placedBox ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black tracking-wide leading-none">
                        {placedBox.syllable}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold opacity-85 leading-none">
                        {placedBox.lower}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold opacity-60 mt-1">
                      cambiar
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-1 opacity-75">
                    <span className="text-xl sm:text-2xl">🎁</span>
                    <span className="text-[11px] font-extrabold text-purple-500 mt-0.5">
                      Sílaba {slotIndex + 1}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* SÍLABAS PARA ELEGIR ABAJO: 100% DESPEJADAS SIN NINGÚN CÍRCULO "CAJA" ENCIMA */}
        <div className="w-full max-w-2xl text-center z-10">
          <p className="text-xs sm:text-sm font-extrabold text-purple-900 mb-2">
            👇 Toca las {numSlots} sílabas en orden para formar <strong>{currentItem?.word}</strong>:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 min-h-[100px]">
            {availableBoxes.map((boxItem) => (
              <button
                key={boxItem.id}
                type="button"
                onClick={() => handleSelectBox(boxItem)}
                className={`relative w-24 h-24 sm:w-32 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer ${boxItem.design.bg}`}
              >
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="font-black text-3xl sm:text-4xl leading-none tracking-wide">
                    {boxItem.syllable}
                  </span>
                  <span className="font-bold text-xl sm:text-2xl opacity-85 leading-none">
                    {boxItem.lower}
                  </span>
                </div>

                <span className="mt-1.5 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 text-purple-800 shadow-sm">
                  ▲ Subir
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL AL TERMINAR UN NIVEL DE CAJAS */}
      {levelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-amber-300 shadow-2xl">
            <img
              src="/fairy-lulu.jpg"
              alt="Hadita Lulú"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Superaste el {currentLevel.name}! 🎁🎉
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Ahora vamos a ordenar palabras con más sílabas!
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setCurrentStep(0);
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Jugar {PARTY_LEVELS[levelIdx + 1]?.name}!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  if (onRestartAll) onRestartAll();
                  else navegarA('map');
                }}
                className="w-full py-2.5 rounded-2xl font-bold text-sm text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                Volver al Mapa Mágico
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANTALLA DE VICTORIA FINAL */}
      {isCompletedAll && (
        <VictoryModal
          title="¡Lo lograste, Cristal!"
          subtitle="¡Ordenaste palabras de 2, 3 y 4 sílabas! Eres una gran campeona de la lectura."
          levelIdToUnlock="mision8"
          yarnReward={5}
          onReturnToMap={() => {
            setIsCompletedAll(false);
            if (onRestartAll) onRestartAll();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
