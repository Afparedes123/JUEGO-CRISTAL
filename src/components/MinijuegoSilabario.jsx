import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, Wand2 } from 'lucide-react';

// Todas las familias silábicas al estilo "Leo con Grin"
const CONSONANT_FAMILIES = [
  { c: 'M', lower: 'm', name: 'Eme', emoji: '👩', word: 'Mamá', letterAudio: 'let_m', syls: [
    { v: 'A', s: 'MA', l: 'ma', audio: 'syl_ma', ex: 'Mamá 👩' },
    { v: 'E', s: 'ME', l: 'me', audio: 'syl_me', ex: 'Mesa 🪑' },
    { v: 'I', s: 'MI', l: 'mi', audio: 'syl_mi', ex: 'Mimi 🐱' },
    { v: 'O', s: 'MO', l: 'mo', audio: 'syl_mo', ex: 'Mono 🐒' },
    { v: 'U', s: 'MU', l: 'mu', audio: 'syl_mu', ex: 'Muñeca 🎎' },
  ]},
  { c: 'P', lower: 'p', name: 'Pe', emoji: '👨', word: 'Papá', letterAudio: 'let_p', syls: [
    { v: 'A', s: 'PA', l: 'pa', audio: 'syl_pa', ex: 'Papá 👨' },
    { v: 'E', s: 'PE', l: 'pe', audio: 'syl_pe', ex: 'Pelota ⚽' },
    { v: 'I', s: 'PI', l: 'pi', audio: 'syl_pi', ex: 'Piña 🍍' },
    { v: 'O', s: 'PO', l: 'po', audio: 'syl_po', ex: 'Pollito 🐥' },
    { v: 'U', s: 'PU', l: 'pu', audio: 'syl_pu', ex: 'Puerta 🚪' },
  ]},
  { c: 'S', lower: 's', name: 'Ese', emoji: '☀️', word: 'Sol', letterAudio: 'let_s', syls: [
    { v: 'A', s: 'SA', l: 'sa', audio: 'syl_sa', ex: 'Sapo 🐸' },
    { v: 'E', s: 'SE', l: 'se', audio: 'syl_se', ex: 'Semilla 🌱' },
    { v: 'I', s: 'SI', l: 'si', audio: 'syl_si', ex: 'Sirena 🧜‍♀️' },
    { v: 'O', s: 'SO', l: 'so', audio: 'syl_so', ex: 'Sol ☀️' },
    { v: 'U', s: 'SU', l: 'su', audio: 'syl_su', ex: 'Suma ➕' },
  ]},
  { c: 'L', lower: 'l', name: 'Ele', emoji: '🌙', word: 'Luna', letterAudio: 'let_l', syls: [
    { v: 'A', s: 'LA', l: 'la', audio: 'syl_la', ex: 'Lazo 🎀' },
    { v: 'E', s: 'LE', l: 'le', audio: 'syl_le', ex: 'León 🦁' },
    { v: 'I', s: 'LI', l: 'li', audio: 'syl_li', ex: 'Limón 🍋' },
    { v: 'O', s: 'LO', l: 'lo', audio: 'syl_lo', ex: 'Loro 🦜' },
    { v: 'U', s: 'LU', l: 'lu', audio: 'syl_lu', ex: 'Luna 🌙' },
  ]},
  { c: 'T', lower: 't', name: 'Te', emoji: '🐢', word: 'Tortuga', letterAudio: 'let_t', syls: [
    { v: 'A', s: 'TA', l: 'ta', audio: 'syl_ta', ex: 'Taza ☕' },
    { v: 'E', s: 'TE', l: 'te', audio: 'syl_te', ex: 'Tela 🧶' },
    { v: 'I', s: 'TI', l: 'ti', audio: 'syl_ti', ex: 'Tigre 🐯' },
    { v: 'O', s: 'TO', l: 'to', audio: 'syl_to', ex: 'Tomate 🍅' },
    { v: 'U', s: 'TU', l: 'tu', audio: 'syl_tu', ex: 'Tulipán 🌷' },
  ]},
  { c: 'D', lower: 'd', name: 'De', emoji: '🐬', word: 'Delfín', letterAudio: 'let_d', syls: [
    { v: 'A', s: 'DA', l: 'da', audio: 'syl_da', ex: 'Dado 🎲' },
    { v: 'E', s: 'DE', l: 'de', audio: 'syl_de', ex: 'Dedo 👆' },
    { v: 'I', s: 'DI', l: 'di', audio: 'syl_di', ex: 'Dinosaurio 🦕' },
    { v: 'O', s: 'DO', l: 'do', audio: 'syl_do', ex: 'Dona 🍩' },
    { v: 'U', s: 'DU', l: 'du', audio: 'syl_du', ex: 'Duende 🧝' },
  ]},
  { c: 'N', lower: 'n', name: 'Ene', emoji: '☁️', word: 'Nube', letterAudio: 'let_n', syls: [
    { v: 'A', s: 'NA', l: 'na', audio: 'syl_na', ex: 'Naranja 🍊' },
    { v: 'E', s: 'NE', l: 'ne', audio: 'syl_ne', ex: 'Nene 👶' },
    { v: 'I', s: 'NI', l: 'ni', audio: 'syl_ni', ex: 'Nido 🪺' },
    { v: 'O', s: 'NO', l: 'no', audio: 'syl_no', ex: 'Noche 🌌' },
    { v: 'U', s: 'NU', l: 'nu', audio: 'syl_nu', ex: 'Nube ☁️' },
  ]},
  { c: 'B', lower: 'b', name: 'Be', emoji: '🐳', word: 'Ballena', letterAudio: 'let_b', syls: [
    { v: 'A', s: 'BA', l: 'ba', audio: 'syl_ba', ex: 'Ballena 🐳' },
    { v: 'E', s: 'BE', l: 'be', audio: 'syl_be', ex: 'Bebé 🍼' },
    { v: 'I', s: 'BI', l: 'bi', audio: 'syl_bi', ex: 'Bicicleta 🚲' },
    { v: 'O', s: 'BO', l: 'bo', audio: 'syl_bo', ex: 'Bota 👢' },
    { v: 'U', s: 'BU', l: 'bu', audio: 'syl_bu', ex: 'Búho 🦉' },
  ]},
  { c: 'C', lower: 'c', name: 'Ce', emoji: '🏠', word: 'Casa', letterAudio: 'let_c', syls: [
    { v: 'A', s: 'CA', l: 'ca', audio: 'syl_ca', ex: 'Casa 🏠' },
    { v: 'E', s: 'CE', l: 'ce', audio: 'syl_ce', ex: 'Cebra 🦓' },
    { v: 'I', s: 'CI', l: 'ci', audio: 'syl_ci', ex: 'Cisne 🦢' },
    { v: 'O', s: 'CO', l: 'co', audio: 'syl_co', ex: 'Conejo 🐰' },
    { v: 'U', s: 'CU', l: 'cu', audio: 'syl_cu', ex: 'Cuna 🛏️' },
  ]},
  { c: 'G', lower: 'g', name: 'Ge', emoji: '🐱', word: 'Gato', letterAudio: 'let_g', syls: [
    { v: 'A', s: 'GA', l: 'ga', audio: 'syl_ga', ex: 'Gato 🐱' },
    { v: 'E', s: 'GE', l: 'ge', audio: 'syl_ge', ex: 'Gelatina 🍮' },
    { v: 'I', s: 'GI', l: 'gi', audio: 'syl_gi', ex: 'Girasol 🌻' },
    { v: 'O', s: 'GO', l: 'go', audio: 'syl_go', ex: 'Gorro 🧢' },
    { v: 'U', s: 'GU', l: 'gu', audio: 'syl_gu', ex: 'Gusano 🐛' },
  ]},
  { c: 'R', lower: 'r', name: 'Erre', emoji: '🌹', word: 'Rosa', letterAudio: 'let_r', syls: [
    { v: 'A', s: 'RA', l: 'ra', audio: 'syl_ra', ex: 'Rana 🐸' },
    { v: 'E', s: 'RE', l: 're', audio: 'syl_re', ex: 'Reina 👑' },
    { v: 'I', s: 'RI', l: 'ri', audio: 'syl_ri', ex: 'Risa 😄' },
    { v: 'O', s: 'RO', l: 'ro', audio: 'syl_ro', ex: 'Rosa 🌹' },
    { v: 'U', s: 'RU', l: 'ru', audio: 'syl_ru', ex: 'Rueda 🎡' },
  ]},
  { c: 'F', lower: 'f', name: 'Efe', emoji: '🌸', word: 'Flor', letterAudio: 'let_f', syls: [
    { v: 'A', s: 'FA', l: 'fa', audio: 'syl_fa', ex: 'Familia 👨‍👩‍👧' },
    { v: 'E', s: 'FE', l: 'fe', audio: 'syl_fe', ex: 'Feliz 😊' },
    { v: 'I', s: 'FI', l: 'fi', audio: 'syl_fi', ex: 'Fiesta 🎉' },
    { v: 'O', s: 'FO', l: 'fo', audio: 'syl_fo', ex: 'Foca 🦭' },
    { v: 'U', s: 'FU', l: 'fu', audio: 'syl_fu', ex: 'Fuego 🔥' },
  ]},
  { c: 'J', lower: 'j', name: 'Jota', emoji: '🦒', word: 'Jirafa', letterAudio: 'let_j', syls: [
    { v: 'A', s: 'JA', l: 'ja', audio: 'syl_ja', ex: 'Jardín 🏡' },
    { v: 'E', s: 'JE', l: 'je', audio: 'syl_je', ex: 'Jeringa 💉' },
    { v: 'I', s: 'JI', l: 'ji', audio: 'syl_ji', ex: 'Jirafa 🦒' },
    { v: 'O', s: 'JO', l: 'jo', audio: 'syl_jo', ex: 'Joya 💎' },
    { v: 'U', s: 'JU', l: 'ju', audio: 'syl_ju', ex: 'Juguete 🧸' },
  ]},
  { c: 'V', lower: 'v', name: 'Uve', emoji: '🐮', word: 'Vaca', letterAudio: 'let_v', syls: [
    { v: 'A', s: 'VA', l: 'va', audio: 'syl_va', ex: 'Vaca 🐮' },
    { v: 'E', s: 'VE', l: 've', audio: 'syl_ve', ex: 'Vela 🕯️' },
    { v: 'I', s: 'VI', l: 'vi', audio: 'syl_vi', ex: 'Violín 🎻' },
    { v: 'O', s: 'VO', l: 'vo', audio: 'syl_vo', ex: 'Volcán 🌋' },
    { v: 'U', s: 'VU', l: 'vu', audio: 'syl_vu', ex: 'Vuelo ✈️' },
  ]},
  { c: 'Z', lower: 'z', name: 'Zeta', emoji: '👟', word: 'Zapato', letterAudio: 'let_z', syls: [
    { v: 'A', s: 'ZA', l: 'za', audio: 'syl_za', ex: 'Zapato 👟' },
    { v: 'E', s: 'ZE', l: 'ze', audio: 'syl_ze', ex: 'Zepelín 🎈' },
    { v: 'I', s: 'ZI', l: 'zi', audio: 'syl_zi', ex: 'Zigzag ⚡' },
    { v: 'O', s: 'ZO', l: 'zo', audio: 'syl_zo', ex: 'Zorro 🦊' },
    { v: 'U', s: 'ZU', l: 'zu', audio: 'syl_zu', ex: 'Zumo 🧃' },
  ]},
  { c: 'Ñ', lower: 'ñ', name: 'Eñe', emoji: '🐦', word: 'Ñandú', letterAudio: 'let_ny', syls: [
    { v: 'A', s: 'ÑA', l: 'ña', audio: 'syl_nya', ex: 'Piña 🍍' },
    { v: 'E', s: 'ÑE', l: 'ñe', audio: 'syl_nye', ex: 'Muñeca 🎎' },
    { v: 'I', s: 'ÑI', l: 'ñi', audio: 'syl_nyi', ex: 'Meñique 🤙' },
    { v: 'O', s: 'ÑO', l: 'ño', audio: 'syl_nyo', ex: 'Moño 🎀' },
    { v: 'U', s: 'ÑU', l: 'ñu', audio: 'syl_nyu', ex: 'Pañuelo 🧣' },
  ]},
  { c: 'Y', lower: 'y', name: 'Ye', emoji: '🪀', word: 'Yoyo', letterAudio: 'let_y', syls: [
    { v: 'A', s: 'YA', l: 'ya', audio: 'syl_ya', ex: 'Yate 🛥️' },
    { v: 'E', s: 'YE', l: 'ye', audio: 'syl_ye', ex: 'Yema 🍳' },
    { v: 'I', s: 'YI', l: 'yi', audio: 'syl_yi', ex: 'Rayito ⚡' },
    { v: 'O', s: 'YO', l: 'yo', audio: 'syl_yo', ex: 'Yoyo 🪀' },
    { v: 'U', s: 'YU', l: 'yu', audio: 'syl_yu', ex: 'Yuca 🥔' },
  ]},
];

