import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Heart, Play, Volume2, Star } from 'lucide-react';

export default function SplashScreen({ onStartGame }) {
  const { audioManager, navegarA } = useGame();
  const [areKittensAwake, setAreKittensAwake] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Audio al entrar: "¡Hola Cristal! Toca el botón brillante para jugar con nosotras."
  useEffect(() => {
    // Si el navegador permite autoplay sonará de inmediato; si requiere toque,
    // audioManager lo encola para sonar al primer toque en la pantalla en español latino.
    const welcomeVoiceTimer = setTimeout(() => {
      audioManager.playVoice('splash_welcome');
    }, 400);

    return () => {
      clearTimeout(welcomeVoiceTimer);
    };
  }, [audioManager]);

  // Al tocar cualquier parte de la pantalla, las gatitas despiertan
  const handleScreenTouch = () => {
    if (!areKittensAwake) {
      setAreKittensAwake(true);
      audioManager.playSFX('sparkle');
      audioManager.playSFX('meow');
    }
    if (!hasInteracted) {
      setHasInteracted(true);
      // Iniciar suavemente la música de fondo instrumental (caja de música mágica)
      audioManager.playBGM();
      // Asegurar que el audio de bienvenida suene en voz de estudio
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

    // Transición suave hacia el Mapa Mágico
    if (onStartGame) {
      onStartGame();
    } else {
      navegarA('map');
    }
  };

  return (
    <div
      onClick={handleScreenTouch}
      className="relative w-full min-h-[92vh] flex flex-col items-center justify-between p-4 sm:p-8 cursor-pointer select-none overflow-hidden bg-gradient-to-b from-purple-200/80 via-pink-100/90 to-blue-100/80 font-sans"
    >
      {/* Nubes flotantes de ensueño pastel de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-300/40 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-10 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Estrellitas mágicas centelleantes */}
        <span className="absolute top-12 left-12 text-yellow-300 text-3xl animate-bounce">✨</span>
        <span className="absolute top-20 right-16 text-pink-400 text-2xl animate-pulse">⭐</span>
        <span className="absolute bottom-24 left-16 text-purple-400 text-3xl animate-pulse delay-500">🌟</span>
        <span className="absolute bottom-32 right-12 text-yellow-300 text-3xl animate-bounce delay-300">✨</span>
      </div>

      {/* Título de Fantasía Pastel */}
      <header className="z-10 text-center mt-2 sm:mt-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 backdrop-blur-md rounded-full border-2 border-pink-300 shadow-lg shadow-pink-200/50 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-xs sm:text-sm font-extrabold text-purple-700 tracking-wider uppercase">
            Aventuras de Cristal
          </span>
          <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-ping" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 drop-shadow-sm">
          Gatitas Mágicas
        </h1>
        <p className="text-xs sm:text-sm font-bold text-pink-700 mt-1">
          {areKittensAwake ? '¡Lulú y Mimi están despiertas para jugar!' : 'Toca la pantalla para despertar a las gatitas 🌙'}
        </p>
      </header>

      {/* ÁREA CENTRAL: LAS DOS GATITAS MÁGICAS (DURMIENDO / DESPIERTAS) */}
      <div className="z-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 my-auto">
        {/* GATITA 1: LULÚ (Rosa & Fresa Estelar) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setAreKittensAwake(true);
            audioManager.playSFX('meow');
            audioManager.playVoice('lulu_intro');
          }}
          className={`relative group flex flex-col items-center transition-all duration-700 ${
            areKittensAwake ? 'scale-105' : 'scale-95 animate-pulse'
          }`}
        >
          {/* Globito de ensueño o emoción */}
          <div className="absolute -top-12 z-20 transition-all duration-500">
            {!areKittensAwake ? (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-purple-200 text-purple-600 font-extrabold text-xs">
                <span>Z</span>
                <span className="text-sm">z</span>
                <span className="text-base animate-bounce">z...</span>
                <span className="text-xs">💤</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-full shadow-lg shadow-pink-300 font-black text-xs animate-bounce">
                <span>¡Miau Cristal!</span>
                <Heart className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            )}
          </div>

          {/* Ilustración Vectorial de Lulú */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Orejas de Gato Rosa */}
              <polygon points="22,35 12,12 38,24" fill="#F472B6" />
              <polygon points="20,32 15,18 32,26" fill="#FCE7F3" />
              <polygon points="78,35 88,12 62,24" fill="#F472B6" />
              <polygon points="80,32 85,18 68,26" fill="#FCE7F3" />

              {/* Cabeza de Gatita */}
              <circle cx="50" cy="54" r="34" fill="#FFF1F2" />
              <circle cx="50" cy="54" r="32" fill="#FFFFFF" />

              {/* Mejillas sonrosadas */}
              <ellipse cx="30" cy="62" rx="7" ry="4" fill="#FDA4AF" opacity="0.6" />
              <ellipse cx="70" cy="62" rx="7" ry="4" fill="#FDA4AF" opacity="0.6" />

              {/* Naricita y hocico */}
              <polygon points="48,58 52,58 50,61" fill="#FB7185" />
              <path d="M47,63 Q50,66 53,63" fill="none" stroke="#FB7185" strokeWidth="1.5" strokeLinecap="round" />

              {/* Bigotes */}
              <line x1="24" y1="58" x2="10" y2="56" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="24" y1="62" x2="11" y2="64" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="76" y1="58" x2="90" y2="56" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="76" y1="62" x2="89" y2="64" stroke="#F472B6" strokeWidth="1.2" strokeLinecap="round" />

              {/* Ojos: Durmiendo (Arco suave) vs Despierta (Estrellas brillantes) */}
              {!areKittensAwake ? (
                <>
                  {/* Ojitos dormidos felices */}
                  <path d="M30,48 Q37,42 44,48" fill="none" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M56,48 Q63,42 70,48" fill="none" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Ojitos despiertos brillantes */}
                  <circle cx="37" cy="46" r="6.5" fill="#831843" />
                  <circle cx="39" cy="44" r="2.2" fill="#FFFFFF" />
                  <circle cx="35" cy="48" r="1.2" fill="#FFFFFF" />

                  <circle cx="63" cy="46" r="6.5" fill="#831843" />
                  <circle cx="65" cy="44" r="2.2" fill="#FFFFFF" />
                  <circle cx="61" cy="48" r="1.2" fill="#FFFFFF" />
                </>
              )}

              {/* Estrellita mágica en la frente */}
              <polygon points="50,28 52,32 56,33 53,36 54,40 50,38 46,40 47,36 44,33 48,32" fill="#FBBF24" />
            </svg>
          </div>
          <span className="mt-2 text-sm font-black text-pink-700 bg-white/80 px-3 py-0.5 rounded-full shadow-sm">
            Lulú ✨
          </span>
        </div>

        {/* BOTÓN GIGANTE LATIENTE DE JUGAR (CENTRO) */}
        <div className="flex flex-col items-center">
          <button
            onClick={handlePlayButtonClick}
            title="¡Toca para Jugar, Cristal!"
            className="group relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white shadow-[0_0_50px_rgba(244,114,182,0.7)] hover:shadow-[0_0_70px_rgba(236,72,153,0.9)] border-4 border-white transition-all transform hover:scale-110 active:scale-95 animate-bounce"
            style={{ animationDuration: '1.8s' }}
          >
            {/* Anillos de brillo pulsante */}
            <span className="absolute inset-0 rounded-full border-4 border-pink-300 animate-ping opacity-60 pointer-events-none" />
            <span className="absolute -inset-2 rounded-full border-2 border-yellow-200 animate-pulse pointer-events-none" />

            {/* Contenido del botón */}
            <div className="flex flex-col items-center justify-center">
              <Play className="w-12 h-12 sm:w-16 sm:h-16 fill-white text-white translate-x-1 drop-shadow-md group-hover:scale-110 transition-transform" />
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase drop-shadow">
                ¡JUGAR!
              </span>
            </div>
          </button>
          <span className="text-xs font-extrabold text-purple-700 mt-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            ✨ Toca aquí, Cristal ✨
          </span>
        </div>

        {/* GATITA 2: MIMI (Lavanda & Alitas Mágicas) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setAreKittensAwake(true);
            audioManager.playSFX('meow');
            audioManager.playVoice('mimi_intro');
          }}
          className={`relative group flex flex-col items-center transition-all duration-700 ${
            areKittensAwake ? 'scale-105' : 'scale-95 animate-pulse delay-200'
          }`}
        >
          {/* Globito de ensueño o emoción */}
          <div className="absolute -top-12 z-20 transition-all duration-500">
            {!areKittensAwake ? (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-purple-200 text-purple-600 font-extrabold text-xs">
                <span>Z</span>
                <span className="text-sm">z</span>
                <span className="text-base animate-bounce delay-150">z...</span>
                <span className="text-xs">💤</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full shadow-lg shadow-purple-300 font-black text-xs animate-bounce">
                <span>¡Vamos a jugar!</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
            )}
          </div>

          {/* Ilustración Vectorial de Mimi */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-b from-purple-100 to-indigo-100 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Orejas de Gato Lavanda */}
              <polygon points="22,35 12,12 38,24" fill="#A855F7" />
              <polygon points="20,32 15,18 32,26" fill="#F3E8FF" />
              <polygon points="78,35 88,12 62,24" fill="#A855F7" />
              <polygon points="80,32 85,18 68,26" fill="#F3E8FF" />

              {/* Cabeza de Gatita */}
              <circle cx="50" cy="54" r="34" fill="#FAF5FF" />
              <circle cx="50" cy="54" r="32" fill="#FFFFFF" />

              {/* Mejillas sonrosadas lavanda */}
              <ellipse cx="30" cy="62" rx="7" ry="4" fill="#D8B4FE" opacity="0.7" />
              <ellipse cx="70" cy="62" rx="7" ry="4" fill="#D8B4FE" opacity="0.7" />

              {/* Naricita y hocico */}
              <polygon points="48,58 52,58 50,61" fill="#9333EA" />
              <path d="M47,63 Q50,66 53,63" fill="none" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" />

              {/* Bigotes */}
              <line x1="24" y1="58" x2="10" y2="56" stroke="#C084FC" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="24" y1="62" x2="11" y2="64" stroke="#C084FC" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="76" y1="58" x2="90" y2="56" stroke="#C084FC" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="76" y1="62" x2="89" y2="64" stroke="#C084FC" strokeWidth="1.2" strokeLinecap="round" />

              {/* Ojos: Durmiendo (Arco suave) vs Despierta (Púrpura estelar) */}
              {!areKittensAwake ? (
                <>
                  <path d="M30,48 Q37,42 44,48" fill="none" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M56,48 Q63,42 70,48" fill="none" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="37" cy="46" r="6.5" fill="#4C1D95" />
                  <circle cx="39" cy="44" r="2.2" fill="#FFFFFF" />
                  <circle cx="35" cy="48" r="1.2" fill="#FFFFFF" />

                  <circle cx="63" cy="46" r="6.5" fill="#4C1D95" />
                  <circle cx="65" cy="44" r="2.2" fill="#FFFFFF" />
                  <circle cx="61" cy="48" r="1.2" fill="#FFFFFF" />
                </>
              )}

              {/* Lazo de hada sobre una orejita */}
              <ellipse cx="30" cy="24" rx="5" ry="3" fill="#EC4899" transform="rotate(-20, 30, 24)" />
              <ellipse cx="38" cy="22" rx="5" ry="3" fill="#EC4899" transform="rotate(20, 38, 22)" />
              <circle cx="34" cy="23" r="2.5" fill="#FDE047" />
            </svg>
          </div>
          <span className="mt-2 text-sm font-black text-purple-700 bg-white/80 px-3 py-0.5 rounded-full shadow-sm">
            Mimi 🌸
          </span>
        </div>
      </div>

      {/* PIE DE PÁGINA: Indicador amigable y botón de repetición de voz */}
      <footer className="z-10 w-full max-w-md flex items-center justify-between px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            audioManager.playVoice('splash_welcome');
          }}
          className="flex items-center gap-1.5 text-xs font-extrabold text-pink-700 bg-pink-100 hover:bg-pink-200 px-3 py-1.5 rounded-xl transition-all"
          title="Escuchar a las gatitas otra vez"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar a las gatitas</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600">
          <span>Creado con amor para</span>
          <span className="font-extrabold text-pink-600">Cristal</span>
          <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
        </div>
      </footer>
    </div>
  );
}
