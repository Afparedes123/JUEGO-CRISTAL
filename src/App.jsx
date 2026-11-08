import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import SplashScreen from './components/SplashScreen';
import HeaderNav from './components/HeaderNav';
import Level1Vowels from './components/Level1Vowels';
import Level2FeedKitty from './components/Level2FeedKitty';
import Level3CloudJumps from './components/Level3CloudJumps';
import Level4PartyBoxes from './components/Level4PartyBoxes';
import { Sparkles, Heart } from 'lucide-react';

function GameContent() {
  const {
    currentScreen,
    navegarA,
    desbloquearNivel,
    isNivelDesbloqueado,
    registrarAcierto,
    sumarOvillos
  } = useGame();

  // Flujo de niveles
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
      {/* Barra superior de navegación (solo visible fuera del splash para máxima inmersión) */}
      {currentScreen !== 'splash' && (
        <HeaderNav
          currentScreen={currentScreen}
          onNavigate={(screen) => navegarA(screen)}
          level2Unlocked={isNivelDesbloqueado('mision2')}
          level3Unlocked={isNivelDesbloqueado('mision3')}
          level4Unlocked={isNivelDesbloqueado('mision4')}
        />
      )}

      {/* Pantalla Activa */}
      <main className="flex-1 flex flex-col justify-center w-full">
        {/* PANTALLA 1: SPLASH SCREEN (INICIO CON LAS 2 GATITAS Y BOTÓN LATIENTE) */}
        {currentScreen === 'splash' && (
          <SplashScreen onStartGame={() => navegarA('level1')} />
        )}

        {/* NIVELES JUGABLES */}
        {currentScreen === 'level1' && (
          <Level1Vowels
            onCompleteLevel={handleLevel1Complete}
            onGoToLevel2={() => navegarA('level2')}
          />
        )}

        {currentScreen === 'level2' && (
          <Level2FeedKitty
            onCompleteLevel={handleLevel2Complete}
            onGoToLevel3={() => navegarA('level3')}
          />
        )}

        {currentScreen === 'level3' && (
          <Level3CloudJumps
            onCompleteLevel={handleLevel3Complete}
            onGoToLevel4={() => navegarA('level4')}
          />
        )}

        {currentScreen === 'level4' && (
          <Level4PartyBoxes onRestartAll={() => navegarA('splash')} />
        )}
      </main>

      {/* Pie de página con amor para Cristal */}
      {currentScreen !== 'splash' && (
        <footer className="w-full py-3 text-center text-xs font-semibold text-slate-500 bg-white/40 border-t border-pink-100">
          <div className="flex items-center justify-center gap-1.5">
            <span>Creado con amor para</span>
            <span className="font-extrabold text-pink-600">Cristal</span>
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>• Aventuras de las Gatitas Mágicas Lulú y Mimi</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
