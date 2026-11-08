import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Lock, Star, Heart, Home, ArrowLeft, Volume2 } from 'lucide-react';

// 8 Niveles Completos al estilo "Leo con Grin: Aprender a Leer y Escribir"
const NIVELES = [
  {
    id: 'mision1',
    screenId: 'minijuego_abecedario',
    numero: 1,
    titulo: 'Isla 1: El Abecedario Mágico (A-Z)',
    subtitulo: 'Vocales y Abecedario en Mayúsculas y Minúsculas',
    emoji: '🔤',
    colorBg: 'from-pink-400 via-rose-400 to-pink-500',
    colorBorder: 'border-pink-300',
  },
  {
    id: 'mision2',
    screenId: 'minijuego_burbujas',
    numero: 2,
    titulo: 'Isla 2: Burbujas de Sílabas',
    subtitulo: 'Atrapa y escucha sílabas juntas: MA, PE, SI, LO, TU',
    emoji: '🫧',
    colorBg: 'from-purple-400 via-fuchsia-400 to-purple-500',
    colorBorder: 'border-purple-300',
  },
  {
    id: 'mision3',
    screenId: 'minijuego_silabario',
    numero: 3,
    titulo: 'Isla 3: Libro de Sílabas (Leo con Grin)',
    subtitulo: 'Todas las Consonantes + Vocales (ma, me, mi, mo, mu...)',
    emoji: '📖',
    colorBg: 'from-indigo-400 via-purple-500 to-pink-500',
    colorBorder: 'border-indigo-300',
  },
  {
    id: 'mision4',
    screenId: 'minijuego_trazos',
    numero: 4,
    titulo: 'Isla 4: Trazos de Luz (Escribir Letras)',
    subtitulo: 'Dibuja letras Mayúsculas y Minúsculas con tu dedito',
    emoji: '✍️',
    colorBg: 'from-amber-400 via-orange-400 to-pink-500',
    colorBorder: 'border-amber-300',
  },
  {
    id: 'mision5',
    screenId: 'level3',
    numero: 5,
    titulo: 'Isla 5: Nubes de Sílabas',
    subtitulo: 'Une la nube de la consonante con la nube de la vocal',
    emoji: '☁️',
    colorBg: 'from-sky-400 via-blue-400 to-indigo-500',
    colorBorder: 'border-sky-300',
  },
  {
    id: 'mision6',
    screenId: 'minijuego_caldero',
    numero: 6,
    titulo: 'Isla 6: Caldero de Palabras',
    subtitulo: 'Une sílabas para formar MESA, MAMÁ, PAPÁ, SAPO y LUPA',
    emoji: '🍲',
    colorBg: 'from-emerald-400 via-teal-400 to-cyan-500',
    colorBorder: 'border-emerald-300',
  },
  {
    id: 'mision7',
    screenId: 'minijuego_escribir',
    numero: 7,
    titulo: 'Isla 7: Escuela de Escritura',
    subtitulo: 'Escribe palabras completas letra por letra (ABC y abc)',
    emoji: '📝',
    colorBg: 'from-rose-400 via-pink-500 to-purple-500',
    colorBorder: 'border-rose-300',
  },
  {
    id: 'mision8',
    screenId: 'level4',
    numero: 8,
    titulo: 'Isla 8: Fiesta de Lectura',
    subtitulo: 'Ordena las cajas mágicas de GATO, PELO, LUNA y CASA',
    emoji: '🎉',
    colorBg: 'from-yellow-400 via-amber-500 to-rose-500',
    colorBorder: 'border-yellow-300',
  },
];

