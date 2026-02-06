
import React from 'react';
import { Target, BarChart3, Medal, TrendingUp, Users, Crown } from 'lucide-react';
import { Feature } from '../types';

const featureList: Feature[] = [
  {
    icon: <Target className="w-6 h-6 text-white" />,
    title: '5-Pin & 10-Pin Tracking',
    description: 'Track both bowling formats with precision scoring and frame-by-frame analysis'
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-white" />,
    title: 'Performance Analytics',
    description: 'Deep insights into your strike rate, spare conversion, and score trends'
  },
  {
    icon: <Medal className="w-6 h-6 text-white" />,
    title: 'Badges of Honour',
    description: 'Earn milestone pins, performance badges, and seasonal achievements'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-white" />,
    title: 'Progress Tracking',
    description: 'Watch your average climb and celebrate personal bests'
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: 'Social Sharing',
    description: 'Share your perfect games and achievements with friends and followers'
  },
  {
    icon: <Crown className="w-6 h-6 text-white" />,
    title: 'League Ready',
    description: 'Built for serious bowlers with handicap calculations and averages'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6">Everything You Need to Bowl Better</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
          Whether you're a league bowler or weekend warrior, Strike Zone gives you the tools to track, analyze, and improve your game.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-50 flex flex-col items-start group">
            <div className="bg-[#2563EB] p-4 rounded-xl mb-6 shadow-md group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
