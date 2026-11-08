import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import KittenGuide from './KittenGuide';
import VictoryModal from './VictoryModal';
import { fireBubbleSparkles, fireVictoryConfetti } from '../utils/confetti';
import {
  Sparkles,
  Star,
  ArrowRight,
  RotateCcw,
  Cloud,
  Wand2,
  Volume2,
} from 'lucide-react';

// 5 Combinaciones de nubes de sílabas: M+A, P+E, S+I, L+O, T+U (Mayúsculas y Minúsculas)
const SYLLABLE_PAIRS = [
  {
    consonant: 'M',
    consonantLower: 'm',
    vowel: 'A',
    vowelLower: 'a',
    syllable: 'MA',
    syllableLower: 'ma',
    soundHint: 'como en Mamá y Mariposa 🦋',
    mergeIntroAudio: 'lvl3_merge_ma',
    mergedAudio: 'lvl3_ma',
    sylAudio: 'syl_ma',
    cAudio: 'let_m',
    vAudio: 'vocal_a',
  },
  {
    consonant: 'P',
    consonantLower: 'p',
    vowel: 'E',
    vowelLower: 'e',
    syllable: 'PE',
    syllableLower: 'pe',
    soundHint: 'como en Pelota y Pececito ⚽',
    mergeIntroAudio: 'lvl3_merge_pe',
    mergedAudio: 'lvl3_pe',
    sylAudio: 'syl_pe',
    cAudio: 'let_p',
    vAudio: 'vocal_e',
  },
  {
    consonant: 'S',
    consonantLower: 's',
    vowel: 'I',
    vowelLower: 'i',
    syllable: 'SI',
    syllableLower: 'si',
    soundHint: 'como en Sirena y Silla 🧜‍♀️',
    mergeIntroAudio: 'lvl3_merge_si',
    mergedAudio: 'lvl3_si',
    sylAudio: 'syl_si',
    cAudio: 'let_s',
    vAudio: 'vocal_i',
  },
  {
    consonant: 'L',
    consonantLower: 'l',
    vowel: 'O',
    vowelLower: 'o',
    syllable: 'LO',
    syllableLower: 'lo',
    soundHint: 'como en Lobo y Loro 🦜',
    mergeIntroAudio: 'lvl3_merge_lo',
    mergedAudio: 'lvl3_lo',
    sylAudio: 'syl_lo',
    cAudio: 'let_l',
    vAudio: 'vocal_o',
  },
  {
    consonant: 'T',
    consonantLower: 't',
    vowel: 'U',
    vowelLower: 'u',
    syllable: 'TU',
    syllableLower: 'tu',
    soundHint: 'como en Tulipán y Tucán 🌷',
    mergeIntroAudio: 'lvl3_merge_tu',
    mergedAudio: 'lvl3_tu',
    sylAudio: 'syl_tu',
    cAudio: 'let_t',
    vAudio: 'vocal_u',
  },
];