export default function MinijuegoSilabario({ onReturnToMap }) {
  const { audioManager, registrarAcierto, navegarA } = useGame();
  const [selectedFamily, setSelectedFamily] = useState(CONSONANT_FAMILIES[0]);
  const [activeSyl, setActiveSyl] = useState(CONSONANT_FAMILIES[0].syls[0]);
  const [combinedCount, setCombinedCount] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      audioManager.playVoice('silabario_welcome');
    }, 350);
    return () => clearTimeout(timer);
  }, [audioManager]);

  const handleSelectConsonant = (fam) => {
    setSelectedFamily(fam);
    setActiveSyl(fam.syls[0]);
    audioManager.playSFX('sparkle');
    audioManager.playVoice(fam.letterAudio);
  };

  const handleCombineVowel = (sylObj) => {
    setActiveSyl(sylObj);
    audioManager.playSFX('magic');
    audioManager.playVoice(sylObj.audio);
    registrarAcierto(sylObj.s);

    const next = combinedCount + 1;
    setCombinedCount(next);
    if (next === 10 && !hasWon) {
      setTimeout(() => setHasWon(true), 1200);
    }
  };

  return (
    <div className="relative w-full min-h-[94vh] flex flex-col justify-between p-3 sm:p-5 overflow-hidden bg-gradient-to-b from-purple-100/95 via-pink-100/90 to-amber-50/90 select-none">
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

        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/90 rounded-full border-2 border-purple-300 shadow-sm">
          <Wand2 className="w-4 h-4 text-purple-600" />
          <h1 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600">
            Libro Mágico de Sílabas: Consonantes + Vocales (Leo con Grin)
          </h1>
        </div>

        <div className="bg-white/90 border-2 border-pink-300 px-3 py-1.5 rounded-2xl text-xs font-black text-pink-700">
          Sílabas leídas: {combinedCount} ✨
        </div>
      </header>

      {/* SELECTOR DE CONSONANTES (M, P, S, L, T, D, N, B, C, G, R, F, J, V, Z, Ñ, Y) */}
      <div className="z-20 w-full max-w-5xl mx-auto my-2 bg-white/85 backdrop-blur-md p-2.5 rounded-3xl border-2 border-pink-200 shadow-md">
        <p className="text-[11px] sm:text-xs font-black text-purple-700 mb-1.5 text-center">
          1️⃣ Elige una Consonante (Mayúscula y Minúscula):
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {CONSONANT_FAMILIES.map((fam) => {
            const isSelected = selectedFamily.c === fam.c;
            return (
              <button
                key={fam.c}
                onClick={() => handleSelectConsonant(fam)}
                className={`px-3 py-1.5 rounded-2xl font-black transition-all border-2 flex items-baseline gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-yellow-300 scale-110 shadow-md'
                    : 'bg-white text-slate-700 border-purple-200 hover:border-pink-400'
                }`}
              >
                <span className="text-base sm:text-lg">{fam.c}</span>
                <span className="text-xs sm:text-sm opacity-85">{fam.lower}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ÁREA CENTRAL: COMBINADOR INTERACTIVO DE CONSONANTE + VOCAL = SÍLABA */}
      <main className="z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center gap-4">
        {/* ECUACIÓN VISUAL DE LECTURA */}
        <div
          onClick={() => audioManager.playVoice(activeSyl.audio)}
          className="cursor-pointer w-full bg-white/95 backdrop-blur-md rounded-3xl border-4 border-pink-300 shadow-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-around gap-4 hover:scale-[1.01] transition-transform"
        >
          {/* Consonante */}
          <div className="flex flex-col items-center bg-pink-50 border-3 border-pink-300 px-6 py-3 rounded-3xl">
            <span className="text-xs font-black text-pink-600 uppercase">Consonante</span>
            <span className="text-4xl sm:text-5xl font-black text-pink-600">
              {selectedFamily.c} / {selectedFamily.lower}
            </span>
          </div>

          <span className="text-3xl font-black text-purple-500">+</span>

          {/* Vocal */}
          <div className="flex flex-col items-center bg-amber-50 border-3 border-amber-300 px-6 py-3 rounded-3xl">
            <span className="text-xs font-black text-amber-700 uppercase">Vocal</span>
            <span className="text-4xl sm:text-5xl font-black text-amber-600">
              {activeSyl.v} / {activeSyl.v.toLowerCase()}
            </span>
          </div>

          <span className="text-3xl font-black text-purple-500">=</span>

          {/* Resultado: Sílaba Completa Junta */}
          <div className="flex flex-col items-center bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-3xl shadow-xl border-4 border-yellow-300 animate-pulse">
            <span className="text-xs font-black text-yellow-200 uppercase flex items-center gap-1">
              <Volume2 className="w-4 h-4" /> Suenan Juntas:
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black">{activeSyl.s}</span>
              <span className="text-4xl sm:text-5xl font-bold text-pink-200">
                {activeSyl.l}
              </span>
            </div>
            <span className="mt-1 text-xs sm:text-sm font-extrabold bg-white/20 px-3 py-0.5 rounded-full">
              Como en {activeSyl.ex}
            </span>
          </div>
        </div>

        {/* BOTONES DE LAS 5 COMBINACIONES CON A, E, I, O, U */}
        <div className="w-full bg-white/90 rounded-3xl border-3 border-purple-200 p-4 shadow-lg text-center">
          <p className="text-xs sm:text-sm font-black text-purple-800 mb-3">
            2️⃣ Toca cada sílaba de la familia de la <strong>{selectedFamily.c} ({selectedFamily.name})</strong> para escuchar cómo suenan juntas:
          </p>
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {selectedFamily.syls.map((sylObj) => {
              const isCurrent = activeSyl.s === sylObj.s;
              return (
                <button
                  key={sylObj.s}
                  onClick={() => handleCombineVowel(sylObj)}
                  className={`p-3 sm:p-4 rounded-3xl border-3 flex flex-col items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white border-yellow-300 shadow-xl scale-105'
                      : 'bg-gradient-to-b from-white to-pink-50 border-pink-300 text-purple-900 hover:border-purple-500'
                  }`}
                >
                  <span className="text-2xl sm:text-4xl font-black leading-none">
                    {sylObj.s}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold opacity-85 mt-1">
                    {sylObj.l}
                  </span>
                  <span className="text-[11px] font-bold mt-1 opacity-90 truncate max-w-full">
                    {sylObj.ex}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-5xl mx-auto flex items-center justify-between mt-2">
        <div className="flex items-center gap-2 bg-white/85 px-3.5 py-1.5 rounded-2xl border border-pink-200">
          <img
            src="/fairy-lulu.jpg"
            alt="Hadita Lulú"
            className="w-8 h-8 rounded-full object-cover border border-pink-400"
          />
          <span className="text-xs font-extrabold text-pink-700">
            Hadita Lulú: "¡Junta cualquier consonante con las 5 vocales!"
          </span>
        </div>

        <button
          onClick={() => audioManager.playVoice(activeSyl.audio)}
          className="flex items-center gap-1.5 bg-pink-500 text-white px-4 py-1.5 rounded-2xl text-xs font-black shadow"
        >
          <Volume2 className="w-4 h-4" />
          <span>Repetir "{activeSyl.l}"</span>
        </button>
      </footer>

      {hasWon && (
        <VictoryModal
          title="¡Maestra de las Sílabas!"
          subtitle="¡Qué bien combinas las consonantes con las vocales, Cristal!"
          levelIdToUnlock="mision5"
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
