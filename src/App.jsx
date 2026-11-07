import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import HomeScreen from './components/HomeScreen';
import Level1Vowels from './components/Level1Vowels';
import Level2MagicWords from './components/Level2MagicWords';
import { Sparkles, Heart } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [level2Unlocked, setLevel2Unlocked] = useState(false);

  const handleStartGame = () => {
    setCurrentScreen('level1');
  };

  const handleLevel1Complete = () => {
    setLevel2Unlocked(true);
  };

  const handleGoToLevel2 = () => {
    setLevel2Unlocked(true);
    setCurrentScreen('level2');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100/70 via-pink-50/50 to-blue-50/70 text-slate-800">
      {/* Top Navigation */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        level2Unlocked={level2Unlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center w-full">
        {currentScreen === 'home' && (
          <HomeScreen onStartGame={handleStartGame} />
        )}

        {currentScreen === 'level1' && (
          <Level1Vowels 
            onCompleteLevel={handleLevel1Complete}
            onGoToLevel2={handleGoToLevel2}
          />
        )}

        {currentScreen === 'level2' && (
          <Level2MagicWords
            onBackToLevel1={() => setCurrentScreen('level1')}
          />
        )}
      </main>

      {/* Footer with warm encouragement for Cristal */}
      <footer className="w-full py-4 text-center text-xs font-semibold text-slate-500 bg-white/40 border-t border-pink-100">
        <div className="flex items-center justify-center gap-1.5">
          <span>Creado con amor para</span>
          <span className="font-extrabold text-pink-600">Cristal</span>
          <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
          <span>• Aventuras de Gatitos Mágicos</span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
        </div>
      </footer>
    </div>
  );
}

export default App;
