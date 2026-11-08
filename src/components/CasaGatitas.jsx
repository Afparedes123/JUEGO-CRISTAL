import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Sparkles, Heart, Gift, Volume2, Star } from 'lucide-react';

export default function CasaGatitas() {
  const { ovillosDeLana, gastarOvillos, navegarA, audioManager } = useGame();

  // Estados interactivos de regalos en la habitación
  const [hasMilk, setHasMilk] = useState(false);
  const [hasBow, setHasBow] = useState(false);
  const [hasToy, setHasToy] = useState(false);

  // Efectos visuales de celebración
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [giftMessage, setGiftMessage] = useState('¡Hola Cristal! Toca un regalo para nosotras.');
  const [shakingYarn, setShakingYarn] = useState(false);

  // Audio al entrar: "¡Gracias por jugar, Cristal! ¿Qué quieres regalarnos hoy?"
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice(
        '¡Gracias por jugar, Cristal! ¿Qué quieres regalarnos hoy?'
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [audioManager]);

  // Manejo de dar un regalo a las gatitas
  const handleGiveGift = (type) => {
    // Intentar restar 1 ovillo del estado global
    const success = gastarOvillos(1);

    if (success) {
      // ÉXITO: hay ovillos suficientes
      setIsCelebrating(true);
      audioManager.playSFX('sparkle');
      audioManager.playSFX('meow');

      // Audio obligatorio: "¡Miau! Gracias Cristal, nos encanta."
      audioManager.playVoice('¡Miau! Gracias Cristal, nos encanta.');

      if (type === 'milk') {
        setHasMilk(true);
        setGiftMessage('🥛 ¡Qué rica lechita mágica! ¡Miau gracias, Cristal!');
      } else if (type === 'bow') {
        setHasBow(true);
        setGiftMessage('🎀 ¡Qué lazo tan hermoso! Ahora nos vemos muy mágicas.');
      } else if (type === 'toy') {
        setHasToy(true);
        setGiftMessage('🧸 ¡Un juguete nuevo para saltar y jugar juntas!');
      }

      setTimeout(() => setIsCelebrating(false), 2000);
    } else {
      // FALLO: ovillos insuficientes
      setShakingYarn(true);
      setTimeout(() => setShakingYarn(false), 600);

      // Audio obligatorio: "Necesitamos ganar más ovillos mágicos, Cristal. ¡Vamos a jugar!"
      audioManager.playVoice(
        'Necesitamos ganar más ovillos mágicos, Cristal. ¡Vamos a jugar!'
      );
      setGiftMessage('🧶 Te faltan ovillos mágicos. ¡Juega en el mapa para ganar más!');
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-pink-100 via-purple-50 to-amber-50 select-none">
      {/* Luces y brillos de habitación mágica */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Estrellitas en la pared */}
        <span className="absolute top-16 left-16 text-yellow-300 text-2xl animate-bounce">✨</span>
        <span className="absolute top-24 right-20 text-pink-400 text-xl animate-pulse">💖</span>
        <span className="absolute bottom-40 left-12 text-purple-400 text-2xl animate-pulse delay-500">🌟</span>
      </div>

      {/* HEADER SUPERIOR: Volver al Mapa, Título y Ovillos */}
      <header className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Volver al Mapa</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-white/85 backdrop-blur-md rounded-full border border-pink-300 shadow-sm">
            <Gift className="w-4 h-4 text-pink-500" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
              La Casa de las Gatitas
            </h1>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Contador de Ovillos con animación de shake si no alcanzan */}
        <div
          className={`flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 px-3.5 py-1.5 rounded-2xl shadow-sm font-black text-amber-800 text-xs sm:text-sm transition-transform ${
            shakingYarn ? 'animate-bounce border-red-400 scale-110' : ''
          }`}
        >
          <span className="text-xl">🧶</span>
          <span className="font-mono text-base font-black">{ovillosDeLana}</span>
          <span className="hidden sm:inline text-xs font-bold text-amber-700">Ovillos</span>
        </div>
      </header>

      {/* ÁREA CENTRAL: LAS DOS GATITAS FELICES EN SU HABITACIÓN */}
      <main className="z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center">
        {/* Mensaje de diálogo flotante */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/95 px-5 py-2 rounded-2xl shadow-md border-2 border-pink-200 text-xs sm:text-sm font-extrabold text-purple-700 animate-pulse">
            <span>{giftMessage}</span>
          </div>
        </div>

        {/* Ilustración de la Habitación con las 2 Gatitas */}
        <div className="relative w-full max-w-lg bg-gradient-to-b from-white/90 to-pink-50/90 rounded-3xl border-4 border-pink-200 shadow-2xl p-6 sm:p-8 flex items-center justify-around overflow-hidden">
          {/* Corazones flotantes si están celebrando */}
          {isCelebrating && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="text-4xl text-pink-500 animate-ping absolute -top-4">💖</span>
              <span className="text-4xl text-yellow-400 animate-bounce absolute -top-8 left-16">✨</span>
              <span className="text-4xl text-purple-500 animate-ping absolute -top-4 right-16">💖</span>
            </div>
          )}

          {/* Gatita Lulú en la Habitación */}
          <div className={`relative flex flex-col items-center transition-transform ${isCelebrating ? 'scale-110 animate-bounce' : 'animate-pulse'}`}>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-pink-100 to-pink-200 border-4 border-pink-300 shadow-lg flex items-center justify-center overflow-hidden">
              <img src="/kitten-guide.jpg" alt="Lulú feliz" className="w-full h-full object-cover" />
              {/* Lazo mágico desbloqueado */}
              {hasBow && (
                <span className="absolute -top-1 left-2 text-3xl animate-bounce">🎀</span>
              )}
            </div>
            <span className="mt-2 text-xs font-black text-pink-700 bg-white/90 px-3 py-0.5 rounded-full shadow-sm">
              Lulú
            </span>
          </div>

          {/* Objetos Intermedios regalados por Cristal */}
          <div className="flex flex-col items-center gap-2">
            {/* Plato de leche mágica */}
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all shadow-md ${
                hasMilk ? 'bg-amber-100 border-amber-300 scale-110 animate-bounce' : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
              title={hasMilk ? '¡Plato con leche mágica!' : 'Platito vacío'}
            >
              <span>{hasMilk ? '🥛' : '🥣'}</span>
            </div>

            {/* Juguete / Ratoncito */}
            <div
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all shadow-md ${
                hasToy ? 'bg-purple-100 border-purple-300 scale-110 animate-bounce' : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
              title={hasToy ? '¡Juguete divertido!' : 'Cesta vacía'}
            >
              <span>{hasToy ? '🧸' : '🧺'}</span>
            </div>
          </div>

          {/* Gatita Mimi en la Habitación */}
          <div className={`relative flex flex-col items-center transition-transform ${isCelebrating ? 'scale-110 animate-bounce' : 'animate-pulse delay-150'}`}>
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-purple-100 to-indigo-200 border-4 border-purple-300 shadow-lg flex items-center justify-center overflow-hidden">
              <img src="/kitten-celebration.jpg" alt="Mimi feliz" className="w-full h-full object-cover" />
              {/* Sombrerito o estrellita mágica */}
              {hasBow && (
                <span className="absolute -top-1 right-2 text-3xl animate-bounce">🌸</span>
              )}
            </div>
            <span className="mt-2 text-xs font-black text-purple-700 bg-white/90 px-3 py-0.5 rounded-full shadow-sm">
              Mimi
            </span>
          </div>
        </div>
      </main>

      {/* PARTE INFERIOR: 3 BOTONES VISUALES GRANDES DE REGALOS (1 OVILLO CADA UNO) */}
      <footer className="z-20 w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-4">
        {/* Botón 1: Dar Leche */}
        <button
          onClick={() => handleGiveGift('milk')}
          className="group relative flex-1 w-full sm:w-auto flex items-center justify-center gap-3 p-3.5 bg-gradient-to-tr from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black rounded-3xl shadow-lg shadow-sky-300/50 hover:scale-105 active:scale-95 transition-all border-2 border-white"
        >
          <span className="text-3xl group-hover:scale-125 transition-transform">🥛</span>
          <div className="text-left">
            <p className="text-sm font-black leading-tight">Dar Leche</p>
            <div className="flex items-center gap-1 text-xs text-sky-100 font-bold">
              <span>Coste: 1</span>
              <span>🧶</span>
            </div>
          </div>
        </button>

        {/* Botón 2: Poner Lazo */}
        <button
          onClick={() => handleGiveGift('bow')}
          className="group relative flex-1 w-full sm:w-auto flex items-center justify-center gap-3 p-3.5 bg-gradient-to-tr from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-black rounded-3xl shadow-lg shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all border-2 border-white"
        >
          <span className="text-3xl group-hover:scale-125 transition-transform">🎀</span>
          <div className="text-left">
            <p className="text-sm font-black leading-tight">Poner Lazo</p>
            <div className="flex items-center gap-1 text-xs text-pink-100 font-bold">
              <span>Coste: 1</span>
              <span>🧶</span>
            </div>
          </div>
        </button>

        {/* Botón 3: Dar Juguete */}
        <button
          onClick={() => handleGiveGift('toy')}
          className="group relative flex-1 w-full sm:w-auto flex items-center justify-center gap-3 p-3.5 bg-gradient-to-tr from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white font-black rounded-3xl shadow-lg shadow-purple-300/50 hover:scale-105 active:scale-95 transition-all border-2 border-white"
        >
          <span className="text-3xl group-hover:scale-125 transition-transform">🧸</span>
          <div className="text-left">
            <p className="text-sm font-black leading-tight">Dar Juguete</p>
            <div className="flex items-center gap-1 text-xs text-purple-100 font-bold">
              <span>Coste: 1</span>
              <span>🧶</span>
            </div>
          </div>
        </button>
      </footer>
    </div>
  );
}
