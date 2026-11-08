import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { Sparkles, ArrowLeft, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';

// Vocales y Consonantes en Mayúscula y Minúscula para trazar y escribir
const TRACE_LETTERS = [
  {
    key: 'A',
    display: 'A',
    pair: 'A / a',
    title: 'Letra A Mayúscula',
    word: 'Abeja 🐝',
    audioKey: 'let_a',
    svgPath: 'M 90,320 L 200,70 L 310,320 M 135,220 L 265,220',
    checkpoints: [
      { id: 0, x: 90, y: 320, label: '1' },
      { id: 1, x: 145, y: 195, label: '' },
      { id: 2, x: 200, y: 70, label: '2' },
      { id: 3, x: 255, y: 195, label: '' },
      { id: 4, x: 310, y: 320, label: '3' },
      { id: 5, x: 200, y: 220, label: '4' },
    ],
  },
  {
    key: 'a',
    display: 'a',
    pair: 'a / A',
    title: 'Letra a Minúscula',
    word: 'árbol 🌳',
    audioKey: 'vocal_a',
    svgPath: 'M 255,150 A 75,75 0 1,0 255,270 M 260,130 L 260,310',
    checkpoints: [
      { id: 0, x: 200, y: 135, label: '1' },
      { id: 1, x: 120, y: 210, label: '2' },
      { id: 2, x: 200, y: 285, label: '3' },
      { id: 3, x: 260, y: 150, label: '4' },
      { id: 4, x: 260, y: 300, label: '5' },
    ],
  },
  {
    key: 'E',
    display: 'E',
    pair: 'E / e',
    title: 'Letra E Mayúscula y e Minúscula',
    word: 'Estrella ⭐',
    audioKey: 'let_e',
    svgPath: 'M 280,80 L 120,80 L 120,320 L 280,320 M 120,200 L 250,200',
    checkpoints: [
      { id: 0, x: 270, y: 80, label: '1' },
      { id: 1, x: 120, y: 80, label: '2' },
      { id: 2, x: 120, y: 200, label: '3' },
      { id: 3, x: 240, y: 200, label: '4' },
      { id: 4, x: 120, y: 320, label: '5' },
      { id: 5, x: 270, y: 320, label: '6' },
    ],
  },
  {
    key: 'I',
    display: 'I i',
    pair: 'I / i',
    title: 'Letra I Mayúscula e i Minúscula',
    word: 'Isla 🏝️',
    audioKey: 'let_i',
    svgPath: 'M 140,80 L 260,80 M 200,80 L 200,320 M 140,320 L 260,320',
    checkpoints: [
      { id: 0, x: 200, y: 80, label: '1' },
      { id: 1, x: 200, y: 160, label: '2' },
      { id: 2, x: 200, y: 240, label: '3' },
      { id: 3, x: 200, y: 320, label: '4' },
    ],
  },
  {
    key: 'O',
    display: 'O o',
    pair: 'O / o',
    title: 'Letra O Mayúscula y o Minúscula',
    word: 'Osito 🧸',
    audioKey: 'let_o',
    svgPath: 'M 200,75 A 120,120 0 1,0 200,325 A 120,120 0 1,0 200,75',
    checkpoints: [
      { id: 0, x: 200, y: 75, label: '1' },
      { id: 1, x: 80, y: 200, label: '2' },
      { id: 2, x: 200, y: 325, label: '3' },
      { id: 3, x: 320, y: 200, label: '4' },
    ],
  },
  {
    key: 'U',
    display: 'U u',
    pair: 'U / u',
    title: 'Letra U Mayúscula y u Minúscula',
    word: 'Unicornio 🦄',
    audioKey: 'let_u',
    svgPath: 'M 110,80 L 110,230 A 90,90 0 0,0 290,230 L 290,80',
    checkpoints: [
      { id: 0, x: 110, y: 90, label: '1' },
      { id: 1, x: 110, y: 220, label: '2' },
      { id: 2, x: 200, y: 315, label: '3' },
      { id: 3, x: 290, y: 220, label: '4' },
      { id: 4, x: 290, y: 90, label: '5' },
    ],
  },
  {
    key: 'M',
    display: 'M m',
    pair: 'M / m',
    title: 'Consonante M Mayúscula y m Minúscula',
    word: 'Mamá 👩',
    audioKey: 'let_m',
    svgPath: 'M 80,320 L 80,80 L 200,220 L 320,80 L 320,320',
    checkpoints: [
      { id: 0, x: 80, y: 310, label: '1' },
      { id: 1, x: 80, y: 90, label: '2' },
      { id: 2, x: 200, y: 220, label: '3' },
      { id: 3, x: 320, y: 90, label: '4' },
      { id: 4, x: 320, y: 310, label: '5' },
    ],
  },
  {
    key: 'P',
    display: 'P p',
    pair: 'P / p',
    title: 'Consonante P Mayúscula y p Minúscula',
    word: 'Papá 👨',
    audioKey: 'let_p',
    svgPath: 'M 130,320 L 130,80 L 230,80 A 60,60 0 0,1 230,200 L 130,200',
    checkpoints: [
      { id: 0, x: 130, y: 310, label: '1' },
      { id: 1, x: 130, y: 90, label: '2' },
      { id: 2, x: 245, y: 95, label: '3' },
      { id: 3, x: 270, y: 150, label: '4' },
      { id: 4, x: 160, y: 200, label: '5' },
    ],
  },
  {
    key: 'S',
    display: 'S s',
    pair: 'S / s',
    title: 'Consonante S Mayúscula y s Minúscula',
    word: 'Sol ☀️',
    audioKey: 'let_s',
    svgPath: 'M 270,110 C 200,50 110,90 130,160 C 150,220 280,210 270,290 C 260,340 150,340 120,290',
    checkpoints: [
      { id: 0, x: 260, y: 105, label: '1' },
      { id: 1, x: 130, y: 135, label: '2' },
      { id: 2, x: 200, y: 205, label: '3' },
      { id: 3, x: 265, y: 275, label: '4' },
      { id: 4, x: 135, y: 300, label: '5' },
    ],
  },
  {
    key: 'L',
    display: 'L l',
    pair: 'L / l',
    title: 'Consonante L Mayúscula y l Minúscula',
    word: 'Luna 🌙',
    audioKey: 'let_l',
    svgPath: 'M 130,80 L 130,320 L 290,320',
    checkpoints: [
      { id: 0, x: 130, y: 90, label: '1' },
      { id: 1, x: 130, y: 200, label: '2' },
      { id: 2, x: 130, y: 320, label: '3' },
      { id: 3, x: 280, y: 320, label: '4' },
    ],
  },
];

export default function MinijuegoTrazos({ onReturnToMap }) {
  const { audioManager, registrarAcierto, navegarA } = useGame();

  const canvasRef = useRef(null);
  const [letterIdx, setLetterIdx] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState([]);
  const [completedLetters, setCompletedLetters] = useState([]);
  const [particles, setParticles] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  const currentLetter = TRACE_LETTERS[letterIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('trace_welcome');
    }, 350);
    return () => clearTimeout(timer);
  }, [audioManager]);

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
    setLetterIdx(idx);
    clearCanvasOnly();
    audioManager.playSFX('bubble');
    audioManager.playVoice(TRACE_LETTERS[idx].audioKey);
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
    const newStars = Array.from({ length: 3 }).map(() => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 28,
      y: y + (Math.random() - 0.5) * 28,
      size: Math.random() * 10 + 8,
    }));
    setParticles((prev) => [...prev.slice(-20), ...newStars]);
  };

  const handlePointerDown = (e) => {
    if (hasWon) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    checkProximity(x, y);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || hasWon) return;
    const { x, y } = getCoordinates(e);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#FBBF24';
      ctx.shadowBlur = 12;

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
    currentLetter.checkpoints.forEach((cp) => {
      if (!visitedCheckpoints.includes(cp.id)) {
        const dist = Math.hypot(cp.x - x, cp.y - y);
        if (dist < 48) {
          audioManager.playSFX('sparkle');
          const nextVisited = [...visitedCheckpoints, cp.id];
          setVisitedCheckpoints(nextVisited);

          if (nextVisited.length === currentLetter.checkpoints.length) {
            handleLetterCompleted();
          }
        }
      }
    });
  };

  const handleLetterCompleted = () => {
    audioManager.playSFX('bell');
    audioManager.playSFX('celebration');
    audioManager.playVoice('trace_win');
    registrarAcierto(currentLetter.key);

    const nextCompleted = completedLetters.includes(currentLetter.key)
      ? completedLetters
      : [...completedLetters, currentLetter.key];
    setCompletedLetters(nextCompleted);

    setTimeout(() => {
      if (letterIdx + 1 < TRACE_LETTERS.length && nextCompleted.length < 3) {
        handleSelectLetterIdx(letterIdx + 1);
      } else if (nextCompleted.length >= 3 && !hasWon) {
        setHasWon(true);
      }
    }, 1500);
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-purple-100/90 via-pink-100/80 to-blue-100/90 select-none">
      {/* HEADER */}
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
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/90 rounded-full border border-pink-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Trazos Mágicos: {currentLetter.title} ({currentLetter.word})
            </h1>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-pink-600" />
          <span>Borrar</span>
        </button>
      </header>

      {/* SELECTOR DE LETRAS PARA TRAZAR (MAYÚSCULAS Y MINÚSCULAS) */}
      <div className="z-20 w-full max-w-3xl mx-auto my-1 flex flex-wrap items-center justify-center gap-1.5">
        {TRACE_LETTERS.map((item, idx) => {
          const isCurrent = idx === letterIdx;
          const isDone = completedLetters.includes(item.key);
          return (
            <button
              key={item.key}
              onClick={() => handleSelectLetterIdx(idx)}
              className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm border-2 flex items-center gap-1 transition-all ${
                isCurrent
                  ? 'bg-pink-500 text-white border-yellow-300 scale-110 shadow-md'
                  : isDone
                  ? 'bg-emerald-400 text-white border-white'
                  : 'bg-white/80 text-purple-800 border-pink-200'
              }`}
            >
              <span>{item.pair}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* ÁREA DE JUEGO: CANVAS TÁCTIL */}
      <main className="z-10 w-full max-w-lg mx-auto my-auto flex flex-col items-center">
        <div className="relative w-[330px] h-[340px] sm:w-[380px] sm:h-[380px] bg-white/95 rounded-3xl border-4 border-pink-300 shadow-2xl p-2 flex items-center justify-center overflow-hidden touch-none">
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <path
              d={currentLetter.svgPath}
              fill="none"
              stroke="#FCE7F3"
              strokeWidth="44"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={currentLetter.svgPath}
              fill="none"
              stroke="#F472B6"
              strokeWidth="6"
              strokeDasharray="12,12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {currentLetter.checkpoints.map((cp) => {
              const isPassed = visitedCheckpoints.includes(cp.id);
              return (
                <g key={cp.id} transform={`translate(${cp.x}, ${cp.y})`}>
                  <circle
                    r={isPassed ? 17 : 15}
                    fill={isPassed ? '#10B981' : '#FBBF24'}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                  {cp.label && (
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill="#FFFFFF"
                      fontSize="13"
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

        {/* Barra de progreso */}
        <div className="mt-2 w-full max-w-xs flex items-center justify-between gap-2 bg-white/85 px-4 py-1.5 rounded-2xl border border-pink-200">
          <span className="text-xs font-black text-purple-700">Trazo:</span>
          <div className="flex-1 h-2.5 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-amber-400 transition-all duration-300"
              style={{
                width: `${Math.round(
                  (visitedCheckpoints.length /
                    currentLetter.checkpoints.length) *
                    100
                )}%`,
              }}
            />
          </div>
          <span className="text-xs font-black text-pink-600">
            {Math.round(
              (visitedCheckpoints.length / currentLetter.checkpoints.length) *
                100
            )}
            %
          </span>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => audioManager.playVoice(currentLetter.audioKey)}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white border border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar letra {currentLetter.pair}</span>
        </button>

        <span className="text-xs font-extrabold text-purple-700">
          🧚‍♀️ Pasa tu dedito por los puntos numerados
        </span>
      </footer>

      {hasWon && (
        <VictoryModal
          title="¡Artista de las Letras!"
          subtitle="¡Qué hermoso dibujas las letras mayúsculas y minúsculas, Cristal!"
          levelIdToUnlock="mision2"
          yarnReward={2}
          onReturnToMap={() => {
            setHasWon(false);
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
