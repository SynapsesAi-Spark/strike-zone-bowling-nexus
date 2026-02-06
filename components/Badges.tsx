import React from 'react';
import { Bookmark } from 'lucide-react';
import { Badge } from '../types';

const badges: Badge[] = [
  { image: 'https://picsum.photos/id/10/100/100', name: '100 Game', count: '12,453 earned' },
  { image: 'https://picsum.photos/id/20/100/100', name: '200 Game', count: '3,892 earned' },
  { image: 'https://picsum.photos/id/30/100/100', name: '250 Game', count: '876 earned' },
  { image: 'https://picsum.photos/id/40/100/100', name: 'Perfect 300', count: '124 earned' },
  { image: 'https://picsum.photos/id/50/100/100', name: 'Turkey', count: '5,234 earned' },
  { image: 'https://picsum.photos/id/60/100/100', name: 'Clean Game', count: '2,109 earned' },
];

const Badges: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6">Badges of Honour</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg font-bold">
            Join thousands of bowlers earning achievements and climbing the leaderboards
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-12">
          {badges.map((badge, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-default">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-50 mb-4 flex items-center justify-center overflow-hidden border-2 border-slate-100 p-1">
                <img src={badge.image} alt={badge.name} className="w-full h-full object-cover rounded-full" />
              </div>
              <h4 className="font-black text-sm md:text-base mb-1 text-[#0F172A]">{badge.name}</h4>
              <p className="text-[#2563EB] text-[8px] md:text-[10px] font-black uppercase tracking-widest">{badge.count}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <button className="flex items-center space-x-2 border-2 border-slate-100 px-8 py-3.5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:border-[#2563EB] hover:text-[#2563EB] transition-all bg-white shadow-sm active:scale-95">
            <span>View All Badges</span>
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Badges;