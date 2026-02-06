
import React from 'react';
import { Trophy, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="pt-12 md:pt-20 pb-16 px-6 text-center max-w-5xl mx-auto">
      <div className="inline-flex items-center bg-white border border-blue-100 rounded-full px-5 md:px-6 py-2 shadow-sm mb-8 md:mb-12">
        <Trophy className="w-4 h-4 md:w-5 md:h-5 text-[#2563EB] mr-2 md:mr-3" />
        <span className="text-[#0F172A] font-black tracking-widest uppercase text-[10px] md:text-sm">Strike Zone</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-[900] leading-tight mb-8 tracking-tighter">
        <span className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent md:text-[#0F172A]">
          Your Bowling Journey
        </span>
      </h1>
      
      <p className="text-base md:text-xl text-slate-900 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-bold">
        Track every frame, earn every badge, and level up your game with the ultimate performance tracker for 5-pin and 10-pin enthusiasts.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <button 
          onClick={() => onNavigate('auth')}
          className="w-full sm:w-auto bg-[#2563EB] text-white px-8 py-4 md:py-5 rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-[#1D4ED8] transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span className="uppercase tracking-widest text-sm">Start Bowling Now</span>
        </button>
        <button 
          onClick={() => onNavigate('auth')}
          className="w-full sm:w-auto bg-white text-[#0F172A] border-2 border-slate-100 px-8 py-4 md:py-5 rounded-2xl font-black flex items-center justify-center space-x-3 hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          <span className="uppercase tracking-widest text-sm">View Demo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-slate-400 font-black text-[10px] uppercase tracking-widest">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>100% Free to Start</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>No Credit Card</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>iOS & Android Soon</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
