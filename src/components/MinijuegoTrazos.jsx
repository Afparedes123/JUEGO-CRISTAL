import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { Sparkles, ArrowLeft, RotateCcw, Volume2, Star } from 'lucide-react';

// Puntos de control para trazar la letra "A"
const CHECKPOINTS = [
  // Trazo 1: Subida izquierda
  { id: 0, x: 90, y: 320, label: '1', step: 1 },
  { id: 1, x: 145, y: 195, label: '', step: 1 },
  { id: 2, x: 200, y: 70, label: '2', step: 1 },

  // Trazo 2: Bajada derecha
  { id: 3, x: 255, y: 195, label: '', step: 2 },
  { id: 4, x: 310, y: 320, label: '3', step: 2 },

  // Trazo 3: Travesaño horizontal
  { id: 5, x: 135, y: 220, label: '4', step: 3 },
  { id: 6, x: 200, y: 220, label: '', step: 3 },
  { id: 7, x: 265, y: 220, label: '5', step: 3 },
];

export default function MinijuegoTrazos({ onReturnToMap }) {
  const { audioManager, navegarA } = useGame();

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState([]);
  const [particles, setParticles] = useState([]);
  const [hasWon, setHasWon] = useState(false);

  // Audio al inicio: "¡Hola Cristal! Vamos a dibujar la letra A. Sigue la luz mágica."
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice(
        '¡Hola Cristal! Vamos a dibujar la letra A. Sigue la luz mágica.'
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [audioManager]);

  // Limpiar y resetear el lienzo
  const handleReset = () => {
    setVisitedCheckpoints([]);
    setParticles([]);
    setHasWon(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    audioManager.playSFX('bubble');
    audioManager.playVoice(
      '¡Hola Cristal! Vamos a dibujar la letra A. Sigue la luz mágica.'
    );
  };

  // Obtener coordenadas relativas al Canvas/SVG
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Agregar partículas de estrellas brillantes
  const spawnStarParticles = (x, y) => {
    const newStars = Array.from({ length: 4 }).map(() => ({
      id: Math.random(),
      x: x + (Math.random() - 0.5) * 30,
      y: y + (Math.random() - 0.5) * 30,
      size: Math.random() * 12 + 8,
      color: ['#FBBF24', '#F472B6', '#A855F7', '#60A5FA'][
        Math.floor(Math.random() * 4)
      ],
    }));

    setParticles((prev) => [...prev.slice(-25), ...newStars]);
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

    // Dibujar trazo de purpurina mágica en Canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#F472B6';
      ctx.lineWidth = 14;
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

  // Validar si el dedo de Cristal pasa cerca de los checkpoints
  const checkProximity = (x, y) => {
    CHECKPOINTS.forEach((cp) => {
      if (!visitedCheckpoints.includes(cp.id)) {
        const dist = Math.hypot(cp.x - x, cp.y - y);
        if (dist < 42) {
          // Checkpoint alcanzado!
          audioManager.playSFX('sparkle');
          const nextVisited = [...visitedCheckpoints, cp.id];
          setVisitedCheckpoints(nextVisited);

          // Si alcanzó todos los checkpoints de la letra "A"
          if (nextVisited.length === CHECKPOINTS.length) {
            triggerWin();
          }
        }
      }
    });
  };

  // Función Central de Victoria del Minijuego
  const triggerWin = () => {
    setHasWon(true);
    audioManager.playSFX('bell');
    audioManager.playSFX('celebration');

    // Audio de victoria requerido: "¡Qué hermoso dibujas, Cristal!"
    audioManager.playVoice('¡Qué hermoso dibujas, Cristal!');
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-purple-100/90 via-pink-100/80 to-blue-100/90 select-none">
      {/* HEADER DE NAVEGACIÓN Y TÍTULO */}
      <header className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/85 backdrop-blur-md rounded-full border border-pink-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Trazos Brillantes: Letra A
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
          title="Borrar y empezar de nuevo"
        >
          <RotateCcw className="w-4 h-4 text-pink-600" />
          <span className="hidden sm:inline">Borrar</span>
        </button>
      </header>

      {/* ÁREA DE JUEGO: SVG GUÍA Y CANVAS TÁCTIL */}
      <main className="z-10 w-full max-w-lg mx-auto my-auto flex flex-col items-center">
        {/* Instrucción visual amigable */}
        <div className="mb-3 text-center">
          <div className="inline-flex items-center gap-2 bg-white/95 px-4 py-1.5 rounded-full shadow-md border border-pink-200 text-xs sm:text-sm font-extrabold text-purple-700 animate-pulse">
            <span>✨ Sigue la luz mágica con tu dedito para dibujar la A ✨</span>
          </div>
        </div>

        {/* Contenedor del Canvas de Trazos */}
        <div className="relative w-[340px] h-[360px] sm:w-[400px] sm:h-[400px] bg-white/90 backdrop-blur-md rounded-3xl border-4 border-pink-300 shadow-2xl p-2 flex items-center justify-center overflow-hidden touch-none">
          {/* Silueta SVG guía de la Letra A */}
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            {/* Camino guía punteado */}
            <path
              d="M 90,320 L 200,70 L 310,320 M 135,220 L 265,220"
              fill="none"
              stroke="#FCE7F3"
              strokeWidth="42"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 90,320 L 200,70 L 310,320 M 135,220 L 265,220"
              fill="none"
              stroke="#F472B6"
              strokeWidth="6"
              strokeDasharray="12,12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Checkpoints Guía con Destellos */}
            {CHECKPOINTS.map((cp) => {
              const isPassed = visitedCheckpoints.includes(cp.id);
              return (
                <g key={cp.id} transform={`translate(${cp.x}, ${cp.y})`}>
                  {/* Círculo de checkpoint */}
                  <circle
                    r={isPassed ? 16 : 14}
                    fill={isPassed ? '#10B981' : '#FBBF24'}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className={!isPassed ? 'animate-pulse' : ''}
                  />
                  {cp.label && (
                    <text
                      textAnchor="middle"
                      dy="5"
                      fill="#FFFFFF"
                      fontWeight="900"
                      fontSize="14"
                    >
                      {isPassed ? '✓' : cp.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Lienzo Canvas para el trazo fluido de Cristal */}
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          />

          {/* Rastro de partículas de estrellas */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {particles.map((p) => (
              <span
                key={p.id}
                style={{
                  left: p.x,
                  top: p.y,
                  color: p.color,
                  fontSize: `${p.size}px`,
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-ping"
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Progreso de la letra */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-black text-purple-700">Progreso:</span>
          <div className="w-48 h-3 bg-pink-100 rounded-full border border-pink-300 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-yellow-400 transition-all duration-300"
              style={{
                width: `${(visitedCheckpoints.length / CHECKPOINTS.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold text-pink-700">
            {visitedCheckpoints.length}/{CHECKPOINTS.length}
          </span>
        </div>
      </main>

      {/* FOOTER: Repetición de audio */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            audioManager.playVoice(
              '¡Hola Cristal! Vamos a dibujar la letra A. Sigue la luz mágica.'
            );
          }}
          className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar instrucción</span>
        </button>

        <span className="text-xs font-extrabold text-purple-600">
          🐾 ¡Dibuja con nosotras, Cristal!
        </span>
      </footer>

      {/* MODAL DE VICTORIA CUANDO COMPLETA EL TRAZO */}
      {hasWon && (
        <VictoryModal
          title="¡Dibujaste la letra A!"
          subtitle="¡Qué hermoso dibujas, Cristal!"
          levelIdToUnlock="mision2"
          yarnReward={1}
          onReturnToMap={() => {
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
