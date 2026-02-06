
import React from 'react';
import { Check, Star } from 'lucide-react';
import { Language, PricingPlan } from '../types';
import { translations } from '../translations';

const Pricing: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: t.freeTier,
      price: '$0',
      features: ['Basic scoring', 'Entry-level badges', 'Personal history'],
      buttonLabel: t.choosePlan
    },
    {
      id: 'spare',
      name: t.spareTier,
      price: '$9.99/mo',
      features: ['Advanced analytics', 'Ball tracking', 'SMS alerts', '10 SMS Credits'],
      buttonLabel: t.choosePlan
    },
    {
      id: 'strike',
      name: t.strikeTier,
      price: '$24.99/mo',
      features: ['Full Broadcast Power', 'AI Coaching', 'Seasonal Erasable Pins', '30 SMS Credits', 'Priority Support'],
      recommended: true,
      buttonLabel: t.choosePlan
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="pricing">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6">{t.pricingTitle}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-3xl border-2 flex flex-col transition-all hover:scale-105 ${
              plan.recommended 
                ? 'border-[#2563EB] bg-white shadow-2xl scale-105 z-10' 
                : 'border-slate-100 bg-white shadow-sm'
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white px-4 py-1 rounded-full text-xs font-bold flex items-center">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {t.recommended}
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
              <div className="text-4xl font-black text-[#0F172A]">{plan.price}</div>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start space-x-3 text-slate-600 font-medium">
                  <Check className={`w-5 h-5 mt-0.5 ${plan.recommended ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 rounded-xl font-bold transition-all ${
              plan.recommended 
                ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]' 
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}>
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
