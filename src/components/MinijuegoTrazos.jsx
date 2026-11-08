import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

// LAS 27 LETRAS DEL ABECEDARIO EN MAYÚSCULAS Y MINÚSCULAS + NIVEL DE SÍLABAS
const TRACE_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: Vocales (A-U)',
    letters: [
      { key: 'A', lower: 'a', word: 'Abeja 🐝', audioKey: 'let_a' },
      { key: 'E', lower: 'e', word: 'Estrella ⭐', audioKey: 'let_e' },
      { key: 'I', lower: 'i', word: 'Isla 🏝️', audioKey: 'let_i' },
      { key: 'O', lower: 'o', word: 'Osito 🧸', audioKey: 'let_o' },
      { key: 'U', lower: 'u', word: 'Unicornio 🦄', audioKey: 'let_u' },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: Letras M, P, S, L, T',
    letters: [
      { key: 'M', lower: 'm', word: 'Mamá 👩', audioKey: 'let_m' },
      { key: 'P', lower: 'p', word: 'Papá 👨', audioKey: 'let_p' },
      { key: 'S', lower: 's', word: 'Sol ☀️', audioKey: 'let_s' },
      { key: 'L', lower: 'l', word: 'Luna 🌙', audioKey: 'let_l' },
      { key: 'T', lower: 't', word: 'Tortuga 🐢', audioKey: 'let_t' },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: Letras D, N, B, C, G, R',
    letters: [
      { key: 'D', lower: 'd', word: 'Delfín 🐬', audioKey: 'let_d' },
      { key: 'N', lower: 'n', word: 'Nube ☁️', audioKey: 'let_n' },
      { key: 'B', lower: 'b', word: 'Ballena 🐳', audioKey: 'let_b' },
      { key: 'C', lower: 'c', word: 'Casa 🏠', audioKey: 'let_c' },
      { key: 'G', lower: 'g', word: 'Gato 🐱', audioKey: 'let_g' },
      { key: 'R', lower: 'r', word: 'Rosa 🌹', audioKey: 'let_r' },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: Letras F, J, V, Z, Ñ, Y',
    letters: [
      { key: 'F', lower: 'f', word: 'Flor 🌸', audioKey: 'let_f' },
      { key: 'J', lower: 'j', word: 'Jirafa 🦒', audioKey: 'let_j' },
      { key: 'V', lower: 'v', word: 'Vaca 🐮', audioKey: 'let_v' },
      { key: 'Z', lower: 'z', word: 'Zapato 👟', audioKey: 'let_z' },
      { key: 'Ñ', lower: 'ñ', word: 'Ñandú 🐦', audioKey: 'let_ny' },
      { key: 'Y', lower: 'y', word: 'Yoyo 🪀', audioKey: 'let_y' },
    ],
  },
  {
    id: 5,
    name: 'Nivel 5: Letras H, K, Q, W, X',
    letters: [
      { key: 'H', lower: 'h', word: 'Hada 🧚‍♀️', audioKey: 'let_h' },
      { key: 'K', lower: 'k', word: 'Koala 🐨', audioKey: 'let_k' },
      { key: 'Q', lower: 'q', word: 'Queso 🧀', audioKey: 'let_q' },
      { key: 'W', lower: 'w', word: 'Wafle 🧇', audioKey: 'let_w' },
      { key: 'X', lower: 'x', word: 'Xilófono 🎼', audioKey: 'let_x' },
    ],
  },
  {
    id: 6,
    name: 'Nivel 6: Sílabas (MA, PE, SI, LO, TU...)',
    letters: [
      { key: 'MA', lower: 'ma', word: 'Mamá 👩', audioKey: 'syl_ma' },
      { key: 'PE', lower: 'pe', word: 'Pelota ⚽', audioKey: 'syl_pe' },
      { key: 'SI', lower: 'si', word: 'Sirena 🧜‍♀️', audioKey: 'syl_si' },
      { key: 'LO', lower: 'lo', word: 'Lobo 🐺', audioKey: 'syl_lo' },
      { key: 'TU', lower: 'tu', word: 'Tulipán 🌷', audioKey: 'syl_tu' },
      { key: 'DA', lower: 'da', word: 'Dado 🎲', audioKey: 'syl_da' },
      { key: 'NO', lower: 'no', word: 'Noche 🌌', audioKey: 'syl_no' },
      { key: 'CA', lower: 'ca', word: 'Casa 🏠', audioKey: 'syl_ca' },
      { key: 'GA', lower: 'ga', word: 'Gato 🐱', audioKey: 'syl_ga' },
      { key: 'RO', lower: 'ro', word: 'Rosa 🌹', audioKey: 'syl_ro' },
    ],
  },
];

// Puntos de control de trazo adaptados si es 1 letra o 2 letras (sílaba)
function getCheckpointsForText(displayStr) {
  if (displayStr.length > 1) {
    return [
      { id: 0, x: 110, y: 120, label: '1' },
      { id: 1, x: 110, y: 270, label: '2' },
      { id: 2, x: 200, y: 200, label: '3' },
      { id: 3, x: 290, y: 120, label: '4' },
      { id: 4, x: 290, y: 270, label: '5' },
    ];
  }
  return [
    { id: 0, x: 200, y: 95, label: '1' },
    { id: 1, x: 135, y: 195, label: '2' },
    { id: 2, x: 265, y: 195, label: '3' },
    { id: 3, x: 200, y: 295, label: '4' },
  ];
}

export default function MinijuegoTrazos({ onReturnToMap }) {
  const { audioManager, registrarAcierto, sumarOvillos, desbloquearNivel, navegarA } = useGame();

  const canvasRef = useRef(null);
  const timersRef = useRef([]);

  const [levelIdx, setLevelIdx] = useState(0);
  const [letterIdx, setLetterIdx] = useState(0);
  // caseMode: 'upper' (Mayúscula) | 'lower' (Minúscula) | 'both' (Mayúscula y Minúscula juntas)
  const [caseMode, setCaseMode] = useState('upper');
  const [isDrawing, setIsDrawing] = useState(false);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [particles, setParticles] = useState([]);
  const [levelModal, setLevelModal] = useState(false);
  const [hasWonAll, setHasWonAll] = useState(false);

  const currentLevel = TRACE_LEVELS[levelIdx];
  const currentLetter = currentLevel.letters[letterIdx] || currentLevel.letters[0];

  const displayString =
    caseMode === 'upper'
      ? currentLetter.key
      : caseMode === 'lower'
      ? currentLetter.lower
      : `${currentLetter.key}${currentLetter.lower}`;

  const checkpoints = getCheckpointsForText(displayString);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    const t = setTimeout(() => {
      audioManager.playVoice(currentLetter.audioKey);
    }, 300);
    timersRef.current.push(t);
    return () => clearTimers();
  }, [levelIdx, letterIdx, caseMode, audioManager, currentLetter.audioKey]);

  const clearCanvasOnly = () => {
    setVisitedCheckpoints([]);
    setParticles([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSelectLetterIdx = (idx) => {
    clearTimers();
    setLetterIdx(idx);
    clearCanvasOnly();
    audioManager.playSFX('bubble');
  };

  const handleReset = () => {
    clearCanvasOnly();
    audioManager.playSFX('bubble');
    audioManager.playVoice(currentLetter.audioKey);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const spawnStarParticles = (x, y) => {
    const newStars = Array.from({ length: 2 }).map(() => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 28,
      y: y + (Math.random() - 0.5) * 28,
      size: Math.random() * 10 + 8,
    }));
    setParticles((prev) => [...prev.slice(-16), ...newStars]);
  };

  const handlePointerDown = (e) => {
    if (hasWonAll || levelModal) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    checkProximity(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || hasWonAll || levelModal) return;
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 10;

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    spawnStarParticles(x, y);
    checkProximity(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const checkProximity = (x, y) => {
    checkpoints.forEach((cp) => {
      if (!visitedCheckpoints.includes(cp.id)) {
        const dist = Math.hypot(cp.x - x, cp.y - y);
        if (dist < 58) {
          audioManager.playSFX('sparkle');
          const nextVisited = [...visitedCheckpoints, cp.id];
          setVisitedCheckpoints(nextVisited);

          if (nextVisited.length === checkpoints.length) {
            handleLetterCompleted();
          }
        }
      }
    });
  };

  const advanceNext = () => {
    clearTimers();
    clearCanvasOnly();
    // Si está en mayúscula, pasar automáticamente a la minúscula de la misma letra para practicar ambas
    if (caseMode === 'upper') {
      setCaseMode('lower');
      return;
    }
    // Si ya trazó la minúscula, pasar a la siguiente letra del nivel en mayúscula
    if (letterIdx + 1 < currentLevel.letters.length) {
      setCaseMode('upper');
      setLetterIdx((prev) => prev + 1);
    } else {
      sumarOvillos(2);
      desbloquearNivel('mision5');
      if (levelIdx + 1 < TRACE_LEVELS.length) {
        setLevelModal(true);
      } else {
        setHasWonAll(true);
      }
    }
  };

  const handleLetterCompleted = () => {
    clearTimers();
    audioManager.playSFX('bell');
    audioManager.playSFX('celebration');
    audioManager.playVoice('trace_win');
    registrarAcierto(displayString);

    const badgeId = `${currentLetter.key}-${caseMode}`;
    if (!completedItems.includes(badgeId)) {
      setCompletedItems((prev) => [...prev, badgeId]);
    }

    const t = setTimeout(() => {
      advanceNext();
    }, 1600);
    timersRef.current.push(t);
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-2.5 sm:p-5 overflow-hidden bg-gradient-to-b from-purple-100/90 via-pink-100/80 to-blue-100/90 select-none">
      {/* HEADER */}
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

        {/* Selector de los 6 Niveles de Trazos */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-white/85 px-2.5 py-1 rounded-2xl border border-pink-200 shadow-sm">
          {TRACE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                clearTimers();
                setLevelIdx(idx);
                setLetterIdx(0);
                setCaseMode('upper');
                clearCanvasOnly();
                setLevelModal(false);
              }}
              className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                idx === levelIdx
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm scale-105'
                  : 'bg-pink-50 text-purple-800 hover:bg-pink-100'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        {/* Selector Mayúscula / Minúscula / Ambas */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-2xl border border-purple-200 shadow-sm">
          {[
            { id: 'upper', label: `Mayúscula (${currentLetter.key})` },
            { id: 'lower', label: `minúscula (${currentLetter.lower})` },
            { id: 'both', label: `${currentLetter.key}${currentLetter.lower}` },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                clearTimers();
                setCaseMode(m.id);
                clearCanvasOnly();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                caseMode === m.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* SELECTOR DE LETRAS DEL NIVEL ACTUAL */}
      <div className="z-20 w-full max-w-4xl mx-auto my-1 flex flex-wrap items-center justify-center gap-1.5">
        {currentLevel.letters.map((item, idx) => {
          const isCurrent = idx === letterIdx;
          const isDone =
            completedItems.includes(`${item.key}-upper`) ||
            completedItems.includes(`${item.key}-lower`);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleSelectLetterIdx(idx)}
              className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm border-2 flex items-center gap-1 transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-pink-500 text-white border-yellow-300 scale-110 shadow-md'
                  : isDone
                  ? 'bg-emerald-400 text-white border-white'
                  : 'bg-white/85 text-purple-800 border-pink-200'
              }`}
            >
              <span>
                {item.key} / {item.lower}
              </span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* ÁREA DE JUEGO: CANVAS TÁCTIL CON GUÍA DE MAYÚSCULA Y MINÚSCULA */}
      <main className="z-10 w-full max-w-lg mx-auto my-auto flex flex-col items-center">
        <div className="mb-1.5 flex items-center gap-2 bg-white/90 px-4 py-1 rounded-full border border-pink-200 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs sm:text-sm font-black text-purple-800">
            Traza: <strong className="text-pink-600 text-base">{displayString}</strong> • Como en {currentLetter.word}
          </span>
        </div>

        <div className="relative w-[320px] h-[320px] sm:w-[370px] sm:h-[370px] bg-white/95 rounded-3xl border-4 border-pink-300 shadow-2xl p-2 flex items-center justify-center overflow-hidden touch-none">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
          >
            {/* Renglones de caligrafía escolar */}
            <line x1="30" y1="90" x2="370" y2="90" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="30" y1="200" x2="370" y2="200" stroke="#FBCFE8" strokeWidth="2" strokeDasharray="6,6" />
            <line x1="30" y1="310" x2="370" y2="310" stroke="#CBD5E1" strokeWidth="3" />

            {/* Silueta gigante de la letra/sílaba en Mayúscula o Minúscula para calcar */}
            <text
              x="200"
              y="285"
              textAnchor="middle"
              fontSize={displayString.length > 1 ? '175' : '250'}
              fontFamily="Nunito, Quicksand, sans-serif"
              fontWeight="900"
              fill="#FCE7F3"
              stroke="#F472B6"
              strokeWidth="4"
              strokeDasharray="10,10"
            >
              {displayString}
            </text>

            {/* Puntos guía numerados */}
            {checkpoints.map((cp) => {
              const isPassed = visitedCheckpoints.includes(cp.id);
              return (
                <g key={cp.id} transform={`translate(${cp.x}, ${cp.y})`}>
                  <circle
                    r={isPassed ? 18 : 16}
                    fill={isPassed ? '#10B981' : '#FBBF24'}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                  {cp.label && (
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="900"
                    >
                      {cp.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="relative z-10 w-full h-full cursor-crosshair"
          />

          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            {particles.map((p) => (
              <span
                key={p.id}
                style={{
                  left: `${(p.x / 400) * 100}%`,
                  top: `${(p.y / 400) * 100}%`,
                  fontSize: `${p.size}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping"
              >
                ✨
              </span>
            ))}
          </div>
        </div>

        {/* Controles debajo del lienzo */}
        <div className="mt-2 w-full max-w-sm flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-xl border border-pink-200 text-xs font-black text-purple-700 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
            <span>Borrar</span>
          </button>

          <div className="flex-1 h-2.5 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300"
              style={{
                width: `${Math.round(
                  (visitedCheckpoints.length / checkpoints.length) * 100
                )}%`,
              }}
            />
          </div>

          <button
            type="button"
            onClick={advanceNext}
            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm"
          >
            <span>Siguiente</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between mt-1">
        <button
          type="button"
          onClick={() => audioManager.playVoice(currentLetter.audioKey)}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white border border-pink-300 px-3.5 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>
            Escuchar {currentLetter.key} / {currentLetter.lower} ({currentLetter.word})
          </span>
        </button>

        <span className="text-xs font-extrabold text-purple-700">
          🧚‍♀️ Traza la Mayúscula y luego su minúscula
        </span>
      </footer>

      {/* MODAL ENTRE NIVELES */}
      {levelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-pink-300 shadow-2xl">
            <img
              src="/fairy-mimi.jpg"
              alt="Hadita Mimi"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Completaste el {currentLevel.name}! ✍️✨
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Qué hermoso dibujas las letras mayúsculas y minúsculas, Cristal!
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setLetterIdx(0);
                  setCaseMode('upper');
                  clearCanvasOnly();
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Ir al {TRACE_LEVELS[levelIdx + 1]?.name}!</span>
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
          title="¡Artista de Todo el Abecedario!"
          subtitle="¡Trazaste todas las letras mayúsculas, minúsculas y sílabas, Cristal!"
          levelIdToUnlock="mision5"
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
