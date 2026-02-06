
import React from 'react';
import { Zap } from 'lucide-react';

interface FinalCTAProps {
  onNavigate: (view: any) => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 px-6 text-center bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-black mb-8">Ready to Strike?</h2>
        <p className="text-slate-500 text-xl font-medium mb-12 max-w-2xl mx-auto">
          Join the Strike Zone community and take your bowling game to the next level. Free to start, easy to use, built for bowlers.
        </p>
        
        <button 
          onClick={() => onNavigate('auth')}
          className="bg-[#2563EB] text-white px-10 py-5 rounded-xl font-black text-lg flex items-center justify-center space-x-3 mx-auto hover:bg-[#1D4ED8] transition-all shadow-xl hover:scale-105 active:scale-95 mb-10"
        >
          <Zap className="w-6 h-6" />
          <span>Start Your First Game</span>
        </button>
        
        <div className="text-slate-400 font-medium text-sm">
          iOS & Android Coming Soon • No Credit Card Required • 100% Free to Start
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
