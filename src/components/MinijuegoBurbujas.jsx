import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, Star } from 'lucide-react';

const TARGET_SYLLABLE = 'MA';
const OTHER_SYLLABLES = ['ME', 'PA', 'SO', 'LU', 'TA', 'MI', 'PO'];

export default function MinijuegoBurbujas({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  const [score, setScore] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [poppingId, setPoppingId] = useState(null);
  const [wobblingId, setWobblingId] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const nextBubbleId = useRef(1);

  // Audio al inicio: "Cristal, ayúdanos a atrapar las burbujas que suenan como 'MA'."
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice(
        'Cristal, ayúdanos a atrapar las burbujas que suenan como MA.'
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [audioManager]);

  // Generador continuo de burbujas flotantes
  useEffect(() => {
    if (hasWon) return;

    // Crear burbuja inicial
    const createBubble = () => {
      const isTarget = Math.random() < 0.45;
      const syllable = isTarget
        ? TARGET_SYLLABLE
        : OTHER_SYLLABLES[Math.floor(Math.random() * OTHER_SYLLABLES.length)];

      const newBubble = {
        id: nextBubbleId.current++,
        syllable,
        isTarget,
        left: Math.random() * 75 + 10, // Entre 10% y 85% de ancho
        speed: Math.random() * 2.5 + 4, // 4s a 6.5s de duración
        size: Math.random() * 15 + 75, // 75px a 90px
      };

      setBubbles((prev) => [...prev.slice(-12), newBubble]);
    };

    // Crear 3 burbujas de entrada
    createBubble();
    createBubble();

    const interval = setInterval(createBubble, 1800);
    return () => clearInterval(interval);
  }, [hasWon]);

  // Clic/Touch en una burbuja
  const handleBubbleTouch = (bubble) => {
    if (hasWon) return;

    if (bubble.isTarget) {
      // ¡ACIERTO! Toca "MA"
      audioManager.playSFX('pop');
      audioManager.playSFX('sparkle');
      registrarAcierto('MA');

      setPoppingId(bubble.id);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setPoppingId(null);
      }, 400);

      const newScore = score + 1;
      setScore(newScore);

      // Requisito: Al llegar a 3 aciertos, winGame()
      if (newScore >= 3) {
        setTimeout(() => {
          setHasWon(true);
        }, 500);
      }
    } else {
      // FALLO: Toca otra sílaba (no penaliza, pero corrige)
      audioManager.playSFX('wobble');
      registrarFallo(bubble.syllable);

      // Vibración táctil si el dispositivo lo soporta
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
      }

      setWobblingId(bubble.id);
      setTimeout(() => setWobblingId(null), 600);

      // Audio al fallar: "Ups, esa no es. Intenta buscar la que suena 'MA', Cristal."
      audioManager.playVoice(
        'Ups, esa no es. Intenta buscar la que suena MA, Cristal.'
      );
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-sky-100/90 via-purple-100/80 to-pink-100/90 select-none">
      {/* HEADER SUPERIOR */}
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

        {/* Sílaba Objetivo destacada */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full border-2 border-pink-300 shadow-md">
            <span className="text-xs font-black text-slate-700 uppercase">Busca la sílaba:</span>
            <span className="text-xl sm:text-2xl font-black text-pink-600 animate-bounce">
              {TARGET_SYLLABLE}
            </span>
          </div>
        </div>

        {/* Marcador de Aciertos (Meta: 3) */}
        <div className="flex items-center gap-1.5 bg-white/90 border-2 border-pink-300 px-3.5 py-1.5 rounded-2xl shadow-sm font-black text-xs sm:text-sm">
          <span>Estrellas:</span>
          <div className="flex gap-1 text-base text-yellow-400">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < score ? 'animate-bounce text-yellow-400' : 'text-slate-300'}>
                ★
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ÁREA DE JUEGO: BURBUJAS FLOTANTES HACIA ARRIBA */}
      <main className="relative z-10 w-full max-w-2xl h-[420px] sm:h-[480px] mx-auto my-auto overflow-hidden rounded-3xl border-4 border-white/80 bg-gradient-to-b from-sky-200/40 to-pink-100/50 backdrop-blur-sm shadow-2xl">
        {bubbles.map((b) => {
          const isPopping = poppingId === b.id;
          const isWobbling = wobblingId === b.id;

          return (
            <div
              key={b.id}
              onClick={() => handleBubbleTouch(b)}
              onTouchStart={() => handleBubbleTouch(b)}
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDuration: `${b.speed}s`,
              }}
              className={`absolute bottom-[-100px] cursor-pointer rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl border-4 shadow-lg transition-transform ${
                isPopping ? 'scale-150 opacity-0 duration-300' : ''
              } ${isWobbling ? 'animate-[wiggle_0.2s_ease-in-out_infinite] border-red-300' : ''} ${
                b.isTarget
                  ? 'bg-gradient-to-tr from-pink-300/90 to-rose-200/90 border-pink-200 text-pink-800'
                  : 'bg-gradient-to-tr from-purple-200/90 to-indigo-200/90 border-purple-200 text-purple-800'
              } animate-[floatUp_linear_infinite] hover:scale-110 active:scale-95`}
            >
              {/* Reflejo brillante de burbuja */}
              <span className="absolute top-2 left-3 w-4 h-2 bg-white/70 rounded-full rotate-[-30deg]" />
              <span className="drop-shadow">{b.syllable}</span>
            </div>
          );
        })}
      </main>

      {/* FOOTER: Repetir instrucción */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            audioManager.playVoice(
              'Cristal, ayúdanos a atrapar las burbujas que suenan como MA.'
            );
          }}
          className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar objetivo</span>
        </button>

        <span className="text-xs font-extrabold text-purple-600">
          🐾 ¡Atrapa 3 burbujas con MA para ganar!
        </span>
      </footer>

      {/* MODAL DE VICTORIA CUANDO CONSIGUE 3 ACIERTOS */}
      {hasWon && (
        <VictoryModal
          title="¡Atrapaste las Sílabas MA!"
          subtitle="¡Eres maravillosa escuchando las palabras, Cristal!"
          levelIdToUnlock="mision3"
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
