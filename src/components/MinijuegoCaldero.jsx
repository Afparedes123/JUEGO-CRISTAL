import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

// 4 NIVELES DE PALABRAS PROGRESIVAS: De 2 sílabas simples hasta 3 y 4 sílabas complejas
const CAULDRON_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: 2 Sílabas (M, P, S, L, T)',
    words: [
      { word: 'MESA', lower: 'mesa', emoji: '🪑', syllables: ['ME', 'SA'], winAudio: 'word_mesa', pool: ['ME', 'SA', 'TA', 'PA'] },
      { word: 'MAMÁ', lower: 'mamá', emoji: '👩', syllables: ['MA', 'MA'], winAudio: 'word_mama', pool: ['MA', 'MA', 'SO', 'LU'] },
      { word: 'PAPÁ', lower: 'papá', emoji: '👨', syllables: ['PA', 'PA'], winAudio: 'word_papa', pool: ['PA', 'PA', 'ME', 'TI'] },
      { word: 'SAPO', lower: 'sapo', emoji: '🐸', syllables: ['SA', 'PO'], winAudio: 'word_sapo', pool: ['SA', 'PO', 'LA', 'MU'] },
      { word: 'LUPA', lower: 'lupa', emoji: '🔍', syllables: ['LU', 'PA'], winAudio: 'word_lupa', pool: ['LU', 'PA', 'SE', 'TO'] },
      { word: 'PATO', lower: 'pato', emoji: '🦆', syllables: ['PA', 'TO'], winAudio: 'word_pato', pool: ['PA', 'TO', 'MI', 'SU'] },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: 2 Sílabas (D, N, B, C, G, R, F, V)',
    words: [
      { word: 'DADO', lower: 'dado', emoji: '🎲', syllables: ['DA', 'DO'], winAudio: 'word_dado', pool: ['DA', 'DO', 'NE', 'BA'] },
      { word: 'MANO', lower: 'mano', emoji: '✋', syllables: ['MA', 'NO'], winAudio: 'word_mano', pool: ['MA', 'NO', 'DI', 'CU'] },
      { word: 'NUBE', lower: 'nube', emoji: '☁️', syllables: ['NU', 'BE'], winAudio: 'word_nube', pool: ['NU', 'BE', 'CA', 'RO'] },
      { word: 'BOTA', lower: 'bota', emoji: '👢', syllables: ['BO', 'TA'], winAudio: 'word_bota', pool: ['BO', 'TA', 'GA', 'FE'] },
      { word: 'FOCA', lower: 'foca', emoji: '🦭', syllables: ['FO', 'CA'], winAudio: 'word_foca', pool: ['FO', 'CA', 'VA', 'LU'] },
      { word: 'ROSA', lower: 'rosa', emoji: '🌹', syllables: ['RO', 'SA'], winAudio: 'word_rosa', pool: ['RO', 'SA', 'VE', 'NI'] },
      { word: 'VACA', lower: 'vaca', emoji: '🐮', syllables: ['VA', 'CA'], winAudio: 'word_vaca', pool: ['VA', 'CA', 'BO', 'TE'] },
      { word: 'VELA', lower: 'vela', emoji: '🕯️', syllables: ['VE', 'LA'], winAudio: 'word_vela', pool: ['VE', 'LA', 'FO', 'DA'] },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: 3 Sílabas (Trisílabas)',
    words: [
      { word: 'PELOTA', lower: 'pelota', emoji: '⚽', syllables: ['PE', 'LO', 'TA'], winAudio: 'word_pelota', pool: ['PE', 'LO', 'TA', 'MA', 'SU'] },
      { word: 'PALOMA', lower: 'paloma', emoji: '🕊️', syllables: ['PA', 'LO', 'MA'], winAudio: 'word_paloma', pool: ['PA', 'LO', 'MA', 'TE', 'SI'] },
      { word: 'CAMISA', lower: 'camisa', emoji: '👕', syllables: ['CA', 'MI', 'SA'], winAudio: 'word_camisa', pool: ['CA', 'MI', 'SA', 'PO', 'LE'] },
      { word: 'MALETA', lower: 'maleta', emoji: '🧳', syllables: ['MA', 'LE', 'TA'], winAudio: 'word_maleta', pool: ['MA', 'LE', 'TA', 'CO', 'NU'] },
      { word: 'TOMATE', lower: 'tomate', emoji: '🍅', syllables: ['TO', 'MA', 'TE'], winAudio: 'word_tomate', pool: ['TO', 'MA', 'TE', 'LA', 'PI'] },
      { word: 'ZAPATO', lower: 'zapato', emoji: '👟', syllables: ['ZA', 'PA', 'TO'], winAudio: 'word_zapato', pool: ['ZA', 'PA', 'TO', 'ME', 'LU'] },
      { word: 'CONEJO', lower: 'conejo', emoji: '🐰', syllables: ['CO', 'NE', 'JO'], winAudio: 'word_conejo', pool: ['CO', 'NE', 'JO', 'SA', 'TI'] },
      { word: 'JIRAFA', lower: 'jirafa', emoji: '🦒', syllables: ['JI', 'RA', 'FA'], winAudio: 'word_jirafa', pool: ['JI', 'RA', 'FA', 'BO', 'DE'] },
      { word: 'CORONA', lower: 'corona', emoji: '👑', syllables: ['CO', 'RO', 'NA'], winAudio: 'word_corona', pool: ['CO', 'RO', 'NA', 'PA', 'MI'] },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: 4 Sílabas (Polisílabas)',
    words: [
      { word: 'MARIPOSA', lower: 'mariposa', emoji: '🦋', syllables: ['MA', 'RI', 'PO', 'SA'], winAudio: 'word_mariposa', pool: ['MA', 'RI', 'PO', 'SA', 'TE', 'LU'] },
      { word: 'CARAMELO', lower: 'caramelo', emoji: '🍬', syllables: ['CA', 'RA', 'ME', 'LO'], winAudio: 'word_caramelo', pool: ['CA', 'RA', 'ME', 'LO', 'PA', 'SI'] },
      { word: 'ELEFANTE', lower: 'elefante', emoji: '🐘', syllables: ['E', 'LE', 'FAN', 'TE'], winAudio: 'word_elefante', pool: ['E', 'LE', 'FAN', 'TE', 'MO', 'CA'] },
      { word: 'BICICLETA', lower: 'bicicleta', emoji: '🚲', syllables: ['BI', 'CI', 'CLE', 'TA'], winAudio: 'word_bicicleta', pool: ['BI', 'CI', 'CLE', 'TA', 'SO', 'LA'] },
      { word: 'CHOCOLATE', lower: 'chocolate', emoji: '🍫', syllables: ['CHO', 'CO', 'LA', 'TE'], winAudio: 'word_chocolate', pool: ['CHO', 'CO', 'LA', 'TE', 'MI', 'PU'] },
    ],
  },
];

const COLORS = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
];

