import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2 } from 'lucide-react';

// 5 Palabras progresivas para construir en el Caldero (Método Leo con Grin)
const CAULDRON_WORDS = [
  {
    word: 'MESA',
    lower: 'mesa',
    emoji: '🪑',
    s1: 'ME',
    s2: 'SA',
    s1Audio: 'syl_me',
    s2Audio: 'syl_sa',
    askAudio: 'cauldron_ask_mesa',
    winWordAudio: 'word_mesa',
    pool: ['ME', 'SA', 'TA', 'PA'],
  },
  {
    word: 'MAMÁ',
    lower: 'mamá',
    emoji: '👩',
    s1: 'MA',
    s2: 'MA',
    s1Audio: 'syl_ma',
    s2Audio: 'syl_ma',
    askAudio: 'cauldron_ask_mama',
    winWordAudio: 'word_mama',
    pool: ['MA', 'MA', 'SO', 'LU'],
  },
  {
    word: 'PAPÁ',
    lower: 'papá',
    emoji: '👨',
    s1: 'PA',
    s2: 'PA',
    s1Audio: 'syl_pa',
    s2Audio: 'syl_pa',
    askAudio: 'cauldron_ask_papa',
    winWordAudio: 'word_papa',
    pool: ['PA', 'PA', 'ME', 'TI'],
  },
  {
    word: 'SAPO',
    lower: 'sapo',
    emoji: '🐸',
    s1: 'SA',
    s2: 'PO',
    s1Audio: 'syl_sa',
    s2Audio: 'syl_po',
    askAudio: 'cauldron_ask_sapo',
    winWordAudio: 'word_sapo',
    pool: ['SA', 'PO', 'LA', 'MU'],
  },
  {
    word: 'LUPA',
    lower: 'lupa',
    emoji: '🔍',
    s1: 'LU',
    s2: 'PA',
    s1Audio: 'syl_lu',
    s2Audio: 'syl_pa',
    askAudio: 'cauldron_ask_lupa',
    winWordAudio: 'word_lupa',
    pool: ['LU', 'PA', 'SE', 'TO'],
  },
];

const COLORS = [
  'from-pink-400 to-rose-500',
  'from-purple-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-blue-500',
];

