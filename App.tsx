
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Badges from './components/Badges';
import Steps from './components/Steps';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Scoring from './components/Scoring';
import Dashboard from './components/Dashboard';
import NewGameFlow from './components/NewGameFlow';
import History from './components/History';
import AchievementBadges from './components/AchievementBadges';
import Profile from './components/Profile';
import BroadcastCenter from './components/BroadcastCenter';
import { Language, GameType, EntryMode } from './types';

type ViewType = 'home' | 'auth' | 'scoring' | 'dashboard' | 'history' | 'badges' | 'profile' | 'admin' | 'newgame';

const STORAGE_KEYS = {
  PIN_PREF: 'strikezone_pin_preference',
  LOGGED_IN: 'strikezone_logged_in',
  LANGUAGE: 'strikezone_language'
};

function App() {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'EN';
  });
  const [fontSize, setFontSize] = useState(16);
  const [view, setView] = useState<ViewType>(() => {
    const loggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
    return loggedIn ? 'dashboard' : 'home';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
  });
  const [activeNav, setActiveNav] = useState('dashboard');
  const [gameType, setGameType] = useState<GameType>('10-pin');
  const [entryMode, setEntryMode] = useState<EntryMode>('manual');
  
  // Shared profile state with persistence
  const [pinPreference, setPinPreference] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PIN_PREF) || '10-Pin';
  });

  // Persist language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, [lang]);

  // Persist Pin Preference
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PIN_PREF, pinPreference);
  }, [pinPreference]);

  // Apply font size globally
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const navigateTo = (newView: ViewType) => {
    setView(newView);
    setActiveNav(newView);
    window.scrollTo(0, 0);
  };

  const handleStartGame = (type: GameType, mode: EntryMode) => {
    setGameType(type);
    setEntryMode(mode);
    setView('scoring');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'false');
    navigateTo('home');
  };

  const renderView = () => {
    switch(view) {
      case 'auth':
        return <Auth lang={lang} onBack={() => navigateTo('home')} onLoginSuccess={handleLogin} />;
      case 'scoring':
        return <Scoring lang={lang} defaultGameType={gameType} entryMode={entryMode} onBack={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return (
          <Dashboard 
            lang={lang} 
            onNewGame={() => navigateTo('newgame')} 
            onViewStats={() => {}} 
            onViewHistory={() => navigateTo('history')} 
            onViewBadges={() => navigateTo('badges')}
            onManageBag={() => navigateTo('profile')}
            defaultPinType={pinPreference === '5-Pin' ? '5-pin' : '10-pin'}
          />
        );
      case 'newgame':
        return <NewGameFlow lang={lang} onBack={() => navigateTo('dashboard')} onStartGame={handleStartGame} />;
      case 'history':
        return <History lang={lang} onBack={() => navigateTo('dashboard')} onNewGame={() => navigateTo('newgame')} />;
      case 'badges':
        return <AchievementBadges lang={lang} onBack={() => navigateTo('dashboard')} pinPreference={pinPreference} />;
      case 'profile':
        return <Profile lang={lang} onBack={() => navigateTo('dashboard')} pinPreference={pinPreference} onUpdatePreference={setPinPreference} onLogout={handleLogout} />;
      case 'admin':
        return <BroadcastCenter lang={lang} />;
      default:
        return (
          <>
            <Hero onNavigate={navigateTo} />
            <Stats />
            <Features />
            <Pricing lang={lang} />
            <Badges />
            <Steps />
            <FinalCTA onNavigate={navigateTo} />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        lang={lang} 
        setLang={setLang} 
        fontSize={fontSize} 
        setFontSize={setFontSize} 
        onAuth={() => navigateTo('auth')}
        onHome={() => navigateTo(isLoggedIn ? 'dashboard' : 'home')}
        isLoggedIn={isLoggedIn}
        activeNav={activeNav}
        onNav={(nav) => navigateTo(nav as ViewType)}
      />
      
      <main className="flex-grow">
        {renderView()}
      </main>

      {!isLoggedIn && view === 'home' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button 
            onClick={handleLogin}
            className="bg-[#EA580C] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center space-x-2 font-black group"
          >
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap px-0 group-hover:px-2 uppercase">Login Demo</span>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
