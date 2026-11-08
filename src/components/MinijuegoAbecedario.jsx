import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, CheckCircle2, BookOpen } from 'lucide-react';

// Las 27 letras del abecedario español con mayúscula, minúscula, sílabas y palabra ejemplo
const ALPHABET_DATA = [
  { upper: 'A', lower: 'a', isVowel: true, name: 'A', word: 'Abeja', emoji: '🐝', audioKey: 'let_a', syllables: ['A', 'a'] },
  { upper: 'B', lower: 'b', isVowel: false, name: 'Be', word: 'Ballena', emoji: '🐳', audioKey: 'let_b', syllables: ['BA', 'BE', 'BI', 'BO', 'BU'], sylKeys: ['syl_ba', 'syl_be', 'syl_bi', 'syl_bo', 'syl_bu'] },
  { upper: 'C', lower: 'c', isVowel: false, name: 'Ce', word: 'Casa', emoji: '🏠', audioKey: 'let_c', syllables: ['CA', 'CE', 'CI', 'CO', 'CU'], sylKeys: ['syl_ca', 'syl_ce', 'syl_ci', 'syl_co', 'syl_cu'] },
  { upper: 'D', lower: 'd', isVowel: false, name: 'De', word: 'Delfín', emoji: '🐬', audioKey: 'let_d', syllables: ['DA', 'DE', 'DI', 'DO', 'DU'], sylKeys: ['syl_da', 'syl_de', 'syl_di', 'syl_do', 'syl_du'] },
  { upper: 'E', lower: 'e', isVowel: true, name: 'E', word: 'Estrella', emoji: '⭐', audioKey: 'let_e', syllables: ['E', 'e'] },
  { upper: 'F', lower: 'f', isVowel: false, name: 'Efe', word: 'Flor', emoji: '🌸', audioKey: 'let_f', syllables: ['FA', 'FE', 'FI', 'FO', 'FU'], sylKeys: ['syl_fa', 'syl_fe', 'syl_fi', 'syl_fo', 'syl_fu'] },
  { upper: 'G', lower: 'g', isVowel: false, name: 'Ge', word: 'Gatita', emoji: '🐱', audioKey: 'let_g', syllables: ['GA', 'GE', 'GI', 'GO', 'GU'], sylKeys: ['syl_ga', 'syl_ge', 'syl_gi', 'syl_go', 'syl_gu'] },
  { upper: 'H', lower: 'h', isVowel: false, name: 'Hache', word: 'Hada', emoji: '🧚‍♀️', audioKey: 'let_h', syllables: ['HA', 'HE', 'HI', 'HO', 'HU'], sylKeys: ['vocal_a', 'vocal_e', 'vocal_i', 'vocal_o', 'vocal_u'] },
  { upper: 'I', lower: 'i', isVowel: true, name: 'I', word: 'Isla', emoji: '🏝️', audioKey: 'let_i', syllables: ['I', 'i'] },
  { upper: 'J', lower: 'j', isVowel: false, name: 'Jota', word: 'Jirafa', emoji: '🦒', audioKey: 'let_j', syllables: ['JA', 'JE', 'JI', 'JO', 'JU'], sylKeys: ['syl_ja', 'syl_je', 'syl_ji', 'syl_jo', 'syl_ju'] },
  { upper: 'K', lower: 'k', isVowel: false, name: 'Ka', word: 'Koala', emoji: '🐨', audioKey: 'let_k', syllables: ['KA', 'KE', 'KI', 'KO', 'KU'], sylKeys: ['syl_ca', 'syl_pe', 'syl_pi', 'syl_co', 'syl_cu'] },
  { upper: 'L', lower: 'l', isVowel: false, name: 'Ele', word: 'Luna', emoji: '🌙', audioKey: 'let_l', syllables: ['LA', 'LE', 'LI', 'LO', 'LU'], sylKeys: ['syl_la', 'syl_le', 'syl_li', 'syl_lo', 'syl_lu'] },
  { upper: 'M', lower: 'm', isVowel: false, name: 'Eme', word: 'Mamá', emoji: '👩', audioKey: 'let_m', syllables: ['MA', 'ME', 'MI', 'MO', 'MU'], sylKeys: ['syl_ma', 'syl_me', 'syl_mi', 'syl_mo', 'syl_mu'] },
  { upper: 'N', lower: 'n', isVowel: false, name: 'Ene', word: 'Nube', emoji: '☁️', audioKey: 'let_n', syllables: ['NA', 'NE', 'NI', 'NO', 'NU'], sylKeys: ['syl_na', 'syl_ne', 'syl_ni', 'syl_no', 'syl_nu'] },
  { upper: 'Ñ', lower: 'ñ', isVowel: false, name: 'Eñe', word: 'Ñandú', emoji: '🐦', audioKey: 'let_ny', syllables: ['ÑA', 'ÑE', 'ÑI', 'ÑO', 'ÑU'], sylKeys: ['syl_nya', 'syl_nye', 'syl_nyi', 'syl_nyo', 'syl_nyu'] },
  { upper: 'O', lower: 'o', isVowel: true, name: 'O', word: 'Osito', emoji: '🧸', audioKey: 'let_o', syllables: ['O', 'o'] },
  { upper: 'P', lower: 'p', isVowel: false, name: 'Pe', word: 'Papá', emoji: '👨', audioKey: 'let_p', syllables: ['PA', 'PE', 'PI', 'PO', 'PU'], sylKeys: ['syl_pa', 'syl_pe', 'syl_pi', 'syl_po', 'syl_pu'] },
  { upper: 'Q', lower: 'q', isVowel: false, name: 'Cu', word: 'Queso', emoji: '🧀', audioKey: 'let_q', syllables: ['QUE', 'QUI'], sylKeys: ['syl_pe', 'syl_pi'] },
  { upper: 'R', lower: 'r', isVowel: false, name: 'Erre', word: 'Rosa', emoji: '🌹', audioKey: 'let_r', syllables: ['RA', 'RE', 'RI', 'RO', 'RU'], sylKeys: ['syl_ra', 'syl_re', 'syl_ri', 'syl_ro', 'syl_ru'] },
  { upper: 'S', lower: 's', isVowel: false, name: 'Ese', word: 'Sol', emoji: '☀️', audioKey: 'let_s', syllables: ['SA', 'SE', 'SI', 'SO', 'SU'], sylKeys: ['syl_sa', 'syl_se', 'syl_si', 'syl_so', 'syl_su'] },
  { upper: 'T', lower: 't', isVowel: false, name: 'Te', word: 'Tortuga', emoji: '🐢', audioKey: 'let_t', syllables: ['TA', 'TE', 'TI', 'TO', 'TU'], sylKeys: ['syl_ta', 'syl_te', 'syl_ti', 'syl_to', 'syl_tu'] },
  { upper: 'U', lower: 'u', isVowel: true, name: 'U', word: 'Unicornio', emoji: '🦄', audioKey: 'let_u', syllables: ['U', 'u'] },
  { upper: 'V', lower: 'v', isVowel: false, name: 'Uve', word: 'Vaca', emoji: '🐮', audioKey: 'let_v', syllables: ['VA', 'VE', 'VI', 'VO', 'VU'], sylKeys: ['syl_va', 'syl_ve', 'syl_vi', 'syl_vo', 'syl_vu'] },
  { upper: 'W', lower: 'w', isVowel: false, name: 'Doble Uve', word: 'Wafle', emoji: '🧇', audioKey: 'let_w', syllables: ['WA', 'WE', 'WI', 'WO', 'WU'], sylKeys: ['syl_ga', 'syl_ge', 'syl_gi', 'syl_go', 'syl_gu'] },
  { upper: 'X', lower: 'x', isVowel: false, name: 'Equis', word: 'Xilófono', emoji: '🎼', audioKey: 'let_x', syllables: ['XA', 'XE', 'XI', 'XO', 'XU'], sylKeys: ['syl_sa', 'syl_se', 'syl_si', 'syl_so', 'syl_su'] },
  { upper: 'Y', lower: 'y', isVowel: false, name: 'Ye', word: 'Yoyo', emoji: '🪀', audioKey: 'let_y', syllables: ['YA', 'YE', 'YI', 'YO', 'YU'], sylKeys: ['syl_ya', 'syl_ye', 'syl_yi', 'syl_yo', 'syl_yu'] },
  { upper: 'Z', lower: 'z', isVowel: false, name: 'Zeta', word: 'Zapato', emoji: '👟', audioKey: 'let_z', syllables: ['ZA', 'ZE', 'ZI', 'ZO', 'ZU'], sylKeys: ['syl_za', 'syl_ze', 'syl_zi', 'syl_zo', 'syl_zu'] },
];

