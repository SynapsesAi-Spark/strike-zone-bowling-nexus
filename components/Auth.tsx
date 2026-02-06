
import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

const Auth: React.FC<{ lang: Language; onBack: () => void; onLoginSuccess: () => void }> = ({ lang, onBack, onLoginSuccess }) => {
  const t = translations[lang];
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  return (
    <div className="fixed inset-0 bg-mesh z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-2xl relative">
        <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-black mb-2">{mode === 'login' ? t.login : t.signUp}</h2>
          <p className="text-slate-500 font-medium">Join the Strike Zone community</p>
        </div>

        <div className="space-y-4 mb-8">
          <button onClick={onLoginSuccess} className="w-full flex items-center justify-center space-x-3 border-2 border-slate-100 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>{t.continueGoogle}</span>
          </button>
          
          <button onClick={onLoginSuccess} className="w-full flex items-center justify-center space-x-3 bg-[#1877F2] text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>{t.continueFacebook}</span>
          </button>

          <button onClick={onLoginSuccess} className="w-full flex items-center justify-center space-x-3 bg-black text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.152 6.896c-.115 0-.273.01-.409.01-.444.015-1.075.067-1.561.067-.96 0-1.39-.09-2.32-.09-1.17 0-2.366.59-3.056 1.447-1.374 1.7-1.47 4.8-.4 6.7 1.06 1.9 3.15 1.9 4.25 1.9.93 0 1.58-.09 2.49-.09 1.357 0 1.562.1 2.532.1 1.108 0 2.978-.12 4.148-1.83 1.168-1.72 1.13-3.9-.39-5.39-.71-.7-1.57-1.02-2.31-1.02-1.02 0-1.76.1-2.98.1zM11.977 5.176c.47 0 .93-.07 1.39-.24.89-.34 1.43-1.01 1.43-1.74 0-1.04-.93-1.84-2.31-1.84-.52 0-.98.05-1.37.2-.9.34-1.44 1.02-1.44 1.75 0 1.04.93 1.87 2.3 1.87z"/></svg>
            <span>{t.continueApple}</span>
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">Or with email</span></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-xl outline-none transition-all font-medium" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-xl outline-none transition-all font-medium" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-[#2563EB] focus:bg-white rounded-xl outline-none transition-all font-medium" required />
          </div>
          <button className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-black shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
            {mode === 'login' ? t.login : t.signUp}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-500">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"} 
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="ml-1 text-[#2563EB] font-bold hover:underline"
          >
            {mode === 'login' ? t.signUp : t.login}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
