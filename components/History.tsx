
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Calendar, MapPin, Trophy } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { MOCK_GAMES, GameRecord } from '../mockData';

interface HistoryProps {
  lang: Language;
  onBack: () => void;
  onNewGame: () => void;
}

const History: React.FC<HistoryProps> = ({ lang, onBack, onNewGame }) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'all' | '5-pin' | '10-pin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter(game => {
      const matchesType = filter === 'all' || game.type === filter;
      const matchesSearch = 
        game.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
        game.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex items-start justify-center p-4 md:p-6 pt-12 overflow-y-auto no-scrollbar">
      <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
        {/* Back Link */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 font-bold mb-8 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#0F172A] mb-2">{t.gameHistory}</h1>
            <p className="text-slate-500 font-medium">{filteredGames.length} {t.gamesRecorded}</p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-xl mt-6 md:mt-0 overflow-x-auto no-scrollbar">
            <FilterButton 
              active={filter === 'all'} 
              onClick={() => setFilter('all')} 
              label={t.filterAll} 
            />
            <FilterButton 
              active={filter === '5-pin'} 
              onClick={() => setFilter('5-pin')} 
              label={t.filter5Pin} 
            />
            <FilterButton 
              active={filter === '10-pin'} 
              onClick={() => setFilter('10-pin')} 
              label={t.filter10Pin} 
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
            <Search className="w-5 h-5 mr-2" />
            <div className="w-px h-4 bg-slate-200 mr-2" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
          />
        </div>

        {/* Games List */}
        {filteredGames.length > 0 ? (
          <div className="space-y-4">
            {filteredGames.map(game => (
              <GameHistoryItem key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[32px] p-12 flex flex-col items-center text-center shadow-inner-sm">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-20 scale-150" />
              <img 
                src="https://img.icons8.com/color/144/bowling.png" 
                alt="Bowling illustration" 
                className="w-32 h-32 relative animate-bounce-slow"
              />
            </div>
            
            <h2 className="text-2xl font-black text-[#0F172A] mb-4">{t.noGamesFound}</h2>
            <p className="text-slate-500 font-medium mb-8 max-w-sm">
              {t.noGamesSub}
            </p>

            <button 
              onClick={onNewGame}
              className="bg-[#2563EB] text-white px-10 py-4 rounded-xl font-black shadow-lg hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 transition-all"
            >
              {t.newGame}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const GameHistoryItem: React.FC<{ game: GameRecord }> = ({ game }) => (
  <div className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer">
    <div className="flex items-center space-x-6">
      <div className="flex flex-col items-center justify-center bg-white w-16 h-16 rounded-2xl border border-slate-100 group-hover:border-blue-500 group-hover:bg-blue-50 transition-colors shadow-sm">
        <span className="text-2xl font-black text-[#0F172A]">{game.score}</span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">PTS</span>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${game.type === '10-pin' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
            {game.type}
          </span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{game.category}</span>
        </div>
        <div className="flex items-center text-slate-500 text-xs font-bold">
          <Calendar className="w-3 h-3 mr-1" />
          {game.date}
        </div>
        <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <MapPin className="w-3 h-3 mr-1" />
          {game.location}
        </div>
      </div>
    </div>
    
    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200">
      <div className="flex space-x-2">
        <div className="bg-[#2563EB] text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">{game.strikes} Strikes</div>
        <div className="bg-[#EA580C] text-white px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">{game.spares} Spares</div>
      </div>
      <Trophy className="hidden sm:block w-4 h-4 text-slate-200 mt-2 group-hover:text-blue-500 transition-colors" />
    </div>
  </div>
);

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
      active 
        ? 'bg-[#2563EB] text-white shadow-md' 
        : 'text-slate-500 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

export default History;
