
import React, { useState } from 'react';
import { Target, Pin, Keyboard, ArrowLeft } from 'lucide-react';
import { Language, GameType, EntryMode } from '../types';
import { translations } from '../translations';

interface NewGameFlowProps {
  lang: Language;
  onStartGame: (type: GameType, mode: EntryMode) => void;
  onBack: () => void;
}

const NewGameFlow: React.FC<NewGameFlowProps> = ({ lang, onStartGame, onBack }) => {
  const t = translations[lang];
  const [step, setStep] = useState<'gameType' | 'entryMode'>('gameType');
  const [selectedType, setSelectedType] = useState<GameType>('10-pin');

  if (step === 'entryMode') {
    return (
      <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setStep('gameType')}
            className="self-start mb-8 flex items-center space-x-2 text-[#2563EB] font-bold hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.undo}</span>
          </button>

          <h1 className="text-4xl font-black text-[#0F172A] mb-12 text-center leading-tight">
            {t.selectEntryMode}
          </h1>

          <div className="flex flex-col space-y-6 w-full max-w-sm">
            <button 
              onClick={() => onStartGame(selectedType, 'visual')}
              className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center group border-2 border-transparent hover:border-[#2563EB] active:scale-95"
            >
              <div className="bg-blue-50 p-4 rounded-3xl mb-4 group-hover:bg-blue-100 transition-colors">
                <Pin className="w-10 h-10 text-[#2563EB] transition-transform group-hover:-rotate-12" />
              </div>
              <span className="text-xl font-black text-[#0F172A]">{t.visualPinPicker}</span>
            </button>

            <button 
              onClick={() => onStartGame(selectedType, 'manual')}
              className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col items-center group border-2 border-transparent hover:border-[#2563EB] active:scale-95"
            >
              <div className="bg-blue-50 p-4 rounded-3xl mb-4 group-hover:bg-blue-100 transition-colors">
                <Keyboard className="w-10 h-10 text-[#2563EB] transition-transform group-hover:translate-y-0.5" />
              </div>
              <span className="text-xl font-black text-[#0F172A]">{t.manualEntry}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full flex flex-col items-center animate-in fade-in duration-500">
        <button 
          onClick={onBack}
          className="self-start mb-4 flex items-center space-x-2 text-[#2563EB] font-bold hover:opacity-70 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </button>

        <h1 className="text-4xl font-black text-[#0F172A] mb-12 uppercase tracking-tight">
          {t.selectGameType}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mb-12">
          {/* Card 1: 5-Pin Canadian Style - Strictly Text Only */}
          <button 
            onClick={() => setSelectedType('5-pin')}
            className={`relative p-8 rounded-[24px] min-h-[160px] transition-all flex items-center justify-center text-center group border-4 ${
              selectedType === '5-pin' 
                ? 'bg-[#E0F2FE] border-[#2563EB] shadow-2xl scale-105' 
                : 'bg-white border-transparent hover:border-[#2563EB]'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A] leading-tight">
              5-Pin Canadian Style - 15 Pts Max
            </h2>
            {selectedType === '5-pin' && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </button>

          {/* Card 2: 10-Pin Traditional Style - Strictly Text Only */}
          <button 
            onClick={() => setSelectedType('10-pin')}
            className={`relative p-8 rounded-[24px] min-h-[160px] transition-all flex items-center justify-center text-center group border-4 ${
              selectedType === '10-pin' 
                ? 'bg-white border-[#2563EB] shadow-2xl scale-105' 
                : 'bg-white border-transparent hover:border-[#2563EB]'
            }`}
          >
            <h2 className="text-xl md:text-2xl font-black text-[#0F172A] leading-tight">
              10-Pin Traditional Style - 10 Pts Max
            </h2>
            {selectedType === '10-pin' && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center shadow-lg">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </button>
        </div>

        <button 
          onClick={() => setStep('entryMode')}
          className="bg-[#2563EB] text-white px-10 py-4 rounded-[20px] font-black text-lg flex items-center space-x-3 shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all"
        >
          <Target className="w-6 h-6" />
          <span>{t.startGame}</span>
        </button>
      </div>
    </div>
  );
};

export default NewGameFlow;
