import React, { useEffect, useState } from 'react';
import { kittenVoice } from '../utils/speech';
import { playCuteMeow } from '../utils/soundEffects';
import { Volume2, Sparkles, Heart } from 'lucide-react';

export default function KittenGuide({ 
  currentDialogue, 
  customImage = '/kitten-guide.jpg', 
  isCelebration = false,
  onKittenClick
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const unsubscribe = kittenVoice.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return unsubscribe;
  }, []);

  const handleKittenTouch = () => {
    playCuteMeow();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    if (onKittenClick) {
      onKittenClick();
    } else {
      kittenVoice.repeat();
    }
  };

  const handleRepeatVoice = () => {
    kittenVoice.repeat();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 max-w-3xl mx-auto my-3 px-4">
      {/* Kitten Avatar Container */}
      <div className="relative group cursor-pointer flex-shrink-0" onClick={handleKittenTouch} title="¡Toca a la gatita para escucharla o mimarla!">
        {/* Magic Aura */}
        <div className={`absolute -inset-2 rounded-full blur-md transition-all duration-500 ${
          isSpeaking 
            ? 'bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400 opacity-90 animate-pulse' 
            : 'bg-gradient-to-r from-pink-300 to-purple-300 opacity-40 group-hover:opacity-80'
        }`}></div>

        {/* Kitten Image Circle */}
        <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 ${
          isSpeaking ? 'border-pink-400 shadow-xl scale-105' : 'border-white shadow-lg'
        } transition-transform duration-300 bg-pink-100 flex items-center justify-center`}>
          <img 
            src={customImage} 
            alt="Gatita Mágica Guía de Cristal" 
            className={`w-full h-full object-cover select-none ${
              isSpeaking ? 'animate-float-fast' : 'animate-float-slow'
            }`}
          />

          {/* Speaking indicator overlay */}
          {isSpeaking && (
            <div className="absolute bottom-2 right-2 bg-pink-500 text-white p-1 rounded-full shadow-md animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-200" />
            </div>
          )}
        </div>

        {/* Love Heart Pop Effect */}
        {showHeart && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 text-pink-600 px-3 py-1 rounded-full shadow-lg border border-pink-200 animate-pop-scale text-sm font-bold z-20">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>¡Miau!</span>
          </div>
        )}

        {/* Small badge */}
        <div className="text-center mt-1">
          <span className="inline-block bg-pink-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-sm">
            Misi la Gatita ✨
          </span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="relative flex-1 w-full sm:w-auto">
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border-2 border-pink-200 shadow-md transition-all">
          {/* Arrow pointing to kitten */}
          <div className="hidden sm:block absolute top-10 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-pink-200"></div>
          <div className="hidden sm:block absolute top-10 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white"></div>

          {/* Text dialogue with large legible font */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-lg sm:text-xl font-bold text-slate-800 leading-snug tracking-wide">
                {currentDialogue}
              </p>
            </div>

            {/* Repeat Audio Button */}
            <button
              onClick={handleRepeatVoice}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isSpeaking 
                  ? 'bg-pink-100 text-pink-700 animate-pulse border border-pink-300' 
                  : 'bg-pink-500 hover:bg-pink-600 active:scale-95 text-white shadow-pink-200'
              }`}
              title="Escuchar a la gatita de nuevo"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isSpeaking ? 'Hablando...' : 'Escuchar'}</span>
            </button>
          </div>

          {/* Hint for Cristal */}
          <div className="mt-2 pt-2 border-t border-pink-100 flex items-center justify-between text-xs text-pink-600 font-medium">
            <span>🐾 Toca la gatita o el botón para escuchar su vocecita mágica</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Gatitos Mágicos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