export default function MinijuegoCaldero({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, sumarOvillos, desbloquearNivel, navegarA } = useGame();

  const [levelIdx, setLevelIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);
  const [availableSyllables, setAvailableSyllables] = useState([]);
  const [isBubbling, setIsBubbling] = useState(false);
  const [wobbleSlot, setWobbleSlot] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [hasWonAll, setHasWonAll] = useState(false);

  const timersRef = useRef([]);

  const currentLevel = CAULDRON_LEVELS[levelIdx];
  const currentItem = currentLevel.words[step] || currentLevel.words[0];
  const numSlots = currentItem.syllables.length;

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Preparar las sílabas de la palabra actual
  useEffect(() => {
    if (!currentItem || hasWonAll || levelModal) return;
    clearTimers();

    const poolItems = currentItem.pool
      .map((text, idx) => ({
        id: `syl-${levelIdx}-${step}-${idx}-${Math.random()}`,
        text,
        lower: text.toLowerCase(),
        color: COLORS[idx % COLORS.length],
      }))
      .sort(() => Math.random() - 0.5);

    setAvailableSyllables(poolItems);
    setSlots(Array(currentItem.syllables.length).fill(null));
    setIsBubbling(false);
    setWobbleSlot(false);

    const t = setTimeout(() => {
      audioManager.playVoice(currentItem.winAudio);
    }, 300);
    timersRef.current.push(t);

    return () => clearTimers();
  }, [levelIdx, step, hasWonAll, levelModal, audioManager, currentItem]);

  const handlePlaceSyllable = (syl) => {
    if (hasWonAll || levelModal || isBubbling) return;

    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    const nextSlots = [...slots];
    nextSlots[emptyIdx] = syl;
    setSlots(nextSlots);
    setAvailableSyllables((prev) => prev.filter((s) => s.id !== syl.id));

    audioManager.playSFX('bubble');

    // Si aún faltan sílabas por colocar, pronunciar la sílaba colocada
    const filledCount = nextSlots.filter(Boolean).length;
    if (filledCount < numSlots) {
      const sylKey = `syl_${syl.lower}`;
      audioManager.playVoice(sylKey);
    } else {
      // Ya se llenaron todas las casillas: validar palabra completa sin montar voces
      evaluateCauldronWord(nextSlots);
    }
  };

  const handleRemoveSyllable = (slotIdx) => {
    if (hasWonAll || levelModal || isBubbling) return;
    const item = slots[slotIdx];
    if (!item) return;

    audioManager.playSFX('bubble');
    const nextSlots = [...slots];
    nextSlots[slotIdx] = null;
    setSlots(nextSlots);
    setAvailableSyllables((prev) => [...prev, item]);
  };

  const evaluateCauldronWord = (filledSlots) => {
    clearTimers();
    const isCorrect = filledSlots.every(
      (s, i) => s && s.text === currentItem.syllables[i]
    );

    if (isCorrect) {
      setIsBubbling(true);
      audioManager.playSFX('magic');
      audioManager.playSFX('bell');
      registrarAcierto(currentItem.word);

      // Pronunciar inmediatamente la palabra completa sin solapar con otra voz
      audioManager.playVoice(currentItem.winAudio);

      const nextTimer = setTimeout(() => {
        if (step + 1 < currentLevel.words.length) {
          setStep((prev) => prev + 1);
        } else {
          sumarOvillos(3);
          desbloquearNivel('mision7');
          if (levelIdx + 1 < CAULDRON_LEVELS.length) {
            audioManager.playSFX('celebration');
            setLevelModal(true);
          } else {
            audioManager.playSFX('celebration');
            audioManager.playVoice('cauldron_win');
            setHasWonAll(true);
          }
        }
      }, 2400);
      timersRef.current.push(nextTimer);
    } else {
      audioManager.playSFX('wobble');
      registrarFallo(currentItem.word);
      setWobbleSlot(true);

      const retryTimer = setTimeout(() => {
        const resetItems = currentItem.pool
          .map((text, idx) => ({
            id: `syl-retry-${idx}-${Math.random()}`,
            text,
            lower: text.toLowerCase(),
            color: COLORS[idx % COLORS.length],
          }))
          .sort(() => Math.random() - 0.5);

        setAvailableSyllables(resetItems);
        setSlots(Array(currentItem.syllables.length).fill(null));
        setWobbleSlot(false);
      }, 1100);
      timersRef.current.push(retryTimer);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-2.5 sm:p-5 overflow-hidden bg-gradient-to-b from-purple-100/95 via-pink-100/85 to-indigo-100/95 select-none">
      {/* HEADER SUPERIOR Y SELECTOR DE LOS 4 NIVELES DE COMPLEJIDAD */}
      <header className="z-20 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimers();
            audioManager.stopVoice();
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        {/* Selector de los 4 Niveles (2, 3 y 4 sílabas) */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-white/90 p-1.5 rounded-2xl border border-purple-200 shadow-sm">
          {CAULDRON_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                clearTimers();
                setLevelIdx(idx);
                setStep(0);
                setLevelModal(false);
              }}
              className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                idx === levelIdx
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm scale-105'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        <span className="text-xs font-black text-purple-800 bg-white/90 px-3 py-1.5 rounded-2xl border border-purple-200">
          Palabra {step + 1}/{currentLevel.words.length}
        </span>
      </header>

      {/* SELECTOR DE PALABRAS DENTRO DEL NIVEL */}
      <div className="z-20 w-full max-w-4xl mx-auto my-1 flex flex-wrap items-center justify-center gap-1.5">
        {currentLevel.words.map((w, idx) => (
          <button
            key={w.word}
            type="button"
            onClick={() => {
              clearTimers();
              setStep(idx);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              idx === step
                ? 'bg-pink-500 text-white border-yellow-300 scale-105 shadow'
                : idx < step
                ? 'bg-emerald-400 text-white border-white'
                : 'bg-white/80 text-purple-700 border-purple-200'
            }`}
          >
            {w.emoji} {w.word}
          </button>
        ))}
      </div>

      {/* ÁREA CENTRAL */}
      <main className="z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center">
        {/* Imagen representativa de la palabra */}
        <div
          onClick={() => audioManager.playVoice(currentItem.winAudio)}
          className="cursor-pointer mb-3 flex items-center gap-3 bg-white/95 px-6 py-2.5 rounded-3xl border-3 border-pink-300 shadow-lg hover:scale-105 transition-transform"
        >
          <span className="text-5xl">{currentItem.emoji}</span>
          <div className="text-left">
            <span className="text-[11px] font-black text-pink-600 uppercase block">
              Une las {numSlots} sílabas para formar:
            </span>
            <span className="text-xl sm:text-2xl font-black text-purple-800">
              {currentItem.word} ({currentItem.lower})
            </span>
            <span className="text-xs font-bold text-slate-500 block">
              {currentItem.syllables.join(' + ')} = {currentItem.word}
            </span>
          </div>
          <Volume2 className="w-5 h-5 text-pink-500 animate-pulse ml-2" />
        </div>

        {/* CALDERO MÁGICO ADAPTABLE A 2, 3 O 4 SÍLABAS */}
        <div
          className={`relative w-full max-w-xl min-h-[210px] sm:min-h-[230px] bg-gradient-to-b from-purple-900 to-indigo-950 rounded-b-[65px] rounded-t-3xl border-4 border-amber-300 shadow-2xl p-4 flex flex-col items-center justify-between transition-transform ${
            wobbleSlot ? 'animate-wiggle' : ''
          }`}
        >
          <div className="text-center">
            <span className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">
              {isBubbling
                ? `✨ ¡${currentItem.word} (${currentItem.lower})! ✨`
                : `Toca las ${numSlots} sílabas en orden`}
            </span>
          </div>

          {/* CASILLAS DE SÍLABAS (2, 3 o 4 según el nivel) */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-auto">
            {currentItem.syllables.map((expectedSyl, sIdx) => {
              const placed = slots[sIdx];
              return (
                <React.Fragment key={sIdx}>
                  {sIdx > 0 && (
                    <span className="text-xl sm:text-2xl font-black text-yellow-300">
                      +
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveSyllable(sIdx)}
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                      placed
                        ? 'bg-gradient-to-tr from-pink-400 to-rose-500 border-white text-white font-black shadow-lg scale-105'
                        : 'border-purple-300/60 bg-purple-950/40 text-purple-200 font-extrabold text-xs'
                    }`}
                  >
                    {placed ? (
                      <>
                        <span className="text-2xl sm:text-3xl leading-none">
                          {placed.text}
                        </span>
                        <span className="text-xs sm:text-sm opacity-90">
                          {placed.lower}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-center px-1 opacity-75">
                        {sIdx + 1}ª ({expectedSyl})
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className="w-3/4 h-2 bg-amber-400/80 rounded-full" />
        </div>

        {/* FICHAS DE SÍLABAS DISPONIBLES */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
          {availableSyllables.map((syl) => (
            <button
              key={syl.id}
              type="button"
              onClick={() => handlePlaceSyllable(syl)}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${syl.color} text-white font-black shadow-xl border-3 border-white transform hover:scale-110 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer`}
            >
              <span className="text-2xl sm:text-3xl leading-none drop-shadow">
                {syl.text}
              </span>
              <span className="text-sm sm:text-base opacity-90 mt-0.5">
                {syl.lower}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between mt-1">
        <button
          type="button"
          onClick={() => audioManager.playVoice(currentItem.winAudio)}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white border border-pink-300 px-3.5 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar "{currentItem.word}"</span>
        </button>

        <button
          type="button"
          onClick={() => {
            clearTimers();
            if (step + 1 < currentLevel.words.length) setStep((s) => s + 1);
            else if (levelIdx + 1 < CAULDRON_LEVELS.length) setLevelModal(true);
          }}
          className="flex items-center gap-1 bg-white/90 border border-purple-300 px-3 py-1.5 rounded-2xl text-xs font-black text-purple-700"
        >
          <span>Siguiente palabra</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* MODAL AL COMPLETAR UN NIVEL DEL CALDERO */}
      {levelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-purple-300 shadow-2xl">
            <img
              src="/fairy-lulu.jpg"
              alt="Hadita Lulú"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Superaste el {currentLevel.name}! 🔮✨
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Ahora vamos a formar palabras con más sílabas!
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setStep(0);
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Jugar {CAULDRON_LEVELS[levelIdx + 1]?.name}!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  if (onReturnToMap) onReturnToMap();
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

      {hasWonAll && (
        <VictoryModal
          title="¡Hechicera Suprema de las Palabras!"
          subtitle="¡Formaste palabras de 2, 3 y 4 sílabas en el caldero mágico, Cristal!"
          levelIdToUnlock="mision7"
          yarnReward={3}
          onReturnToMap={() => {
            setHasWonAll(false);
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
