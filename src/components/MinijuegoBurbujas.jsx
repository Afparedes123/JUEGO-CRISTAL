import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, Star } from 'lucide-react';

// 5 Rondas progresivas de sílabas (Método Silábico Leo con Grin)
const ROUNDS = [
  {
    target: 'MA',
    lower: 'ma',
    example: 'Mamá 👩',
    askAudio: 'bubbles_ask_ma',
    sylAudio: 'syl_ma',
    distractors: ['ME', 'PA', 'SO', 'LA', 'TU'],
  },
  {
    target: 'PE',
    lower: 'pe',
    example: 'Pelota ⚽',
    askAudio: 'bubbles_ask_pe',
    sylAudio: 'syl_pe',
    distractors: ['MA', 'PI', 'LO', 'SA', 'TE'],
  },
  {
    target: 'SI',
    lower: 'si',
    example: 'Sirena 🧜‍♀️',
    askAudio: 'bubbles_ask_si',
    sylAudio: 'syl_si',
    distractors: ['SU', 'ME', 'PO', 'LA', 'TA'],
  },
  {
    target: 'LO',
    lower: 'lo',
    example: 'Lobo 🐺',
    askAudio: 'bubbles_ask_lo',
    sylAudio: 'syl_lo',
    distractors: ['LA', 'MU', 'PA', 'SE', 'TI'],
  },
  {
    target: 'TU',
    lower: 'tu',
    example: 'Tulipán 🌷',
    askAudio: 'bubbles_ask_tu',
    sylAudio: 'syl_tu',
    distractors: ['TO', 'MI', 'PE', 'SA', 'LU'],
  },
];

