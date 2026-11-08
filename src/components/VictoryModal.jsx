import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Heart, ArrowRight, Star } from 'lucide-react';

export default function VictoryModal({
  title = '¡Misión Cumplida!',
  subtitle = '¡Qué increíble lo hiciste, Cristal!',
  levelIdToUnlock = null,
  yarnReward = 1,
  onReturnToMap,
}) {
  const { sumarOvillos, desbloquearNivel, navegarA, audioManager } = useGame();

  useEffect(() => {
    // 1. Reducir volumen del BGM para que la voz triunfal destaque claramente
    audioManager.setBGMVolume(0.05);

    // 2. Efectos sonoros de fanfarria estelar
    audioManager.playSFX('celebration');
    audioManager.playSFX('bell');

    // 3. Audio de recompensa para Cristal
    const timer = setTimeout(() => {
      audioManager.playVoice(
        '¡Ganaste un ovillo mágico para nuestras gatitas, Cristal!'
      );
    }, 500);

    // 4. Actualizar estado global: sumar ovillo y desbloquear siguiente nivel
    sumarOvillos(yarnReward);
    if (levelIdToUnlock) {
      desbloquearNivel(levelIdToUnlock);
    }

    return () => {
      clearTimeout(timer);
      // Restaurar volumen suave del BGM al desmontar
      audioManager.setBGMVolume(0.25);
    };
  }, []);

  const handleReturn = () => {
    audioManager.playSFX('sparkle');
    if (onReturnToMap) {
      onReturnToMap();
    } else {
      navegarA('map');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md animate-fade-in select-none">
      {/* Lluvia de estrellas mágica en el fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-10 left-10 text-4xl text-yellow-300 animate-bounce">✨</span>
        <span className="absolute top-20 right-16 text-3xl text-pink-300 animate-pulse">🌟</span>
        <span className="absolute bottom-16 left-20 text-4xl text-amber-300 animate-bounce delay-300">⭐</span>
        <span className="absolute bottom-24 right-20 text-3xl text-purple-300 animate-pulse delay-700">✨</span>
      </div>

      {/* Tarjeta de Celebración */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-white via-pink-50 to-purple-50 rounded-3xl border-4 border-pink-300 shadow-2xl p-6 sm:p-8 text-center flex flex-col items-center animate-bounce" style={{ animationDuration: '2s' }}>
        {/* Halo de destellos */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-pink-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl mb-3 animate-spin" style={{ animationDuration: '8s' }}>
          <span>🌟</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 rounded-full text-pink-700 font-extrabold text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>¡Victoria Mágica!</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700 mb-1">
          {title}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-600 mb-5">
          {subtitle}
        </p>

        {/* Recompensa del Ovillo Mágico */}
        <div className="w-full bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-3 mb-6 shadow-inner flex items-center justify-center gap-3">
          <span className="text-3xl animate-bounce">🧶</span>
          <div className="text-left">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider block">
              ¡Recompensa Ganada!
            </span>
            <span className="text-sm font-extrabold text-purple-800">
              +{yarnReward} Ovillo de Lana Mágico
            </span>
          </div>
        </div>

        {/* Botón Gigante "Volver al Mapa" */}
        <button
          onClick={handleReturn}
          className="w-full group py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-base sm:text-lg shadow-xl shadow-pink-300/60 border-2 border-white flex items-center justify-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
        >
          <span>Volver al Mapa</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
