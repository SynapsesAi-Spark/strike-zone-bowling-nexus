
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, BarChart2, BookOpen, Trophy, TrendingUp, Target, Zap, Settings, ChevronRight, Info, Hand, Layers, ShieldAlert } from 'lucide-react';
import { Language, GameType } from '../types';
import { translations } from '../translations';
import { MOCK_GAMES, MOCK_ACHIEVEMENTS } from '../mockData';

interface DashboardProps {
  lang: Language;
  onNewGame: () => void;
  onViewStats: () => void;
  onViewHistory: () => void;
  onViewBadges: () => void;
  onManageBag: () => void;
  defaultPinType?: GameType;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, onNewGame, onViewStats, onViewHistory, onViewBadges, onManageBag, defaultPinType = '5-pin' }) => {
  const t = translations[lang];
  // Sync local activeType with the global preference when it changes or initializes
  const [activeType, setActiveType] = useState<GameType>(defaultPinType);

  // If the global preference changes (e.g., edited in profile), update the dashboard view
  useEffect(() => {
    setActiveType(defaultPinType);
  }, [defaultPinType]);

  const filteredGames = useMemo(() => 
    MOCK_GAMES.filter(g => g.type === activeType)
  , [activeType]);

  const stats = useMemo(() => {
    if (filteredGames.length === 0) return { average: 0, highScore: 0, highSeries: 0, strikeRate: 0, spareRate: 0, pocketHit: 0 };
    const scores = filteredGames.map(g => g.score);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const high = Math.max(...scores);
    const highSeries = Math.max(...scores.slice(0, 3).reduce((acc: number[], _, i, arr) => {
        if (i <= arr.length - 3) acc.push(arr[i] + arr[i+1] + arr[i+2]);
        return acc;
    }, [scores[0] + (scores[1] || 0) + (scores[2] || 0)]));
    
    const totalStrikes = filteredGames.reduce((a, b) => a + b.strikes, 0);
    const totalSpares = filteredGames.reduce((a, b) => a + b.spares, 0);
    const totalFrames = filteredGames.length * 10;
    
    return {
      average: avg,
      highScore: high,
      highSeries,
      strikeRate: Math.round((totalStrikes / totalFrames) * 100),
      spareRate: Math.round((totalSpares / totalFrames) * 100),
      pocketHit: activeType === '10-pin' ? 68 : 72 // Mocked advanced stat
    };
  }, [filteredGames, activeType]);

  // Logic to show different balls based on 5-pin vs 10-pin context
  const equipment = useMemo(() => {
    if (activeType === '5-pin') {
      return [
        { name: "Classic Rubber Pro", weight: "3 lbs 8 oz", type: "Soft Rubber", games: 156, color: "bg-slate-700", maintenanceNeeded: false },
        { name: "Ebonite EPX", weight: "3 lbs 6 oz", type: "Synthetic", games: 45, color: "bg-blue-600", maintenanceNeeded: false },
        { name: "Paramount Star", weight: "3 lbs 10 oz", type: "Urethane", games: 89, color: "bg-purple-600", maintenanceNeeded: true },
        { name: "Carbon Core", weight: "3 lbs 4 oz", type: "Composite", games: 12, color: "bg-zinc-800", maintenanceNeeded: false }
      ];
    } else {
      return [
        { name: "Storm Phaze II", weight: "15 lbs", type: "Reactive Resin", games: 42, color: "bg-indigo-600", maintenanceNeeded: false },
        { name: "Hammer Black Widow", weight: "15 lbs", type: "Urethane", games: 12, color: "bg-red-700", maintenanceNeeded: false },
        { name: "Brunswick Quantum", weight: "15 lbs", type: "Plastic", games: 108, color: "bg-emerald-600", maintenanceNeeded: true },
        { name: "Roto Grip Gem", weight: "15 lbs", type: "Hybrid", games: 28, color: "bg-amber-600", maintenanceNeeded: false }
      ];
    }
  }, [activeType]);

  const themeHex = activeType === '10-pin' ? '#2563EB' : '#DC2626';

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex flex-col p-4 md:p-8 overflow-y-auto no-scrollbar pb-32">
      <div className="max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* 1. Identity Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/50 pb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${activeType === '10-pin' ? 'border-blue-500' : 'border-red-600'} p-1.5 shadow-xl bg-white`}>
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-black text-2xl text-slate-800">S</div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-[#BFDBFE]" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-2xl md:text-4xl font-black text-[#0F172A] tracking-tighter">John 'The Strike' Doe</h1>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${activeType === '10-pin' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                  League Pro
                </span>
              </div>
              <div className="flex items-center space-x-4 text-slate-500 font-bold text-xs md:text-sm uppercase tracking-widest">
                <span className="flex items-center"><Hand className="w-4 h-4 mr-1.5" /> Right-Handed</span>
                <span className="opacity-30">|</span>
                <span>Member since 2024</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             <button onClick={onManageBag} className="p-4 bg-white/70 text-slate-400 hover:text-slate-900 rounded-2xl transition-all hover:bg-white shadow-sm">
               <Settings className="w-6 h-6" />
             </button>
             <button 
               onClick={onNewGame}
               className={`hidden md:flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${activeType === '10-pin' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-red-600 shadow-red-500/20'}`}
             >
               <Plus className="w-5 h-5" />
               <span>Start Game</span>
             </button>
          </div>
        </div>

        {/* 2. Game Type Toggle - 5-Pin then 10-Pin */}
        <div className="flex justify-center">
          <div className="bg-white/70 p-1.5 rounded-3xl flex space-x-1 shadow-lg backdrop-blur-md border border-white/50">
            <button 
              onClick={() => setActiveType('5-pin')}
              className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center space-x-3 ${activeType === '5-pin' ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Layers className="w-4 h-4" />
              <span>5-Pin</span>
            </button>
            <button 
              onClick={() => setActiveType('10-pin')}
              className={`px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center space-x-3 ${activeType === '10-pin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Target className="w-4 h-4" />
              <span>10-Pin</span>
            </button>
          </div>
        </div>

        {/* 3. Dashboard Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Performance Snapshot */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 border border-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden group backdrop-blur-xl">
              <div className={`absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl ${activeType === '10-pin' ? 'bg-blue-500' : 'bg-red-600'}`} />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Performance Snapshot</h2>
                <div className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest ${activeType === '10-pin' ? 'text-blue-500' : 'text-red-500'}`}>
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending Up +4.2 pts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
                <Metric label="Current Avg" value={stats.average} color={activeType === '10-pin' ? 'text-blue-600' : 'text-red-600'} sub="Last 5 games" />
                <Metric label="High Game" value={stats.highScore} color="text-slate-900" sub="Personal Best" />
                <Metric label="High Series" value={stats.highSeries} color="text-slate-900" sub="Best 3-Game" />
                <Metric label={activeType === '10-pin' ? "Pocket Hit %" : "Headpin Accuracy"} value={stats.pocketHit + "%"} color="text-emerald-600" sub="Consistency" />
              </div>

              <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-slate-100">
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Strike %</span>
                      <span className="text-3xl font-black text-slate-900">{stats.strikeRate}%</span>
                    </div>
                    <ProgressCircle percent={stats.strikeRate} color={themeHex} size={60} />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Spare %</span>
                      <span className="text-3xl font-black text-slate-900">{stats.spareRate}%</span>
                    </div>
                    <ProgressCircle percent={stats.spareRate} color={activeType === '10-pin' ? '#60A5FA' : '#F87171'} size={60} />
                 </div>
              </div>
            </div>

            {/* Virtual Locker - Equipment now swaps based on Context */}
            <div className="bg-white/80 border border-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/5 backdrop-blur-xl">
               <div className="flex items-center justify-between mb-8">
                 <div className="flex flex-col">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Virtual Locker</h2>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">Equipment health and usage tracking</p>
                 </div>
                 <button onClick={onManageBag} className={`text-[10px] font-black uppercase tracking-widest transition-all hover:underline ${activeType === '10-pin' ? 'text-blue-500' : 'text-red-600'}`}>Manage Bag</button>
               </div>
               
               <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
                  {equipment.map((ball, i) => (
                    <BallCard 
                      key={i}
                      name={ball.name} 
                      weight={ball.weight} 
                      type={ball.type} 
                      games={ball.games} 
                      color={ball.color} 
                      maintenanceNeeded={ball.maintenanceNeeded} 
                    />
                  ))}
               </div>
            </div>
          </div>

          {/* Right Column: Advanced Analytics */}
          <div className="space-y-8">
            <div className="bg-white/80 border border-white rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/5 backdrop-blur-xl flex flex-col items-center">
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-10 w-full">Pin Leave Heatmap</h2>
              
              <div className="relative py-6 flex justify-center w-full">
                {activeType === '10-pin' ? (
                  <Heatmap10 nemesisPins={[7, 10]} />
                ) : (
                  <Heatmap5 nemesisPins={[2]} />
                )}
              </div>

              <div className="mt-12 w-full bg-blue-50 p-6 rounded-3xl border border-blue-100/50 flex items-start space-x-4">
                <div className="bg-amber-500/20 p-2.5 rounded-xl"><Info className="w-5 h-5 text-amber-600" /></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Coach Insight</span>
                  <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                    "You leave the {activeType === '10-pin' ? '10-pin' : 'Counter-pin'} on 15% of first balls. Try adjusting your entry angle by 1 board!"
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 gap-4">
               <QuickLink 
                 title="Game History" 
                 sub="Historical calendar & log" 
                 icon={<BookOpen className="w-6 h-6" />} 
                 onClick={onViewHistory}
                 gradient={activeType === '10-pin' ? 'from-blue-600 to-indigo-700' : 'from-red-600 to-amber-700'} 
               />
               <QuickLink 
                 title="Achievements" 
                 sub="Milestones & badges" 
                 icon={<Trophy className="w-6 h-6" />} 
                 onClick={onViewBadges}
                 gradient="from-slate-700 to-slate-800" 
                 border
               />
            </div>
          </div>

        </div>

        {/* Floating Start Button (Mobile) */}
        <button 
          onClick={onNewGame}
          className={`md:hidden fixed bottom-8 right-8 z-[100] p-6 rounded-full shadow-2xl transition-all active:scale-90 text-white ${activeType === '10-pin' ? 'bg-blue-600 shadow-blue-500/40' : 'bg-red-600 shadow-red-500/40'}`}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

/* --- Visual Sub-Components --- */

const Metric: React.FC<{ label: string; value: string | number; color: string; sub: string }> = ({ label, value, color, sub }) => (
  <div className="flex flex-col">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-3xl md:text-5xl font-black ${color} tracking-tighter`}>{value}</span>
    <span className="text-[10px] font-bold text-slate-500 mt-1">{sub}</span>
  </div>
);

const BallCard: React.FC<{ name: string; weight: string; type: string; games: number; color: string; maintenanceNeeded?: boolean }> = ({ name, weight, type, games, color, maintenanceNeeded }) => (
  <div className="flex-shrink-0 w-48 bg-white border border-slate-100 p-5 rounded-3xl group hover:border-blue-200 transition-all cursor-pointer relative shadow-sm">
    <div className={`w-16 h-16 ${color} rounded-full mb-4 shadow-xl group-hover:scale-110 transition-transform flex items-center justify-center`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-transparent" />
    </div>
    <h4 className="text-slate-900 font-black text-sm truncate mb-0.5">{name}</h4>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{weight} • {type}</p>
    
    <div className="mt-6 space-y-1.5">
       <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase">
          <span>Usage</span>
          <span>{games} games</span>
       </div>
       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${maintenanceNeeded ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`} style={{ width: `${Math.min(games / 2, 100)}%` }} />
       </div>
    </div>

    {maintenanceNeeded && (
      <div className="absolute top-4 right-4 bg-amber-500 text-white p-1.5 rounded-lg shadow-md z-10">
        <ShieldAlert className="w-4 h-4" />
      </div>
    )}
  </div>
);

const Heatmap10: React.FC<{ nemesisPins: number[] }> = ({ nemesisPins }) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="grid grid-cols-4 gap-6">
      {[7, 8, 9, 10].map(p => <Pin key={p} id={p} highlighted={nemesisPins.includes(p)} />)}
    </div>
    <div className="grid grid-cols-3 gap-6 w-32">
      {[4, 5, 6].map(p => <Pin key={p} id={p} highlighted={nemesisPins.includes(p)} />)}
    </div>
    <div className="grid grid-cols-2 gap-6 w-20">
      {[2, 3].map(p => <Pin key={p} id={p} highlighted={nemesisPins.includes(p)} />)}
    </div>
    <Pin id={1} highlighted={nemesisPins.includes(1)} />
  </div>
);

const Heatmap5: React.FC<{ nemesisPins: number[] }> = ({ nemesisPins }) => (
  <div className="flex flex-col items-center space-y-6">
    <div className="flex space-x-12">
      <Pin id={2} highlighted={nemesisPins.includes(0)} label="2" />
      <Pin id={2} highlighted={nemesisPins.includes(4)} label="2" />
    </div>
    <div className="flex space-x-8">
      <Pin id={3} highlighted={nemesisPins.includes(1)} label="3" />
      <Pin id={3} highlighted={nemesisPins.includes(3)} label="3" />
    </div>
    <Pin id={5} highlighted={nemesisPins.includes(2)} label="5" />
  </div>
);

const Pin: React.FC<{ id: number; highlighted: boolean; label?: string }> = ({ highlighted, label }) => (
  <div className={`w-4 h-4 rounded-full border-2 transition-all duration-700 ${highlighted ? 'bg-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-125' : 'bg-slate-200 border-slate-300'}`}>
     {label && <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-400">{label}</span>}
  </div>
);

const ProgressCircle: React.FC<{ percent: number; color: string; size: number }> = ({ percent, color, size }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
      <circle 
        cx={size / 2} cy={size / 2} r={radius} 
        fill="transparent" stroke={color} 
        strokeWidth="4" strokeDasharray={circumference} 
        strokeDashoffset={offset} 
        strokeLinecap="round" 
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};

const QuickLink: React.FC<{ title: string; sub: string; icon: React.ReactNode; gradient: string; onClick: () => void; border?: boolean }> = ({ title, sub, icon, gradient, onClick, border }) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 rounded-[32px] flex items-center justify-between group transition-all hover:scale-[1.02] active:scale-95 shadow-lg ${border ? 'bg-slate-800 border border-slate-700' : `bg-gradient-to-br ${gradient}`}`}
  >
    <div className="flex items-center space-x-5">
      <div className="bg-white/10 p-3 rounded-2xl text-white">{icon}</div>
      <div className="text-left">
        <h3 className="text-white font-black text-lg leading-tight">{title}</h3>
        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{sub}</p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all" />
  </button>
);

export default Dashboard;
