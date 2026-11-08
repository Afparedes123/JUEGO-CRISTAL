import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Lock, Star, Heart, Home, ArrowLeft, Volume2 } from 'lucide-react';

const NIVELES = [
  {
    id: 'mision1',
    screenId: 'minijuego_trazos',
    numero: 1,
    titulo: 'Misión 1: Trazos Brillantes',
    subtitulo: 'Dibuja la letra A con luz mágica',
    emoji: '✍️',
    colorBg: 'from-pink-400 via-rose-400 to-pink-500',
    colorBorder: 'border-pink-300',
    icono: '✨',
  },
  {
    id: 'mision2',
    screenId: 'minijuego_burbujas',
    numero: 2,
    titulo: 'Misión 2: Burbujas de Sonido',
    subtitulo: 'Atrapa las burbujas que suenan como MA',
    emoji: '🫧',
    colorBg: 'from-purple-400 via-fuchsia-400 to-purple-500',
    colorBorder: 'border-purple-300',
    icono: '🎵',
  },
  {
    id: 'mision3',
    screenId: 'minijuego_caldero',
    numero: 3,
    titulo: 'Misión 3: Caldero Mágico',
    subtitulo: 'Construye la palabra ME-SA con magia',
    emoji: '🍲',
    colorBg: 'from-sky-400 via-blue-400 to-indigo-500',
    colorBorder: 'border-sky-300',
    icono: '🌈',
  },
  {
    id: 'mision4',
    screenId: 'level4',
    numero: 4,
    titulo: 'Misión 4: Fiesta Gatuna',
    subtitulo: 'Ordena las cajas para formar palabras',
    emoji: '🎉',
    colorBg: 'from-amber-400 via-orange-400 to-rose-500',
    colorBorder: 'border-amber-300',
    icono: '📦',
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

  // Audio al entrar: "Cristal, elige a dónde vamos hoy."
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('Cristal, elige a dónde vamos hoy.');
    }, 400);

    return () => clearTimeout(timer);
  }, [audioManager]);

  const handleNivelClick = (nivel) => {
    const isDesbloqueado = nivelesDesbloqueados.includes(nivel.id);

    if (isDesbloqueado) {
      // Nivel disponible
      audioManager.playSFX('sparkle');
      audioManager.playSFX('bell');
      navegarA(nivel.screenId);
    } else {
      // Nivel bloqueado
      audioManager.playSFX('lock');
      setShakingId(nivel.id);
      setTimeout(() => setShakingId(null), 600);

      // Requisito: Audio al tocar bloqueado
      audioManager.playVoice(
        'Aún no, Cristal. Primero terminemos el nivel anterior.'
      );
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-purple-100/90 via-pink-100/80 to-blue-100/90 select-none">
      {/* Nubes y estrellas de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 left-1/3 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Estrellitas mágicas */}
        <span className="absolute top-16 left-8 text-2xl text-yellow-300 animate-bounce">✨</span>
        <span className="absolute top-28 right-24 text-xl text-pink-400 animate-pulse">⭐</span>
        <span className="absolute bottom-36 left-1/2 text-2xl text-amber-300 animate-spin">🌟</span>
      </div>

      {/* HEADER SUPERIOR: Botón inicio, Contador de Ovillos y Acceso a la Casa */}
      <header className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Botón Volver al Splash */}
        <button
          onClick={() => navegarA('splash')}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/80 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span className="hidden sm:inline">Inicio</span>
        </button>

        {/* Título de la pantalla */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/85 backdrop-blur-md rounded-full border border-pink-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
              El Mapa Mágico de Cristal
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Barra de Recompensas: Ovillos & Acceso a la Casa de las Gatitas */}
        <div className="flex items-center gap-2">
          {/* Contador de Ovillos de Lana */}
          <div
            title="Tus ovillos de lana mágicos"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm font-black text-amber-800 text-xs sm:text-sm"
          >
            <span className="text-lg">🧶</span>
            <span className="font-mono text-sm sm:text-base font-black">{ovillosDeLana}</span>
            <span className="hidden sm:inline text-xs font-bold text-amber-700">Ovillos</span>
          </div>

          {/* Botón Acceso a la Casa de las Gatitas */}
          <button
            onClick={() => {
              audioManager.playSFX('sparkle');
              navegarA('kittens_house');
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black px-3.5 py-2 rounded-2xl shadow-md shadow-pink-300/60 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm animate-pulse"
          >
            <Home className="w-4 h-4" />
            <span>Casa de Gatitas</span>
          </button>
        </div>
      </header>

      {/* CAMINO CURVO SOBRE NUBES ROSAS (ISLAS / NIVELES) */}
      <main className="z-10 w-full max-w-3xl mx-auto my-auto py-6 sm:py-8">
        <div className="relative flex flex-col gap-6 sm:gap-8 items-center">
          {/* Línea curva conectora de nubes */}
          <div className="absolute left-1/2 top-10 bottom-10 w-3 -translate-x-1/2 bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-300 rounded-full opacity-60 pointer-events-none" />

          {NIVELES.map((nivel, index) => {
            const isDesbloqueado = nivelesDesbloqueados.includes(nivel.id);
            const isShaking = shakingId === nivel.id;
            const isCurrent = isDesbloqueado && (!nivelesDesbloqueados.includes(NIVELES[index + 1]?.id));

            return (
              <div
                key={nivel.id}
                onClick={() => handleNivelClick(nivel)}
                className={`relative group w-full max-w-md cursor-pointer transition-all duration-300 transform ${
                  isShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
                } ${
                  isDesbloqueado
                    ? 'hover:scale-105 active:scale-95'
                    : 'grayscale opacity-75 hover:opacity-90'
                }`}
                style={{
                  animation: isShaking ? 'softWobble 0.5s ease-in-out' : undefined,
                }}
              >
                {/* Nube Rosa de Soporte de la Isla */}
                <div
                  className={`relative flex items-center gap-4 p-3.5 sm:p-4 rounded-3xl border-4 ${
                    isDesbloqueado
                      ? `${nivel.colorBorder} bg-white/95 shadow-xl shadow-pink-200/60`
                      : 'border-slate-300 bg-slate-100/90 shadow-md'
                  } backdrop-blur-md`}
                >
                  {/* Ícono de Nivel con Badge o Candado */}
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-md ${
                      isDesbloqueado
                        ? `bg-gradient-to-tr ${nivel.colorBg} text-white`
                        : 'bg-slate-300 text-slate-500'
                    } ${isCurrent ? 'animate-bounce ring-4 ring-yellow-400 ring-offset-2' : ''}`}
                    style={{ animationDuration: '2s' }}
                  >
                    <span>{nivel.emoji}</span>

                    {/* Candado si está bloqueado */}
                    {!isDesbloqueado && (
                      <div className="absolute inset-0 bg-slate-800/40 rounded-2xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white drop-shadow-md animate-pulse" />
                      </div>
                    )}

                    {/* Estrella de Nivel Actual Desbloqueado */}
                    {isCurrent && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-spin">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                      </span>
                    )}
                  </div>

                  {/* Textos del Nivel */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                          isDesbloqueado
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        Nivel {nivel.numero}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                          ✨ ¡Jugar Aquí! ✨
                        </span>
                      )}
                    </div>
                    <h3 className="font-black text-sm sm:text-lg text-slate-800 truncate">
                      {nivel.titulo}
                    </h3>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-500 leading-tight">
                      {nivel.subtitulo}
                    </p>
                  </div>

                  {/* Flechita o Candado lateral */}
                  <div className="pr-1">
                    {isDesbloqueado ? (
                      <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md group-hover:translate-x-1 transition-transform">
                        ▶
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-500 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ESQUINA INFERIOR IZQUIERDA: GATITA FLOTANTE SALUDANDO (LULÚ) */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-end justify-between">
        <div
          onClick={() => {
            audioManager.playSFX('meow');
            audioManager.playVoice('¡Vamos Cristal, tú puedes lograrlo! Elige una misión.');
          }}
          className="group relative flex items-center gap-2.5 cursor-pointer bg-white/85 backdrop-blur-md px-3.5 py-2 rounded-3xl border-2 border-pink-300 shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          {/* Avatar Gatita Flotante */}
          <div className="relative w-12 h-12 rounded-full bg-pink-100 border-2 border-pink-400 overflow-hidden shadow-inner flex items-center justify-center animate-bounce" style={{ animationDuration: '2.5s' }}>
            <img src="/kitten-guide.jpg" alt="Lulú flotando" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border border-white" />
          </div>

          <div>
            <p className="text-xs font-black text-purple-700 flex items-center gap-1">
              <span>Lulú tu guía</span>
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            </p>
            <p className="text-[11px] font-bold text-pink-600">
              Tócame para escucharnos 🐾
            </p>
          </div>
        </div>

        {/* Botón de Ayuda / Repetición de audio */}
        <button
          onClick={() => {
            audioManager.playVoice('Cristal, elige a dónde vamos hoy.');
          }}
          className="flex items-center gap-1.5 bg-pink-100 hover:bg-pink-200 border border-pink-300 px-3 py-2 rounded-2xl text-xs font-black text-pink-700 shadow-sm transition-all"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Repetir instrucción</span>
        </button>
      </footer>
    </div>
  );
}
