
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Users, MessageSquare, Volume2, Check, Lock, Settings, Loader2, XCircle, 
  Mail, Plus, ArrowRight, Send, PenTool, Sparkles, ChevronDown, 
  Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon, 
  Type, Shield, Info, AlignLeft, AlignCenter, AlignRight, RotateCcw, RotateCw, Palette
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

interface BroadcastCenterProps {
  lang: Language;
}

interface EmailCampaign {
  id: string;
  name: string;
  status: 'sent' | 'draft' | 'scheduled';
  date: string;
  recipients: number;
  openRate?: string;
  clickRate?: string;
  subject: string;
}

interface Segment {
  id: string;
  name: string;
  count: number;
  criteria: string;
}

const BroadcastCenter: React.FC<BroadcastCenterProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'broadcast' | 'email' | 'integrations'>('broadcast');
  const [emailLanguage, setEmailLanguage] = useState<'English' | 'French'>('English');
  const [googleKey, setGoogleKey] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [campaigns] = useState<EmailCampaign[]>([
    { id: '1', name: 'January Free Game Promo', subject: 'Your monthly strike zone coupon!', status: 'sent', date: 'Jan 15, 2026', recipients: 1240, openRate: '42%', clickRate: '12%' },
    { id: '2', name: 'Youth League Registration', subject: 'Sign up for winter ybc!', status: 'scheduled', date: 'Feb 01, 2026', recipients: 450 },
    { id: '3', name: 'Maintenance Notice', subject: 'Lane upgrades incoming!', status: 'draft', date: '---', recipients: 0 },
  ]);

  const [segments] = useState<Segment[]>([
    { id: 's1', name: 'Active League Bowlers', count: 342, criteria: 'Tag: League + Active last 30 days' },
    { id: 's2', name: 'Youth Under 18', count: 128, criteria: 'Age: < 18' },
    { id: 's3', name: 'Ontario Residents', count: 890, criteria: 'Province: Ontario' },
  ]);

  useEffect(() => {
    const savedKey = localStorage.getItem('google_places_api_key');
    if (savedKey) setGoogleKey(savedKey);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('google_places_api_key', googleKey);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#DBEAFE] flex flex-col items-center p-4 md:p-6 pt-8 md:pt-12 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      {showSaveToast && (
        <div className="fixed top-24 right-6 z-[100] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className="bg-white border-l-4 border-green-500 shadow-2xl rounded-2xl p-4 flex items-center space-x-4 pr-8">
            <div className="bg-green-100 p-2 rounded-full"><Check className="w-5 h-5 text-green-600" /></div>
            <div>
              <p className="font-black text-slate-800 text-sm">Settings Saved</p>
              <p className="text-xs font-bold text-slate-500">API key updated successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Container */}
      <header className="bg-[#2563EB] text-white px-6 py-8 rounded-[40px] w-full max-w-7xl mb-8 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-xl border border-white/30 shadow-inner">
            <span className="text-4xl">🎳</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Broadcast HQ</h1>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Strike Zone v2.5 Enterprise</span>
          </div>
        </div>

        {!isComposing && (
          <div className="flex bg-black/10 backdrop-blur-md p-1.5 rounded-2xl shadow-inner mt-6 md:mt-0 relative z-10 border border-white/10">
            <TabBtn active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} icon={<Volume2 className="w-4 h-4" />} label={t.broadcastCenter} transparent />
            <TabBtn active={activeTab === 'email'} onClick={() => setActiveTab('email')} icon={<Mail className="w-4 h-4" />} label={t.emailCampaigns} transparent />
            <TabBtn active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} icon={<Settings className="w-4 h-4" />} label={t.integrations} transparent />
          </div>
        )}
      </header>

      <div className="max-w-7xl w-full flex flex-col items-center relative transition-all duration-500">
        {activeTab === 'broadcast' && (
          <div className="w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-500">
             <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] mb-4 tracking-tight">Center Broadcasts</h2>
             <p className="text-slate-500 font-medium mb-12 max-w-xl mx-auto">{t.broadcastSub}</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard icon={<Users className="w-10 h-10 text-blue-600" />} title={t.patronMgmt} description={t.patronMgmtDesc} />
                <FeatureCard icon={<MessageSquare className="w-10 h-10 text-blue-600" />} title={t.smsBroadcasts} description={t.smsBroadcastsDesc} />
                <FeatureCard icon={<Volume2 className="w-10 h-10 text-blue-600" />} title={t.ttsAnnouncements} description={t.ttsAnnouncementsDesc} />
             </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="w-full">
            {isComposing ? (
              <EmailComposer lang={lang} segments={segments} emailLanguage={emailLanguage} onCancel={() => setIsComposing(false)} />
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500 bg-white p-12 rounded-[40px] shadow-2xl border border-white/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="bg-blue-50 border-2 border-blue-100 p-4 rounded-3xl shadow-sm">
                       <Mail className="w-8 h-8 text-[#2563EB]" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mb-1 leading-tight">{t.campaignDashboard}</h2>
                      <div className="flex items-center space-x-3">
                        <select 
                          value={emailLanguage} 
                          onChange={(e) => setEmailLanguage(e.target.value as any)}
                          className="bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 rounded-full outline-none cursor-pointer border-0"
                        >
                          <option value="English">Language: EN</option>
                          <option value="French">Language: FR</option>
                        </select>
                        <span className="text-slate-300">|</span>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Strike Zone Communications</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setIsComposing(true)} className="bg-[#2563EB] text-white px-10 py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                    <Plus className="w-5 h-5" />
                    <span>{t.createCampaign}</span>
                  </button>
                </div>

                <div className="bg-slate-50/50 border border-slate-100 rounded-[32px] overflow-hidden overflow-x-auto no-scrollbar shadow-inner">
                  <table className="w-full text-left min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Campaign Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.status}</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Engagement</th>
                        <th className="px-8 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {campaigns.map(camp => (
                        <tr key={camp.id} className="hover:bg-white transition-all group cursor-pointer">
                          <td className="px-8 py-7">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-base group-hover:text-blue-600 transition-colors">{camp.name}</span>
                              <span className="text-[11px] text-slate-400 font-bold italic mt-0.5">{camp.subject}</span>
                            </div>
                          </td>
                          <td className="px-8 py-7">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${camp.status === 'sent' ? 'bg-green-100 text-green-700' : camp.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-8 py-7">
                            <div className="flex items-center space-x-6">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Open Rate</span>
                                <span className="text-sm font-black text-blue-600">{camp.openRate || '0%'}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Click Rate</span>
                                <span className="text-sm font-black text-emerald-600">{camp.clickRate || '0%'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-7 text-right">
                            <button className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-300 group-hover:text-blue-600 group-hover:border-blue-200 transition-all"><ArrowRight className="w-5 h-5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'integrations' && (
           <div className="w-full bg-white rounded-[40px] p-12 shadow-2xl border border-white/50 max-w-2xl text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Settings className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-black mb-4 tracking-tight">{t.integrations}</h1>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">{t.integrationsSub}</p>
              <div className="bg-slate-50/50 p-10 rounded-[40px] border border-slate-100 shadow-inner space-y-8">
                <div className="text-left space-y-4">
                  <div className="flex items-center space-x-3 mb-2 px-1">
                    <Lock className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Credentials</span>
                  </div>
                  <InputGroup label="Google Places API Key" value={googleKey} isEditing onChange={(val) => setGoogleKey(val)} type="password" />
                </div>
                <button onClick={handleSaveKey} className="w-full bg-[#2563EB] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">Save Connection</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

/* --- Optimized Rich Text Email Composer --- */
const EmailComposer: React.FC<{ lang: Language; segments: Segment[]; emailLanguage: 'English' | 'French'; onCancel: () => void }> = ({ lang, segments, emailLanguage, onCancel }) => {
  const t = translations[lang];
  const editorRef = useRef<HTMLDivElement>(null);
  const [audienceType, setAudienceType] = useState<'whole' | 'segments'>('whole');
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('14pt');
  const [currentFontName, setCurrentFontName] = useState('Arial');
  const [currentTextColor, setCurrentTextColor] = useState('#1F2937');
  
  const [campaignData, setCampaignData] = useState({
    internalName: '',
    subjectLine: '',
    preheader: '',
  });

  const [aiModal, setAiModal] = useState({ field: '', label: '', open: false, suggestions: [], loading: false });

  const exec = useCallback((command: string, value: any = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleAiSuggest = async (field: string, label: string) => {
    setAiModal({ field, label, open: true, loading: true, suggestions: [] });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Suggest 3 catchy email ${label} variations for a bowling center named Strike Zone. Context: Marketing promo. Language: ${emailLanguage}. Return JSON array of strings only.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const suggestions = JSON.parse(response.text.match(/\[.*\]/s)?.[0] || '[]');
      setAiModal(prev => ({ ...prev, loading: false, suggestions }));
    } catch (e) {
      setAiModal(prev => ({ ...prev, loading: false, suggestions: ['Perfect Games incoming!', 'Bowl like a pro this weekend', 'Exclusive Strike Zone offer'] }));
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsFontMenuOpen(false);
        setIsSizeMenuOpen(false);
        setIsColorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const COLORS = [
    { name: 'Dark', hex: '#1F2937' },
    { name: 'Strike Blue', hex: '#2563EB' },
    { name: 'Dark Blue', hex: '#1E3A8A' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Orange', hex: '#F59E0B' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Medium Gray', hex: '#4B5563' },
    { name: 'Light Gray', hex: '#9CA3AF' },
    { name: 'White', hex: '#FFFFFF' },
  ];

  return (
    <div className="w-full space-y-10 animate-in slide-in-from-right-8 duration-700 pb-32 relative">
      {/* AI Assistant Modal */}
      {aiModal.open && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#2563EB] p-8 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">AI Assistant</h3>
                </div>
                <button onClick={() => setAiModal({ ...aiModal, open: false })} className="hover:rotate-90 transition-transform"><XCircle className="w-6 h-6" /></button>
              </div>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Generating ideas for: {aiModal.label}</p>
            </div>
            <div className="p-10 space-y-4">
              {aiModal.loading ? (
                <div className="flex flex-col items-center py-10 space-y-4">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Crafting suggestions...</span>
                </div>
              ) : (
                aiModal.suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setCampaignData(prev => ({...prev, [aiModal.field]: s})); setAiModal({ ...aiModal, open: false }); }}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-left font-bold text-slate-700 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                  >
                    <span>{s}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        <div className="lg:col-span-3 space-y-10">
          <section className="bg-white border border-white/50 p-10 md:p-14 rounded-[40px] shadow-2xl space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-8">
                 <ComposeInput label="Campaign Name" placeholder="Internal name" value={campaignData.internalName} onChange={(val) => setCampaignData(p => ({...p, internalName: val}))} onAi={() => handleAiSuggest('internalName', 'Campaign Name')} />
                 <ComposeInput label="Subject Line" placeholder="What they see in inbox" value={campaignData.subjectLine} onChange={(val) => setCampaignData(p => ({...p, subjectLine: val}))} onAi={() => handleAiSuggest('subjectLine', 'Subject Line')} />
                 <ComposeInput label="Preheader Text" placeholder="Brief summary" value={campaignData.preheader} onChange={(val) => setCampaignData(p => ({...p, preheader: val}))} onAi={() => handleAiSuggest('preheader', 'Preheader Text')} />
               </div>
               <div className="bg-blue-600 rounded-[32px] p-10 text-white flex flex-col justify-center text-center shadow-xl shadow-blue-500/20 relative overflow-hidden">
                  <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-6" />
                  <h4 className="text-xl font-black mb-2 italic uppercase tracking-tight">AI Content Engine</h4>
                  <p className="text-[10px] font-bold text-blue-100 mb-8 uppercase tracking-widest opacity-80">Full body generation coming soon</p>
               </div>
            </div>

            <div className="pt-12 border-t border-slate-100">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase">Canvas Designer</h3>
              </div>

              <div className="bg-[#f1f3f4] p-1 rounded-t-[32px] border-x border-t border-slate-200 flex flex-wrap items-center gap-1 shadow-sm overflow-visible">
                
                {/* FONT FAMILY DROPDOWN */}
                <div className="px-1 py-1.5 flex items-center dropdown-container">
                   <div className="relative">
                     <button 
                        onMouseDown={(e) => { e.preventDefault(); setIsSizeMenuOpen(false); setIsColorMenuOpen(false); setIsFontMenuOpen(!isFontMenuOpen); }} 
                        className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-700 font-bold flex items-center gap-2 hover:border-[#2563EB] transition text-xs whitespace-nowrap"
                      >
                       <span>{currentFontName}</span> <ChevronDown className="w-3 h-3" />
                     </button>
                     {isFontMenuOpen && (
                       <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-40 z-[60] animate-in fade-in slide-in-from-top-2">
                          {['Arial', 'Verdana', 'Georgia', 'Helvetica', 'Tahoma'].map(f => (
                            <button 
                                key={f} 
                                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); exec('fontName', f); setCurrentFontName(f); setIsFontMenuOpen(false); editorRef.current?.focus(); }} 
                                className="w-full text-left px-4 py-2 hover:bg-[#DBEAFE] rounded-lg transition text-xs font-bold text-slate-700" style={{ fontFamily: f }}>{f}</button>
                          ))}
                       </div>
                     )}
                   </div>
                </div>

                {/* FONT SIZE DROPDOWN */}
                <div className="px-1 py-1.5 flex items-center dropdown-container">
                   <div className="relative">
                     <button 
                        onMouseDown={(e) => { e.preventDefault(); setIsFontMenuOpen(false); setIsColorMenuOpen(false); setIsSizeMenuOpen(!isSizeMenuOpen); }} 
                        className="px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-700 font-bold flex items-center gap-2 hover:border-[#2563EB] transition text-xs whitespace-nowrap"
                      >
                       <span className="text-[#9CA3AF] uppercase text-[10px] tracking-widest mr-1">Size</span>
                       <span>{currentFontSize}</span> <ChevronDown className="w-3 h-3" />
                     </button>
                     {isSizeMenuOpen && (
                       <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-32 z-[60] animate-in fade-in slide-in-from-top-2">
                          {[
                            { value: '2', label: '12pt' },
                            { value: '3', label: '14pt' },
                            { value: '4', label: '16pt' },
                            { value: '5', label: '18pt' }
                          ].map(size => (
                            <button 
                                key={size.label} 
                                onMouseDown={(e) => { 
                                  e.preventDefault(); 
                                  e.stopPropagation(); 
                                  exec('fontSize', size.value); 
                                  setCurrentFontSize(size.label); 
                                  setIsSizeMenuOpen(false); 
                                  editorRef.current?.focus();
                                }} 
                                className="w-full text-left px-4 py-2 hover:bg-[#DBEAFE] rounded-lg transition text-xs font-bold text-slate-700"
                            >
                              {size.label}
                            </button>
                          ))}
                       </div>
                     )}
                   </div>
                </div>

                {/* TEXT COLOR PICKER */}
                <div className="px-1 py-1.5 flex items-center dropdown-container">
                   <div className="relative">
                     <button 
                        onMouseDown={(e) => { e.preventDefault(); setIsFontMenuOpen(false); setIsSizeMenuOpen(false); setIsColorMenuOpen(!isColorMenuOpen); }} 
                        className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center gap-2 hover:border-[#2563EB] transition relative"
                        title="Text Color"
                      >
                       <Palette className="w-4 h-4 text-slate-600" />
                       <div className="w-4 h-4 rounded-full border border-slate-200 shadow-inner" style={{ backgroundColor: currentTextColor }} />
                       <ChevronDown className="w-3 h-3 text-slate-400" />
                     </button>
                     {isColorMenuOpen && (
                       <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-48 z-[60] animate-in fade-in slide-in-from-top-2">
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Select Color</div>
                          <div className="grid grid-cols-5 gap-2">
                            {COLORS.map(color => (
                              <button 
                                key={color.hex}
                                title={color.name}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  exec('foreColor', color.hex);
                                  setCurrentTextColor(color.hex);
                                  setIsColorMenuOpen(false);
                                  editorRef.current?.focus();
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-125 shadow-sm ${currentTextColor === color.hex ? 'border-[#2563EB] scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color.hex }}
                              />
                            ))}
                            {/* Native Picker Trigger */}
                            <label className="w-6 h-6 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                               <input 
                                 type="color" 
                                 className="sr-only" 
                                 onChange={(e) => {
                                   const val = e.target.value;
                                   exec('foreColor', val);
                                   setCurrentTextColor(val);
                                   setIsColorMenuOpen(false);
                                 }}
                               />
                               <Plus className="w-3 h-3 text-slate-400" />
                            </label>
                          </div>
                       </div>
                     )}
                   </div>
                </div>
                
                <div className="w-px h-6 bg-slate-300 mx-1" />

                <GmailBtn icon={<BoldIcon className="w-4 h-4" />} onMouseDown={() => exec('bold')} />
                <GmailBtn icon={<ItalicIcon className="w-4 h-4" />} onMouseDown={() => exec('italic')} />
                <GmailBtn icon={<UnderlineIcon className="w-4 h-4" />} onMouseDown={() => exec('underline')} />

                <div className="w-px h-6 bg-slate-300 mx-1" />
                
                <GmailBtn icon={<AlignLeft className="w-4 h-4" />} onMouseDown={() => exec('justifyLeft')} />
                <GmailBtn icon={<AlignCenter className="w-4 h-4" />} onMouseDown={() => exec('justifyCenter')} />
                <GmailBtn icon={<AlignRight className="w-4 h-4" />} onMouseDown={() => exec('justifyRight')} />

                <div className="w-px h-6 bg-slate-300 mx-1" />
                
                <GmailBtn icon={<RotateCcw className="w-4 h-4" />} onMouseDown={() => exec('undo')} />
                <GmailBtn icon={<RotateCw className="w-4 h-4" />} onMouseDown={() => exec('redo')} />
              </div>

              <div 
                id="editor"
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="bg-white min-h-[500px] rounded-b-[32px] p-12 outline-none border-x border-b border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-700 leading-relaxed font-medium text-lg overflow-y-auto"
                placeholder="Start typing your masterpiece..."
              />
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-xl space-y-8">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Audience</h3>
            </div>
            <div className="space-y-4">
              <AudienceCard label="Full List" count={1240} active={audienceType === 'whole'} onClick={() => setAudienceType('whole')} desc="All bowling patrons" />
              <AudienceCard label="Targeted" count={342} active={audienceType === 'segments'} onClick={() => setAudienceType('segments')} desc="Specific member segments" />
            </div>
          </section>

          <section className="bg-[#0F172A] p-10 rounded-[40px] shadow-2xl space-y-8 relative overflow-hidden">
             <div className="space-y-4 relative z-10">
               <button className="w-full bg-[#2563EB] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center space-x-3">
                 <Send className="w-4 h-4" />
                 <span>Blast Off</span>
               </button>
               <button onClick={onCancel} className="w-full bg-white/5 border border-white/10 text-slate-400 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">
                 <span>Draft Exit</span>
               </button>
             </div>
             <div className="pt-8 border-t border-white/5 flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-600">
                <Shield className="w-3.5 h-3.5" />
                <span className="italic uppercase tracking-widest">CASL Compliant</span>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* --- Visual Components & Utilities --- */

const GmailBtn: React.FC<{ icon: React.ReactNode; onMouseDown: () => void }> = ({ icon, onMouseDown }) => (
  <button 
    onMouseDown={(e) => { 
      e.preventDefault(); 
      onMouseDown(); 
    }} 
    className="p-2 hover:bg-slate-200 rounded text-slate-600 transition-colors"
  >
    {icon}
  </button>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:border-blue-100 transition-all shadow-sm">
    <div className="mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">{icon}</div>
    <h3 className="text-xl font-black text-[#0F172A] mb-3 leading-tight tracking-tight uppercase italic">{title}</h3>
    <p className="text-slate-400 font-bold text-xs leading-relaxed max-w-[200px]">{description}</p>
  </div>
);

const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; transparent?: boolean }> = ({ active, onClick, icon, label, transparent }) => (
  <button onClick={onClick} className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${active ? 'bg-white text-blue-600 shadow-xl scale-[1.02]' : 'text-white/60 hover:text-white'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const ComposeInput: React.FC<{ label: string; placeholder: string; value: string; onChange: (val: string) => void; onAi?: () => void }> = ({ label, placeholder, value, onChange, onAi }) => (
  <div className="flex flex-col space-y-2.5 w-full">
    <div className="flex items-center justify-between px-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</label>
      {onAi && (
        <button onClick={(e) => { e.preventDefault(); onAi(); }} className="text-blue-600 hover:scale-110 p-1.5 rounded-xl bg-blue-50 transition-all shadow-sm border border-blue-100/30">
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
    <input 
      type="text" value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="w-full p-5 bg-slate-50 border-2 border-slate-100 transition-all shadow-inner outline-none font-bold text-sm text-slate-700 rounded-[20px] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50" 
    />
  </div>
);

const AudienceCard: React.FC<{ label: string; count: number; active: boolean; onClick: () => void; desc: string }> = ({ label, count, active, onClick, desc }) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 rounded-[28px] border-2 transition-all text-left flex items-center justify-between group ${active ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20 text-white' : 'bg-white border-slate-100 text-slate-400 shadow-sm hover:border-slate-200'}`}
  >
    <div className="flex flex-col">
      <span className={`text-xs font-black uppercase tracking-widest mb-1 ${active ? 'text-white' : 'text-slate-800'}`}>{label}</span>
      <span className={`text-[10px] font-bold ${active ? 'text-blue-100' : 'text-slate-400'}`}>{desc}</span>
    </div>
    <div className={`text-right ${active ? 'text-white' : 'text-blue-600'}`}>
      <span className="text-2xl font-black italic leading-none">{count}</span>
    </div>
  </button>
);

const InputGroup: React.FC<{ label: string; value: string; isEditing: boolean; onChange: (val: string) => void; type?: string }> = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="flex flex-col space-y-2.5 text-left">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className={`flex items-center space-x-4 p-5 rounded-[24px] border-2 transition-all ${isEditing ? 'border-blue-500 bg-white ring-4 ring-blue-50 shadow-inner' : 'border-slate-100 bg-slate-50'}`}>
      <input type={type} value={value} disabled={!isEditing} onChange={(e) => onChange(e.target.value)} className="bg-transparent w-full font-bold text-slate-700 outline-none text-sm" placeholder="Enter API Key" />
    </div>
  </div>
);

export default BroadcastCenter;
