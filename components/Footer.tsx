
import React from 'react';
import { Trophy } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0F172A] text-slate-400 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center space-x-2 text-white mb-6">
            <Trophy className="w-6 h-6 text-[#2563EB]" />
            <span className="text-lg font-black tracking-tight">STRIKE ZONE</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 font-medium">
            The ultimate bowling performance tracker for 5-pin and 10-pin enthusiasts across Canada and beyond.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Features</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">Score Tracking</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Badges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Game History</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bowling Centers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Coming Soon</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-white transition-colors">iOS App</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Android App</a></li>
            <li><a href="#" className="hover:text-white transition-colors">League Management</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Social Features</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-sm font-medium">
        © {currentYear} Strike Zone. All rights reserved. Built for bowlers, by bowlers.
      </div>
    </footer>
  );
};

export default Footer;
