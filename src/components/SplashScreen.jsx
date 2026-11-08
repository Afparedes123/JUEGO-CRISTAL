import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Heart, Play, Volume2 } from 'lucide-react';

export default function SplashScreen({ onStartGame }) {
  const { audioManager, navegarA } = useGame();
  const [areKittensAwake, setAreKittensAwake] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio al entrar: "¡Hola Cristal! Toca el botón brillante para jugar con nosotras."
  useEffect(() => {
    const welcomeVoiceTimer = setTimeout(() => {
      audioManager.playVoice('splash_welcome');
    }, 400);

    return () => {
      clearTimeout(welcomeVoiceTimer);
    };
  }, [audioManager]);

  // Al tocar cualquier parte de la pantalla, las haditas gatunas despiertan
  const handleScreenTouch = () => {
    if (!areKittensAwake) {
      setAreKittensAwake(true);
      audioManager.playSFX('sparkle');
      audioManager.playSFX('meow');
    }
    if (!hasInteracted) {
      setHasInteracted(true);
      audioManager.playBGM();
      audioManager.playVoice('splash_welcome');
    }
  };

  // Al presionar el botón gigante de JUGAR
  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    setAreKittensAwake(true);
    setHasInteracted(true);
    audioManager.playSFX('sparkle');
    audioManager.playSFX('bell');
    audioManager.playBGM();

    if (onStartGame) {
      onStartGame();
    } else {
      navegarA('map');
    }
  };

  return (
    <div
      onClick={handleScreenTouch}
      className="relative w-full min-h-[94vh] flex flex-col items-center justify-between p-4 sm:p-8 cursor-pointer select-none overflow-hidden bg-gradient-to-b from-purple-200/90 via-pink-100/95 to-indigo-100/90 font-sans"
    >
      {/* Nubes y magia pastel de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-300/40 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000" />

        <span className="absolute top-10 left-10 text-yellow-400 text-3xl animate-bounce">✨</span>
        <span className="absolute top-16 right-14 text-pink-400 text-2xl animate-pulse">🧚‍♀️</span>
        <span className="absolute bottom-24 left-12 text-purple-400 text-3xl animate-pulse delay-500">🌟</span>
        <span className="absolute bottom-28 right-10 text-yellow-400 text-3xl animate-bounce delay-300">✨</span>
      </div>

      {/* ENCABEZADO MÁGICO */}
      <header className="z-10 text-center mt-1 sm:mt-2">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-white/85 backdrop-blur-md rounded-full border-2 border-pink-300 shadow-lg shadow-pink-200/50 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-xs sm:text-sm font-black text-purple-700 tracking-wider uppercase">
            Leo y Escribo con las Haditas Gatunas
          </span>
          <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-ping" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-sm">
          La Academia Mágica de Cristal
        </h1>
        <p className="text-xs sm:text-base font-extrabold text-pink-700 mt-1 bg-white/60 inline-block px-4 py-1 rounded-full">
          {areKittensAwake
            ? '✨ ¡Las Haditas Lulú y Mimi están listas para enseñarte a leer y escribir! ✨'
            : '🌙 Toca la pantalla para despertar a tus Haditas Gatunas 🐾'}
        </p>
      </header>

      {/* ÁREA CENTRAL: AVATARES REALISTAS DE LAS GATITAS HADAS + BOTÓN GIGANTE */}
      <div className="z-10 w-full max-w-5xl mx-auto my-auto py-4">
        {!areKittensAwake ? (
          /* MODO DURMIENDO: Ambas gatitas hadas durmiendo en su nube + Botón de despertar y jugar */
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="relative group">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border-2 border-purple-300 text-purple-700 font-black text-xs sm:text-sm animate-bounce">
                <span>Zzz...</span>
                <span>💤</span>
                <span>¡Tócanos para despertar, Cristal!</span>
              </div>

              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-tr from-pink-300 via-purple-300 to-amber-200 shadow-[0_0_50px_rgba(244,114,182,0.6)]">
                <img
                  src="/fairy-sleeping.jpg"
                  alt="Haditas Gatunas Lulú y Mimi durmiendo"
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
                />
              </div>
            </div>

            {/* BOTÓN GIGANTE LATIENTE DE JUGAR */}
            <div className="flex flex-col items-center">
              <button
                onClick={handlePlayButtonClick}
                title="¡Toca para Jugar, Cristal!"
                className="group relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-[0_0_50px_rgba(244,114,182,0.8)] hover:shadow-[0_0_70px_rgba(236,72,153,1)] border-4 border-white transition-all transform hover:scale-110 active:scale-95 animate-bounce"
                style={{ animationDuration: '1.8s' }}
              >
                <span className="absolute inset-0 rounded-full border-4 border-pink-300 animate-ping opacity-60 pointer-events-none" />
                <div className="flex flex-col items-center justify-center">
                  <Play className="w-12 h-12 sm:w-14 sm:h-14 fill-white text-white translate-x-1 drop-shadow-md" />
                  <span className="text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow">
                    ¡JUGAR!
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* MODO DESPIERTAS: Las 2 Haditas Gatunas Realistas (Lulú y Mimi) con alas brillantes */
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {/* HADITA GATUNA 1: LULÚ */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                audioManager.playSFX('meow');
                audioManager.playVoice('lulu_intro');
              }}
              className="relative group flex flex-col items-center transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <div className="mb-2 flex items-center gap-1 bg-pink-500 text-white px-4 py-1 rounded-full shadow-lg font-black text-xs sm:text-sm animate-bounce">
                <span>¡Hola Cristal! Soy Lulú 🧚‍♀️</span>
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
              </div>

              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-300 shadow-[0_0_40px_rgba(244,114,182,0.7)]">
                <img
                  src="/fairy-lulu.jpg"
                  alt="Hadita Gatuna Lulú"
                  className="w-full h-full object-cover rounded-full border-4 border-white"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 text-pink-700 font-black text-xs sm:text-sm px-4 py-1 rounded-full border-2 border-pink-300 shadow-md whitespace-nowrap">
                  Hadita Lulú ✨
                </span>
              </div>
            </div>

            {/* BOTÓN GIGANTE LATIENTE DE JUGAR (CENTRO) */}
            <div className="flex flex-col items-center my-2">
              <button
                onClick={handlePlayButtonClick}
                title="¡Toca para Jugar, Cristal!"
                className="group relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-[0_0_55px_rgba(244,114,182,0.85)] hover:shadow-[0_0_75px_rgba(236,72,153,1)] border-4 border-white transition-all transform hover:scale-110 active:scale-95 animate-bounce"
                style={{ animationDuration: '1.8s' }}
              >
                <span className="absolute inset-0 rounded-full border-4 border-pink-300 animate-ping opacity-60 pointer-events-none" />
                <span className="absolute -inset-2 rounded-full border-2 border-yellow-200 animate-pulse pointer-events-none" />

                <div className="flex flex-col items-center justify-center">
                  <Play className="w-14 h-14 sm:w-16 sm:h-16 fill-white text-white translate-x-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                  <span className="text-sm sm:text-base font-black tracking-wider uppercase drop-shadow">
                    ¡ENTRAR!
                  </span>
                </div>
              </button>
              <span className="text-xs sm:text-sm font-extrabold text-purple-700 mt-3 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm border border-pink-200">
                ✨ Toca para Aprender a Leer ✨
              </span>
            </div>

            {/* HADITA GATUNA 2: MIMI */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                audioManager.playSFX('meow');
                audioManager.playVoice('mimi_intro');
              }}
              className="relative group flex flex-col items-center transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <div className="mb-2 flex items-center gap-1 bg-purple-600 text-white px-4 py-1 rounded-full shadow-lg font-black text-xs sm:text-sm animate-bounce">
                <span>¡Vamos a leer, Cristal! 🌸</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>

              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-purple-400 via-indigo-300 to-pink-300 shadow-[0_0_40px_rgba(168,85,247,0.7)]">
                <img
                  src="/fairy-mimi.jpg"
                  alt="Hadita Gatuna Mimi"
                  className="w-full h-full object-cover rounded-full border-4 border-white"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 text-purple-700 font-black text-xs sm:text-sm px-4 py-1 rounded-full border-2 border-purple-300 shadow-md whitespace-nowrap">
                  Hadita Mimi 🌸
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PIE DE PÁGINA */}
      <footer className="z-10 w-full max-w-lg flex items-center justify-between px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-pink-200 shadow-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAreKittensAwake(true);
            audioManager.playVoice('splash_welcome');
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-pink-700 bg-pink-100 hover:bg-pink-200 px-3.5 py-1.5 rounded-xl transition-all"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar a las Haditas</span>
        </button>

        <div className="flex items-center gap-1 text-xs font-bold text-purple-700">
          <span>Escuela de Lectura para</span>
          <span className="font-black text-pink-600">Cristal</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
        </div>
      </footer>
    </div>
  );
}
