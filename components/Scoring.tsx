import React, { useState, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Zap, CheckCircle2, Ban } from 'lucide-react';
import { Language, GameType, EntryMode, Frame } from '../types';
import { translations } from '../translations';

interface ScoringProps {
  lang: Language;
  onBack: () => void;
  defaultGameType: GameType;
  entryMode: EntryMode;
}

const FIVE_PIN_VALUES = [2, 3, 5, 3, 2];
const PIN_IDS = ['L2', 'L3', 'C5', 'R3', 'R2'];

interface GameStateSnapshot {
  frames: Frame[];
  currentFrameIdx: number;
  currentBallIdx: number;
  knockedDownThisFrame: Set<number>;
}

const Scoring: React.FC<ScoringProps> = ({ lang, onBack, defaultGameType, entryMode }) => {
  const t = translations[lang];
  
  // 1. Data Model
  const [frames, setFrames] = useState<Frame[]>(
    Array(10).fill(null).map(() => ({
      balls: [null, null, null],
      score: null,
      cumulativeScore: null
    }))
  );

  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [currentBallIdx, setCurrentBallIdx] = useState(0);
  const [knockedDownThisFrame, setKnockedDownThisFrame] = useState<Set<number>>(new Set());
  const [selectingNow, setSelectingNow] = useState<Set<number>>(new Set());
  
  // History for Undo (Reset Selection button)
  const [history, setHistory] = useState<GameStateSnapshot[]>([]);

  // 2. Selection & Pattern Detection
  const totalSelectedThisBall = useMemo(() => 
    Array.from(selectingNow).reduce((acc: number, idx: number) => acc + FIVE_PIN_VALUES[idx], 0)
  , [selectingNow]);

  const currentBallDisplayString = useMemo(() => {
    if (selectingNow.size === 0) return null;
    
    const isStartOfRack = knockedDownThisFrame.size === 0;
    const isStrike = isStartOfRack && selectingNow.size === 5;
    if (isStrike) return 'X';

    const isAces = isStartOfRack && 
                   selectingNow.size === 3 && 
                   selectingNow.has(1) && 
                   selectingNow.has(2) && 
                   selectingNow.has(3);
    if (isAces) return 'A';

    const isOnlyHeadpin = isStartOfRack && selectingNow.size === 1 && selectingNow.has(2);
    if (isOnlyHeadpin) return 'H';

    const isSecondBallOfRack = !isStartOfRack;
    const totalDownThisRack = knockedDownThisFrame.size + selectingNow.size;
    const isSpare = isSecondBallOfRack && totalDownThisRack === 5;
    if (isSpare) return '/';

    return totalSelectedThisBall;
  }, [selectingNow, currentBallIdx, knockedDownThisFrame, totalSelectedThisBall]);

  const getBallValue = (ball: any): number => {
    if (ball === 'X' || ball === '/') return 15;
    if (ball === 'H') return 5;
    if (ball === 'A') return 11;
    if (typeof ball === 'number') return ball;
    return 0;
  };

  const totalScore = useMemo(() => {
    let sum = 0;
    frames.forEach(f => {
      f.balls.forEach(b => { sum += getBallValue(b); });
    });
    return sum;
  }, [frames]);

  const handlePinTap = (idx: number) => {
    if (knockedDownThisFrame.has(idx) || selectingNow.has(idx)) return;
    const newSelecting = new Set(selectingNow);
    newSelecting.add(idx);
    setSelectingNow(newSelecting);
  };

  const handleResetCurrentSelections = () => {
    if (selectingNow.size > 0) {
      setSelectingNow(new Set());
    } else if (history.length > 0) {
      const lastSnapshot = history[history.length - 1];
      setFrames(lastSnapshot.frames);
      setCurrentFrameIdx(lastSnapshot.currentFrameIdx);
      setCurrentBallIdx(lastSnapshot.currentBallIdx);
      setKnockedDownThisFrame(lastSnapshot.knockedDownThisFrame);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const advanceTurn = (value: number | 'X' | '/' | '-' | 'H' | 'A') => {
    const snapshot: GameStateSnapshot = {
      frames: JSON.parse(JSON.stringify(frames)),
      currentFrameIdx,
      currentBallIdx,
      knockedDownThisFrame: new Set(knockedDownThisFrame)
    };
    setHistory(prev => [...prev, snapshot]);

    const newFrames = [...frames];
    const currentFrame = { ...newFrames[currentFrameIdx] };
    const balls = [...currentFrame.balls];
    
    balls[currentBallIdx] = value;
    currentFrame.balls = balls;
    newFrames[currentFrameIdx] = currentFrame;

    setFrames(newFrames);

    const isStrike = value === 'X';
    const isSpare = value === '/';
    const updatedFrameHits = new Set([...knockedDownThisFrame, ...selectingNow]);
    const allPinsDown = updatedFrameHits.size === 5 || isStrike || isSpare;

    let moveNextFrame = false;
    let nextBallIdx = currentBallIdx + 1;
    let nextKnockedDown = updatedFrameHits;

    if (currentFrameIdx < 9) {
      if (isStrike || isSpare || currentBallIdx === 2 || allPinsDown) {
        moveNextFrame = true;
      }
    } else {
      if (currentBallIdx < 2) {
        if (allPinsDown) {
          nextKnockedDown = new Set();
        }
      }
    }

    if (moveNextFrame) {
      setCurrentFrameIdx(prev => prev + 1);
      setCurrentBallIdx(0);
      setKnockedDownThisFrame(new Set());
    } else {
      if (currentBallIdx < 2) {
        setCurrentBallIdx(nextBallIdx);
        setKnockedDownThisFrame(nextKnockedDown);
      }
    }
    setSelectingNow(new Set());
  };

  const handleConfirm = () => {
    if (selectingNow.size === 0) return;
    const valueToAdvance = currentBallDisplayString;
    if (valueToAdvance !== null) {
      advanceTurn(valueToAdvance as any);
    }
  };

  const handleStrike = () => {
    const pinsToHit = [];
    for(let i=0; i<5; i++) {
      if(!knockedDownThisFrame.has(i)) pinsToHit.push(i);
    }
    
    if (knockedDownThisFrame.size === 0) {
      setSelectingNow(new Set([0, 1, 2, 3, 4]));
      advanceTurn('X');
    } else {
      const allRemaining = new Set(selectingNow);
      pinsToHit.forEach(p => allRemaining.add(p));
      setSelectingNow(allRemaining);
      const val = knockedDownThisFrame.size + pinsToHit.length === 5 ? '/' : pinsToHit.length;
      advanceTurn(val as any);
    }
  };

  const handleGutter = () => {
    setSelectingNow(new Set());
    advanceTurn(0);
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex flex-col p-3 md:p-6 animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden no-scrollbar">
      <div className="max-w-4xl mx-auto w-full flex flex-col space-y-3 md:space-y-4">
        
        <button 
          onClick={onBack} 
          className="flex items-center space-x-2 text-slate-600 font-bold hover:text-slate-800 transition-colors self-start py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs">{t.back}</span>
        </button>

        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <div className="bg-white/60 p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-white/40 shadow-sm flex flex-col justify-center">
            <h3 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{t.frame} {currentFrameIdx + 1}</h3>
            <div className="text-lg md:text-2xl font-black text-[#0F172A] leading-none">
              {currentBallIdx + 1} <span className="text-[10px] md:text-xs text-slate-400 font-bold">/ 3</span>
            </div>
          </div>
          <div className="bg-white/60 p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-white/40 shadow-sm flex flex-col justify-center">
            <h3 className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{t.previousFrame}</h3>
            <div className="text-lg md:text-2xl font-black text-[#0F172A] leading-none">
              {currentFrameIdx > 0 ? (getBallValue(frames[currentFrameIdx - 1].balls[0])) : '-'}
            </div>
          </div>
          <div className="bg-white/60 p-3 md:p-4 rounded-[16px] md:rounded-[20px] border border-white/40 shadow-sm flex flex-col justify-center">
            <h3 className="text-[8px] md:text-[9px] font-black text-[#0F172A] uppercase tracking-widest mb-0.5 md:mb-1">{t.currentBall}</h3>
            <div className="text-lg md:text-2xl font-black text-red-600 leading-none">
              {totalSelectedThisBall}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-5 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[10px] md:text-xs font-black text-[#0F172A] uppercase tracking-widest">{t.scorecard}</h2>
            <div className="flex items-center space-x-2">
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.currentTotal}:</span>
              <div className="bg-red-600 text-white min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center font-black text-xs shadow-md">
                {totalScore}
              </div>
            </div>
          </div>
          <div className="flex space-x-1 overflow-x-auto pb-2 no-scrollbar">
            {frames.map((frame, i) => {
              const ballsInThisFrame = frame.balls;
              return (
                <div key={i} className={`w-12 md:w-14 h-16 md:h-18 rounded-lg md:rounded-xl border flex flex-col transition-all flex-shrink-0 ${i === currentFrameIdx ? 'border-red-500 bg-red-50/50 ring-2 ring-red-100 shadow-md' : 'border-slate-50 bg-slate-50/50'}`}>
                  <div className={`p-0.5 md:p-1 text-center text-[7px] md:text-[8px] font-black uppercase tracking-tighter ${i === currentFrameIdx ? 'text-red-600' : 'text-slate-400'}`}>
                    F{i + 1}
                  </div>
                  <div className="flex-grow flex flex-col items-center justify-center text-[9px] md:text-[10px] font-black text-slate-800 px-1">
                     <div className="flex space-x-0.5 border-b border-slate-100 w-full justify-center pb-0.5 mb-0.5">
                        {ballsInThisFrame.map((b, bi) => {
                          let displayValue = b;
                          if (i === currentFrameIdx && bi === currentBallIdx && currentBallDisplayString !== null) {
                            displayValue = currentBallDisplayString;
                          }
                          let textColor = 'text-slate-700';
                          if (displayValue === 'A') textColor = 'text-red-500 font-black';
                          else if (displayValue === 'X' || displayValue === 'H' || displayValue === '/') textColor = 'text-red-600 font-black';
                          return (
                            <span key={bi} className={`w-2.5 md:w-3 text-center transition-all ${textColor}`}>
                              {displayValue === null ? '' : displayValue}
                            </span>
                          );
                        })}
                     </div>
                     <div className="text-[10px] md:text-[11px] font-black">
                        {i <= currentFrameIdx && (frame.balls.some(b => b !== null) || (i === currentFrameIdx && currentBallDisplayString !== null)) ? (
                           frames.slice(0, i + 1).reduce((acc, f, idx) => {
                             let fSum = 0;
                             f.balls.forEach(b => fSum += getBallValue(b));
                             if (idx === currentFrameIdx && currentBallDisplayString !== null) {
                               fSum += totalSelectedThisBall;
                             }
                             return acc + fSum;
                           }, 0)
                        ) : '-'}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row items-stretch justify-center gap-2 w-full max-w-2xl mx-auto px-1">
          <button onClick={handleStrike} disabled={currentFrameIdx < 9 && currentBallIdx !== 0} className="bg-[#D12B26] text-white py-3 px-3 rounded-xl font-black text-[10px] md:text-xs flex items-center justify-center space-x-1 shadow-lg disabled:opacity-30 disabled:grayscale transition-all active:scale-95">
            <Zap className="w-3 h-3 fill-current" />
            <span className="whitespace-nowrap uppercase">{t.strikeLabel}</span>
          </button>
          
          <button onClick={handleConfirm} disabled={selectingNow.size === 0} className="bg-white border-2 border-[#D12B26] text-[#D12B26] py-3 px-3 rounded-xl font-black text-[10px] md:text-xs flex items-center justify-center space-x-1 shadow-md hover:bg-red-50 disabled:opacity-30 transition-all active:scale-95">
            <CheckCircle2 className="w-3 h-3" />
            <span className="whitespace-nowrap uppercase truncate">{t.confirmLabel} ({totalSelectedThisBall})</span>
          </button>
          
          <button onClick={handleResetCurrentSelections} className="bg-blue-50 text-[#2563EB] py-3 px-3 rounded-xl font-black text-[10px] md:text-xs border-2 border-transparent transition-all flex items-center justify-center space-x-1 active:scale-95">
            <RotateCcw className="w-3 h-3" />
            <span className="whitespace-nowrap uppercase">{selectingNow.size > 0 ? t.resetSelection : t.undo}</span>
          </button>
          
          <button onClick={handleGutter} className="bg-slate-800 text-white py-3 px-3 rounded-xl font-black text-[10px] md:text-xs shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center space-x-1 active:scale-95">
            <Ban className="w-3 h-3" />
            <span className="whitespace-nowrap uppercase">{t.gutterBall}</span>
          </button>
        </div>

        <div className="bg-white/30 backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-4 md:p-8 flex justify-center items-end space-x-2 md:space-x-4 min-h-[160px] md:min-h-[180px] shadow-inner-sm">
          {FIVE_PIN_VALUES.map((val, idx) => {
            const isHitEarlierThisFrame = knockedDownThisFrame.has(idx);
            const isSelectedNow = selectingNow.has(idx);
            const isDisabled = isHitEarlierThisFrame || isSelectedNow;
            
            return (
              <div key={PIN_IDS[idx]} className="relative" onClick={() => handlePinTap(idx)}>
                {idx === 2 && (
                  <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
                    <div className="bg-amber-100 border border-amber-600 rounded-md p-0.5 px-1.5 md:px-2 shadow-sm">
                      <span className="text-amber-800 font-black text-[8px] md:text-[9px]">5</span>
                    </div>
                    <div className="w-0.5 h-2 md:h-3 bg-amber-600" />
                  </div>
                )}
                <div className={`relative w-8 md:w-16 transition-all duration-300 ${isDisabled ? 'opacity-20 scale-90 translate-y-3 md:translate-y-4 grayscale bg-slate-200 cursor-not-allowed' : 'hover:-translate-y-2 active:scale-110 cursor-pointer'}`}>
                  <div className={`relative bg-white rounded-full border-2 shadow-lg overflow-hidden aspect-[1/3.5] flex flex-col items-center justify-end pb-2 md:pb-3 transition-colors ${isDisabled ? 'border-slate-300' : 'border-slate-200'}`}>
                    <div className={`absolute top-[20%] w-full h-1 ${isDisabled ? 'bg-slate-400' : 'bg-red-600'}`} />
                    <div className={`absolute top-[20%] mt-1 md:mt-1.5 w-full h-1 ${isDisabled ? 'bg-slate-400' : 'bg-red-600'}`} />
                    <div className={`w-5 h-5 md:w-10 md:h-10 rounded-full border flex items-center justify-center font-black text-[9px] md:text-base shadow-inner z-10 ${isDisabled ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-800 border-slate-200'}`}>
                      {val}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Scoring;