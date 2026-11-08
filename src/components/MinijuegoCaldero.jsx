import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, Star } from 'lucide-react';

const SYLLABLES_POOL = [
  { id: 'syl-1', text: 'ME', color: 'from-pink-400 to-rose-500' },
  { id: 'syl-2', text: 'SA', color: 'from-purple-400 to-indigo-500' },
  { id: 'syl-3', text: 'TA', color: 'from-amber-400 to-orange-500' },
  { id: 'syl-4', text: 'PA', color: 'from-sky-400 to-blue-500' },
];

export default function MinijuegoCaldero({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  // Zonas del caldero: Posición 0 ("ME") y Posición 1 ("SA")
  const [slot1, setSlot1] = useState(null);
  const [slot2, setSlot2] = useState(null);

  // Sílabas disponibles abajo
  const [availableSyllables, setAvailableSyllables] = useState(SYLLABLES_POOL);

  // Estados visuales
  const [isBubbling, setIsBubbling] = useState(false);
  const [wobbleSlot, setWobbleSlot] = useState(null);
  const [hasWon, setHasWon] = useState(false);

  // Audio al inicio: "Cristal, vamos a hacer magia. Construye la palabra ME-SA."
  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice(
        'Cristal, vamos a hacer magia. Construye la palabra ME-SA.'
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [audioManager]);

  // Colocar una sílaba (soporta Drag & Drop y toque directo accesible para tablets)
  const handlePlaceSyllable = (syl, targetSlot = null) => {
    if (hasWon) return;

    // Determinar qué slot está libre
    let slotToUse = targetSlot;
    if (!slotToUse) {
      if (!slot1) slotToUse = 1;
      else if (!slot2) slotToUse = 2;
      else return; // Ambos llenos
    }

    audioManager.playSFX('bubble');

    if (slotToUse === 1) {
      setSlot1(syl);
    } else {
      setSlot2(syl);
    }

    setAvailableSyllables((prev) => prev.filter((s) => s.id !== syl.id));
  };

  // Quitar una sílaba del caldero
  const handleRemoveSyllable = (slotNumber) => {
    if (hasWon) return;

    audioManager.playSFX('bubble');
    if (slotNumber === 1 && slot1) {
      setAvailableSyllables((prev) => [...prev, slot1]);
      setSlot1(null);
    } else if (slotNumber === 2 && slot2) {
      setAvailableSyllables((prev) => [...prev, slot2]);
      setSlot2(null);
    }
  };

  // Validar cuando ambas posiciones estén ocupadas
  useEffect(() => {
    if (slot1 && slot2 && !hasWon) {
      // Validar: ¿Es ME + SA?
      if (slot1.text === 'ME' && slot2.text === 'SA') {
        // ¡ÉXITO!
        setIsBubbling(true);
        audioManager.playSFX('magic');
        audioManager.playSFX('bell');
        registrarAcierto('MESA');

        // Audio de completado requerido: "¡Magia pura, Cristal! Eres muy inteligente."
        setTimeout(() => {
          audioManager.playVoice(
            '¡Magia pura, Cristal! Eres muy inteligente.'
          );
          setHasWon(true);
        }, 600);
      } else {
        // ERROR: Rebote suave y devolución de sílabas sin castigo
        audioManager.playSFX('wobble');
        registrarFallo('MESA');
        setWobbleSlot(true);

        setTimeout(() => {
          // Devolver suavemente las sílabas a la lista
          setAvailableSyllables(SYLLABLES_POOL);
          setSlot1(null);
          setSlot2(null);
          setWobbleSlot(false);
        }, 1200);
      }
    }
  }, [slot1, slot2]);

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-purple-100/90 via-pink-100/80 to-indigo-100/90 select-none">
      {/* HEADER SUPERIOR */}
      <header className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/85 backdrop-blur-md rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full border-2 border-purple-300 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600">
              El Caldero Mágico: Forma ME-SA
            </h1>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="w-16" />
      </header>

      {/* ÁREA CENTRAL: IMAGEN REPRESENTATIVA + CALDERO MÁGICO CON 2 ZONAS */}
      <main className="z-10 w-full max-w-xl mx-auto my-auto flex flex-col items-center">
        {/* Imagen representativa de la palabra objetivo (MESA) */}
        <div className="mb-3 flex items-center gap-3 bg-white/90 px-5 py-2.5 rounded-3xl border-2 border-pink-200 shadow-md animate-pulse">
          <span className="text-4xl">🪑</span>
          <div className="text-left">
            <span className="text-[11px] font-black text-slate-500 uppercase block">
              Palabra Mágica:
            </span>
            <span className="text-base sm:text-lg font-black text-purple-700">
              MESA (ME - SA)
            </span>
          </div>
        </div>

        {/* ILUSTRACIÓN DEL CALDERO MÁGICO */}
        <div
          className={`relative w-80 sm:w-96 h-56 sm:h-64 bg-gradient-to-b from-purple-900 to-indigo-950 rounded-b-[70px] rounded-t-3xl border-4 border-amber-300 shadow-2xl p-4 flex flex-col items-center justify-between transition-transform ${
            wobbleSlot ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : ''
          }`}
        >
          {/* Vapor y burbujas mágicas del caldero */}
          <div className="absolute -top-7 flex gap-4 text-2xl animate-bounce">
            <span>✨</span>
            <span className="delay-100">🫧</span>
            <span className="delay-200">✨</span>
          </div>

          <div className="text-center mt-1">
            <span className="text-[11px] font-extrabold text-amber-200 uppercase tracking-wider">
              {isBubbling ? '¡Haciendo Magia!' : 'Arrastra o toca las sílabas'}
            </span>
          </div>

          {/* 2 ZONAS DE CAÍDA (DROP ZONES) */}
          <div className="flex items-center justify-center gap-4 my-auto">
            {/* Zona 1: Espera "ME" */}
            <div
              onClick={() => handleRemoveSyllable(1)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                slot1
                  ? 'bg-gradient-to-tr from-pink-400 to-rose-500 border-white text-white font-black text-3xl shadow-lg scale-105'
                  : 'border-purple-300/60 bg-purple-950/40 text-purple-200 font-extrabold text-sm'
              }`}
            >
              {slot1 ? (
                <span>{slot1.text}</span>
              ) : (
                <span className="text-xs text-center px-1">Sílaba 1</span>
              )}
            </div>

            {/* Símbolo más de unión mágica */}
            <span className="text-2xl font-black text-yellow-300 animate-pulse">
              +
            </span>

            {/* Zona 2: Espera "SA" */}
            <div
              onClick={() => handleRemoveSyllable(2)}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                slot2
                  ? 'bg-gradient-to-tr from-purple-400 to-indigo-500 border-white text-white font-black text-3xl shadow-lg scale-105'
                  : 'border-purple-300/60 bg-purple-950/40 text-purple-200 font-extrabold text-sm'
              }`}
            >
              {slot2 ? (
                <span>{slot2.text}</span>
              ) : (
                <span className="text-xs text-center px-1">Sílaba 2</span>
              )}
            </div>
          </div>

          {/* Base brillante del caldero */}
          <div className="w-3/4 h-2 bg-amber-400/80 rounded-full blur-[1px]" />
        </div>

        {/* PARTE INFERIOR: 4 SÍLABAS ARRASTRABLES / TOCABLES */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {availableSyllables.map((syl) => (
            <button
              key={syl.id}
              onClick={() => handlePlaceSyllable(syl)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${syl.color} text-white font-black text-2xl sm:text-3xl shadow-xl shadow-purple-300/50 border-3 border-white transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer`}
            >
              <span className="drop-shadow">{syl.text}</span>
            </button>
          ))}
        </div>
      </main>

      {/* FOOTER: Repetición de audio */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            audioManager.playVoice(
              'Cristal, vamos a hacer magia. Construye la palabra ME-SA.'
            );
          }}
          className="flex items-center gap-1.5 bg-white/80 hover:bg-white border border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700 shadow-sm"
        >
          <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
          <span>Escuchar palabra</span>
        </button>

        <span className="text-xs font-extrabold text-purple-600">
          🐾 ¡Toca las sílabas para meterlas en el caldero!
        </span>
      </footer>

      {/* MODAL DE VICTORIA CUANDO FORMA ME-SA */}
      {hasWon && (
        <VictoryModal
          title="¡Palabra ME-SA Creada!"
          subtitle="¡Magia pura, Cristal! Eres muy inteligente."
          levelIdToUnlock="mision4"
          yarnReward={1}
          onReturnToMap={() => {
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