export default function MapaMagico() {
  const {
    nivelesDesbloqueados,
    ovillosDeLana,
    navegarA,
    audioManager,
  } = useGame();

  const [shakingId, setShakingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('map_welcome');
    }, 350);

    return () => clearTimeout(timer);
  }, [audioManager]);

  const handleNivelClick = (nivel) => {
    // Permitir entrar a todos los niveles desbloqueados (por defecto todos están abiertos para que Cristal aprenda libremente)
    const isDesbloqueado = true || nivelesDesbloqueados.includes(nivel.id);

    if (isDesbloqueado) {
      audioManager.playSFX('sparkle');
      audioManager.playSFX('bell');
      navegarA(nivel.screenId);
    } else {
      audioManager.playSFX('lock');
      setShakingId(nivel.id);
      setTimeout(() => setShakingId(null), 600);
      audioManager.playVoice('map_locked');
    }
  };

  return (
    <div className="relative w-full min-h-[94vh] flex flex-col justify-between p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-purple-100/95 via-pink-100/85 to-blue-100/95 select-none">
      {/* Nubes y estrellas de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 left-1/3 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-700" />
        <span className="absolute top-16 left-8 text-2xl text-yellow-300 animate-bounce">✨</span>
        <span className="absolute top-28 right-24 text-xl text-pink-400 animate-pulse">🧚‍♀️</span>
      </div>

      {/* HEADER SUPERIOR */}
      <header className="z-20 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => navegarA('splash')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Inicio</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/90 rounded-full border-2 border-pink-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              Academia de Lectura y Escritura de Cristal
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            title="Tus ovillos de lana mágicos"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm font-black text-amber-800 text-xs sm:text-sm"
          >
            <span className="text-lg">🧶</span>
            <span className="font-mono text-sm sm:text-base font-black">{ovillosDeLana}</span>
            <span className="hidden sm:inline text-xs font-bold text-amber-700">Ovillos</span>
          </div>

          <button
            onClick={() => {
              audioManager.playSFX('sparkle');
              navegarA('kittens_house');
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-3.5 py-2 rounded-2xl shadow-md hover:scale-105 transition-all text-xs sm:text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Casa de Haditas</span>
          </button>
        </div>
      </header>

      {/* CUADRÍCULA DE LAS 8 ISLAS EDUCATIVAS */}
      <main className="z-10 w-full max-w-5xl mx-auto my-auto py-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {NIVELES.map((nivel) => {
            const isShaking = shakingId === nivel.id;

            return (
              <div
                key={nivel.id}
                onClick={() => handleNivelClick(nivel)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.03] active:scale-95 ${
                  isShaking ? 'animate-wiggle' : ''
                }`}
              >
                <div
                  className={`relative flex items-center gap-3.5 p-3.5 rounded-3xl border-3 ${nivel.colorBorder} bg-white/95 shadow-lg hover:shadow-xl backdrop-blur-md`}
                >
                  {/* Ícono de la Isla */}
                  <div
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md bg-gradient-to-tr ${nivel.colorBg} text-white shrink-0`}
                  >
                    <span>{nivel.emoji}</span>
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow">
                      <Star className="w-3 h-3 fill-white text-white" />
                    </span>
                  </div>

                  {/* Textos del Nivel */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        Nivel {nivel.numero}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ✨ Disponible
                      </span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-slate-800 truncate">
                      {nivel.titulo}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 leading-tight">
                      {nivel.subtitulo}
                    </p>
                  </div>

                  <div className="pr-1">
                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                      ▶
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER CON LAS HADITAS GATUNAS REALISTAS */}
      <footer className="z-20 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div
          onClick={() => {
            audioManager.playSFX('meow');
            audioManager.playVoice('map_guide_cheer');
          }}
          className="group flex items-center gap-3 cursor-pointer bg-white/90 px-4 py-2 rounded-3xl border-2 border-pink-300 shadow-md hover:scale-105 transition-all"
        >
          <div className="flex -space-x-2">
            <img
              src="/fairy-lulu.jpg"
              alt="Hadita Lulú"
              className="w-11 h-11 rounded-full border-2 border-pink-400 object-cover shadow"
            />
            <img
              src="/fairy-mimi.jpg"
              alt="Hadita Mimi"
              className="w-11 h-11 rounded-full border-2 border-purple-400 object-cover shadow"
            />
          </div>
          <div>
            <p className="text-xs font-black text-purple-800 flex items-center gap-1">
              <span>Haditas Lulú y Mimi</span>
              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            </p>
            <p className="text-[11px] font-bold text-pink-600">
              ¡Toca cualquier isla para aprender a leer y escribir, Cristal! 🧚‍♀️
            </p>
          </div>
        </div>

        <button
          onClick={() => audioManager.playVoice('map_welcome')}
          className="flex items-center gap-1.5 bg-pink-100 hover:bg-pink-200 border border-pink-300 px-3.5 py-2 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Repetir bienvenida</span>
        </button>
      </footer>
    </div>
  );
}