export default function MinijuegoAbecedario({ onReturnToMap }) {
  const { audioManager, registrarAcierto, navegarA } = useGame();
  const [selectedLetter, setSelectedLetter] = useState(ALPHABET_DATA[0]);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'vowels' | 'consonants'
  const [exploredLetters, setExploredLetters] = useState(['A']);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('abc_welcome');
    }, 350);
    return () => clearTimeout(timer);
  }, [audioManager]);

  const handleSelectLetter = (item) => {
    setSelectedLetter(item);
    audioManager.playSFX('sparkle');
    audioManager.playVoice(item.audioKey);

    if (!exploredLetters.includes(item.upper)) {
      const next = [...exploredLetters, item.upper];
      setExploredLetters(next);
      registrarAcierto(item.upper);

      // Si explora al menos 8 letras, gana ovillo de recompensa (puede seguir explorando las 27)
      if (next.length === 8 && !hasWon) {
        setTimeout(() => {
          setHasWon(true);
        }, 2500);
      }
    }
  };

  const handlePlaySyllable = (sylText, idx) => {
    audioManager.playSFX('pop');
    if (selectedLetter.sylKeys && selectedLetter.sylKeys[idx]) {
      audioManager.playVoice(selectedLetter.sylKeys[idx]);
    } else {
      audioManager.playVoice(selectedLetter.audioKey);
    }
  };

  const filteredList = ALPHABET_DATA.filter((item) => {
    if (filterMode === 'vowels') return item.isVowel;
    if (filterMode === 'consonants') return !item.isVowel;
    return true;
  });

  return (
    <div className="relative w-full min-h-[94vh] flex flex-col justify-between p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-pink-100/95 via-purple-100/90 to-sky-100/95 select-none">
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

        <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-full border-2 border-pink-300 shadow-sm">
          <BookOpen className="w-4 h-4 text-pink-600" />
          <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-700">
            Abecedario Completo: Mayúsculas y Minúsculas (A-Z)
          </h1>
        </div>

        {/* Filtros: Todo / Vocales / Consonantes */}
        <div className="flex items-center gap-1.5">
          {[
            { id: 'all', label: 'Todas (27)' },
            { id: 'vowels', label: 'Vocales (5)' },
            { id: 'consonants', label: 'Consonantes (22)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audioManager.playSFX('bubble');
                setFilterMode(tab.id);
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all border-2 ${
                filterMode === tab.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-white shadow-md scale-105'
                  : 'bg-white/80 text-purple-700 border-pink-200 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* PANEL CENTRAL: TARJETA INTERACTIVA DE LA LETRA SELECCIONADA + CUADRÍCULA A-Z */}
      <main className="z-10 w-full max-w-5xl mx-auto my-2 flex flex-col lg:flex-row items-center gap-4">
        {/* TARJETA GRANDE DE LA LETRA ACTIVA (MAYÚSCULA + MINÚSCULA + SÍLABAS) */}
        <div className="w-full lg:w-2/5 bg-white/95 backdrop-blur-md rounded-3xl border-4 border-pink-300 shadow-2xl p-4 sm:p-5 flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                selectedLetter.isVowel
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-purple-100 text-purple-800 border border-purple-300'
              }`}
            >
              {selectedLetter.isVowel ? '⭐ Vocal Mágica' : '✨ Consonante'}
            </span>
            <button
              onClick={() => audioManager.playVoice(selectedLetter.audioKey)}
              className="flex items-center gap-1 bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs px-3 py-1 rounded-full transition-all"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Escuchar</span>
            </button>
          </div>

          {/* Muestra Gigante de Mayúscula y Minúscula */}
          <div
            onClick={() => audioManager.playVoice(selectedLetter.audioKey)}
            className="cursor-pointer my-1 flex items-baseline justify-center gap-6 px-8 py-4 rounded-3xl bg-gradient-to-tr from-pink-50 via-purple-50 to-indigo-50 border-3 border-pink-200 shadow-inner hover:scale-105 transition-transform"
          >
            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl font-black text-pink-600 drop-shadow-sm">
                {selectedLetter.upper}
              </span>
              <span className="text-[11px] font-extrabold text-pink-500 uppercase mt-1">
                Mayúscula
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-6xl sm:text-7xl font-black text-purple-600 drop-shadow-sm">
                {selectedLetter.lower}
              </span>
              <span className="text-[11px] font-extrabold text-purple-500 uppercase mt-1">
                Minúscula
              </span>
            </div>
          </div>

          {/* Palabra Ejemplo con Emoji */}
          <div className="mt-3 flex items-center gap-3 bg-amber-50/90 border-2 border-amber-200 px-4 py-2 rounded-2xl w-full justify-center">
            <span className="text-4xl">{selectedLetter.emoji}</span>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-500 block">
                Letra "{selectedLetter.name}" como en:
              </span>
              <span className="text-lg sm:text-xl font-black text-slate-800">
                {selectedLetter.word} ({selectedLetter.word.toLowerCase()})
              </span>
            </div>
          </div>

          {/* Sílabas de esta letra (Consonante + Vocales) */}
          {!selectedLetter.isVowel && (
            <div className="mt-3 w-full">
              <p className="text-xs font-black text-purple-700 mb-1.5">
                🎵 Toca sus sílabas para escuchar cómo suenan juntas:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedLetter.syllables.map((syl, idx) => (
                  <button
                    key={syl}
                    onClick={() => handlePlaySyllable(syl, idx)}
                    className="px-3 py-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white font-black shadow-md hover:scale-110 active:scale-95 transition-all flex flex-col items-center min-w-[54px]"
                  >
                    <span className="text-base leading-none">{syl}</span>
                    <span className="text-xs opacity-90 leading-tight">
                      {syl.toLowerCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CUADRÍCULA DE LAS 27 LETRAS DEL ABECEDARIO */}
        <div className="w-full lg:w-3/5 bg-white/85 backdrop-blur-md rounded-3xl border-4 border-purple-200 shadow-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-black text-purple-800">
              🐾 Toca cualquier letra para aprenderla ({exploredLetters.length}/27 exploradas):
            </span>
            {exploredLetters.length >= 8 && (
              <button
                onClick={() => setHasWon(true)}
                className="text-xs font-black bg-emerald-500 text-white px-3 py-1 rounded-full shadow animate-bounce"
              >
                🎁 Reclamar Ovillo
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-[360px] overflow-y-auto p-1">
            {filteredList.map((item) => {
              const isSelected = selectedLetter.upper === item.upper;
              const isExplored = exploredLetters.includes(item.upper);

              return (
                <button
                  key={item.upper}
                  onClick={() => handleSelectLetter(item)}
                  className={`relative p-2 rounded-2xl border-2 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-yellow-300 ring-4 ring-pink-300 shadow-lg scale-105'
                      : item.isVowel
                      ? 'bg-gradient-to-b from-amber-100 to-yellow-50 border-amber-300 text-amber-900'
                      : 'bg-white border-purple-200 text-slate-800 hover:border-pink-400'
                  }`}
                >
                  {isExplored && (
                    <CheckCircle2
                      className={`w-3.5 h-3.5 absolute top-1 right-1 ${
                        isSelected ? 'text-yellow-200' : 'text-emerald-500'
                      }`}
                    />
                  )}
                  <div className="flex items-baseline gap-1 font-black">
                    <span className="text-xl sm:text-2xl">{item.upper}</span>
                    <span className="text-base sm:text-lg opacity-85">{item.lower}</span>
                  </div>
                  <span className="text-sm">{item.emoji}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/85 px-3.5 py-1.5 rounded-2xl border border-pink-200 shadow-sm">
          <img
            src="/fairy-mimi.jpg"
            alt="Hadita Mimi"
            className="w-8 h-8 rounded-full object-cover border border-purple-400"
          />
          <span className="text-xs font-extrabold text-purple-800">
            Hadita Mimi: "¡Explora las letras mayúsculas y minúsculas, Cristal!"
          </span>
        </div>

        <button
          onClick={() => audioManager.playVoice('abc_welcome')}
          className="flex items-center gap-1.5 bg-pink-100 hover:bg-pink-200 border border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700"
        >
          <Volume2 className="w-4 h-4" />
          <span>Instrucción</span>
        </button>
      </footer>

      {hasWon && (
        <VictoryModal
          title="¡Exploradora del Abecedario!"
          subtitle="¡Qué bien conoces las letras mayúsculas y minúsculas, Cristal!"
          levelIdToUnlock="mision2"
          yarnReward={2}
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
