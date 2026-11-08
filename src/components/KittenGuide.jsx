import React, { useEffect, useState } from 'react';
import { audioManager } from '../services/audioManager';
import { kittenVoice } from '../utils/speech';
import { Volume2, Sparkles, Heart } from 'lucide-react';

export default function KittenGuide({ 
  currentDialogue, 
  customImage = '/fairy-lulu.jpg', 
  isCelebration = false,
  onKittenClick
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  useEffect(() => {
    const unsub1 = audioManager.subscribe((state) => {
      if (state.isVoiceSpeaking !== undefined) {
        setIsSpeaking(state.isVoiceSpeaking);
      }
    });
    const unsub2 = kittenVoice.subscribe((state) => {
      if (state.isSpeaking !== undefined) {
        setIsSpeaking(state.isSpeaking);
      }
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleKittenTouch = () => {
    audioManager.playSFX('meow');
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
    if (onKittenClick) {
      onKittenClick();
    } else if (currentDialogue) {
      audioManager.playVoice(currentDialogue);
    }
  };

  const handleRepeatVoice = () => {
    if (currentDialogue) {
      audioManager.playVoice(currentDialogue);
    } else {
      kittenVoice.repeat();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 max-w-3xl mx-auto my-2 px-3">
      {/* Fairy Kitten Avatar Container */}
      <div
        className="relative group cursor-pointer flex-shrink-0"
        onClick={handleKittenTouch}
        title="¡Toca a la hadita gatuna para escucharla o darle cariñitos!"
      >
        {/* Magic Aura */}
        <div
          className={`absolute -inset-2 rounded-full blur-md transition-all duration-500 ${
            isSpeaking
              ? 'bg-gradient-to-r from-pink-400 via-yellow-300 to-purple-400 opacity-90 animate-pulse'
              : 'bg-gradient-to-r from-pink-300 to-purple-300 opacity-40 group-hover:opacity-80'
          }`}
        />

        {/* Kitten Image Circle */}
        <div
          className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 ${
            isSpeaking
              ? 'border-pink-400 shadow-xl scale-105'
              : 'border-white shadow-lg'
          } transition-transform duration-300 bg-pink-100 flex items-center justify-center`}
        >
          <img
            src={customImage}
            alt="Hadita Gatuna Guía de Cristal"
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
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 text-pink-600 px-3 py-1 rounded-full shadow-lg border border-pink-200 animate-pop-scale text-sm font-bold z-20">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>¡Miau!</span>
          </div>
        )}

        {/* Small badge */}
        <div className="text-center mt-1">
          <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-extrabold px-3 py-0.5 rounded-full shadow-sm">
            Hadita Lulú ✨
          </span>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="relative flex-1 w-full sm:w-auto">
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-5 border-2 border-pink-200 shadow-md transition-all">
          {/* Arrow pointing to kitten */}
          <div className="hidden sm:block absolute top-8 -left-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-pink-200" />
          <div className="hidden sm:block absolute top-8 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />

          {/* Text dialogue with large legible font */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-base sm:text-xl font-bold text-slate-800 leading-snug tracking-wide">
                {currentDialogue}
              </p>
            </div>

            {/* Repeat Audio Button */}
            <button
              type="button"
              onClick={handleRepeatVoice}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
                isSpeaking
                  ? 'bg-pink-100 text-pink-700 animate-pulse border border-pink-300'
                  : 'bg-pink-500 hover:bg-pink-600 active:scale-95 text-white shadow-pink-200'
              }`}
              title="Escuchar a la hadita gatuna de nuevo"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">
                {isSpeaking ? 'Hablando...' : 'Escuchar'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
