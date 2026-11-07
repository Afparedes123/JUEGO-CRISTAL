import React, { useState, useEffect } from 'react';
import { kittenVoice } from '../utils/speech';
import { playCuteMeow, playSoftBounce } from '../utils/soundEffects';
import { Sparkles, Home, Volume2, Lock, Unlock, Settings, Heart, Check } from 'lucide-react';

export default function HeaderNav({ 
  currentScreen, 
  onNavigate, 
  level2Unlocked,
  level3Unlocked,
  level4Unlocked
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [pitch, setPitch] = useState(1.0); // Tono 1.0 natural humano (no distorsiona)
  const [rate, setRate] = useState(0.98);  // Ritmo fluido
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

  useEffect(() => {
    const updateVoices = () => {
      const latinVoices = kittenVoice.getAvailableLatinVoices();
      setAvailableVoices(latinVoices);
      if (kittenVoice.selectedVoice) {
        setSelectedVoiceURI(kittenVoice.selectedVoice.voiceURI || kittenVoice.selectedVoice.name);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTestVoice = () => {
    playCuteMeow();
    kittenVoice.speak('¡Hola Cristal! Soy tu amiga gatita. ¡Vamos a leer juntas con mucho cariño!');
  };

  const handleVoiceSelect = (e) => {
    const uri = e.target.value;
    setSelectedVoiceURI(uri);
    kittenVoice.setVoiceByURI(uri);
    kittenVoice.speak('¡Hola Cristal! Esta es mi nueva voz. ¿Te gusta cómo suena?');
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

  const getCountryFlag = (lang, name) => {
    const str = `${lang} ${name}`.toLowerCase();
    if (str.includes('mx') || str.includes('mexic')) return '🇲🇽 México';
    if (str.includes('co') || str.includes('colomb')) return '🇨🇴 Colombia';
    if (str.includes('us') || str.includes('united states') || str.includes('estados unidos')) return '🇺🇸 Latino';
    if (str.includes('ar') || str.includes('argent')) return '🇦🇷 Argentina';
    if (str.includes('cl') || str.includes('chile')) return '🇨🇱 Chile';
    if (str.includes('pe') || str.includes('peru')) return '🇵🇪 Perú';
    if (str.includes('419')) return '🌎 Latinoamérica';
    if (str.includes('es') || str.includes('spain')) return '🇪🇸 España';
    return '🌎 Español';
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-pink-200/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-sm">
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
            <div className="flex items-center gap-1 font-extrabold text-sm sm:text-base text-pink-600 leading-tight">
              <span>Gatitos Mágicos</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
              <span>Para Cristal</span>
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            </p>
          </div>
        </div>

        {/* Level Navigation Pills */}
        <nav className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-end">
          {/* Home */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'home'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inicio</span>
          </button>

          {/* Level 1: Vocales */}
          <button
            onClick={() => onNavigate('level1')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level1'
                ? 'bg-pink-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-pink-50'
            }`}
            title="Nivel 1: Atrapa la Vocal"
          >
            <span>Nivel 1</span>
          </button>

          {/* Level 2: Alimenta al Minino */}
          <button
            onClick={() => {
              if (level2Unlocked) {
                onNavigate('level2');
              } else {
                playSoftBounce();
                kittenVoice.speak('Cristal, primero atrapa 5 vocales en el Nivel 1 para desbloquear el Nivel 2.');
              }
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level2'
                ? 'bg-purple-600 text-white shadow-sm'
                : level2Unlocked
                ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-80'
            }`}
            title={level2Unlocked ? 'Ir al Nivel 2: Alimenta al Minino' : 'Completa el Nivel 1 para desbloquear'}
          >
            {level2Unlocked ? (
              <Unlock className="w-3 h-3 text-purple-600" />
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
            <span>Nivel 2</span>
          </button>

          {/* Level 3: Saltos en las Nubes */}
          <button
            onClick={() => {
              if (level3Unlocked) {
                onNavigate('level3');
              } else {
                playSoftBounce();
                kittenVoice.speak('Cristal, primero alimenta a los gatitos en el Nivel 2 para desbloquear el Nivel 3.');
              }
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level3'
                ? 'bg-sky-500 text-white shadow-sm'
                : level3Unlocked
                ? 'text-sky-700 bg-sky-50 hover:bg-sky-100'
                : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-80'
            }`}
            title={level3Unlocked ? 'Ir al Nivel 3: Saltos en las Nubes' : 'Completa el Nivel 2 para desbloquear'}
          >
            {level3Unlocked ? (
              <Unlock className="w-3 h-3 text-sky-600" />
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
            <span>Nivel 3</span>
          </button>

          {/* Level 4: Gran Fiesta */}
          <button
            onClick={() => {
              if (level4Unlocked) {
                onNavigate('level4');
              } else {
                playSoftBounce();
                kittenVoice.speak('Cristal, primero junta las nubes en el Nivel 3 para desbloquear la Gran Fiesta del Nivel 4.');
              }
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'level4'
                ? 'bg-amber-500 text-white shadow-sm'
                : level4Unlocked
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-400 bg-slate-100 cursor-not-allowed opacity-80'
            }`}
            title={level4Unlocked ? 'Ir al Nivel 4: Gran Fiesta' : 'Completa el Nivel 3 para desbloquear'}
          >
            {level4Unlocked ? (
              <Unlock className="w-3 h-3 text-amber-600" />
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
            <span>Nivel 4</span>
          </button>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-xl text-slate-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            title="Ajustes de Voz Latina"
          >
            <Settings className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Voice Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-14 right-3 sm:right-6 bg-white rounded-3xl p-5 border-2 border-pink-200 shadow-2xl w-80 sm:w-96 z-50 text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100 mb-3">
            <span className="font-extrabold text-sm text-pink-700 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-pink-500" />
              Voz de Mujer Latina (Fluida y Humana)
            </span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-xs font-bold">
            {/* Latin Voice Selector */}
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                Selecciona la voz para Cristal:
              </label>
              <select
                value={selectedVoiceURI}
                onChange={handleVoiceSelect}
                className="w-full bg-pink-50 border-2 border-pink-200 rounded-xl p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500"
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map((v) => {
                    const flag = getCountryFlag(v.lang, v.name);
                    const isNeural = v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google');
                    return (
                      <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                        {flag} - {v.name.replace(/Microsoft|Google|Apple/g, '').trim()} {isNeural ? '✨(Natural)' : ''}
                      </option>
                    );
                  })
                ) : (
                  <option value="">Cargando voces latinas...</option>
                )}
              </select>
              <p className="text-[10px] text-pink-600 mt-1 font-medium">
                💡 Consejo: Las voces marcadas con ✨(Natural) suenan 100% humanas y fluidas.
              </p>
            </div>

            {/* Natural Speed */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Velocidad de habla:</span>
                <span className="text-pink-600 font-mono">{rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.15"
                step="0.02"
                value={rate}
                onChange={handleRateChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Natural Tone */}
            <div>
              <div className="flex justify-between mb-1">
                <span>Tono natural:</span>
                <span className="text-pink-600 font-mono">{pitch.toFixed(2)}x (Humano)</span>
              </div>
              <input
                type="range"
                min="0.9"
                max="1.1"
                step="0.02"
                value={pitch}
                onChange={handlePitchChange}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleTestVoice}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>Probar voz latina ahora</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
