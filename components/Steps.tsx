
import React from 'react';
import { Step } from '../types';

const steps: Step[] = [
  {
    number: 1,
    title: 'Score Your Game',
    description: 'Enter your scores frame-by-frame or let your bowling center sync automatically',
    colorClass: 'bg-[#2563EB]'
  },
  {
    number: 2,
    title: 'Track Progress',
    description: 'Watch your stats improve with detailed analytics and performance insights',
    colorClass: 'bg-[#EA580C]'
  },
  {
    number: 3,
    title: 'Earn Badges',
    description: 'Unlock achievements, compete on leaderboards, and share your victories',
    colorClass: 'bg-gradient-to-br from-[#2563EB] to-[#93C5FD] opacity-80'
  }
];

const Steps: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Three Steps to Better Bowling</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center text-center relative overflow-hidden group">
            <div className={`${step.colorClass} w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-black mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              {step.number}
            </div>
            <h3 className="text-2xl font-black mb-4">{step.title}</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