export default function Level3CloudJumps({ onCompleteLevel, onGoToLevel4 }) {
  const { audioManager, registrarAcierto, navegarA } = useGame();

  const [currentStep, setCurrentStep] = useState(0); // 0 a 4
  const [isMerged, setIsMerged] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSyllables, setCompletedSyllables] = useState([]);
  const [dialogue, setDialogue] = useState(
    'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Toca ¡Juntar! para formar la sílaba.'
  );

  const arenaRef = useRef(null);
  const timersRef = useRef([]);

  const currentPair = SYLLABLE_PAIRS[currentStep];

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Audio inicial al montar el nivel
  useEffect(() => {
    const t = setTimeout(() => {
      audioManager.playVoice('lvl3_intro');
    }, 350);
    return () => {
      clearTimeout(t);
      clearAllTimers();
    };
  }, [audioManager]);

  // Función principal para juntar las dos nubes
  const handleMergeClouds = () => {
    if (isMerged || isCompleted) return;
    clearAllTimers();

    // Sonidos y estado inmediato
    audioManager.playSFX('magic');
    audioManager.playSFX('bell');
    registrarAcierto(currentPair.syllable);

    setIsJumping(true);
    setIsMerged(true);

    // Chispas mágicas seguras en el centro del área de nubes
    try {
      if (arenaRef.current) {
        const rect = arenaRef.current.getBoundingClientRect();
        fireBubbleSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else if (typeof window !== 'undefined') {
        fireBubbleSparkles(window.innerWidth / 2, window.innerHeight / 2);
      }
    } catch (e) {
      // Ignorar si falla confetti
    }

    // Actualizar progreso inmediatamente
    const updatedCompleted = completedSyllables.includes(currentPair.syllable)
      ? completedSyllables
      : [...completedSyllables, currentPair.syllable];
    setCompletedSyllables(updatedCompleted);

    // Actualizar diálogo y pronunciar la sílaba unida con voz dulce
    setDialogue(
      `¡${currentPair.syllable} / ${currentPair.syllableLower}! ✨ La ${currentPair.consonant} con la ${currentPair.vowel} suena "${currentPair.syllableLower}" (${currentPair.soundHint})`
    );
    audioManager.playVoice(currentPair.mergedAudio);

    // Si es la última nube (5 de 5), mostrar pantalla de victoria tras escuchar la sílaba
    if (currentStep >= SYLLABLE_PAIRS.length - 1 || updatedCompleted.length >= SYLLABLE_PAIRS.length) {
      const winTimer = setTimeout(() => {
        setIsCompleted(true);
        audioManager.playSFX('celebration');
        audioManager.playVoice('lvl3_win');
        try {
          fireVictoryConfetti();
        } catch (e) {
          // Ignorar
        }
        if (onCompleteLevel) onCompleteLevel();
      }, 2800);
      timersRef.current.push(winTimer);
    }
  };

  // Pasar a la siguiente combinación de nubes
  const handleNextSyllable = () => {
    clearAllTimers();
    if (currentStep < SYLLABLE_PAIRS.length - 1) {
      const nextIdx = currentStep + 1;
      const nextPair = SYLLABLE_PAIRS[nextIdx];
      setCurrentStep(nextIdx);
      setIsMerged(false);
      setIsJumping(false);
      setDialogue(
        `Ahora juntemos la nube ${nextPair.consonant} (${nextPair.consonantLower}) con la nube ${nextPair.vowel} (${nextPair.vowelLower}). ¡Toca el botón Juntar!`
      );
      audioManager.playSFX('bubble');
      audioManager.playVoice(nextPair.mergeIntroAudio);
    } else {
      setIsCompleted(true);
      audioManager.playSFX('celebration');
      audioManager.playVoice('lvl3_win');
      if (onCompleteLevel) onCompleteLevel();
    }
  };

  // Seleccionar cualquier sílaba directamente desde las pestañas superiores
  const handleJumpToStep = (idx) => {
    clearAllTimers();
    const targetPair = SYLLABLE_PAIRS[idx];
    setCurrentStep(idx);
    setIsMerged(false);
    setIsJumping(false);
    setDialogue(
      `Juntemos la nube ${targetPair.consonant} (${targetPair.consonantLower}) con la nube ${targetPair.vowel} (${targetPair.vowelLower}). ¡Toca Juntar!`
    );
    audioManager.playSFX('bubble');
    audioManager.playVoice(targetPair.mergeIntroAudio);
  };

  const handleResetLevel = () => {
    clearAllTimers();
    setCurrentStep(0);
    setIsMerged(false);
    setIsJumping(false);
    setIsCompleted(false);
    setCompletedSyllables([]);
    setDialogue(
      'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Toca ¡Juntar! para formar la sílaba.'
    );
    audioManager.playVoice('lvl3_intro');
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[88vh] py-2 px-3 sm:px-6 w-full max-w-5xl mx-auto select-none">
      {/* HEADER SUPERIOR Y PROGRESO */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md rounded-2xl p-3 border-2 border-sky-200 shadow-sm mb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                audioManager.playSFX('bubble');
                if (onGoToLevel4) onGoToLevel4();
                else navegarA('map');
              }}
              className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
            >
              ← Mapa
            </button>
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-3 py-1 rounded-xl shadow-sm">
              Isla 5
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-1.5">
              <span>Nubes de Sílabas</span>
              <Cloud className="w-5 h-5 text-sky-500 fill-sky-200" />
            </h2>
          </div>

          {/* 5 Botones de Sílabas (Clicables para cambiar o escuchar) */}
          <div className="flex items-center gap-1.5 bg-sky-50 px-2.5 py-1.5 rounded-xl border border-sky-200">
            <span className="text-xs font-bold text-sky-800 hidden sm:inline">Sílabas:</span>
            <div className="flex items-center gap-1">
              {SYLLABLE_PAIRS.map((item, idx) => {
                const isDone =
                  completedSyllables.includes(item.syllable) ||
                  idx < currentStep ||
                  isCompleted;
                const isCurrent = idx === currentStep;

                return (
                  <button
                    key={item.syllable}
                    type="button"
                    onClick={() => handleJumpToStep(idx)}
                    className={`px-2.5 py-1 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-amber-950 ring-2 ring-yellow-300 scale-110 shadow-sm'
                        : isDone
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm'
                        : 'bg-white border border-sky-300 text-sky-600'
                    }`}
                  >
                    {item.syllable}/{item.syllableLower}
                  </button>
                );
              })}
            </div>
            <span className="font-extrabold text-sky-700 ml-1 text-xs sm:text-sm">
              {Math.min(completedSyllables.length, 5)}/5
            </span>
          </div>
        </div>

        {/* Guía con Hadita Lulú Realista */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={isJumping || isMerged ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
          onKittenClick={() => {
            if (isMerged) {
              audioManager.playVoice(currentPair.mergedAudio);
            } else {
              audioManager.playVoice(currentPair.mergeIntroAudio);
            }
          }}
        />
      </div>

      {/* ESCENARIO CENTRAL DE NUBES */}
      <div
        ref={arenaRef}
        className="relative w-full my-2 min-h-[360px] sm:min-h-[400px] rounded-3xl bg-gradient-to-b from-sky-200/80 via-pink-100/70 to-purple-100/80 border-4 border-white shadow-lg flex flex-col items-center justify-between p-4 overflow-hidden"
      >
        {/* Estrellas decorativas */}
        <div className="absolute top-3 left-6 text-yellow-400 opacity-70 pointer-events-none animate-pulse">
          <Star className="w-7 h-7 fill-yellow-200" />
        </div>
        <div className="absolute top-6 right-8 text-pink-400 opacity-70 pointer-events-none animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Hadita Gatuna Saltarina sobre las nubes */}
        <div className="relative flex flex-col items-center justify-center z-20 mt-1">
          <div
            onClick={() =>
              audioManager.playVoice(
                isMerged ? currentPair.mergedAudio : currentPair.mergeIntroAudio
              )
            }
            className={`cursor-pointer w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 transform ${
              isJumping
                ? 'scale-115 -translate-y-2 ring-4 ring-yellow-300 animate-bounce'
                : 'animate-float-slow'
            }`}
          >
            <img
              src={isMerged ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
              alt="Hadita de las nubes"
              className="w-full h-full object-cover"
            />
          </div>

          {isJumping && (
            <div className="mt-1 bg-yellow-400 text-yellow-950 font-black text-xs px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>¡MAGIA DE SÍLABAS!</span>
            </div>
          )}
        </div>

        {/* LAS NUBES: SEPARADAS VS UNIDAS */}
        <div className="w-full max-w-2xl my-2 flex items-center justify-center min-h-[150px] relative z-20">
          {!isMerged ? (
            <div className="flex items-center justify-center gap-3 sm:gap-10 w-full">
              {/* Nube 1: Consonante (Mayúscula y Minúscula) */}
              <button
                type="button"
                onClick={() => {
                  audioManager.playSFX('pop');
                  audioManager.playVoice(currentPair.cAudio);
                }}
                className="relative group cursor-pointer active:scale-95 transition-transform"
                title="Toca para escuchar la letra o pulsa Juntar"
              >
                <div className="relative w-32 sm:w-44 h-28 sm:h-32 bg-white rounded-3xl border-4 border-sky-300 shadow-xl flex flex-col items-center justify-center p-2 hover:border-sky-400">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-6xl font-black text-sky-700 leading-none">
                      {currentPair.consonant}
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-sky-500 leading-none">
                      {currentPair.consonantLower}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] font-extrabold text-sky-600 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Consonante
                  </span>
                </div>
              </button>

              {/* Botón central "+" que también junta las nubes al tocarlo */}
              <button
                type="button"
                onClick={handleMergeClouds}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform animate-pulse cursor-pointer border-2 border-white"
                title="¡Toca para juntar las nubes!"
              >
                +
              </button>

              {/* Nube 2: Vocal (Mayúscula y Minúscula) */}
              <button
                type="button"
                onClick={() => {
                  audioManager.playSFX('pop');
                  audioManager.playVoice(currentPair.vAudio);
                }}
                className="relative group cursor-pointer active:scale-95 transition-transform"
                title="Toca para escuchar la vocal o pulsa Juntar"
              >
                <div className="relative w-32 sm:w-44 h-28 sm:h-32 bg-white rounded-3xl border-4 border-pink-300 shadow-xl flex flex-col items-center justify-center p-2 hover:border-pink-400">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-6xl font-black text-pink-600 leading-none">
                      {currentPair.vowel}
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-pink-400 leading-none">
                      {currentPair.vowelLower}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] font-extrabold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Vocal
                  </span>
                </div>
              </button>
            </div>
          ) : (
            /* NUBE GIGANTE UNIDA CON LA SÍLABA COMPLETA */
            <button
              type="button"
              onClick={() => {
                audioManager.playSFX('bell');
                audioManager.playVoice(currentPair.sylAudio);
              }}
              className="relative cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
              title="¡Toca para escuchar cómo suena la sílaba!"
            >
              <div className="relative w-72 sm:w-96 h-32 sm:h-36 bg-gradient-to-r from-white via-pink-50 to-white rounded-3xl border-4 border-yellow-400 shadow-2xl flex flex-col items-center justify-center p-4 ring-4 ring-yellow-200">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-yellow-500 animate-spin" />
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-7xl font-black text-purple-700 tracking-wider">
                      {currentPair.syllable}
                    </span>
                    <span className="text-4xl sm:text-6xl font-bold text-pink-600">
                      {currentPair.syllableLower}
                    </span>
                  </div>
                  <Sparkles className="w-7 h-7 text-yellow-500 animate-spin" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-purple-700 mt-1 flex items-center gap-1">
                  <Volume2 className="w-4 h-4 text-pink-500" />
                  <span>{currentPair.soundHint}</span>
                </span>
              </div>
            </button>
          )}
        </div>

        {/* BOTONES DE ACCIÓN PRINCIPALES: "¡Juntar!" y "¡Siguiente Nube!" */}
        <div className="mt-2 z-30 flex flex-wrap items-center justify-center gap-3 w-full">
          {!isMerged ? (
            <button
              type="button"
              onClick={handleMergeClouds}
              className="cursor-pointer flex items-center justify-center gap-3 px-10 sm:px-14 py-4 rounded-3xl font-black text-xl sm:text-2xl text-white bg-gradient-to-r from-sky-500 via-pink-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all"
            >
              <Wand2 className="w-6 h-6 text-yellow-300" />
              <span>¡Juntar!</span>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => audioManager.playVoice(currentPair.sylAudio)}
                className="cursor-pointer flex items-center gap-2 px-5 py-3.5 rounded-2xl font-extrabold text-base text-purple-800 bg-white hover:bg-purple-50 border-2 border-purple-300 shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5 text-pink-600" />
                <span>Escuchar "{currentPair.syllableLower}"</span>
              </button>

              {currentStep < SYLLABLE_PAIRS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextSyllable}
                  className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-lg sm:text-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all animate-bounce"
                >
                  <span>¡Siguiente Nube!</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsCompleted(true);
                    audioManager.playSFX('celebration');
                    audioManager.playVoice('lvl3_win');
                    if (onCompleteLevel) onCompleteLevel();
                  }}
                  className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-lg sm:text-xl text-white bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all animate-bounce"
                >
                  <Sparkles className="w-6 h-6 text-yellow-200" />
                  <span>¡Terminar Misión!</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONTROLES INFERIORES */}
      <div className="flex items-center justify-between w-full pt-1">
        <button
          type="button"
          onClick={handleResetLevel}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 text-xs sm:text-sm font-bold border border-sky-200 shadow-sm active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-sky-500" />
          <span>Reiniciar Nubes</span>
        </button>

        <div className="text-xs sm:text-sm font-extrabold text-sky-900 bg-sky-100/90 px-4 py-2 rounded-2xl border border-sky-200">
          <span>
            Nube {currentStep + 1} de 5: {currentPair.consonant} + {currentPair.vowel} ={' '}
            {currentPair.syllable} ({currentPair.syllableLower}) ☁️
          </span>
        </div>
      </div>

      {/* MODAL DE VICTORIA */}
      {isCompleted && (
        <VictoryModal
          title="¡Qué inteligente eres, Cristal!"
          subtitle="¡Uniste todas las nubes mágicas y formaste MA, PE, SI, LO y TU a la perfección!"
          levelIdToUnlock="mision6"
          yarnReward={3}
          onReturnToMap={() => {
            if (onGoToLevel4) onGoToLevel4();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
