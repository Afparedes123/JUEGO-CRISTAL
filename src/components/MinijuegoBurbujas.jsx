import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import VictoryModal from './VictoryModal';
import { ArrowLeft, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';

// 6 Niveles que cubren TODAS las combinaciones de Consonantes + Vocales (85 sílabas en total)
const BUBBLE_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: M, P, S',
    families: [
      {
        c: 'M',
        syls: [
          { target: 'MA', lower: 'ma', example: 'Mamá 👩', sylAudio: 'syl_ma' },
          { target: 'ME', lower: 'me', example: 'Mesa 🪑', sylAudio: 'syl_me' },
          { target: 'MI', lower: 'mi', example: 'Mimi 🐱', sylAudio: 'syl_mi' },
          { target: 'MO', lower: 'mo', example: 'Mono 🐒', sylAudio: 'syl_mo' },
          { target: 'MU', lower: 'mu', example: 'Muñeca 🎎', sylAudio: 'syl_mu' },
        ],
      },
      {
        c: 'P',
        syls: [
          { target: 'PA', lower: 'pa', example: 'Papá 👨', sylAudio: 'syl_pa' },
          { target: 'PE', lower: 'pe', example: 'Pelota ⚽', sylAudio: 'syl_pe' },
          { target: 'PI', lower: 'pi', example: 'Piña 🍍', sylAudio: 'syl_pi' },
          { target: 'PO', lower: 'po', example: 'Pollito 🐥', sylAudio: 'syl_po' },
          { target: 'PU', lower: 'pu', example: 'Puerta 🚪', sylAudio: 'syl_pu' },
        ],
      },
      {
        c: 'S',
        syls: [
          { target: 'SA', lower: 'sa', example: 'Sapo 🐸', sylAudio: 'syl_sa' },
          { target: 'SE', lower: 'se', example: 'Semilla 🌱', sylAudio: 'syl_se' },
          { target: 'SI', lower: 'si', example: 'Sirena 🧜‍♀️', sylAudio: 'syl_si' },
          { target: 'SO', lower: 'so', example: 'Sol ☀️', sylAudio: 'syl_so' },
          { target: 'SU', lower: 'su', example: 'Suma ➕', sylAudio: 'syl_su' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: L, T, D',
    families: [
      {
        c: 'L',
        syls: [
          { target: 'LA', lower: 'la', example: 'Lazo 🎀', sylAudio: 'syl_la' },
          { target: 'LE', lower: 'le', example: 'León 🦁', sylAudio: 'syl_le' },
          { target: 'LI', lower: 'li', example: 'Limón 🍋', sylAudio: 'syl_li' },
          { target: 'LO', lower: 'lo', example: 'Lobo 🐺', sylAudio: 'syl_lo' },
          { target: 'LU', lower: 'lu', example: 'Luna 🌙', sylAudio: 'syl_lu' },
        ],
      },
      {
        c: 'T',
        syls: [
          { target: 'TA', lower: 'ta', example: 'Taza ☕', sylAudio: 'syl_ta' },
          { target: 'TE', lower: 'te', example: 'Tela 🧶', sylAudio: 'syl_te' },
          { target: 'TI', lower: 'ti', example: 'Tigre 🐯', sylAudio: 'syl_ti' },
          { target: 'TO', lower: 'to', example: 'Tomate 🍅', sylAudio: 'syl_to' },
          { target: 'TU', lower: 'tu', example: 'Tulipán 🌷', sylAudio: 'syl_tu' },
        ],
      },
      {
        c: 'D',
        syls: [
          { target: 'DA', lower: 'da', example: 'Dado 🎲', sylAudio: 'syl_da' },
          { target: 'DE', lower: 'de', example: 'Dedo 👆', sylAudio: 'syl_de' },
          { target: 'DI', lower: 'di', example: 'Dinosaurio 🦕', sylAudio: 'syl_di' },
          { target: 'DO', lower: 'do', example: 'Dona 🍩', sylAudio: 'syl_do' },
          { target: 'DU', lower: 'du', example: 'Duende 🧝', sylAudio: 'syl_du' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: N, B, C',
    families: [
      {
        c: 'N',
        syls: [
          { target: 'NA', lower: 'na', example: 'Naranja 🍊', sylAudio: 'syl_na' },
          { target: 'NE', lower: 'ne', example: 'Nene 👶', sylAudio: 'syl_ne' },
          { target: 'NI', lower: 'ni', example: 'Nido 🪺', sylAudio: 'syl_ni' },
          { target: 'NO', lower: 'no', example: 'Noche 🌌', sylAudio: 'syl_no' },
          { target: 'NU', lower: 'nu', example: 'Nube ☁️', sylAudio: 'syl_nu' },
        ],
      },
      {
        c: 'B',
        syls: [
          { target: 'BA', lower: 'ba', example: 'Ballena 🐳', sylAudio: 'syl_ba' },
          { target: 'BE', lower: 'be', example: 'Bebé 🍼', sylAudio: 'syl_be' },
          { target: 'BI', lower: 'bi', example: 'Bicicleta 🚲', sylAudio: 'syl_bi' },
          { target: 'BO', lower: 'bo', example: 'Bota 👢', sylAudio: 'syl_bo' },
          { target: 'BU', lower: 'bu', example: 'Búho 🦉', sylAudio: 'syl_bu' },
        ],
      },
      {
        c: 'C',
        syls: [
          { target: 'CA', lower: 'ca', example: 'Casa 🏠', sylAudio: 'syl_ca' },
          { target: 'CE', lower: 'ce', example: 'Cebra 🦓', sylAudio: 'syl_ce' },
          { target: 'CI', lower: 'ci', example: 'Cisne 🦢', sylAudio: 'syl_ci' },
          { target: 'CO', lower: 'co', example: 'Conejo 🐰', sylAudio: 'syl_co' },
          { target: 'CU', lower: 'cu', example: 'Cuna 🛏️', sylAudio: 'syl_cu' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: G, R, F',
    families: [
      {
        c: 'G',
        syls: [
          { target: 'GA', lower: 'ga', example: 'Gato 🐱', sylAudio: 'syl_ga' },
          { target: 'GE', lower: 'ge', example: 'Gelatina 🍮', sylAudio: 'syl_ge' },
          { target: 'GI', lower: 'gi', example: 'Girasol 🌻', sylAudio: 'syl_gi' },
          { target: 'GO', lower: 'go', example: 'Gorro 🧢', sylAudio: 'syl_go' },
          { target: 'GU', lower: 'gu', example: 'Gusano 🐛', sylAudio: 'syl_gu' },
        ],
      },
      {
        c: 'R',
        syls: [
          { target: 'RA', lower: 'ra', example: 'Rana 🐸', sylAudio: 'syl_ra' },
          { target: 'RE', lower: 're', example: 'Reina 👑', sylAudio: 'syl_re' },
          { target: 'RI', lower: 'ri', example: 'Risa 😄', sylAudio: 'syl_ri' },
          { target: 'RO', lower: 'ro', example: 'Rosa 🌹', sylAudio: 'syl_ro' },
          { target: 'RU', lower: 'ru', example: 'Rueda 🎡', sylAudio: 'syl_ru' },
        ],
      },
      {
        c: 'F',
        syls: [
          { target: 'FA', lower: 'fa', example: 'Familia 👨‍👩‍👧', sylAudio: 'syl_fa' },
          { target: 'FE', lower: 'fe', example: 'Feliz 😊', sylAudio: 'syl_fe' },
          { target: 'FI', lower: 'fi', example: 'Fiesta 🎉', sylAudio: 'syl_fi' },
          { target: 'FO', lower: 'fo', example: 'Foca 🦭', sylAudio: 'syl_fo' },
          { target: 'FU', lower: 'fu', example: 'Fuego 🔥', sylAudio: 'syl_fu' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Nivel 5: J, V, Z',
    families: [
      {
        c: 'J',
        syls: [
          { target: 'JA', lower: 'ja', example: 'Jardín 🏡', sylAudio: 'syl_ja' },
          { target: 'JE', lower: 'je', example: 'Jefe 👑', sylAudio: 'syl_je' },
          { target: 'JI', lower: 'ji', example: 'Jirafa 🦒', sylAudio: 'syl_ji' },
          { target: 'JO', lower: 'jo', example: 'Joya 💎', sylAudio: 'syl_jo' },
          { target: 'JU', lower: 'ju', example: 'Juguete 🧸', sylAudio: 'syl_ju' },
        ],
      },
      {
        c: 'V',
        syls: [
          { target: 'VA', lower: 'va', example: 'Vaca 🐮', sylAudio: 'syl_va' },
          { target: 'VE', lower: 've', example: 'Vela 🕯️', sylAudio: 'syl_ve' },
          { target: 'VI', lower: 'vi', example: 'Violín 🎻', sylAudio: 'syl_vi' },
          { target: 'VO', lower: 'vo', example: 'Volcán 🌋', sylAudio: 'syl_vo' },
          { target: 'VU', lower: 'vu', example: 'Vuelo ✈️', sylAudio: 'syl_vu' },
        ],
      },
      {
        c: 'Z',
        syls: [
          { target: 'ZA', lower: 'za', example: 'Zapato 👟', sylAudio: 'syl_za' },
          { target: 'ZE', lower: 'ze', example: 'Zepelín 🎈', sylAudio: 'syl_ze' },
          { target: 'ZI', lower: 'zi', example: 'Zigzag ⚡', sylAudio: 'syl_zi' },
          { target: 'ZO', lower: 'zo', example: 'Zorro 🦊', sylAudio: 'syl_zo' },
          { target: 'ZU', lower: 'zu', example: 'Zumo 🧃', sylAudio: 'syl_zu' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Nivel 6: Ñ, Y',
    families: [
      {
        c: 'Ñ',
        syls: [
          { target: 'ÑA', lower: 'ña', example: 'Piña 🍍', sylAudio: 'syl_nya' },
          { target: 'ÑE', lower: 'ñe', example: 'Muñeca 🎎', sylAudio: 'syl_nye' },
          { target: 'ÑI', lower: 'ñi', example: 'Meñique 🤙', sylAudio: 'syl_nyi' },
          { target: 'ÑO', lower: 'ño', example: 'Moño 🎀', sylAudio: 'syl_nyo' },
          { target: 'ÑU', lower: 'ñu', example: 'Pañuelo 🧣', sylAudio: 'syl_nyu' },
        ],
      },
      {
        c: 'Y',
        syls: [
          { target: 'YA', lower: 'ya', example: 'Yate 🛥️', sylAudio: 'syl_ya' },
          { target: 'YE', lower: 'ye', example: 'Yema 🍳', sylAudio: 'syl_ye' },
          { target: 'YI', lower: 'yi', example: 'Rayito ⚡', sylAudio: 'syl_yi' },
          { target: 'YO', lower: 'yo', example: 'Yoyo 🪀', sylAudio: 'syl_yo' },
          { target: 'YU', lower: 'yu', example: 'Yuca 🥔', sylAudio: 'syl_yu' },
        ],
      },
    ],
  },
];

const ALL_DISTRACTORS = [
  'MA', 'ME', 'MI', 'MO', 'MU',
  'PA', 'PE', 'PI', 'PO', 'PU',
  'SA', 'SE', 'SI', 'SO', 'SU',
  'LA', 'LE', 'LI', 'LO', 'LU',
  'TA', 'TE', 'TI', 'TO', 'TU',
  'DA', 'DE', 'NA', 'NO', 'CA',
];

export default function MinijuegoBurbujas({ onReturnToMap }) {
  const { audioManager, registrarAcierto, registrarFallo, sumarOvillos, desbloquearNivel, navegarA } = useGame();

  const [levelIdx, setLevelIdx] = useState(0);
  const [familyIdx, setFamilyIdx] = useState(0);
  const [sylIdx, setSylIdx] = useState(0);
  const [scoreInRound, setScoreInRound] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [poppingId, setPoppingId] = useState(null);
  const [wobblingId, setWobblingId] = useState(null);
  const [levelCompleteModal, setLevelCompleteModal] = useState(false);
  const [hasWonAll, setHasWonAll] = useState(false);
  const [showCaseBoth, setShowCaseBoth] = useState(true);

  const nextBubbleId = useRef(1);
  const lastTouchId = useRef(null);
  const timersRef = useRef([]);

  const currentLevel = BUBBLE_LEVELS[levelIdx];
  const currentFamily = currentLevel.families[familyIdx] || currentLevel.families[0];
  const currentRound = currentFamily.syls[sylIdx] || currentFamily.syls[0];

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Pronunciar la sílaba objetivo al cambiar de sílaba o nivel
  useEffect(() => {
    if (hasWonAll || levelCompleteModal) return;
    clearTimers();
    const t = setTimeout(() => {
      audioManager.playVoice(currentRound.sylAudio);
    }, 300);
    timersRef.current.push(t);
    return () => clearTimers();
  }, [levelIdx, familyIdx, sylIdx, hasWonAll, levelCompleteModal, audioManager, currentRound.sylAudio]);

  // Generador de burbujas flotantes
  useEffect(() => {
    if (hasWonAll || levelCompleteModal) return;

    const distractors = ALL_DISTRACTORS.filter((d) => d !== currentRound.target);

    const createBubble = (initialOffsetBottom = null) => {
      const isTarget = Math.random() < 0.52;
      const sylUpper = isTarget
        ? currentRound.target
        : distractors[Math.floor(Math.random() * distractors.length)];

      const newBubble = {
        id: nextBubbleId.current++,
        syllable: sylUpper,
        lower: sylUpper.toLowerCase(),
        isTarget,
        left: Math.floor(Math.random() * 72) + 8,
        speed: (Math.random() * 2.5 + 5.5).toFixed(1),
        size: Math.floor(Math.random() * 14) + 84,
        initialBottom: initialOffsetBottom,
      };

      setBubbles((prev) => [...prev.slice(-9), newBubble]);
    };

    setBubbles([]);
    createBubble(25);
    createBubble(115);
    createBubble(205);
    createBubble(285);

    const interval = setInterval(() => createBubble(null), 1450);
    return () => clearInterval(interval);
  }, [levelIdx, familyIdx, sylIdx, hasWonAll, levelCompleteModal, currentRound]);

  // Avanzar a la siguiente sílaba, familia o nivel
  const advanceToNextSyllable = () => {
    clearTimers();
    setScoreInRound(0);
    if (sylIdx + 1 < currentFamily.syls.length) {
      setSylIdx((prev) => prev + 1);
    } else if (familyIdx + 1 < currentLevel.families.length) {
      setFamilyIdx((prev) => prev + 1);
      setSylIdx(0);
    } else {
      // Terminó todas las familias de este Nivel
      sumarOvillos(2);
      desbloquearNivel('mision3');
      if (levelIdx + 1 < BUBBLE_LEVELS.length) {
        audioManager.playSFX('celebration');
        audioManager.playVoice('bubbles_win');
        setLevelCompleteModal(true);
      } else {
        audioManager.playSFX('celebration');
        audioManager.playVoice('bubbles_win');
        setHasWonAll(true);
      }
    }
  };

  const handleBubbleTouch = (e, bubble) => {
    e.stopPropagation();
    if (hasWonAll || levelCompleteModal) return;

    if (lastTouchId.current === bubble.id) return;
    lastTouchId.current = bubble.id;
    setTimeout(() => {
      if (lastTouchId.current === bubble.id) lastTouchId.current = null;
    }, 300);

    const audioKey =
      bubble.lower.startsWith('ñ')
        ? `syl_ny${bubble.lower.slice(1)}`
        : `syl_${bubble.lower}`;

    if (bubble.isTarget) {
      clearTimers();
      audioManager.playSFX('pop');
      audioManager.playSFX('sparkle');
      audioManager.playVoice(audioKey);
      registrarAcierto(bubble.syllable);

      setPoppingId(bubble.id);
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
        setPoppingId(null);
      }, 280);

      const nextScore = scoreInRound + 1;
      setScoreInRound(nextScore);

      // 2 burbujas por sílaba para avanzar ágilmente por todas las combinaciones
      if (nextScore >= 2) {
        const advTimer = setTimeout(() => {
          audioManager.playSFX('bell');
          advanceToNextSyllable();
        }, 1250);
        timersRef.current.push(advTimer);
      }
    } else {
      clearTimers();
      audioManager.playSFX('wobble');
      registrarFallo(bubble.syllable);
      setWobblingId(bubble.id);
      setTimeout(() => setWobblingId(null), 550);
      // Pronunciar la sílaba objetivo que estamos buscando
      audioManager.playVoice(currentRound.sylAudio);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col justify-between p-2.5 sm:p-5 overflow-hidden bg-gradient-to-b from-sky-100/95 via-purple-100/90 to-pink-100/95 select-none">
      {/* HEADER SUPERIOR */}
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

        {/* Selector de los 6 Niveles de Burbujas */}
        <div className="flex flex-wrap items-center justify-center gap-1 bg-white/85 px-2.5 py-1 rounded-2xl border border-purple-200 shadow-sm">
          {BUBBLE_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                clearTimers();
                setLevelIdx(idx);
                setFamilyIdx(0);
                setSylIdx(0);
                setScoreInRound(0);
                setLevelCompleteModal(false);
              }}
              className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                idx === levelIdx
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm scale-105'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowCaseBoth((prev) => !prev)}
          className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-2xl text-xs font-black text-purple-800 shadow-sm"
        >
          {showCaseBoth ? 'MA / ma' : 'Solo MA'}
        </button>
      </header>

      {/* SELECTOR DE CONSONANTE Y SUS 5 SÍLABAS DENTRO DEL NIVEL ACTUAL */}
      <div className="z-20 w-full max-w-4xl mx-auto my-1 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-3xl border-2 border-pink-200 shadow-md">
        {/* Familias de consonantes del nivel */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-purple-700">Letra:</span>
          {currentLevel.families.map((fam, fIdx) => (
            <button
              key={fam.c}
              type="button"
              onClick={() => {
                clearTimers();
                setFamilyIdx(fIdx);
                setSylIdx(0);
                setScoreInRound(0);
              }}
              className={`px-3 py-1 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
                fIdx === familyIdx
                  ? 'bg-amber-400 text-amber-950 border-yellow-300 scale-105 shadow-sm'
                  : 'bg-white text-purple-800 border-purple-200'
              }`}
            >
              {fam.c} / {fam.c.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Las 5 sílabas de la consonante activa */}
        <div className="flex items-center gap-1.5">
          {currentFamily.syls.map((sItem, sIdx) => {
            const active = sIdx === sylIdx;
            const done = sIdx < sylIdx;
            return (
              <button
                key={sItem.target}
                type="button"
                onClick={() => {
                  clearTimers();
                  setSylIdx(sIdx);
                  setScoreInRound(0);
                }}
                className={`px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-pink-500 text-white border-yellow-300 scale-110 shadow-md'
                    : done
                    ? 'bg-emerald-400 text-white border-white'
                    : 'bg-pink-50 text-pink-700 border-pink-200'
                }`}
              >
                {sItem.target}/{sItem.lower}
              </button>
            );
          })}
        </div>

        {/* Tarjeta de Sílaba Objetivo + Audio */}
        <button
          type="button"
          onClick={() => audioManager.playVoice(currentRound.sylAudio)}
          className="flex items-center gap-2 px-3.5 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black text-xs sm:text-sm shadow cursor-pointer"
        >
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>
            Atrapa: {currentRound.target} ({currentRound.example}) • {scoreInRound}/2 ★
          </span>
        </button>
      </div>

      {/* ÁREA DE JUEGO: BURBUJAS FLOTANTES */}
      <main className="relative z-10 w-full max-w-3xl h-[380px] sm:h-[430px] mx-auto my-auto overflow-hidden rounded-3xl border-4 border-white/90 bg-gradient-to-b from-sky-200/50 via-purple-100/40 to-pink-200/50 backdrop-blur-sm shadow-2xl">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
          <span className="text-8xl sm:text-9xl font-black text-pink-500">
            {currentRound.target} {currentRound.lower}
          </span>
        </div>

        {bubbles.map((b) => {
          const isPopping = poppingId === b.id;
          const isWobbling = wobblingId === b.id;

          return (
            <button
              key={b.id}
              type="button"
              onClick={(e) => handleBubbleTouch(e, b)}
              style={{
                left: `${b.left}%`,
                bottom: b.initialBottom !== null ? `${b.initialBottom}px` : '-90px',
                width: `${b.size}px`,
                height: `${b.size}px`,
                animationDuration: `${b.speed}s`,
              }}
              className={`absolute cursor-pointer rounded-full flex flex-col items-center justify-center border-4 shadow-xl transition-transform select-none ${
                isPopping ? 'scale-150 opacity-0 duration-300' : 'animate-bubble-rise'
              } ${isWobbling ? 'animate-wiggle border-rose-400' : ''} ${
                b.isTarget
                  ? 'bg-gradient-to-tr from-pink-400/95 via-rose-300/95 to-amber-200/95 border-white text-white shadow-pink-300/70'
                  : 'bg-gradient-to-tr from-purple-300/90 via-indigo-200/90 to-sky-200/90 border-white/90 text-purple-900 shadow-purple-300/50'
              } hover:scale-110 active:scale-95`}
            >
              <span className="absolute top-2.5 left-3.5 w-5 h-2.5 bg-white/80 rounded-full rotate-[-30deg] pointer-events-none" />
              <span className="font-black text-2xl sm:text-3xl leading-none drop-shadow">
                {b.syllable}
              </span>
              {showCaseBoth && (
                <span className="font-bold text-sm sm:text-base opacity-95 leading-tight">
                  {b.lower}
                </span>
              )}
            </button>
          );
        })}
      </main>

      {/* FOOTER */}
      <footer className="z-20 w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 mt-1">
        <button
          type="button"
          onClick={() => audioManager.playVoice(currentRound.sylAudio)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-xs sm:text-sm font-black shadow-md hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>Escuchar sílaba "{currentRound.lower}" ({currentRound.example})</span>
        </button>

        <button
          type="button"
          onClick={advanceToNextSyllable}
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white border-2 border-purple-300 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-black text-purple-700 shadow-sm"
        >
          <span>Siguiente sílaba</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* MODAL AL TERMINAR UN NIVEL (Permite pasar al siguiente Nivel de consonantes sin sacarla al mapa) */}
      {levelCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-pink-300 shadow-2xl">
            <img
              src="/fairy-lulu.jpg"
              alt="Hadita Lulú"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Completaste el {currentLevel.name}! 🎉
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Ganaste +2 ovillos mágicos! ¿Quieres seguir al siguiente nivel de sílabas o ir al mapa?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelCompleteModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setFamilyIdx(0);
                  setSylIdx(0);
                  setScoreInRound(0);
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Jugar {BUBBLE_LEVELS[levelIdx + 1]?.name}!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevelCompleteModal(false);
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

      {/* MODAL FINAL CUANDO COMPLETA LOS 6 NIVELES */}
      {hasWonAll && (
        <VictoryModal
          title="¡Reina de Todas las Burbujas!"
          subtitle="¡Practicaste las 85 sílabas del abecedario en burbujas, Cristal!"
          levelIdToUnlock="mision3"
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
