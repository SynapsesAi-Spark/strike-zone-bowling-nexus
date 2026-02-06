
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Medal, Trophy, Calendar, Lock, X, Target, MapPin, Zap, BookOpen, Star, Info, Bird, Egg, Flame } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { MOCK_ACHIEVEMENTS, Achievement, MOCK_GAMES, GameRecord } from '../mockData';

interface AchievementBadgesProps {
  lang: Language;
  onBack: () => void;
  pinPreference?: string;
}

const GLOSSARY_DATA = [
  { count: 1, strike: "Strike", spare: "Egg" },
  { count: 2, strike: "Double", spare: "Chick" },
  { count: 3, strike: "Turkey", spare: "Chicken" },
  { count: 4, strike: "Beetle", spare: "Duck" },
  { count: 5, strike: "Donkey", spare: "Goose" },
  { count: 6, strike: "Rhinoceros", spare: "Emu" },
  { count: 7, strike: "T-Rex", spare: "Ostrich" },
  { count: 8, strike: "Giraffe", spare: "Penguin" },
  { count: 9, strike: "Wild Turkey", spare: "Hawk" },
  { count: 10, strike: "Anglerfish", spare: "Eagle" },
  { count: 11, strike: "Unicorn", spare: null },
  { count: 12, strike: "G.O.A.T", spare: null }
];

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ lang, onBack, pinPreference = '10-Pin' }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked' | 'reference'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const earnedBadgesCount = useMemo(() => MOCK_ACHIEVEMENTS.filter(a => a.earned).length, []);
  const totalBadges = MOCK_ACHIEVEMENTS.length;
  const progressPercent = Math.round((earnedBadgesCount / totalBadges) * 100);

  const overallAverage = useMemo(() => {
    const scores = MOCK_GAMES.map(g => g.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, []);

  const filteredBadges = useMemo(() => {
    if (filter === 'reference') return [];
    
    // Start with all mock achievements
    let base = MOCK_ACHIEVEMENTS;
    
    // Rule: Only display 300 Game (id: a7) if Pin Preference is 10-Pin
    if (pinPreference !== '10-Pin') {
      base = base.filter(a => a.id !== 'a7');
    }

    if (filter === 'earned') return base.filter(a => a.earned);
    if (filter === 'locked') return base.filter(a => !a.earned);
    return base;
  }, [filter, pinPreference]);

  const milestoneGame = useMemo(() => {
    if (!selectedAchievement?.gameId) return null;
    return MOCK_GAMES.find(g => g.id === selectedAchievement.gameId) || null;
  }, [selectedAchievement]);

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex items-start justify-center p-4 md:p-6 pt-12 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
        
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 font-bold mb-6 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.back}</span>
        </button>

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#0F172A] mb-2">{t.achievementBadges}</h1>
            <p className="text-slate-500 font-medium">{t.badgesMilestones}</p>
          </div>
          {filter === 'reference' && (
            <div className="bg-white/50 border border-white/80 px-4 py-2 rounded-2xl flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#2563EB]">
              <Info className="w-4 h-4" />
              <span>Strike & Spare Terminology Guide</span>
            </div>
          )}
        </div>

        {/* Collection Progress Card - Hidden for Reference */}
        {filter !== 'reference' && (
          <div className="max-w-4xl bg-white/70 backdrop-blur-md rounded-[24px] border border-white/40 shadow-sm p-6 md:p-8 mb-8 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 md:mb-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t.collectionProgress}</h3>
                <div className="text-4xl font-black text-[#0F172A]">
                  {earnedBadgesCount} <span className="text-slate-300">/</span> {totalBadges}
                </div>
              </div>
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Medal className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
            </div>

            <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-[#2563EB] transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
              {progressPercent}% {t.complete}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto no-scrollbar pb-2 max-w-4xl">
          <TabButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')} 
            label={`${t.filterAll} (${totalBadges})`} 
          />
          <TabButton 
            active={filter === 'earned'} 
            onClick={() => setFilter('earned')} 
            label={`${t.earned} (${earnedBadgesCount})`} 
          />
          <TabButton 
            active={filter === 'locked'} 
            onClick={() => setFilter('locked')} 
            label={`${t.locked} (${totalBadges - earnedBadgesCount})`} 
          />
          <TabButton 
            active={filter === 'reference'} 
            onClick={() => setFilter('reference')} 
            icon={<BookOpen className="w-4 h-4" />}
            label="Scoring Reference" 
          />
        </div>

        {/* Content Area */}
        {filter === 'reference' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 animate-in fade-in zoom-in-95 duration-500">
            {GLOSSARY_DATA.map((item) => (
              <ReferenceCard key={item.count} data={item} />
            ))}
          </div>
        ) : filteredBadges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl">
            {filteredBadges.map(badge => (
              <BadgeItem 
                key={badge.id} 
                badge={badge} 
                lang={lang} 
                onClick={() => badge.earned && setSelectedAchievement(badge)}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl bg-white/40 border border-white/60 rounded-[32px] p-20 flex flex-col items-center text-center backdrop-blur-sm">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-amber-100 blur-2xl rounded-full opacity-30 scale-150" />
              <Trophy className="w-32 h-32 text-amber-500 relative animate-bounce-slow" />
            </div>
            
            <h2 className="text-2xl font-black text-[#0F172A] mb-2">{t.noBadgesFound}</h2>
            <p className="text-slate-500 font-medium">
              {t.noBadgesSub}
            </p>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedAchievement && milestoneGame && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#2563EB] p-10 md:p-14 text-white relative">
              <button 
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              
              <div className="flex items-center space-x-8">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl">
                  {selectedAchievement.icon}
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-2">{selectedAchievement.title}</h2>
                  <p className="text-blue-100 text-xl font-bold opacity-80">{selectedAchievement.desc}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-10 md:p-14 overflow-y-auto no-scrollbar space-y-10">
              
              <div>
                <h3 className="text-base font-black uppercase tracking-widest mb-6" style={{ color: '#2563eb' }}>
                  See Top Score Highlights
                </h3>
                {/* Stats Highlights */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                     <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Game Score</div>
                     <div className="text-4xl font-black text-[#0F172A]">{milestoneGame.score}</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                     <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.average}</div>
                     <div className="text-4xl font-black text-slate-400">{overallAverage}</div>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                     <div className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Points Over</div>
                     <div className="text-4xl font-black text-[#2563EB]">
                       +{milestoneGame.score - overallAverage}
                     </div>
                  </div>
                </div>
              </div>

              {/* Game Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 text-slate-600 text-lg font-bold">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  <span>{milestoneGame.date}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 text-lg font-bold">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <span className="truncate">{milestoneGame.location}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 text-lg font-bold">
                  <Target className="w-6 h-6 text-blue-500" />
                  <span className="capitalize">{milestoneGame.category} • {milestoneGame.type}</span>
                </div>
                <div className="flex items-center space-x-4 text-slate-600 text-lg font-bold">
                  <Zap className="w-6 h-6 text-orange-500" />
                  <span>{milestoneGame.strikes} Strikes • {milestoneGame.spares} Spares</span>
                </div>
              </div>

              {/* Scorecard Visualization */}
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Frame-by-Frame Pinfall</h3>
                <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar">
                  {milestoneGame.frames.map((frame, i) => (
                    <div key={i} className="flex-shrink-0 w-16 md:w-20 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                      <div className="bg-slate-100 p-2 text-center text-[10px] font-black text-slate-400 uppercase">F{i+1}</div>
                      <div className="flex-grow flex flex-col items-center justify-center p-3">
                        <div className="flex space-x-1 text-xs font-black text-[#2563EB] mb-2">
                          {frame.balls.map((b, bi) => b !== null && <span key={bi}>{b}</span>)}
                        </div>
                        <div className="text-base font-black text-slate-800">{frame.cumulativeScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedAchievement(null)}
                  className="bg-[#2563EB] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Close Achievement
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- Scoring Reference Card Component --- */
const ReferenceCard: React.FC<{ data: { count: number; strike: string; spare: string | null } }> = ({ data }) => (
  <div className="bg-white rounded-[32px] overflow-hidden border border-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col group">
    <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Consecutive</span>
        <span className="text-3xl font-black text-[#0F172A]">{data.count}</span>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
        <Star className={`w-6 h-6 ${data.count >= 10 ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-300'}`} />
      </div>
    </div>
    
    <div className="p-6 space-y-5 flex-grow">
      {/* Strike Section */}
      <div className="flex items-center space-x-4 group/strike">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover/strike:bg-[#2563EB] group-hover/strike:text-white transition-all shadow-sm">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Strikes</p>
          <p className="text-xl font-black text-[#0F172A]">{data.strike}</p>
        </div>
      </div>

      {/* Spare Section */}
      <div className={`flex items-center space-x-4 group/spare ${!data.spare ? 'opacity-20' : ''}`}>
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#EA580C] flex items-center justify-center group-hover/spare:bg-[#EA580C] group-hover/spare:text-white transition-all shadow-sm">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Spares</p>
          <p className="text-xl font-black text-[#0F172A]">{data.spare || 'N/A'}</p>
        </div>
      </div>
    </div>

    <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-center">
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
         {data.count} {data.count === 1 ? 'Frame' : 'Frames'}
       </span>
    </div>
  </div>
);

const BadgeItem: React.FC<{ badge: Achievement; lang: Language; onClick: () => void }> = ({ badge, lang, onClick }) => {
  const t = translations[lang];
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-[24px] border-2 transition-all flex items-start space-x-5 ${
        badge.earned 
          ? 'bg-white border-white shadow-md hover:shadow-xl hover:scale-[1.02] cursor-pointer' 
          : 'bg-white/30 border-dashed border-slate-300 opacity-60 cursor-default'
      }`}
    >
      <div className={`w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center text-3xl shadow-inner ${
        badge.earned ? 'bg-blue-50 border border-blue-100' : 'bg-slate-100 grayscale'
      }`}>
        {badge.icon}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-black text-slate-800 text-base">{badge.title}</h4>
          {badge.earned ? (
            <span className="text-[10px] font-black" style={{ color: '#2563eb' }}>
              See Top Score Highlights
            </span>
          ) : (
            <Lock className="w-4 h-4 text-slate-300" />
          )}
        </div>
        <p className="text-xs font-bold text-slate-500 leading-snug mb-3">{badge.desc}</p>
        
        {badge.earned ? (
          <div className="flex items-center text-[#2563EB] text-[10px] font-black tracking-widest">
            <Calendar className="w-3 h-3 mr-1" />
            {t.earned} {badge.date}
          </div>
        ) : (
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">
            Keep bowling to unlock
          </div>
        )}
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center space-x-2 ${
      active 
        ? 'bg-[#2563EB] text-white shadow-md' 
        : 'bg-[#93C5FD] text-[#2563EB] hover:bg-blue-300'
    }`}
  >
    {icon && icon}
    <span>{label}</span>
  </button>
);

export default AchievementBadges;
