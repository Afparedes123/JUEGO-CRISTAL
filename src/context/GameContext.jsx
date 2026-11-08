import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioManager } from '../services/audioManager';

// Clave para guardar el progreso de Cristal en el navegador
const STORAGE_KEY = 'cristal_gatitas_magicas_state_v1';

const defaultState = {
  // Requisito 1: Array de niveles/islas desbloqueadas en el mapa
  nivelesDesbloqueados: ['mision1'], // Misión 1 (Vocales) empieza desbloqueada

  // Requisito 2: Moneda virtual mágica de Cristal
  ovillosDeLana: 5, // 5 ovillos iniciales de regalo de bienvenida

  // Requisito 3: Racha de aciertos para animaciones estelares
  aciertosConsecutivos: 0,

  // Navegación de vistas: 'splash' | 'map' | 'kittens_house' | 'dads_zone' | 'level1' | ...
  currentScreen: 'splash',

  // Inventario desbloqueado en la Casa de las Gatitas
  recompensasDesbloqueadas: {
    sombreritoEstelar: false,
    lecheMagica: false,
    lazoRosa: false,
  },

  // Estadísticas para la Zona de Papá
  estadisticas: {
    tiempoInicioSesion: Date.now(),
    tiempoTotalMinutos: 0,
    aciertosTotales: 0,
    intentosTotales: 0,
    letrasPracticadas: ['A', 'E', 'I', 'O', 'U'],
    letrasDificiles: ['S', 'T'], // Registra letras con más de un intento
  },

  // Ajustes de volumen
  volumenBGM: 0.25,
  volumenVoces: 1.0,
  volumenSFX: 0.7,
  musicaActiva: true,
};

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Inicialización con persistencia de localStorage
  const [gameState, setGameState] = useState(() => {
    if (typeof window === 'undefined') return defaultState;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          currentScreen: 'splash', // Siempre iniciar en el Splash Screen
          aciertosConsecutivos: 0, // Reiniciar racha de sesión
        };
      }
    } catch (e) {
      console.warn('Error leyendo guardado de Cristal:', e);
    }
    return defaultState;
  });

  // Guardar cambios automáticamente en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      // Ignorar si el almacenamiento local está lleno
    }
  }, [gameState]);

  // Sincronizar volúmenes con el AudioManager global
  useEffect(() => {
    audioManager.setBGMVolume(gameState.volumenBGM);
    audioManager.setVoiceVolume(gameState.volumenVoces);
    audioManager.setSFXVolume(gameState.volumenSFX);
  }, [gameState.volumenBGM, gameState.volumenVoces, gameState.volumenSFX]);

  // Temporizador de sesión para estadísticas de Papá
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        estadisticas: {
          ...prev.estadisticas,
          tiempoTotalMinutos: prev.estadisticas.tiempoTotalMinutos + 1,
        },
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================================================
  // Métodos de Gestión de Niveles y Navegación
  // ==========================================================================

  const navegarA = (pantalla) => {
    audioManager.playSFX('bubble');
    setGameState((prev) => ({
      ...prev,
      currentScreen: pantalla,
    }));
  };

  const desbloquearNivel = (nivelId) => {
    setGameState((prev) => {
      if (prev.nivelesDesbloqueados.includes(nivelId)) return prev;
      audioManager.playSFX('sparkle');
      return {
        ...prev,
        nivelesDesbloqueados: [...prev.nivelesDesbloqueados, nivelId],
      };
    });
  };

  const isNivelDesbloqueado = (nivelId) => {
    return gameState.nivelesDesbloqueados.includes(nivelId);
  };

  // ==========================================================================
  // Métodos de Moneda (Ovillos de Lana)
  // ==========================================================================

  const sumarOvillos = (cantidad = 1) => {
    audioManager.playSFX('yarn');
    setGameState((prev) => ({
      ...prev,
      ovillosDeLana: prev.ovillosDeLana + cantidad,
    }));
  };

  const gastarOvillos = (cantidad) => {
    if (gameState.ovillosDeLana < cantidad) {
      audioManager.playSFX('lock');
      return false;
    }
    audioManager.playSFX('magic');
    setGameState((prev) => ({
      ...prev,
      ovillosDeLana: prev.ovillosDeLana - cantidad,
    }));
    return true;
  };

  // ==========================================================================
  // Métodos de Aciertos y Celebración
  // ==========================================================================

  const registrarAcierto = (letra = null) => {
    audioManager.playSFX('bell');
    setGameState((prev) => {
      const nuevaRacha = prev.aciertosConsecutivos + 1;
      let bonusOvillos = 0;

      // Cada 3 aciertos seguidos, Cristal recibe un ovillo de regalo estelar
      if (nuevaRacha % 3 === 0) {
        bonusOvillos = 1;
        audioManager.playSFX('celebration');
      }

      return {
        ...prev,
        aciertosConsecutivos: nuevaRacha,
        ovillosDeLana: prev.ovillosDeLana + bonusOvillos,
        estadisticas: {
          ...prev.estadisticas,
          aciertosTotales: prev.estadisticas.aciertosTotales + 1,
          intentosTotales: prev.estadisticas.intentosTotales + 1,
        },
      };
    });
  };

  const registrarFallo = (letra = null) => {
    audioManager.playSFX('wobble');
    setGameState((prev) => {
      const letrasDificiles = [...prev.estadisticas.letrasDificiles];
      if (letra && !letrasDificiles.includes(letra)) {
        letrasDificiles.push(letra);
      }
      return {
        ...prev,
        aciertosConsecutivos: 0, // Reinicia racha suavemente sin castigar
        estadisticas: {
          ...prev.estadisticas,
          intentosTotales: prev.estadisticas.intentosTotales + 1,
          letrasDificiles,
        },
      };
    });
  };

  // Desbloqueo de objetos en la Casa de las Gatitas
  const desbloquearRecompensa = (itemId, costeOvillos = 3) => {
    if (gastarOvillos(costeOvillos)) {
      setGameState((prev) => ({
        ...prev,
        recompensasDesbloqueadas: {
          ...prev.recompensasDesbloqueadas,
          [itemId]: true,
        },
      }));
      return true;
    }
    return false;
  };

  // Controles de audio
  const toggleMusica = () => {
    if (gameState.musicaActiva) {
      audioManager.stopBGM();
      setGameState((prev) => ({ ...prev, musicaActiva: false }));
    } else {
      audioManager.playBGM();
      setGameState((prev) => ({ ...prev, musicaActiva: true }));
    }
  };

  const setVolumenBGM = (vol) => {
    setGameState((prev) => ({ ...prev, volumenBGM: vol }));
  };

  const setVolumenVoces = (vol) => {
    setGameState((prev) => ({ ...prev, volumenVoces: vol }));
  };

  const value = {
    // Estado
    nivelesDesbloqueados: gameState.nivelesDesbloqueados,
    ovillosDeLana: gameState.ovillosDeLana,
    aciertosConsecutivos: gameState.aciertosConsecutivos,
    currentScreen: gameState.currentScreen,
    recompensasDesbloqueadas: gameState.recompensasDesbloqueadas,
    estadisticas: gameState.estadisticas,
    volumenBGM: gameState.volumenBGM,
    volumenVoces: gameState.volumenVoces,
    musicaActiva: gameState.musicaActiva,

    // Acciones
    navegarA,
    desbloquearNivel,
    isNivelDesbloqueado,
    sumarOvillos,
    gastarOvillos,
    registrarAcierto,
    registrarFallo,
    desbloquearRecompensa,
    toggleMusica,
    setVolumenBGM,
    setVolumenVoces,
    audioManager,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
}
