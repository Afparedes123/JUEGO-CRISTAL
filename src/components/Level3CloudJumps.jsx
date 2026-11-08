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

// 6 NIVELES DE NUBES QUE CUBREN LAS 17 CONSONANTES CON LAS 5 VOCALES (85 SÍLABAS)
const CLOUD_LEVELS = [
  {
    id: 1,
    name: 'Nivel 1: M, P, S',
    families: [
      {
        c: 'M', lower: 'm', cAudio: 'let_m',
        vowels: [
          { v: 'A', vL: 'a', syl: 'MA', sylL: 'ma', hint: 'como en Mamá 👩', audio: 'syl_ma', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'ME', sylL: 'me', hint: 'como en Mesa 🪑', audio: 'syl_me', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'MI', sylL: 'mi', hint: 'como en Mimi 🐱', audio: 'syl_mi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'MO', sylL: 'mo', hint: 'como en Mono 🐒', audio: 'syl_mo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'MU', sylL: 'mu', hint: 'como en Muñeca 🎎', audio: 'syl_mu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'P', lower: 'p', cAudio: 'let_p',
        vowels: [
          { v: 'A', vL: 'a', syl: 'PA', sylL: 'pa', hint: 'como en Papá 👨', audio: 'syl_pa', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'PE', sylL: 'pe', hint: 'como en Pelota ⚽', audio: 'syl_pe', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'PI', sylL: 'pi', hint: 'como en Piña 🍍', audio: 'syl_pi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'PO', sylL: 'po', hint: 'como en Pollito 🐥', audio: 'syl_po', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'PU', sylL: 'pu', hint: 'como en Puerta 🚪', audio: 'syl_pu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'S', lower: 's', cAudio: 'let_s',
        vowels: [
          { v: 'A', vL: 'a', syl: 'SA', sylL: 'sa', hint: 'como en Sapo 🐸', audio: 'syl_sa', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'SE', sylL: 'se', hint: 'como en Semilla 🌱', audio: 'syl_se', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'SI', sylL: 'si', hint: 'como en Sirena 🧜‍♀️', audio: 'syl_si', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'SO', sylL: 'so', hint: 'como en Sol ☀️', audio: 'syl_so', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'SU', sylL: 'su', hint: 'como en Suma ➕', audio: 'syl_su', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Nivel 2: L, T, D',
    families: [
      {
        c: 'L', lower: 'l', cAudio: 'let_l',
        vowels: [
          { v: 'A', vL: 'a', syl: 'LA', sylL: 'la', hint: 'como en Lazo 🎀', audio: 'syl_la', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'LE', sylL: 'le', hint: 'como en León 🦁', audio: 'syl_le', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'LI', sylL: 'li', hint: 'como en Limón 🍋', audio: 'syl_li', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'LO', sylL: 'lo', hint: 'como en Lobo 🐺', audio: 'syl_lo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'LU', sylL: 'lu', hint: 'como en Luna 🌙', audio: 'syl_lu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'T', lower: 't', cAudio: 'let_t',
        vowels: [
          { v: 'A', vL: 'a', syl: 'TA', sylL: 'ta', hint: 'como en Taza ☕', audio: 'syl_ta', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'TE', sylL: 'te', hint: 'como en Tela 🧶', audio: 'syl_te', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'TI', sylL: 'ti', hint: 'como en Tigre 🐯', audio: 'syl_ti', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'TO', sylL: 'to', hint: 'como en Tomate 🍅', audio: 'syl_to', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'TU', sylL: 'tu', hint: 'como en Tulipán 🌷', audio: 'syl_tu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'D', lower: 'd', cAudio: 'let_d',
        vowels: [
          { v: 'A', vL: 'a', syl: 'DA', sylL: 'da', hint: 'como en Dado 🎲', audio: 'syl_da', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'DE', sylL: 'de', hint: 'como en Dedo 👆', audio: 'syl_de', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'DI', sylL: 'di', hint: 'como en Dinosaurio 🦕', audio: 'syl_di', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'DO', sylL: 'do', hint: 'como en Dona 🍩', audio: 'syl_do', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'DU', sylL: 'du', hint: 'como en Duende 🧝', audio: 'syl_du', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Nivel 3: N, B, C',
    families: [
      {
        c: 'N', lower: 'n', cAudio: 'let_n',
        vowels: [
          { v: 'A', vL: 'a', syl: 'NA', sylL: 'na', hint: 'como en Naranja 🍊', audio: 'syl_na', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'NE', sylL: 'ne', hint: 'como en Nene 👶', audio: 'syl_ne', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'NI', sylL: 'ni', hint: 'como en Nido 🪺', audio: 'syl_ni', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'NO', sylL: 'no', hint: 'como en Noche 🌌', audio: 'syl_no', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'NU', sylL: 'nu', hint: 'como en Nube ☁️', audio: 'syl_nu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'B', lower: 'b', cAudio: 'let_b',
        vowels: [
          { v: 'A', vL: 'a', syl: 'BA', sylL: 'ba', hint: 'como en Ballena 🐳', audio: 'syl_ba', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'BE', sylL: 'be', hint: 'como en Bebé 🍼', audio: 'syl_be', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'BI', sylL: 'bi', hint: 'como en Bicicleta 🚲', audio: 'syl_bi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'BO', sylL: 'bo', hint: 'como en Bota 👢', audio: 'syl_bo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'BU', sylL: 'bu', hint: 'como en Búho 🦉', audio: 'syl_bu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'C', lower: 'c', cAudio: 'let_c',
        vowels: [
          { v: 'A', vL: 'a', syl: 'CA', sylL: 'ca', hint: 'como en Casa 🏠', audio: 'syl_ca', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'CE', sylL: 'ce', hint: 'como en Cebra 🦓', audio: 'syl_ce', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'CI', sylL: 'ci', hint: 'como en Cisne 🦢', audio: 'syl_ci', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'CO', sylL: 'co', hint: 'como en Conejo 🐰', audio: 'syl_co', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'CU', sylL: 'cu', hint: 'como en Cuna 🛏️', audio: 'syl_cu', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Nivel 4: G, R, F',
    families: [
      {
        c: 'G', lower: 'g', cAudio: 'let_g',
        vowels: [
          { v: 'A', vL: 'a', syl: 'GA', sylL: 'ga', hint: 'como en Gato 🐱', audio: 'syl_ga', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'GE', sylL: 'ge', hint: 'como en Gelatina 🍮', audio: 'syl_ge', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'GI', sylL: 'gi', hint: 'como en Girasol 🌻', audio: 'syl_gi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'GO', sylL: 'go', hint: 'como en Gorro 🧢', audio: 'syl_go', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'GU', sylL: 'gu', hint: 'como en Gusano 🐛', audio: 'syl_gu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'R', lower: 'r', cAudio: 'let_r',
        vowels: [
          { v: 'A', vL: 'a', syl: 'RA', sylL: 'ra', hint: 'como en Rana 🐸', audio: 'syl_ra', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'RE', sylL: 're', hint: 'como en Reina 👑', audio: 'syl_re', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'RI', sylL: 'ri', hint: 'como en Risa 😄', audio: 'syl_ri', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'RO', sylL: 'ro', hint: 'como en Rosa 🌹', audio: 'syl_ro', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'RU', sylL: 'ru', hint: 'como en Rueda 🎡', audio: 'syl_ru', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'F', lower: 'f', cAudio: 'let_f',
        vowels: [
          { v: 'A', vL: 'a', syl: 'FA', sylL: 'fa', hint: 'como en Familia 👨‍👩‍👧', audio: 'syl_fa', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'FE', sylL: 'fe', hint: 'como en Feliz 😊', audio: 'syl_fe', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'FI', sylL: 'fi', hint: 'como en Fiesta 🎉', audio: 'syl_fi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'FO', sylL: 'fo', hint: 'como en Foca 🦭', audio: 'syl_fo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'FU', sylL: 'fu', hint: 'como en Fuego 🔥', audio: 'syl_fu', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'Nivel 5: J, V, Z',
    families: [
      {
        c: 'J', lower: 'j', cAudio: 'let_j',
        vowels: [
          { v: 'A', vL: 'a', syl: 'JA', sylL: 'ja', hint: 'como en Jardín 🏡', audio: 'syl_ja', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'JE', sylL: 'je', hint: 'como en Jefe 👑', audio: 'syl_je', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'JI', sylL: 'ji', hint: 'como en Jirafa 🦒', audio: 'syl_ji', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'JO', sylL: 'jo', hint: 'como en Joya 💎', audio: 'syl_jo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'JU', sylL: 'ju', hint: 'como en Juguete 🧸', audio: 'syl_ju', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'V', lower: 'v', cAudio: 'let_v',
        vowels: [
          { v: 'A', vL: 'a', syl: 'VA', sylL: 'va', hint: 'como en Vaca 🐮', audio: 'syl_va', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'VE', sylL: 've', hint: 'como en Vela 🕯️', audio: 'syl_ve', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'VI', sylL: 'vi', hint: 'como en Violín 🎻', audio: 'syl_vi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'VO', sylL: 'vo', hint: 'como en Volcán 🌋', audio: 'syl_vo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'VU', sylL: 'vu', hint: 'como en Vuelo ✈️', audio: 'syl_vu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'Z', lower: 'z', cAudio: 'let_z',
        vowels: [
          { v: 'A', vL: 'a', syl: 'ZA', sylL: 'za', hint: 'como en Zapato 👟', audio: 'syl_za', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'ZE', sylL: 'ze', hint: 'como en Zepelín 🎈', audio: 'syl_ze', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'ZI', sylL: 'zi', hint: 'como en Zigzag ⚡', audio: 'syl_zi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'ZO', sylL: 'zo', hint: 'como en Zorro 🦊', audio: 'syl_zo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'ZU', sylL: 'zu', hint: 'como en Zumo 🧃', audio: 'syl_zu', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
  {
    id: 6,
    name: 'Nivel 6: Ñ, Y',
    families: [
      {
        c: 'Ñ', lower: 'ñ', cAudio: 'let_ny',
        vowels: [
          { v: 'A', vL: 'a', syl: 'ÑA', sylL: 'ña', hint: 'como en Piña 🍍', audio: 'syl_nya', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'ÑE', sylL: 'ñe', hint: 'como en Muñeca 🎎', audio: 'syl_nye', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'ÑI', sylL: 'ñi', hint: 'como en Meñique 🤙', audio: 'syl_nyi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'ÑO', sylL: 'ño', hint: 'como en Moño 🎀', audio: 'syl_nyo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'ÑU', sylL: 'ñu', hint: 'como en Pañuelo 🧣', audio: 'syl_nyu', vAudio: 'vocal_u' },
        ],
      },
      {
        c: 'Y', lower: 'y', cAudio: 'let_y',
        vowels: [
          { v: 'A', vL: 'a', syl: 'YA', sylL: 'ya', hint: 'como en Yate 🛥️', audio: 'syl_ya', vAudio: 'vocal_a' },
          { v: 'E', vL: 'e', syl: 'YE', sylL: 'ye', hint: 'como en Yema 🍳', audio: 'syl_ye', vAudio: 'vocal_e' },
          { v: 'I', vL: 'i', syl: 'YI', sylL: 'yi', hint: 'como en Rayito ⚡', audio: 'syl_yi', vAudio: 'vocal_i' },
          { v: 'O', vL: 'o', syl: 'YO', sylL: 'yo', hint: 'como en Yoyo 🪀', audio: 'syl_yo', vAudio: 'vocal_o' },
          { v: 'U', vL: 'u', syl: 'YU', sylL: 'yu', hint: 'como en Yuca 🥔', audio: 'syl_yu', vAudio: 'vocal_u' },
        ],
      },
    ],
  },
];

export default function Level3CloudJumps({ onCompleteLevel, onGoToLevel4 }) {
  const { audioManager, registrarAcierto, sumarOvillos, desbloquearNivel, navegarA } = useGame();

  const [levelIdx, setLevelIdx] = useState(0);
  const [familyIdx, setFamilyIdx] = useState(0);
  const [vowelIdx, setVowelIdx] = useState(0);

  const [isMerged, setIsMerged] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [levelModal, setLevelModal] = useState(false);
  const [isCompletedAll, setIsCompletedAll] = useState(false);
  const [completedSyllables, setCompletedSyllables] = useState([]);
  const [dialogue, setDialogue] = useState(
    'Cristal, mira las nubes. Si las juntamos, ¡hacemos magia! Toca ¡Juntar! para formar todas las sílabas.'
  );

  const arenaRef = useRef(null);
  const timersRef = useRef([]);

  const currentLevel = CLOUD_LEVELS[levelIdx];
  const currentFamily = currentLevel.families[familyIdx] || currentLevel.families[0];
  const currentVowel = currentFamily.vowels[vowelIdx] || currentFamily.vowels[0];

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    const t = setTimeout(() => {
      audioManager.playVoice('lvl3_intro');
    }, 350);
    return () => {
      clearTimeout(t);
      clearAllTimers();
    };
  }, [audioManager]);

  const handleMergeClouds = () => {
    if (isMerged || isCompletedAll || levelModal) return;
    clearAllTimers();

    audioManager.playSFX('magic');
    audioManager.playSFX('bell');
    registrarAcierto(currentVowel.syl);

    setIsJumping(true);
    setIsMerged(true);

    try {
      if (arenaRef.current) {
        const rect = arenaRef.current.getBoundingClientRect();
        fireBubbleSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    } catch (e) {
      // Ignorar
    }

    if (!completedSyllables.includes(currentVowel.syl)) {
      setCompletedSyllables((prev) => [...prev, currentVowel.syl]);
    }

    setDialogue(
      `¡${currentVowel.syl} / ${currentVowel.sylL}! ✨ La ${currentFamily.c} con la ${currentVowel.v} suena "${currentVowel.sylL}" (${currentVowel.hint})`
    );
    audioManager.playVoice(currentVowel.audio);
  };

  const handleNextSyllable = () => {
    clearAllTimers();
    setIsMerged(false);
    setIsJumping(false);

    if (vowelIdx + 1 < currentFamily.vowels.length) {
      const nextV = currentFamily.vowels[vowelIdx + 1];
      setVowelIdx(vowelIdx + 1);
      setDialogue(
        `Ahora juntemos la nube ${currentFamily.c} (${currentFamily.lower}) con la vocal ${nextV.v} (${nextV.vL}). ¡Toca Juntar!`
      );
      audioManager.playSFX('bubble');
      audioManager.playVoice(nextV.vAudio);
    } else if (familyIdx + 1 < currentLevel.families.length) {
      const nextFam = currentLevel.families[familyIdx + 1];
      setFamilyIdx(familyIdx + 1);
      setVowelIdx(0);
      setDialogue(
        `¡Genial! Ahora juntemos la letra ${nextFam.c} (${nextFam.lower}) con las 5 vocales.`
      );
      audioManager.playSFX('bell');
      audioManager.playVoice(nextFam.cAudio);
    } else {
      sumarOvillos(2);
      desbloquearNivel('mision6');
      if (onCompleteLevel) onCompleteLevel();
      if (levelIdx + 1 < CLOUD_LEVELS.length) {
        audioManager.playSFX('celebration');
        audioManager.playVoice('lvl3_win');
        setLevelModal(true);
      } else {
        audioManager.playSFX('celebration');
        audioManager.playVoice('lvl3_win');
        try {
          fireVictoryConfetti();
        } catch (e) {
          // Ignorar
        }
        setIsCompletedAll(true);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-[90vh] py-2 px-3 sm:px-5 w-full max-w-5xl mx-auto select-none">
      {/* HEADER SUPERIOR Y SELECTOR DE LOS 6 NIVELES DE CONSONANTES */}
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border-2 border-sky-200 shadow-sm mb-2">
          <button
            type="button"
            onClick={() => {
              clearAllTimers();
              audioManager.stopVoice();
              audioManager.playSFX('bubble');
              if (onGoToLevel4) onGoToLevel4();
              else navegarA('map');
            }}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl border border-pink-300 transition-all"
          >
            ← Mapa
          </button>

          {/* Pestañas de los 6 Niveles */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            {CLOUD_LEVELS.map((lvl, idx) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  clearAllTimers();
                  setLevelIdx(idx);
                  setFamilyIdx(0);
                  setVowelIdx(0);
                  setIsMerged(false);
                  setIsJumping(false);
                  setLevelModal(false);
                }}
                className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs transition-all cursor-pointer ${
                  idx === levelIdx
                    ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-sm scale-105'
                    : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                {lvl.name}
              </button>
            ))}
          </div>

          <span className="font-extrabold text-sky-700 text-xs sm:text-sm bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
            Unidas: {completedSyllables.length}/85 ☁️
          </span>
        </div>

        {/* Selector de Consonante y sus 5 Vocales dentro del Nivel */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/85 px-3 py-2 rounded-2xl border border-pink-200 shadow-sm mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-purple-800">Consonante:</span>
            {currentLevel.families.map((fam, fIdx) => (
              <button
                key={fam.c}
                type="button"
                onClick={() => {
                  clearAllTimers();
                  setFamilyIdx(fIdx);
                  setVowelIdx(0);
                  setIsMerged(false);
                  setIsJumping(false);
                  audioManager.playVoice(fam.cAudio);
                }}
                className={`px-3 py-1 rounded-xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                  fIdx === familyIdx
                    ? 'bg-amber-400 text-amber-950 border-yellow-300 scale-105 shadow-sm'
                    : 'bg-white text-purple-800 border-purple-200'
                }`}
              >
                {fam.c} / {fam.lower}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {currentFamily.vowels.map((vObj, vIdx) => {
              const isDone = completedSyllables.includes(vObj.syl);
              const isCurrent = vIdx === vowelIdx;
              return (
                <button
                  key={vObj.syl}
                  type="button"
                  onClick={() => {
                    clearAllTimers();
                    setVowelIdx(vIdx);
                    setIsMerged(false);
                    setIsJumping(false);
                    audioManager.playVoice(vObj.audio);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-black text-xs sm:text-sm transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-pink-500 text-white ring-2 ring-yellow-300 scale-110 shadow-sm'
                      : isDone
                      ? 'bg-emerald-400 text-white'
                      : 'bg-white border border-sky-300 text-sky-700'
                  }`}
                >
                  {vObj.syl}/{vObj.sylL}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guía con Hadita Lulú */}
        <KittenGuide
          currentDialogue={dialogue}
          customImage={isJumping || isMerged ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
          onKittenClick={() => {
            audioManager.playVoice(currentVowel.audio);
          }}
        />
      </div>

      {/* ESCENARIO CENTRAL DE NUBES */}
      <div
        ref={arenaRef}
        className="relative w-full my-1.5 min-h-[340px] sm:min-h-[370px] rounded-3xl bg-gradient-to-b from-sky-200/80 via-pink-100/70 to-purple-100/80 border-4 border-white shadow-lg flex flex-col items-center justify-between p-4 overflow-hidden"
      >
        <div className="absolute top-3 left-6 text-yellow-400 opacity-70 pointer-events-none animate-pulse">
          <Star className="w-7 h-7 fill-yellow-200" />
        </div>
        <div className="absolute top-6 right-8 text-pink-400 opacity-70 pointer-events-none animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>

        {/* Hadita Saltarina */}
        <div className="relative flex flex-col items-center justify-center z-20">
          <div
            onClick={() => audioManager.playVoice(currentVowel.audio)}
            className={`cursor-pointer w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 transform ${
              isJumping
                ? 'scale-110 -translate-y-1 ring-4 ring-yellow-300 animate-bounce'
                : 'animate-float-slow'
            }`}
          >
            <img
              src={isMerged ? '/fairy-mimi.jpg' : '/fairy-lulu.jpg'}
              alt="Hadita de las nubes"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* LAS NUBES: SEPARADAS VS UNIDAS */}
        <div className="w-full max-w-2xl my-2 flex items-center justify-center min-h-[140px] relative z-20">
          {!isMerged ? (
            <div className="flex items-center justify-center gap-3 sm:gap-10 w-full">
              {/* Nube 1: Consonante */}
              <button
                type="button"
                onClick={() => {
                  audioManager.playSFX('pop');
                  audioManager.playVoice(currentFamily.cAudio);
                }}
                className="relative group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-32 sm:w-44 h-28 sm:h-32 bg-white rounded-3xl border-4 border-sky-300 shadow-xl flex flex-col items-center justify-center p-2 hover:border-sky-400">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-6xl font-black text-sky-700 leading-none">
                      {currentFamily.c}
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-sky-500 leading-none">
                      {currentFamily.lower}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] font-extrabold text-sky-600 uppercase flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Consonante
                  </span>
                </div>
              </button>

              {/* Botón central "+" */}
              <button
                type="button"
                onClick={handleMergeClouds}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-3xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform animate-pulse cursor-pointer border-2 border-white"
              >
                +
              </button>

              {/* Nube 2: Vocal */}
              <button
                type="button"
                onClick={() => {
                  audioManager.playSFX('pop');
                  audioManager.playVoice(currentVowel.vAudio);
                }}
                className="relative group cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-32 sm:w-44 h-28 sm:h-32 bg-white rounded-3xl border-4 border-pink-300 shadow-xl flex flex-col items-center justify-center p-2 hover:border-pink-400">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-6xl font-black text-pink-600 leading-none">
                      {currentVowel.v}
                    </span>
                    <span className="text-3xl sm:text-5xl font-bold text-pink-400 leading-none">
                      {currentVowel.vL}
                    </span>
                  </div>
                  <span className="mt-1 text-[11px] font-extrabold text-pink-600 uppercase flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> Vocal
                  </span>
                </div>
              </button>
            </div>
          ) : (
            /* NUBE GIGANTE UNIDA */
            <button
              type="button"
              onClick={() => {
                audioManager.playSFX('bell');
                audioManager.playVoice(currentVowel.audio);
              }}
              className="relative cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
            >
              <div className="relative w-72 sm:w-96 h-32 sm:h-36 bg-gradient-to-r from-white via-pink-50 to-white rounded-3xl border-4 border-yellow-400 shadow-2xl flex flex-col items-center justify-center p-4 ring-4 ring-yellow-200">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-yellow-500 animate-spin" />
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl sm:text-7xl font-black text-purple-700 tracking-wider">
                      {currentVowel.syl}
                    </span>
                    <span className="text-4xl sm:text-6xl font-bold text-pink-600">
                      {currentVowel.sylL}
                    </span>
                  </div>
                  <Sparkles className="w-7 h-7 text-yellow-500 animate-spin" />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-purple-700 mt-1 flex items-center gap-1">
                  <Volume2 className="w-4 h-4 text-pink-500" />
                  <span>{currentVowel.hint}</span>
                </span>
              </div>
            </button>
          )}
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="mt-1 z-30 flex flex-wrap items-center justify-center gap-3 w-full">
          {!isMerged ? (
            <button
              type="button"
              onClick={handleMergeClouds}
              className="cursor-pointer flex items-center justify-center gap-3 px-10 sm:px-14 py-3.5 rounded-3xl font-black text-xl sm:text-2xl text-white bg-gradient-to-r from-sky-500 via-pink-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all"
            >
              <Wand2 className="w-6 h-6 text-yellow-300" />
              <span>¡Juntar!</span>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => audioManager.playVoice(currentVowel.audio)}
                className="cursor-pointer flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-base text-purple-800 bg-white hover:bg-purple-50 border-2 border-purple-300 shadow-md active:scale-95 transition-all"
              >
                <Volume2 className="w-5 h-5 text-pink-600" />
                <span>Escuchar "{currentVowel.sylL}"</span>
              </button>

              <button
                type="button"
                onClick={handleNextSyllable}
                className="cursor-pointer flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-black text-lg sm:text-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl border-2 border-white hover:scale-105 active:scale-95 transition-all animate-bounce"
              >
                <span>¡Siguiente Nube!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL AL TERMINAR UN NIVEL DE NUBES */}
      {levelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center border-4 border-sky-300 shadow-2xl">
            <img
              src="/fairy-mimi.jpg"
              alt="Hadita Mimi"
              className="w-28 h-28 mx-auto rounded-full border-4 border-amber-300 object-cover shadow-lg mb-3"
            />
            <h2 className="text-2xl font-black text-purple-800 mb-1">
              ¡Completaste el {currentLevel.name}! ☁️✨
            </h2>
            <p className="text-sm font-bold text-slate-600 mb-5">
              ¡Uniste todas las nubes de este nivel! ¿Vamos al siguiente nivel de consonantes?
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  setLevelIdx((prev) => prev + 1);
                  setFamilyIdx(0);
                  setVowelIdx(0);
                  setIsMerged(false);
                  setIsJumping(false);
                }}
                className="w-full py-3.5 rounded-2xl font-black text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center gap-2"
              >
                <span>¡Jugar {CLOUD_LEVELS[levelIdx + 1]?.name}!</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevelModal(false);
                  if (onGoToLevel4) onGoToLevel4();
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

      {isCompletedAll && (
        <VictoryModal
          title="¡Qué inteligente eres, Cristal!"
          subtitle="¡Uniste las 85 nubes de sílabas de todo el abecedario!"
          levelIdToUnlock="mision6"
          yarnReward={3}
          onReturnToMap={() => {
            setIsCompletedAll(false);
            if (onGoToLevel4) onGoToLevel4();
            else navegarA('map');
          }}
        />
      )}
    </div>
  );
}
