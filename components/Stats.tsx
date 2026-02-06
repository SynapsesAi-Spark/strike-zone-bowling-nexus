import React from 'react';
import { Stat } from '../types';

const stats: Stat[] = [
  { value: '10,000+', label: 'Games Tracked' },
  { value: '2,500+', label: 'Active Bowlers' },
  { value: '47', label: 'Partner Centers' },
  { value: '98%', label: 'Satisfaction' },
];

const Stats: React.FC = () => {
  return (
    <section className="bg-white/50 backdrop-blur-sm py-12 md:py-16 border-t border-b border-slate-100/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-3xl md:text-5xl font-black text-[#2563EB] mb-1 md:mb-2">{stat.value}</div>
            <div className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;