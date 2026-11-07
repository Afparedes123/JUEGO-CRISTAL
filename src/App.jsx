import React, { useState } from 'react';
import HeaderNav from './components/HeaderNav';
import HomeScreen from './components/HomeScreen';
import Level1Vowels from './components/Level1Vowels';
import Level2FeedKitty from './components/Level2FeedKitty';
import Level3MagicWords from './components/Level3MagicWords';
import { Sparkles, Heart } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [level2Unlocked, setLevel2Unlocked] = useState(false);
  const [level3Unlocked, setLevel3Unlocked] = useState(false);

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

  const handleLevel2Complete = () => {
    setLevel3Unlocked(true);
  };

  const handleGoToLevel3 = () => {
    setLevel3Unlocked(true);
    setCurrentScreen('level3');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-100/70 via-pink-50/50 to-blue-50/70 text-slate-800">
      {/* Top Navigation Bar */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        level2Unlocked={level2Unlocked}
        level3Unlocked={level3Unlocked}
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
          <Level2FeedKitty
            onCompleteLevel={handleLevel2Complete}
            onGoToLevel3={handleGoToLevel3}
          />
        )}

        {currentScreen === 'level3' && (
          <Level3MagicWords
            onBackToLevel2={() => setCurrentScreen('level2')}
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
