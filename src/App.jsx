import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SplashScreen from './components/SplashScreen';
import MapaMagico from './components/MapaMagico';
import CasaGatitas from './components/CasaGatitas';
import MinijuegoAbecedario from './components/MinijuegoAbecedario';
import MinijuegoBurbujas from './components/MinijuegoBurbujas';
import MinijuegoSilabario from './components/MinijuegoSilabario';
import MinijuegoTrazos from './components/MinijuegoTrazos';
import MinijuegoCaldero from './components/MinijuegoCaldero';
import MinijuegoEscribir from './components/MinijuegoEscribir';
import Level1Vowels from './components/Level1Vowels';
import Level2FeedKitty from './components/Level2FeedKitty';
import Level3CloudJumps from './components/Level3CloudJumps';
import Level4PartyBoxes from './components/Level4PartyBoxes';

function GameRouter() {
  const { currentScreen, navegarA, desbloquearNivel, sumarOvillos } = useGame();

  const handleLevel1Complete = () => {
    desbloquearNivel('mision2');
    sumarOvillos(3);
  };

  const handleLevel2Complete = () => {
    desbloquearNivel('mision3');
    sumarOvillos(3);
  };

  const handleLevel3Complete = () => {
    desbloquearNivel('mision6');
    sumarOvillos(3);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100/70 via-pink-50/50 to-blue-50/70 text-slate-800">
      <main className="flex-1 flex flex-col justify-center w-full">
        {/* PANTALLA 1: SPLASH SCREEN (INICIO CON LAS 2 HADITAS GATUNAS REALISTAS) */}
        {currentScreen === 'splash' && (
          <SplashScreen onStartGame={() => navegarA('map')} />
        )}

        {/* PANTALLA 2: EL MAPA MÁGICO (8 ISLAS DE LECTURA Y ESCRITURA) */}
        {currentScreen === 'map' && <MapaMagico />}

        {/* PANTALLA 3: LA CASA DE LAS HADITAS (RECOMPENSAS) */}
        {currentScreen === 'kittens_house' && <CasaGatitas />}

        {/* ISLA 1: ABECEDARIO COMPLETO (MAYÚSCULAS Y MINÚSCULAS A-Z) */}
        {currentScreen === 'minijuego_abecedario' && (
          <MinijuegoAbecedario onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 2: BURBUJAS DE SÍLABAS (MA, PE, SI, LO, TU LEÍDAS JUNTAS) */}
        {currentScreen === 'minijuego_burbujas' && (
          <MinijuegoBurbujas onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 3: LIBRO DE SÍLABAS (CONSONANTES + VOCALES - MÉTODO LEO CON GRIN) */}
        {currentScreen === 'minijuego_silabario' && (
          <MinijuegoSilabario onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 4: TRAZOS DE LUZ (DIBUJAR MAYÚSCULAS Y MINÚSCULAS) */}
        {currentScreen === 'minijuego_trazos' && (
          <MinijuegoTrazos onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 5: NUBES DE SÍLABAS */}
        {currentScreen === 'level3' && (
          <Level3CloudJumps
            onCompleteLevel={handleLevel3Complete}
            onGoToLevel4={() => {
              desbloquearNivel('mision6');
              sumarOvillos(3);
              navegarA('map');
            }}
          />
        )}

        {/* ISLA 6: EL CALDERO DE LAS PALABRAS */}
        {currentScreen === 'minijuego_caldero' && (
          <MinijuegoCaldero onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 7: ESCUELA DE ESCRITURA (ESCRIBIR PALABRAS LETRA POR LETRA) */}
        {currentScreen === 'minijuego_escribir' && (
          <MinijuegoEscribir onReturnToMap={() => navegarA('map')} />
        )}

        {/* ISLA 8: FIESTA DE LECTURA (ORDENAR CAJAS DE SÍLABAS) */}
        {currentScreen === 'level4' && (
          <Level4PartyBoxes
            onRestartAll={() => {
              sumarOvillos(5);
              navegarA('map');
            }}
          />
        )}

        {/* NIVELES ADICIONALES */}
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
