import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, RotateCcw, Check } from 'lucide-react';

// Palabras progresivas para aprender a escribir letra por letra y sílaba por sílaba (Leo con Grin)
const WRITING_WORDS = [
  {
    word: 'SOL',
    lower: 'sol',
    syllables: ['SOL'],
    emoji: '☀️',
    hint: 'Brilla en el cielo durante el día',
    audioKey: 'word_sol',
    letters: ['S', 'O', 'L'],
    extraPool: ['M', 'A'],
  },
  {
    word: 'OSO',
    lower: 'oso',
    syllables: ['O', 'SO'],
    emoji: '🧸',
    hint: 'Suave y cariñoso amigo del bosque',
    audioKey: 'word_oso',
    letters: ['O', 'S', 'O'],
    extraPool: ['P', 'E'],
  },
  {
    word: 'UVA',
    lower: 'uva',
    syllables: ['U', 'VA'],
    emoji: '🍇',
    hint: 'Fruta dulce y morada',
    audioKey: 'word_uva',
    letters: ['U', 'V', 'A'],
    extraPool: ['L', 'I'],
  },
  {
    word: 'MESA',
    lower: 'mesa',
    syllables: ['ME', 'SA'],
    emoji: '🪑',
    hint: 'Donde dibujamos y comemos',
    audioKey: 'word_mesa',
    letters: ['M', 'E', 'S', 'A'],
    extraPool: ['P', 'O'],
  },
  {
    word: 'GATO',
    lower: 'gato',
    syllables: ['GA', 'TO'],
    emoji: '🐱',
    hint: 'Dice miau como Lulú y Mimi',
    audioKey: 'lvl4_word_gato',
    letters: ['G', 'A', 'T', 'O'],
    extraPool: ['L', 'U'],
  },
  {
    word: 'LUNA',
    lower: 'luna',
    syllables: ['LU', 'NA'],
    emoji: '🌙',
    hint: 'Ilumina las estrellas por la noche',
    audioKey: 'lvl4_word_luna',
    letters: ['L', 'U', 'N', 'A'],
    extraPool: ['S', 'E'],
  },
  {
    word: 'CASA',
    lower: 'casa',
    syllables: ['CA', 'SA'],
    emoji: '🏠',
    hint: 'Nuestro hogar lleno de amor',
    audioKey: 'lvl4_word_casa',
    letters: ['C', 'A', 'S', 'A'],
    extraPool: ['M', 'I'],
  },
  {
    word: 'PATO',
    lower: 'pato',
    syllables: ['PA', 'TO'],
    emoji: '🦆',
    hint: 'Nada feliz en el agua diciendo cuac',
    audioKey: 'word_pato',
    letters: ['P', 'A', 'T', 'O'],
    extraPool: ['N', 'E'],
  },
];

const LETTER_AUDIO_MAP = {
  A: 'vocal_a',
  E: 'vocal_e',
  I: 'vocal_i',
  O: 'vocal_o',
  U: 'vocal_u',
  M: 'let_m',
  P: 'let_p',
  S: 'let_s',
  L: 'let_l',
  T: 'let_t',
  D: 'let_d',
  N: 'let_n',
  C: 'let_c',
  G: 'let_g',
  V: 'let_v',
  R: 'let_r',
};

