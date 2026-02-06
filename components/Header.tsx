
import React, { useState, useEffect } from 'react';
import { Trophy, Moon, Globe, ChevronDown, LayoutDashboard, PlusCircle, History, Medal, User, Settings } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
  onAuth: () => void;
  onHome: () => void;
  isLoggedIn: boolean;
  activeNav?: string;
  onNav: (nav: string) => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, onAuth, onHome, isLoggedIn, activeNav, onNav }) => {
  const t = translations[lang];
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // Sync avatar from localStorage
  const syncAvatar = () => {
    const saved = localStorage.getItem('strikezone_profile_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setUserAvatar(data.avatar || null);
      } catch (e) {
        console.error("Header avatar sync error", e);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      syncAvatar();
      window.addEventListener('storage', syncAvatar);
      return () => window.removeEventListener('storage', syncAvatar);
    }
  }, [isLoggedIn]);

  return (
    <div className="w-full flex flex-col sticky top-0 z-50">
      {/* Top Tier */}
      <header className="w-full bg-[#2563EB] text-white px-4 md:px-10 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onHome}>
          <Trophy className="w-6 h-6 md:w-7 md:h-7" />
          <span className="text-lg md:text-xl font-black tracking-tighter uppercase">{t.brand}</span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-5">
          <button className="hidden sm:p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Toggle theme">
            <Moon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
            className="flex items-center space-x-1 hover:bg-white/10 px-2 py-1 rounded transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[10px] md:text-xs font-bold uppercase">{lang}</span>
          </button>

          {!isLoggedIn ? (
            <button 
              onClick={onAuth}
              className="bg-white text-[#2563EB] px-3 md:px-4 py-1.5 rounded-lg font-bold text-xs md:text-sm hover:bg-opacity-90 transition-all shadow-sm"
            >
              {t.signUp}
            </button>
          ) : (
            <div 
              onClick={() => onNav('profile')}
              className="flex items-center space-x-2 md:space-x-3 bg-white/10 p-1 md:pr-3 rounded-full cursor-pointer hover:bg-white/20 transition-all group overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center font-black text-sm overflow-hidden border-2 border-white/20">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  'S'
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-black">StrikeMaster</span>
                  <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-bold opacity-70">Avg: 185</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Sub Navigation Bar */}
      {isLoggedIn && (
        <nav className="w-full bg-white border-b border-slate-100 px-2 md:px-10 py-2 flex items-center justify-start md:justify-center space-x-2 md:space-x-8 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
          <NavItem active={activeNav === 'dashboard'} onClick={() => onNav('dashboard')} icon={<LayoutDashboard className="w-4 h-4" />} label={t.dashboard} />
          <NavItem active={activeNav === 'newgame'} onClick={() => onNav('newgame')} icon={<PlusCircle className="w-4 h-4" />} label={t.newGame} primary />
          <NavItem active={activeNav === 'history'} onClick={() => onNav('history')} icon={<History className="w-4 h-4" />} label={t.history} />
          <NavItem active={activeNav === 'badges'} onClick={() => onNav('badges')} icon={<Medal className="w-4 h-4" />} label={t.badges} />
          <NavItem active={activeNav === 'profile'} onClick={() => onNav('profile')} icon={<User className="w-4 h-4" />} label={t.profile} />
          <div className="hidden lg:block lg:flex-grow" />
          <NavItem active={activeNav === 'admin'} onClick={() => onNav('admin')} icon={<Settings className="w-4 h-4" />} label={t.admin} />
        </nav>
      )}
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ active, icon, label, primary, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm transition-all whitespace-nowrap ${
      active 
        ? primary ? 'bg-[#2563EB] text-white shadow-md' : 'text-[#2563EB] bg-blue-50' 
        : 'text-[#0F172A] hover:text-[#2563EB] opacity-100'
    }`}
  >
    <div className={active ? 'text-inherit' : 'text-slate-400'}>{icon}</div>
    <span>{label}</span>
  </button>
);

export default Header;
