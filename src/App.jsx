import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SplashScreen from './components/SplashScreen';
import MapaMagico from './components/MapaMagico';
import CasaGatitas from './components/CasaGatitas';
import Level1Vowels from './components/Level1Vowels';
import Level2FeedKitty from './components/Level2FeedKitty';
import Level3CloudJumps from './components/Level3CloudJumps';
import Level4PartyBoxes from './components/Level4PartyBoxes';

function GameRouter() {
  const { currentScreen, navegarA, desbloquearNivel, sumarOvillos } = useGame();

  // Handlers de finalización de minijuegos
  const handleLevel1Complete = () => {
    desbloquearNivel('mision2');
    sumarOvillos(3);
  };

  const handleLevel2Complete = () => {
    desbloquearNivel('mision3');
    sumarOvillos(3);
  };

  const handleLevel3Complete = () => {
    desbloquearNivel('mision4');
    sumarOvillos(5);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100/70 via-pink-50/50 to-blue-50/70 text-slate-800">
      <main className="flex-1 flex flex-col justify-center w-full">
        {/* PANTALLA 1: SPLASH SCREEN (INICIO CON LAS 2 GATITAS Y BOTÓN LATIENTE) */}
        {currentScreen === 'splash' && (
          <SplashScreen onStartGame={() => navegarA('map')} />
        )}

        {/* PANTALLA 2: EL MAPA MÁGICO (SELECTOR DE NIVELES / ISLAS) */}
        {currentScreen === 'map' && <MapaMagico />}

        {/* PANTALLA 3: LA CASA DE LAS GATITAS (CUARTO DE RECOMPENSAS) */}
        {currentScreen === 'kittens_house' && <CasaGatitas />}

        {/* MINIJUEGO 1: VOCALES (ATRAPA LA VOCAL) */}
        {currentScreen === 'level1' && (
          <Level1Vowels
            onCompleteLevel={handleLevel1Complete}
            onGoToLevel2={() => {
              desbloquearNivel('mision2');
              sumarOvillos(2);
              navegarA('map');
            }}
          />
        )}

        {/* MINIJUEGO 2: CONSONANTES (ALIMENTA AL MININO) */}
        {currentScreen === 'level2' && (
          <Level2FeedKitty
            onCompleteLevel={handleLevel2Complete}
            onGoToLevel3={() => {
              desbloquearNivel('mision3');
              sumarOvillos(2);
              navegarA('map');
            }}
          />
        )}

        {/* MINIJUEGO 3: SÍLABAS (SALTOS EN LAS NUBES) */}
        {currentScreen === 'level3' && (
          <Level3CloudJumps
            onCompleteLevel={handleLevel3Complete}
            onGoToLevel4={() => {
              desbloquearNivel('mision4');
              sumarOvillos(3);
              navegarA('map');
            }}
          />
        )}

        {/* MINIJUEGO 4: FIESTA GATUNA (ORDENA LAS CAJAS) */}
        {currentScreen === 'level4' && (
          <Level4PartyBoxes
            onRestartAll={() => {
              sumarOvillos(5);
              navegarA('map');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
