import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, ArrowRight } from 'lucide-react';

// 4 NIVELES DE ESCRITURA PROGRESIVA: Desde palabras cortas hasta palabras de 3 y 4 sílabas
const WRITING_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: Cortas (3-4 letras)',
    words: [
      { word: 'SOL', lower: 'sol', syllables: ['SOL'], emoji: '☀️', hint: 'Brilla en el cielo', audioKey: 'word_sol', letters: ['S', 'O', 'L'], extraPool: ['M', 'A'] },
      { word: 'MAR', lower: 'mar', syllables: ['MAR'], emoji: '🌊', hint: 'Olas azules y pececitos', audioKey: 'word_mar', letters: ['M', 'A', 'R'], extraPool: ['P', 'E'] },
      { word: 'OSO', lower: 'oso', syllables: ['O', 'SO'], emoji: '🧸', hint: 'Suave amigo del bosque', audioKey: 'word_oso', letters: ['O', 'S', 'O'], extraPool: ['L', 'I'] },
      { word: 'UVA', lower: 'uva', syllables: ['U', 'VA'], emoji: '🍇', hint: 'Fruta dulce y morada', audioKey: 'word_uva', letters: ['U', 'V', 'A'], extraPool: ['T', 'O'] },
      { word: 'MAMÁ', lower: 'mama', syllables: ['MA', 'MÁ'], emoji: '👩', hint: 'Nos da abrazos llenos de amor', audioKey: 'word_mama', letters: ['M', 'A', 'M', 'A'], extraPool: ['S', 'E'] },
      { word: 'PAPÁ', lower: 'papa', syllables: ['PA', 'PÁ'], emoji: '👨', hint: 'Juega y nos cuida mucho', audioKey: 'word_papa', letters: ['P', 'A', 'P', 'A'], extraPool: ['L', 'U'] },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: 2 Sílabas (4 letras)',
    words: [
      { word: 'MESA', lower: 'mesa', syllables: ['ME', 'SA'], emoji: '🪑', hint: 'Donde dibujamos y comemos', audioKey: 'word_mesa', letters: ['M', 'E', 'S', 'A'], extraPool: ['P', 'O'] },
      { word: 'SAPO', lower: 'sapo', syllables: ['SA', 'PO'], emoji: '🐸', hint: 'Salta en el charco', audioKey: 'word_sapo', letters: ['S', 'A', 'P', 'O'], extraPool: ['L', 'I'] },
      { word: 'LUPA', lower: 'lupa', syllables: ['LU', 'PA'], emoji: '🔍', hint: 'Para mirar cosas pequeñitas', audioKey: 'word_lupa', letters: ['L', 'U', 'P', 'A'], extraPool: ['M', 'E'] },
      { word: 'PATO', lower: 'pato', syllables: ['PA', 'TO'], emoji: '🦆', hint: 'Nada feliz en el agua', audioKey: 'word_pato', letters: ['P', 'A', 'T', 'O'], extraPool: ['N', 'E'] },
      { word: 'GATO', lower: 'gato', syllables: ['GA', 'TO'], emoji: '🐱', hint: 'Dice miau como Lulú y Mimi', audioKey: 'lvl4_word_gato', letters: ['G', 'A', 'T', 'O'], extraPool: ['L', 'U'] },
      { word: 'LUNA', lower: 'luna', syllables: ['LU', 'NA'], emoji: '🌙', hint: 'Ilumina la noche', audioKey: 'lvl4_word_luna', letters: ['L', 'U', 'N', 'A'], extraPool: ['S', 'E'] },
      { word: 'CASA', lower: 'casa', syllables: ['CA', 'SA'], emoji: '🏠', hint: 'Nuestro hogar feliz', audioKey: 'lvl4_word_casa', letters: ['C', 'A', 'S', 'A'], extraPool: ['M', 'I'] },
      { word: 'MANO', lower: 'mano', syllables: ['MA', 'NO'], emoji: '✋', hint: 'Tiene cinco deditos', audioKey: 'word_mano', letters: ['M', 'A', 'N', 'O'], extraPool: ['P', 'U'] },
      { word: 'DADO', lower: 'dado', syllables: ['DA', 'DO'], emoji: '🎲', hint: 'Cubo con puntitos para jugar', audioKey: 'word_dado', letters: ['D', 'A', 'D', 'O'], extraPool: ['S', 'I'] },
      { word: 'NUBE', lower: 'nube', syllables: ['NU', 'BE'], emoji: '☁️', hint: 'Esponjosa en el cielo', audioKey: 'word_nube', letters: ['N', 'U', 'B', 'E'], extraPool: ['L', 'A'] },
      { word: 'ROSA', lower: 'rosa', syllables: ['RO', 'SA'], emoji: '🌹', hint: 'Flor perfumada del jardín', audioKey: 'word_rosa', letters: ['R', 'O', 'S', 'A'], extraPool: ['T', 'E'] },
      { word: 'VACA', lower: 'vaca', syllables: ['VA', 'CA'], emoji: '🐮', hint: 'Nos da leche fresca', audioKey: 'word_vaca', letters: ['V', 'A', 'C', 'A'], extraPool: ['M', 'O'] },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: 3 Sílabas (6 letras)',
    words: [
      { word: 'PELOTA', lower: 'pelota', syllables: ['PE', 'LO', 'TA'], emoji: '⚽', hint: 'Redonda y rebota muy alto', audioKey: 'word_pelota', letters: ['P', 'E', 'L', 'O', 'T', 'A'], extraPool: ['M', 'S'] },
      { word: 'PALOMA', lower: 'paloma', syllables: ['PA', 'LO', 'MA'], emoji: '🕊️', hint: 'Ave blanca que vuela alto', audioKey: 'word_paloma', letters: ['P', 'A', 'L', 'O', 'M', 'A'], extraPool: ['T', 'E'] },
      { word: 'CAMISA', lower: 'camisa', syllables: ['CA', 'MI', 'SA'], emoji: '👕', hint: 'Prenda de vestir con botones', audioKey: 'word_camisa', letters: ['C', 'A', 'M', 'I', 'S', 'A'], extraPool: ['L', 'O'] },
      { word: 'MALETA', lower: 'maleta', syllables: ['MA', 'LE', 'TA'], emoji: '🧳', hint: 'Para llevar ropa de viaje', audioKey: 'word_maleta', letters: ['M', 'A', 'L', 'E', 'T', 'A'], extraPool: ['P', 'U'] },
      { word: 'TOMATE', lower: 'tomate', syllables: ['TO', 'MA', 'TE'], emoji: '🍅', hint: 'Rojo y jugoso de la ensalada', audioKey: 'word_tomate', letters: ['T', 'O', 'M', 'A', 'T', 'E'], extraPool: ['S', 'I'] },
      { word: 'ZAPATO', lower: 'zapato', syllables: ['ZA', 'PA', 'TO'], emoji: '👟', hint: 'Lo usamos en los pies', audioKey: 'word_zapato', letters: ['Z', 'A', 'P', 'A', 'T', 'O'], extraPool: ['L', 'E'] },
      { word: 'CONEJO', lower: 'conejo', syllables: ['CO', 'NE', 'JO'], emoji: '🐰', hint: 'Tiene orejas largas y come zanahoria', audioKey: 'word_conejo', letters: ['C', 'O', 'N', 'E', 'J', 'O'], extraPool: ['M', 'A'] },
      { word: 'JIRAFA', lower: 'jirafa', syllables: ['JI', 'RA', 'FA'], emoji: '🦒', hint: 'Tiene el cuello muy largo', audioKey: 'word_jirafa', letters: ['J', 'I', 'R', 'A', 'F', 'A'], extraPool: ['S', 'O'] },
      { word: 'CORONA', lower: 'corona', syllables: ['CO', 'RO', 'NA'], emoji: '👑', hint: 'Brilla en la cabeza de las princesas', audioKey: 'word_corona', letters: ['C', 'O', 'R', 'O', 'N', 'A'], extraPool: ['P', 'I'] },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: 4 Sílabas (7-8 letras)',
    words: [
      { word: 'MARIPOSA', lower: 'mariposa', syllables: ['MA', 'RI', 'PO', 'SA'], emoji: '🦋', hint: 'Vuela entre las flores con alas de colores', audioKey: 'word_mariposa', letters: ['M', 'A', 'R', 'I', 'P', 'O', 'S', 'A'], extraPool: ['L', 'E'] },
      { word: 'CARAMELO', lower: 'caramelo', syllables: ['CA', 'RA', 'ME', 'LO'], emoji: '🍬', hint: 'Dulce de colores para disfrutar', audioKey: 'word_caramelo', letters: ['C', 'A', 'R', 'A', 'M', 'E', 'L', 'O'], extraPool: ['P', 'U'] },
      { word: 'ELEFANTE', lower: 'elefante', syllables: ['E', 'LE', 'FAN', 'TE'], emoji: '🐘', hint: 'Grande con una trompa larga', audioKey: 'word_elefante', letters: ['E', 'L', 'E', 'F', 'A', 'N', 'T', 'E'], extraPool: ['S', 'O'] },
      { word: 'TORTUGA', lower: 'tortuga', syllables: ['TOR', 'TU', 'GA'], emoji: '🐢', hint: 'Camina despacito con su caparazón', audioKey: 'word_tortuga', letters: ['T', 'O', 'R', 'T', 'U', 'G', 'A'], extraPool: ['M', 'I'] },
    ],
  },
];

const LETTER_AUDIO_MAP = {
  A: 'vocal_a', E: 'vocal_e', I: 'vocal_i', O: 'vocal_o', U: 'vocal_u',
  B: 'let_b', C: 'let_c', D: 'let_d', F: 'let_f', G: 'let_g',
  H: 'let_h', J: 'let_j', K: 'let_k', L: 'let_l', M: 'let_m',
  N: 'let_n', Ñ: 'let_ny', P: 'let_p', Q: 'let_q', R: 'let_r',
  S: 'let_s', T: 'let_t', V: 'let_v', W: 'let_w', X: 'let_x',
  Y: 'let_y', Z: 'let_z',
};

export default function MinijuegoEscribir({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, sumarOvillos, desbloquearNivel, navegarA } = useGame();

  const [levelIdx, setLevelIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [typedLetters, setTypedLetters] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [useLowercase, setUseLowercase] = useState(false);
  const [wobbleError, setWobbleError] = useState(false);
  const [wordComplete, setWordComplete] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [hasWonAll, setHasWonAll] = useState(false);

  const timersRef = useRef([]);

  const currentLevel = WRITING_LEVELS[levelIdx];
  const currentWord = currentLevel.words[wordIdx] || currentLevel.words[0];

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Preparar fichas de letras desordenadas para la palabra actual y pronunciarla
  useEffect(() => {
    if (!currentWord || hasWonAll || levelModal) return;
    clearTimers();

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

    const t = setTimeout(() => {
      audioManager.playVoice(currentWord.audioKey);
    }, 300);
    timersRef.current.push(t);

    return () => clearTimers();
  }, [levelIdx, wordIdx, hasWonAll, levelModal, currentWord, audioManager]);

  const handleSelectTile = (tile) => {
    if (wordComplete || hasWonAll || levelModal) return;

    const nextPosition = typedLetters.length;
    const expectedLetter = currentWord.letters[nextPosition];

    if (tile.upper === expectedLetter) {
      clearTimers();
      audioManager.playSFX('sparkle');
      const nextTyped = [...typedLetters, tile];
      setTypedLetters(nextTyped);
      setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));

      // Si completó toda la palabra: pronunciar SOLO la palabra completa sin montar el audio de la última letra
      if (nextTyped.length === currentWord.letters.length) {
        setWordComplete(true);
        audioManager.playSFX('celebration');
        audioManager.playVoice(currentWord.audioKey);
        registrarAcierto(currentWord.word);

        const nextT = setTimeout(() => {
          if (wordIdx + 1 < currentLevel.words.length) {
            setWordIdx((prev) => prev + 1);
          } else {
            sumarOvillos(3);
            desbloquearNivel('mision8');
            if (levelIdx + 1 < WRITING_LEVELS.length) {
              setLevelModal(true);
            } else {
              setHasWonAll(true);
            }
          }
        }, 2400);
        timersRef.current.push(nextT);
      } else {
        // Si aún faltan letras, pronunciar la letra colocada
        const letAudio = LETTER_AUDIO_MAP[tile.upper];
        if (letAudio) {
          audioManager.playVoice(letAudio);
        }
      }
    } else {
      audioManager.playSFX('wobble');
      registrarFallo(expectedLetter);
      setWobbleError(true);
      setTimeout(() => setWobbleError(false), 500);
    }
  };

  return (
    <div className="relative w-full min-h-[94vh] flex flex-col justify-between p-2.5 sm:p-5 overflow-hidden bg-gradient-to-b from-amber-100/90 via-pink-100/90 to-purple-100/90 select-none">
      {/* HEADER */}
      <header className="z-20 w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            clearTimers();
            audioManager.stopVoice();
            audioManager.playSFX('bubble');
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-2xl border-2 border-pink-200 text-purple-700 font-extrabold text-xs sm:text-sm shadow-sm hover:scale-105 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-600" />
          <span>Mapa</span>
        </button>

        {/* Selector de los 4 Niveles de Escritura */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-white/90 p-1.5 rounded-2xl border border-amber-300 shadow-sm">
          {WRITING_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                clearTimers();
                setLevelIdx(idx);
                setWordIdx(0);
                setLevelModal(false);
              }}
              className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                idx === levelIdx
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm scale-105'
                  : 'bg-amber-50 text-purple-800 hover:bg-amber-100'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        {/* Alternar Mayúsculas / Minúsculas */}
        <button
          type="button"
          onClick={() => setUseLowercase((prev) => !prev)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-2xl text-xs font-black shadow-md hover:scale-105 transition-all"
        >
          {useLowercase ? 'Modo: minúsculas (abc)' : 'Modo: MAYÚSCULAS (ABC)'}
        </button>
      </header>

      {/* SELECTOR DE PALABRAS DEL NIVEL */}
      <div className="z-20 w-full max-w-4xl mx-auto my-1 flex flex-wrap items-center justify-center gap-1">
        {currentLevel.words.map((w, idx) => (
          <button
            key={w.word}
            type="button"
            onClick={() => {
              clearTimers();
              setWordIdx(idx);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
              idx === wordIdx
                ? 'bg-pink-500 text-white border-yellow-300 scale-105 shadow'
                : idx < wordIdx
                ? 'bg-emerald-400 text-white border-white'
                : 'bg-white/80 text-purple-700 border-pink-200'
            }`}
          >
            {w.emoji} {useLowercase ? w.lower : w.word}
          </button>
        ))}
      </div>

      {/* ÁREA CENTRAL DE ESCRITURA */}
      <main className="z-10 w-full max-w-3xl mx-auto my-auto flex flex-col items-center gap-4">
        {/* Tarjeta del Objeto e Imagen */}
        <div
          onClick={() => audioManager.playVoice(currentWord.audioKey)}
          className="cursor-pointer w-full bg-white/95 rounded-3xl border-4 border-pink-300 shadow-xl p-3.5 sm:p-5 flex items-center justify-between gap-4 hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-tr from-pink-100 to-amber-100 border-2 border-pink-300 flex items-center justify-center text-4xl sm:text-5xl shadow-inner p-3">
              {currentWord.emoji}
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-pink-600 uppercase">
                Escribe letra por letra ({currentWord.letters.length} letras):
              </span>
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wider">
                  {currentWord.word}
                </h2>
                <span className="text-xl sm:text-3xl font-bold text-purple-600">
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
          className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 p-3 sm:p-4 rounded-3xl bg-white/90 border-4 ${
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
                className={`w-12 h-16 sm:w-16 sm:h-20 rounded-2xl border-3 flex flex-col items-center justify-center font-black transition-all ${
                  placed
                    ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-white shadow-lg scale-105'
                    : isNext
                    ? 'bg-amber-50 border-amber-400 border-dashed text-amber-400 animate-pulse'
                    : 'bg-slate-50 border-slate-200 border-dashed text-slate-300'
                }`}
              >
                {placed ? (
                  <>
                    <span className="text-2xl sm:text-3xl leading-none">
                      {useLowercase ? placed.lower : placed.upper}
                    </span>
                    <span className="text-[11px] opacity-85 mt-0.5">
                      {useLowercase ? placed.upper : placed.lower}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl opacity-35">
                    {useLowercase ? expectedChar.toLowerCase() : expectedChar}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* TECLADO DE FICHAS DE LETRAS */}
        <div className="w-full bg-white/85 rounded-3xl border-3 border-pink-200 p-3.5 shadow-md text-center">
          <p className="text-xs font-black text-purple-700 mb-2.5">
            ✍️ Toca la letra{' '}
            <strong className="text-pink-600 text-base">
              {useLowercase
                ? (currentWord.letters[typedLetters.length] || '✓').toLowerCase()
                : currentWord.letters[typedLetters.length] || '✓'}
            </strong>{' '}
            para escribir la palabra:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {availableTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => handleSelectTile(tile)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-rose-500 text-white font-black shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-xl sm:text-2xl leading-none">
                  {useLowercase ? tile.lower : tile.upper}
                </span>
                <span className="text-[11px] opacity-90">
                  {useLowercase ? tile.upper : tile.lower}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-5xl mx-auto flex items-center justify-between mt-1">
        <button
          type="button"
          onClick={() => audioManager.playVoice(currentWord.audioKey)}
          className="flex items-center gap-1.5 bg-pink-500 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black shadow"
        >
          <Volume2 className="w-4 h-4" />
          <span>Escuchar "{currentWord.word}"</span>
        </button>

        <button
          type="button"
          onClick={() => {
            clearTimers();
            if (wordIdx + 1 < currentLevel.words.length) setWordIdx((w) => w + 1);
            else if (levelIdx + 1 < WRITING_LEVELS.length) setLevelModal(true);
          }}
          className="flex items-center gap-1 bg-white/90 border border-purple-300 px-3 py-1.5 rounded-2xl text-xs font-black text-purple-700"
        >
          <span>Siguiente palabra</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* MODAL AL TERMINAR UN NIVEL DE ESCRITURA */}
      {levelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-pink-300 shadow-2xl">
            <img
              src="/fairy-mimi.jpg"
              alt="Hadita Mimi"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Completaste el {currentLevel.name}! ✍️🎉
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Cada vez escribes palabras más largas e importantes, Cristal!
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setWordIdx(0);
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Jugar {WRITING_LEVELS[levelIdx + 1]?.name}!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  if (onReturnToMap) onReturnToMap();
                  else navegarA('map');
                }}
                className="w-full py-2.5 rounded-2xl font-bold text-sm text-purple-700 bg-purple-100 hover:bg-purple-200"
              >
                Volver al Mapa Mágico
              </button>
            </div>
          </div>
        </div>
      )}

      {hasWonAll && (
        <VictoryModal
          title="¡Graduada en Escritura Mágica!"
          subtitle="¡Escribiste palabras de 1, 2, 3 y 4 sílabas letra por letra, Cristal!"
          levelIdToUnlock="mision8"
          yarnReward={3}
          onReturnToMap={() => {
            setHasWonAll(false);
            if (onReturnToMap) onReturnToMap();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
