import React, { useState } from 'react';
import KittenGuide from './KittenGuide';
import { kittenVoice } from '../utils/speech';
import { playBellChime, playCuteMeow } from '../utils/soundEffects';
import { Sparkles, Play, Star, BookOpen, Heart, Award } from 'lucide-react';

export default function HomeScreen({ onStartGame }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [dialogue, setDialogue] = useState(
    '¡Hola Cristal! Soy Misi, tu gatita mágica. ¡Presiona el botón para empezar nuestra gran aventura!'
  );

  const handleStartClick = () => {
    if (hasStarted) return;
    setHasStarted(true);

    // Play pleasant audio effects
    playCuteMeow();
    playBellChime();

    const welcomeGreeting = '¡Hola Cristal! Soy tu nueva amiga gatita. ¡Vamos a jugar y aprender juntas!';
    setDialogue(welcomeGreeting);

    // Speak welcome audio as requested:
    // "Al hacer clic en un botón de '¡Empezar a Jugar!', la gatita debe decir en audio: '¡Hola Cristal! Soy tu nueva amiga gatita. ¡Vamos a jugar y aprender juntas!'."
    kittenVoice.speak(welcomeGreeting, {
      onEnd: () => {
        // Smoothly proceed to Level 1
        setTimeout(() => {
          onStartGame();
        }, 500);
      }
    });

    // Fallback timer if speech ends or browser delays callback
    setTimeout(() => {
      onStartGame();
    }, 4500);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[85vh] py-6 px-4">
      {/* Decorative Floating Stars & Elements */}
      <div className="absolute top-4 left-6 text-yellow-400 animate-star-twinkle select-none pointer-events-none">
        <Star className="w-8 h-8 fill-yellow-300" />
      </div>
      <div className="absolute top-12 right-10 text-pink-400 animate-star-twinkle delay-500 select-none pointer-events-none">
        <Sparkles className="w-7 h-7 text-pink-400" />
      </div>
      <div className="absolute bottom-16 left-12 text-purple-400 animate-star-twinkle delay-1000 select-none pointer-events-none">
        <Star className="w-6 h-6 fill-purple-300" />
      </div>
      <div className="absolute bottom-20 right-16 text-yellow-400 animate-star-twinkle delay-700 select-none pointer-events-none">
        <Sparkles className="w-9 h-9 text-amber-400" />
      </div>

      {/* Hero Welcome Card */}
      <div className="text-center max-w-2xl mx-auto mt-2">
        {/* Welcome Tag */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-full font-bold text-sm sm:text-base shadow-lg shadow-pink-200 mb-4 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>¡Especialmente para Cristal!</span>
          <Heart className="w-4 h-4 fill-white" />
        </div>

        {/* Title optimized with wide letter spacing for reading clarity */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 tracking-wide drop-shadow-sm leading-tight">
          Aventuras con Gatitos Mágicos
        </h1>
        <p className="mt-3 text-lg sm:text-xl font-medium text-slate-700 tracking-wide">
          Un mundo lleno de estrellas, vocales y diversión para aprender a leer jugando ✨
        </p>
      </div>

      {/* Guide Kitten with Speech */}
      <div className="w-full my-4">
        <KittenGuide 
          currentDialogue={dialogue} 
          customImage="/kitten-guide.jpg"
          onKittenClick={() => {
            playCuteMeow();
            kittenVoice.speak('¡Hola Cristal! Haz clic en el gran botón rosa para que juguemos juntas.');
          }}
        />
      </div>

      {/* Start Button & Kid-friendly features */}
      <div className="flex flex-col items-center gap-4 z-10">
        <button
          onClick={handleStartClick}
          disabled={hasStarted}
          className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-3xl font-extrabold text-xl sm:text-2xl text-white shadow-2xl transition-all transform ${
            hasStarted 
              ? 'bg-gradient-to-r from-pink-400 to-purple-400 opacity-90 scale-100 cursor-wait' 
              : 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-purple-600 hover:scale-105 active:scale-95 shadow-pink-300'
          }`}
          style={{ letterSpacing: '0.04em' }}
        >
          <span className="absolute -top-3 -right-2 bg-yellow-400 text-yellow-950 text-xs px-2.5 py-1 rounded-full font-bold shadow-md animate-pulse">
            ¡Miau!
          </span>
          <Play className="w-7 h-7 fill-white group-hover:rotate-12 transition-transform" />
          <span>{hasStarted ? '¡Comenzando...!' : '¡Empezar a Jugar!'}</span>
          <Sparkles className="w-6 h-6 text-yellow-300 group-hover:scale-125 transition-transform" />
        </button>

        {/* Friendly Guidance Badges for Cristal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-600 mt-2">
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-pink-100 shadow-sm">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Lectura sin estrés</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-purple-100 shadow-sm">
            <Award className="w-4 h-4 text-purple-500" />
            <span>Voz de gatita guía</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-yellow-100 shadow-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>Nivel 1: Vocales</span>
          </div>
        </div>
      </div>
    </div>
  );
}