export default function MinijuegoBurbujas({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  const [roundIndex, setRoundIndex] = useState(0);
  const [scoreInRound, setScoreInRound] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [poppingId, setPoppingId] = useState(null);
  const [wobblingId, setWobblingId] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [showCaseBoth, setShowCaseBoth] = useState(true); // Muestra MA / ma
  const nextBubbleId = useRef(1);
  const lastTouchId = useRef(null);

  const currentRound = ROUNDS[roundIndex];

  // Audio al iniciar cada ronda: pronuncia la sílaba junta ("ma", "pe", "si", "lo", "tu")
  useEffect(() => {
    if (hasWon) return;
    const timer = setTimeout(() => {
      audioManager.playVoice(currentRound.askAudio);
    }, 350);

    return () => clearTimeout(timer);
  }, [roundIndex, hasWon, audioManager, currentRound.askAudio]);

  // Generador de burbujas flotantes visibles y accesibles
  useEffect(() => {
    if (hasWon) return;

    const createBubble = (initialOffsetBottom = null) => {
      const isTarget = Math.random() < 0.5;
      const sylUpper = isTarget
        ? currentRound.target
        : currentRound.distractors[
            Math.floor(Math.random() * currentRound.distractors.length)
          ];

      const newBubble = {
        id: nextBubbleId.current++,
        syllable: sylUpper,
        lower: sylUpper.toLowerCase(),
        isTarget,
        left: Math.floor(Math.random() * 72) + 8, // 8% a 80%
        speed: (Math.random() * 2.5 + 5.5).toFixed(1), // 5.5s a 8s
        size: Math.floor(Math.random() * 14) + 84, // 84px a 98px
        initialBottom: initialOffsetBottom,
      };

      setBubbles((prev) => [...prev.slice(-9), newBubble]);
    };

    // Sembrar 4 burbujas iniciales en pantalla inmediatamente
    setBubbles([]);
    createBubble(20);
    createBubble(110);
    createBubble(200);
    createBubble(280);

    const interval = setInterval(() => createBubble(null), 1500);
    return () => clearInterval(interval);
  }, [roundIndex, hasWon, currentRound]);

  // Al tocar una burbuja: pronuncia la sílaba junta ("¡ma!", "¡pe!", etc.)
  const handleBubbleTouch = (e, bubble) => {
    e.stopPropagation();
    if (hasWon) return;

    // Prevenir doble disparo entre touch y click
    if (lastTouchId.current === bubble.id) return;
    lastTouchId.current = bubble.id;
    setTimeout(() => {
      if (lastTouchId.current === bubble.id) lastTouchId.current = null;
    }, 350);

    const sylAudioKey = `syl_${bubble.lower}`;

    if (bubble.isTarget) {
      // ¡ACIERTO! Pronuncia la sílaba completa junta con alegría
      audioManager.playSFX('pop');
      audioManager.playSFX('sparkle');
      audioManager.playVoice(sylAudioKey);
      registrarAcierto(bubble.syllable);

      setPoppingId(bubble.id);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setPoppingId(null);
      }, 300);

      const nextScore = scoreInRound + 1;
      setScoreInRound(nextScore);

      // 2 burbujas por ronda (5 rondas = 10 sílabas atrapadas)
      if (nextScore >= 2) {
        if (roundIndex + 1 < ROUNDS.length) {
          setTimeout(() => {
            audioManager.playSFX('bell');
            setScoreInRound(0);
            setRoundIndex((prev) => prev + 1);
          }, 950);
        } else {
          setTimeout(() => {
            audioManager.playVoice('bubbles_win');
            setHasWon(true);
          }, 900);
        }
      }
    } else {
      // TOCÓ OTRA SÍLABA: pronuncia cómo suena esa sílaba junta y luego anima suavemente
      audioManager.playSFX('wobble');
      registrarFallo(bubble.syllable);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      setWobblingId(bubble.id);
      setTimeout(() => setWobblingId(null), 600);

      // Primero pronuncia la sílaba que tocó junta, o recuerda la sílaba objetivo
      audioManager.playVoice('bubbles_fail');
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-sky-100/95 via-purple-100/90 to-pink-100/95 select-none">
      {/* HEADER SUPERIOR */}
      <header className="z-20 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        {/* Tarjeta central de la Sílaba Objetivo con Mayúscula y Minúscula */}
        <div
          onClick={() => audioManager.playVoice(currentRound.sylAudio)}
          className="cursor-pointer flex items-center gap-3 px-5 py-2 bg-white/95 backdrop-blur-md rounded-3xl border-3 border-pink-300 shadow-lg hover:scale-105 transition-transform"
          title="Toca para escuchar cómo suena la sílaba junta"
        >
          <img
            src="/fairy-lulu.jpg"
            alt="Hadita Lulú"
            className="w-11 h-11 rounded-full border-2 border-pink-400 object-cover shadow-sm"
          />
          <div className="text-left">
            <span className="text-[11px] font-black text-purple-600 uppercase block">
              Ronda {roundIndex + 1} de {ROUNDS.length} • {currentRound.example}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-600">Atrapa:</span>
              <span className="text-2xl sm:text-3xl font-black text-pink-600">
                {currentRound.target}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-purple-600">
                / {currentRound.lower}
              </span>
              <Volume2 className="w-5 h-5 text-pink-500 animate-pulse ml-1" />
            </div>
          </div>
        </div>

        {/* Selector Mayúsculas / Minúsculas + Estrellas */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCaseBoth((prev) => !prev)}
            className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-2xl text-xs font-black text-purple-800 shadow-sm"
          >
            {showCaseBoth ? 'MA / ma' : 'Solo MA'}
          </button>

          <div className="flex items-center gap-1.5 bg-white/90 border-2 border-pink-300 px-3 py-1.5 rounded-2xl shadow-sm font-black text-xs sm:text-sm">
            <span>Meta:</span>
            <div className="flex gap-1 text-lg">
              {[0, 1].map((i) => (
                <span
                  key={i}
                  className={
                    i < scoreInRound ? 'animate-bounce text-yellow-400' : 'text-slate-300'
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* BARRA DE PROGRESO DE LAS 5 SÍLABAS */}
      <div className="z-20 w-full max-w-xl mx-auto my-1 flex items-center justify-center gap-2">
        {ROUNDS.map((r, idx) => {
          const done = idx < roundIndex || hasWon;
          const active = idx === roundIndex && !hasWon;
          return (
            <button
              key={r.target}
              onClick={() => audioManager.playVoice(r.sylAudio)}
              className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm border-2 transition-all ${
                done
                  ? 'bg-emerald-400 border-white text-white shadow-sm'
                  : active
                  ? 'bg-pink-500 border-yellow-300 text-white scale-110 shadow-md animate-pulse'
                  : 'bg-white/70 border-pink-200 text-slate-500'
              }`}
            >
              {r.target} • {r.lower}
            </button>
          );
        })}
      </div>

      {/* ÁREA DE JUEGO: BURBUJAS FLOTANTES QUE SUBEN CONTINUAMENTE */}
      <main className="relative z-10 w-full max-w-3xl h-[400px] sm:h-[450px] mx-auto my-auto overflow-hidden rounded-3xl border-4 border-white/90 bg-gradient-to-b from-sky-200/50 via-purple-100/40 to-pink-200/50 backdrop-blur-sm shadow-2xl">
        {/* Decoración submarina/aérea mágica */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
          <span className="text-9xl font-black text-pink-500">
            {currentRound.target} {currentRound.lower}
          </span>
        </div>

        {bubbles.map((b) => {
          const isPopping = poppingId === b.id;
          const isWobbling = wobblingId === b.id;

          return (
            <button
              key={b.id}
              type="button"
              onClick={(e) => handleBubbleTouch(e, b)}
              style={{
                left: `${b.left}%`,
                bottom: b.initialBottom !== null ? `${b.initialBottom}px` : '-90px',
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDuration: `${b.speed}s`,
              }}
              className={`absolute cursor-pointer rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-transform select-none ${
                isPopping ? 'scale-150 opacity-0 duration-300' : 'animate-bubble-rise'
              } ${isWobbling ? 'animate-wiggle border-rose-400' : ''} ${
                b.isTarget
                  ? 'bg-gradient-to-tr from-pink-400/95 via-rose-300/95 to-amber-200/95 border-white text-white shadow-pink-300/70'
                  : 'bg-gradient-to-tr from-purple-300/90 via-indigo-200/90 to-sky-200/90 border-white/90 text-purple-900 shadow-purple-300/50'
              } hover:scale-110 active:scale-95`}
            >
              {/* Reflejo de burbuja de cristal */}
              <span className="absolute top-2.5 left-3.5 w-5 h-2.5 bg-white/80 rounded-full rotate-[-30deg] pointer-events-none" />

              {/* Sílaba en Mayúscula y Minúscula */}
              <span className="font-black text-2xl sm:text-3xl leading-none drop-shadow">
                {b.syllable}
              </span>
              {showCaseBoth && (
                <span className="font-bold text-sm sm:text-base opacity-95 leading-tight">
                  {b.lower}
                </span>
              )}
            </button>
          );
        })}
      </main>

      {/* FOOTER: Botones para escuchar la sílaba junta */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => audioManager.playVoice(currentRound.askAudio)}
            className="flex items-center gap-1.5 bg-white/90 hover:bg-white border-2 border-pink-300 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black text-pink-700 shadow-sm"
          >
            <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
            <span>Escuchar instrucción</span>
          </button>

          <button
            onClick={() => audioManager.playVoice(currentRound.sylAudio)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-black shadow-md hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Pronunciar "{currentRound.lower}"</span>
          </button>
        </div>

        <span className="text-xs sm:text-sm font-extrabold text-purple-700 bg-white/75 px-3 py-1 rounded-full">
          🧚‍♀️ Toca las burbujas con <strong>{currentRound.target} / {currentRound.lower}</strong>
        </span>
      </footer>

      {/* MODAL DE VICTORIA */}
      {hasWon && (
        <VictoryModal
          title="¡Dominaste las Sílabas en Burbujas!"
          subtitle="¡Escuchaste y atrapaste MA, PE, SI, LO y TU súper bien, Cristal!"
          levelIdToUnlock="mision3"
          yarnReward={2}
          onReturnToMap={() => {
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