export default function MinijuegoEscribir({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, navegarA } = useGame();

  const [wordIdx, setWordIdx] = useState(0);
  const [typedLetters, setTypedLetters] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [useLowercase, setUseLowercase] = useState(false);
  const [wobbleError, setWobbleError] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const currentWord = WRITING_WORDS[wordIdx];

  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('escribir_welcome');
    }, 350);
    return () => clearTimeout(timer);
  }, [audioManager]);

  // Preparar fichas de letras desordenadas para la palabra actual
  useEffect(() => {
    if (!currentWord) return;
    const allLetters = [...currentWord.letters, ...currentWord.extraPool];
    const shuffled = allLetters
      .map((char, idx) => ({
        id: `${char}-${idx}-${Math.random()}`,
        upper: char,
        lower: char.toLowerCase(),
      }))
      .sort(() => Math.random() - 0.5);

    setAvailableTiles(shuffled);
    setTypedLetters([]);
    setWordComplete(false);
  }, [wordIdx, currentWord]);

  const handleSelectTile = (tile) => {
    if (wordComplete || hasWon) return;

    const nextPosition = typedLetters.length;
    const expectedLetter = currentWord.letters[nextPosition];

    if (tile.upper === expectedLetter) {
      // ¡Letra correcta en la posición actual!
      audioManager.playSFX('sparkle');
      const nextTyped = [...typedLetters, tile];
      setTypedLetters(nextTyped);
      setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

      // Si completó toda la palabra
      if (nextTyped.length === currentWord.letters.length) {
        setWordComplete(true);
        audioManager.playSFX('celebration');
        audioManager.playVoice(currentWord.audioKey);
        registrarAcierto(currentWord.word);

        setTimeout(() => {
          if (wordIdx + 1 < WRITING_WORDS.length) {
            setWordIdx((prev) => prev + 1);
          } else {
            setHasWon(true);
          }
        }, 2300);
      } else {
        // Pronunciar suavemente la vocal si es vocal
        if (['A', 'E', 'I', 'O', 'U'].includes(tile.upper)) {
          audioManager.playVoice(LETTER_AUDIO_MAP[tile.upper]);
        }
      }
    } else {
      // Letra en orden incorrecto: vibración suave y pista visual
      audioManager.playSFX('wobble');
      registrarFallo(expectedLetter);
      setWobbleError(true);
      setTimeout(() => setWobbleError(false), 500);
    }
  };

  return (
    <div className="relative w-full min-h-[94vh] flex flex-col justify-between p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-amber-100/90 via-pink-100/90 to-purple-100/90 select-none">
      {/* HEADER */}
      <header className="z-20 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => {
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/95 rounded-full border-2 border-amber-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Escuela de Escritura: Escribe Palabras ({wordIdx + 1}/{WRITING_WORDS.length})
          </h1>
        </div>

        {/* Alternar Mayúsculas / Minúsculas */}
        <button
          onClick={() => setUseLowercase((prev) => !prev)}
          className="px-3.5 py-1.5 bg-purple-600 text-white rounded-2xl text-xs font-black shadow-md hover:scale-105 transition-all"
        >
          {useLowercase ? 'Modo: minúsculas (abc)' : 'Modo: MAYÚSCULAS (ABC)'}
        </button>
      </header>

      {/* ÁREA CENTRAL DE ESCRITURA */}
      <main className="z-10 w-full max-w-2xl mx-auto my-auto flex flex-col items-center gap-5">
        {/* Tarjeta del Objeto e Imagen */}
        <div
          onClick={() => audioManager.playVoice(currentWord.audioKey)}
          className="cursor-pointer w-full bg-white/95 rounded-3xl border-4 border-pink-300 shadow-xl p-4 sm:p-5 flex items-center justify-between gap-4 hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-pink-100 to-amber-100 border-2 border-pink-300 flex items-center justify-center text-5xl sm:text-6xl shadow-inner">
              {currentWord.emoji}
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-pink-600 uppercase">
                Escribe la palabra:
              </span>
              <div className="flex items-baseline gap-3">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wider">
                  {currentWord.word}
                </h2>
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                  ({currentWord.lower})
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Sílabas: <strong>{currentWord.syllables.join(' - ')}</strong> • {currentWord.hint}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="p-3 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-600 shadow-sm"
            title="Escuchar palabra"
          >
            <Volume2 className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* CASILLAS DE ESCRITURA LETRA POR LETRA */}
        <div
          className={`flex items-center justify-center gap-2.5 sm:gap-4 p-4 rounded-3xl bg-white/90 border-4 ${
            wordComplete
              ? 'border-emerald-400 bg-emerald-50/90 scale-105'
              : wobbleError
              ? 'border-rose-400 animate-wiggle'
              : 'border-purple-300'
          } shadow-lg transition-all`}
        >
          {currentWord.letters.map((expectedChar, index) => {
            const placed = typedLetters[index];
            const isNext = index === typedLetters.length;

            return (
              <div
                key={index}
                className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all ${
                  placed
                    ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-white shadow-lg scale-105'
                    : isNext
                    ? 'bg-amber-50 border-amber-400 border-dashed text-amber-300 animate-pulse'
                    : 'bg-slate-50 border-slate-200 border-dashed text-slate-200'
                }`}
              >
                {placed ? (
                  <>
                    <span className="text-3xl sm:text-4xl leading-none">
                      {useLowercase ? placed.lower : placed.upper}
                    </span>
                    <span className="text-xs opacity-85 mt-0.5">
                      {useLowercase ? placed.upper : placed.lower}
                    </span>
                  </>
                ) : (
                  /* Letra guía translúcida para que Cristal aprenda a escribirla */
                  <span className="text-3xl sm:text-4xl opacity-35">
                    {useLowercase ? expectedChar.toLowerCase() : expectedChar}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* TECLADO DE FICHAS DE LETRAS PARA TOCAR Y ESCRIBIR */}
        <div className="w-full bg-white/85 rounded-3xl border-3 border-pink-200 p-4 shadow-md text-center">
          <p className="text-xs font-black text-purple-700 mb-3">
            ✍️ Toca la letra <strong className="text-pink-600 text-base">{currentWord.letters[typedLetters.length] || '✓'}</strong> para escribir la palabra:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                onClick={() => handleSelectTile(tile)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 text-white font-black shadow-lg border-3 border-white hover:scale-110 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-2xl sm:text-3xl leading-none">
                  {useLowercase ? tile.lower : tile.upper}
                </span>
                <span className="text-xs opacity-90">
                  {useLowercase ? tile.upper : tile.lower}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/85 px-3.5 py-1.5 rounded-2xl border border-pink-200">
          <img
            src="/fairy-mimi.jpg"
            alt="Hadita Mimi"
            className="w-8 h-8 rounded-full object-cover border border-purple-400"
          />
          <span className="text-xs font-extrabold text-purple-800">
            Hadita Mimi: "¡Sigue las letras sombreadas para escribir la palabra!"
          </span>
        </div>

        <button
          onClick={() => audioManager.playVoice(currentWord.audioKey)}
          className="flex items-center gap-1.5 bg-pink-500 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black shadow"
        >
          <Volume2 className="w-4 h-4" />
          <span>Escuchar "{currentWord.word}"</span>
        </button>
      </footer>

      {hasWon && (
        <VictoryModal
          title="¡Graduada en Escritura Mágica!"
          subtitle="¡Escribiste todas las palabras letra por letra, Cristal!"
          levelIdToUnlock="mision7"
          yarnReward={3}
          onReturnToMap={() => {
            setHasWon(false);
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