export default function MinijuegoCaldero({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  const [step, setStep] = useState(0);
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);
  const [availableSyllables, setAvailableSyllables] = useState([]);
  const [isBubbling, setIsBubbling] = useState(false);
  const [wobbleSlot, setWobbleSlot] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const currentItem = CAULDRON_WORDS[step];

  // Preparar las sílabas del paso actual
  useEffect(() => {
    if (!currentItem || hasWon) return;

    const poolItems = currentItem.pool
      .map((text, idx) => ({
        id: `syl-${step}-${idx}-${Math.random()}`,
        text,
        lower: text.toLowerCase(),
        color: COLORS[idx % COLORS.length],
      }))
      .sort(() => Math.random() - 0.5);

    setAvailableSyllables(poolItems);
    setSlot1(null);
    setSlot2(null);
    setIsBubbling(false);
    setWobbleSlot(false);

    const timer = setTimeout(() => {
      audioManager.playVoice(currentItem.askAudio);
    }, 350);

    return () => clearTimeout(timer);
  }, [step, hasWon, audioManager]);

  const handlePlaceSyllable = (syl) => {
    if (hasWon || isBubbling) return;

    // Pronunciar la sílaba junta al tocarla
    audioManager.playSFX('bubble');
    audioManager.playVoice(`syl_${syl.lower}`);

    if (!slot1) {
      setSlot1(syl);
      setAvailableSyllables((prev) => prev.filter((s) => s.id !== syl.id));
    } else if (!slot2) {
      setSlot2(syl);
      setAvailableSyllables((prev) => prev.filter((s) => s.id !== syl.id));
    }
  };

  const handleRemoveSyllable = (slotNumber) => {
    if (hasWon || isBubbling) return;
    audioManager.playSFX('bubble');
    if (slotNumber === 1 && slot1) {
      setAvailableSyllables((prev) => [...prev, slot1]);
      setSlot1(null);
    } else if (slotNumber === 2 && slot2) {
      setAvailableSyllables((prev) => [...prev, slot2]);
      setSlot2(null);
    }
  };

  // Validar cuando ambas posiciones estén ocupadas
  useEffect(() => {
    if (slot1 && slot2 && !hasWon) {
      if (slot1.text === currentItem.s1 && slot2.text === currentItem.s2) {
        // ¡ÉXITO!
        setIsBubbling(true);
        audioManager.playSFX('magic');
        audioManager.playSFX('bell');
        registrarAcierto(currentItem.word);

        setTimeout(() => {
          audioManager.playVoice(currentItem.winWordAudio);
        }, 350);

        setTimeout(() => {
          if (step + 1 < CAULDRON_WORDS.length) {
            setStep((prev) => prev + 1);
          } else {
            audioManager.playVoice('cauldron_win');
            setHasWon(true);
          }
        }, 2300);
      } else {
        // Reintentar suavemente
        audioManager.playSFX('wobble');
        registrarFallo(currentItem.word);
        setWobbleSlot(true);

        setTimeout(() => {
          const resetItems = currentItem.pool
            .map((text, idx) => ({
              id: `syl-retry-${idx}-${Math.random()}`,
              text,
              lower: text.toLowerCase(),
              color: COLORS[idx % COLORS.length],
            }))
            .sort(() => Math.random() - 0.5);

          setAvailableSyllables(resetItems);
          setSlot1(null);
          setSlot2(null);
          setWobbleSlot(false);
        }, 1100);
      }
    }
  }, [slot1, slot2]);

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-purple-100/95 via-pink-100/85 to-indigo-100/95 select-none">
      {/* HEADER SUPERIOR */}
      <header className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 rounded-full border-2 border-purple-300 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600">
              El Caldero de las Palabras ({step + 1}/{CAULDRON_WORDS.length})
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="flex gap-1">
          {CAULDRON_WORDS.map((w, idx) => (
            <span
              key={w.word}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                idx < step
                  ? 'bg-emerald-400 text-white'
                  : idx === step
                  ? 'bg-pink-500 text-white animate-bounce'
                  : 'bg-white/70 text-slate-400'
              }`}
            >
              {idx + 1}
            </span>
          ))}
        </div>
      </header>

      {/* ÁREA CENTRAL */}
      <main className="z-10 w-full max-w-xl mx-auto my-auto flex flex-col items-center">
        {/* Imagen representativa de la palabra */}
        <div
          onClick={() => audioManager.playVoice(currentItem.askAudio)}
          className="cursor-pointer mb-3 flex items-center gap-3 bg-white/95 px-6 py-3 rounded-3xl border-3 border-pink-300 shadow-lg hover:scale-105 transition-transform"
        >
          <span className="text-5xl">{currentItem.emoji}</span>
          <div className="text-left">
            <span className="text-[11px] font-black text-pink-600 uppercase block">
              Une las sílabas para leer:
            </span>
            <span className="text-xl sm:text-2xl font-black text-purple-800">
              {currentItem.word} ({currentItem.lower})
            </span>
            <span className="text-xs font-bold text-slate-500 block">
              {currentItem.s1} + {currentItem.s2} = {currentItem.word}
            </span>
          </div>
          <Volume2 className="w-5 h-5 text-pink-500 animate-pulse ml-2" />
        </div>

        {/* CALDERO MÁGICO */}
        <div
          className={`relative w-80 sm:w-96 h-56 sm:h-64 bg-gradient-to-b from-purple-900 to-indigo-950 rounded-b-[70px] rounded-t-3xl border-4 border-amber-300 shadow-2xl p-4 flex flex-col items-center justify-between transition-transform ${
            wobbleSlot ? 'animate-wiggle' : ''
          }`}
        >
          <div className="absolute -top-7 flex gap-4 text-2xl animate-bounce">
            <span>✨</span>
            <span>🫧</span>
            <span>✨</span>
          </div>

          <div className="text-center mt-1">
            <span className="text-xs font-extrabold text-amber-200 uppercase tracking-wider">
              {isBubbling
                ? `¡${currentItem.word} (${currentItem.lower})!`
                : 'Toca las sílabas en orden'}
            </span>
          </div>

          {/* 2 ZONAS DE SÍLABAS */}
          <div className="flex items-center justify-center gap-4 my-auto">
            <div
              onClick={() => handleRemoveSyllable(1)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                slot1
                  ? 'bg-gradient-to-tr from-pink-400 to-rose-500 border-white text-white font-black shadow-lg scale-105'
                  : 'border-purple-300/60 bg-purple-950/40 text-purple-200 font-extrabold text-sm'
              }`}
            >
              {slot1 ? (
                <>
                  <span className="text-3xl leading-none">{slot1.text}</span>
                  <span className="text-sm opacity-90">{slot1.lower}</span>
                </>
              ) : (
                <span className="text-xs text-center px-1">
                  1ª Sílaba ({currentItem.s1})
                </span>
              )}
            </div>

            <span className="text-2xl font-black text-yellow-300 animate-pulse">
              +
            </span>

            <div
              onClick={() => handleRemoveSyllable(2)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                slot2
                  ? 'bg-gradient-to-tr from-purple-400 to-indigo-500 border-white text-white font-black shadow-lg scale-105'
                  : 'border-purple-300/60 bg-purple-950/40 text-purple-200 font-extrabold text-sm'
              }`}
            >
              {slot2 ? (
                <>
                  <span className="text-3xl leading-none">{slot2.text}</span>
                  <span className="text-sm opacity-90">{slot2.lower}</span>
                </>
              ) : (
                <span className="text-xs text-center px-1">
                  2ª Sílaba ({currentItem.s2})
                </span>
              )}
            </div>
          </div>

          <div className="w-3/4 h-2 bg-amber-400/80 rounded-full" />
        </div>

        {/* FICHAS DE SÍLABAS MAYÚSCULAS Y MINÚSCULAS */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {availableSyllables.map((syl) => (
            <button
              key={syl.id}
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
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => audioManager.playVoice(currentItem.askAudio)}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white border border-pink-300 px-3.5 py-2 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar palabra</span>
        </button>

        <span className="text-xs font-extrabold text-purple-700 bg-white/75 px-3 py-1 rounded-full">
          🧚‍♀️ Toca las sílabas para formar <strong>{currentItem.word}</strong>
        </span>
      </footer>

      {hasWon && (
        <VictoryModal
          title="¡Hechicera de las Palabras!"
          subtitle="¡Formaste MESA, MAMÁ, PAPÁ, SAPO y LUPA en el caldero, Cristal!"
          levelIdToUnlock="mision7"
          yarnReward={3}
          onReturnToMap={() => {
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
