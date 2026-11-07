import React, { useState } from 'react';
import { kittenVoice } from '../utils/speech';
import { playBellChime, playCuteMeow } from '../utils/soundEffects';
import { Sparkles, Home, Volume2, Lock, Unlock, Settings, HelpCircle, Heart } from 'lucide-react';

export default function HeaderNav({ 
  currentScreen, 
  onNavigate, 
  level2Unlocked,
  fontFamily,
  setFontFamily
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [pitch, setPitch] = useState(1.55);
  const [rate, setRate] = useState(0.93);

  const handleTestVoice = () => {
    playCuteMeow();
    kittenVoice.speak('¡Hola Cristal! Esta es mi voz de gatita mágica. ¡Miau!');
  };

  const handlePitchChange = (e) => {
    const val = parseFloat(e.target.value);
    setPitch(val);
    kittenVoice.setPitch(val);
  };

  const handleRateChange = (e) => {
    const val = parseFloat(e.target.value);
    setRate(val);
    kittenVoice.setRate(val);
  };

  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-pink-200/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer group"
          title="Ir al Inicio"
        >
          <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-pink-300 overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <img src="/kitten-guide.jpg" alt="Logo Gatitos Mágicos" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-1 font-extrabold text-base sm:text-lg text-pink-600 leading-tight">
              <span>Gatitos Mágicos</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
              <span>Para Cristal</span>
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            </p>
          </div>
        </div>

        {/* Level Navigation Pills */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'home'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          <button
            onClick={() => onNavigate('level1')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level1'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <span>Nivel 1</span>
            <span className="hidden md:inline font-normal">(Vocales)</span>
          </button>

          <button
            onClick={() => {
              if (level2Unlocked) {
                onNavigate('level2');
              } else {
                kittenVoice.speak('Cristal, primero atrapa 5 vocales en el Nivel 1 para desbloquear el Nivel 2.');
              }
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level2'
                ? 'bg-purple-600 text-white shadow-sm'
                : level2Unlocked
                ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-80'
            }`}
            title={level2Unlocked ? 'Ir al Nivel 2' : 'Completa el Nivel 1 para desbloquear'}
          >
            {level2Unlocked ? (
              <Unlock className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Nivel 2</span>
          </button>

          {/* Quick Voice & Audio Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            title="Ajustes de Voz y Sonido"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Voice Settings Dropdown / Panel */}
      {showSettings && (
        <div className="absolute top-14 right-3 sm:right-6 bg-white rounded-2xl p-4 border-2 border-pink-200 shadow-xl w-72 sm:w-80 z-50 text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100 mb-3">
            <span className="font-extrabold text-sm text-pink-700 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-pink-500" />
              Ajustes de Voz Mágica
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div>
              <div className="flex justify-between mb-1">
                <span>Tono de voz (Agudo/Gatita):</span>
                <span className="text-pink-600">{pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.9"
                step="0.05"
                value={pitch}
                onChange={handlePitchChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Velocidad de lectura:</span>
                <span className="text-pink-600">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.2"
                step="0.05"
                value={rate}
                onChange={handleRateChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleTestVoice}
              className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Probar voz de la gatita</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
