
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, User, Mail, Calendar, MapPin, Target, Hand, Weight, Trophy, Shield, Edit3, Save, X, Check, Trash2, Globe, Bell, Zap, Package, MessageSquare, LogOut, Camera, Grid, AlertCircle, Info, ChevronDown, Search } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface ProfileProps {
  lang: Language;
  onBack: () => void;
  pinPreference: string;
  onUpdatePreference: (pref: string) => void;
  onLogout: () => void;
}

interface Equipment {
  id: string;
  name: string;
  weight: string;
  surface: string;
  gameCount: number;
  type: '5-pin' | '10-pin';
}

interface ProfileData {
  fullName: string;
  nickname: string;
  email: string;
  dob: string;
  city: string;
  province: string;
  pinPreference: string;
  ballWeight: string;
  leagueAverage: string;
  highSeries: string;
  dominantHand: string;
  bowlingStyle: string;
  playerType: 'Casual' | 'League' | 'Youth';
  equipment: Equipment[];
  bowlingCenters: string[];
  emailMarketing: boolean;
  smsMarketing: boolean;
  inAppNotifications: boolean;
  publicProfile: boolean;
  avatar: string | null;
}

const STORAGE_KEY = 'strikezone_profile_data';

const KID_AVATARS = [
  { id: 'r1', url: 'https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r2', url: 'https://images.unsplash.com/photo-1517677129300-07b130802f46?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r3', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r4', url: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r5', url: 'https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r6', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r7', url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r8', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r9', url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r10', url: 'https://images.unsplash.com/photo-1475823678248-624fc6f85785?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r11', url: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=300&h=300&auto=format&fit=crop' },
  { id: 'r12', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&auto=format&fit=crop' }
];

const CANADIAN_CITY_MAP: Record<string, string> = {
  "Toronto": "Ontario", "Mississauga": "Ontario", "Ottawa": "Ontario", "Hamilton": "Ontario",
  "Montreal": "Quebec", "Quebec City": "Quebec", "Laval": "Quebec",
  "Vancouver": "British Columbia", "Victoria": "British Columbia", "Surrey": "British Columbia",
  "Calgary": "Alberta", "Edmonton": "Alberta", "Red Deer": "Alberta",
  "Winnipeg": "Manitoba", "Regina": "Saskatchewan", "Saskatoon": "Saskatchewan",
  "Halifax": "Nova Scotia", "Fredericton": "New Brunswick", "St. John's": "Newfoundland and Labrador"
};

const Profile: React.FC<ProfileProps> = ({ lang, onBack, pinPreference, onUpdatePreference, onLogout }) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error("Error parsing profile data", e); }
    }
    return {
      fullName: 'John Doe',
      nickname: 'StrikeMaster',
      email: 'john.doe@bowler.ca',
      dob: '06/15/1990',
      city: 'Toronto',
      province: 'Ontario',
      pinPreference: pinPreference,
      ballWeight: '15 lbs',
      leagueAverage: '185',
      highSeries: '654',
      dominantHand: 'Right',
      bowlingStyle: 'Tweener',
      playerType: 'League',
      equipment: [
        { id: '1', name: 'Storm Phaze II', weight: '15 lbs', surface: 'Reactive', gameCount: 42, type: '10-pin' },
        { id: '2', name: 'Hammer Black Widow', weight: '15 lbs', surface: 'Urethane', gameCount: 12, type: '10-pin' },
        { id: '3', name: 'Classic Rubber Pro', weight: '3 lbs 8 oz', surface: 'Rubber', gameCount: 88, type: '5-pin' }
      ],
      bowlingCenters: ['Splitsville Entertainment', 'Playdium Mississauga'],
      emailMarketing: true,
      smsMarketing: false,
      inAppNotifications: true,
      publicProfile: true,
      avatar: null,
    };
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [draftData, setDraftData] = useState<ProfileData | null>(null);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [showAvatarGallery, setShowAvatarGallery] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [citySearch, setCitySearch] = useState('');
  const [isCitySearching, setIsCitySearching] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    window.dispatchEvent(new Event('storage'));
  }, [profileData]);

  const capitalizeWords = (str: string) => str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const validateDateOfBirth = (val: string): string => {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = val.match(dateRegex);
    if (!match) return "Use MM/DD/YYYY format.";
    
    const m = parseInt(match[1]);
    const d = parseInt(match[2]);
    const y = parseInt(match[3]);
    
    if (m < 1 || m > 12) return "Month invalid (01-12).";
    if (d < 1 || d > 31) return "Day invalid (01-31).";
    
    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1 || date.getDate() !== d) return "Invalid calendar date.";

    const currentYear = new Date().getFullYear();
    if (y > currentYear - 3) return `Min age 3 (${currentYear - 3}).`;
    if (y < currentYear - 90) return `Max age 90 (${currentYear - 90}).`;
    
    return "";
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? "Full name required." : "";
      case 'nickname':
        return !value.trim() ? "Nickname required." : "";
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required.";
        if (value.includes(' ')) return "No spaces allowed.";
        if (!emailRegex.test(value)) return "Invalid email format.";
        return "";
      case 'dob':
        return validateDateOfBirth(value);
      case 'city':
        return !value.trim() ? "City is required." : "";
      default:
        return "";
    }
  };

  const handleBlur = (fieldName: string, value: string) => {
    const error = validateField(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const startEditing = (sectionId: string) => {
    setEditingSection(sectionId);
    setDraftData({ ...profileData });
    if (sectionId === 'basic') {
      setCitySearch(profileData.city);
    }
    setFieldErrors({});
  };

  const saveEditing = () => {
    if (draftData) {
      const newErrors: Record<string, string> = {};
      let hasError = false;

      // Re-validate all relevant fields for the section before saving
      if (editingSection === 'basic') {
        ['fullName', 'nickname', 'email', 'dob', 'city'].forEach(f => {
          const err = validateField(f, (draftData as any)[f]);
          if (err) {
            newErrors[f] = err;
            hasError = true;
          }
        });
      }

      if (hasError) {
        setFieldErrors(newErrors);
        return;
      }

      setProfileData(draftData);
      if (editingSection === 'specifics') onUpdatePreference(draftData.pinPreference);
    }
    setEditingSection(null);
    setDraftData(null);
    setFieldErrors({});
  };

  const currentData = editingSection ? (draftData || profileData) : profileData;
  const TEN_PIN_WEIGHTS = ["6 lbs", "7 lbs", "8 lbs", "9 lbs", "10 lbs", "11 lbs", "12 lbs", "13 lbs", "14 lbs", "15 lbs", "16 lbs"];
  const FIVE_PIN_WEIGHTS = ["3 lbs 4 oz", "3 lbs 6 oz", "3 lbs 8 oz", "3 lbs 10 oz", "3 lbs 12 oz"];

  const filteredCities = Object.keys(CANADIAN_CITY_MAP).filter(city => 
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const selectCity = (city: string) => {
    setDraftData(prev => prev ? ({ ...prev, city, province: CANADIAN_CITY_MAP[city] }) : null);
    setCitySearch(city);
    setFieldErrors(prev => ({ ...prev, city: "" }));
  };

  return (
    <div className="min-h-[calc(100vh-110px)] bg-[#BFDBFE] flex flex-col p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-y-auto no-scrollbar pb-32">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 text-slate-600 font-bold hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
          <button onClick={onLogout} className="text-red-600 font-black text-xs uppercase tracking-widest flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-red-50 shadow-sm">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Identity Header */}
        <div className="bg-white/80 rounded-[40px] p-8 md:p-12 border border-white shadow-2xl shadow-blue-900/5 relative overflow-hidden flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col items-center space-y-4">
            <div className={`relative group cursor-pointer transition-all duration-500 ${tempAvatar ? 'ring-4 ring-offset-4 ring-[#2563EB]' : ''}`}>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center group relative z-10">
                {(tempAvatar || profileData.avatar) ? (
                  <img src={tempAvatar || profileData.avatar || ''} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                {!tempAvatar && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white space-y-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 hover:text-blue-400 font-black text-[10px] uppercase">
                      <Camera className="w-5 h-5" /><span>Upload</span>
                    </button>
                    <button onClick={() => setShowAvatarGallery(!showAvatarGallery)} className="flex items-center space-x-2 hover:text-orange-400 font-black text-[10px] uppercase">
                      <Grid className="w-5 h-5" /><span>AVATAR</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-center md:text-left flex-grow relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] tracking-tighter mb-2">{profileData.fullName}</h1>
            <p className="text-blue-600 font-black text-2xl italic tracking-tight mb-4">"{profileData.nickname}"</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-slate-400 font-bold text-sm">
               <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-slate-300" />{profileData.city}, {profileData.province}</div>
               <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-slate-300" />Member Since 2024</div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {showAvatarGallery && (
          <div className="bg-white rounded-[32px] p-8 border border-white shadow-xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Select Avatar</h3>
              <button onClick={() => setShowAvatarGallery(false)} className="text-slate-400 hover:text-red-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
              {KID_AVATARS.map(avatar => (
                <button key={avatar.id} onClick={() => { setProfileData(p => ({...p, avatar: avatar.url})); setShowAvatarGallery(false); }} className={`w-full aspect-square rounded-[24px] bg-slate-50 border-4 transition-all p-1 overflow-hidden flex items-center justify-center border-slate-100 hover:border-blue-200 shadow-sm`}>
                  <img src={avatar.url} alt="Kid Avatar" className="w-full h-full object-cover rounded-[18px]" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Basic Information */}
           <Section title={t.basicInfo} icon={<User className="w-5 h-5" />} isEditing={editingSection === 'basic'} onEdit={() => startEditing('basic')} onSave={saveEditing} onCancel={() => setEditingSection(null)} lang={lang}>
             <div className="space-y-6">
                <InputGroup 
                  label={t.firstLastName} 
                  icon={<User className="w-4 h-4" />} 
                  value={currentData.fullName} 
                  isEditing={editingSection === 'basic'} 
                  onChange={(val) => setDraftData(p => p ? ({ ...p, fullName: capitalizeWords(val) }) : null)} 
                  onBlur={() => handleBlur('fullName', currentData.fullName)}
                  error={fieldErrors.fullName}
                />
                <InputGroup 
                  label={t.nicknameDisplay} 
                  icon={<Edit3 className="w-4 h-4" />} 
                  value={currentData.nickname} 
                  isEditing={editingSection === 'basic'} 
                  onChange={(val) => setDraftData(p => p ? ({ ...p, nickname: capitalizeWords(val) }) : null)} 
                  onBlur={() => handleBlur('nickname', currentData.nickname)}
                  error={fieldErrors.nickname}
                />
                <InputGroup 
                  label={t.email} 
                  icon={<Mail className="w-4 h-4" />} 
                  value={currentData.email} 
                  isEditing={editingSection === 'basic'} 
                  onChange={(val) => setDraftData(p => p ? ({ ...p, email: val.replace(/\s/g, '') }) : null)} 
                  onBlur={() => handleBlur('email', currentData.email)}
                  error={fieldErrors.email}
                  type="email" 
                />
                <InputGroup 
                  label={t.dateOfBirth} 
                  icon={<Calendar className="w-4 h-4" />} 
                  value={currentData.dob} 
                  isEditing={editingSection === 'basic'} 
                  onChange={(val) => setDraftData(p => p ? ({ ...p, dob: val }) : null)} 
                  onBlur={() => handleBlur('dob', currentData.dob)}
                  error={fieldErrors.dob}
                  placeholder="MM/DD/YYYY"
                />
                
                {/* City Lookup Mock */}
                <div className="flex flex-col space-y-1.5 relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">City (Google Places Search)</label>
                  <div className={`flex items-center space-x-3.5 p-4 rounded-2xl border-2 transition-all ${editingSection === 'basic' ? 'border-[#2563EB] bg-white ring-4 ring-blue-50 shadow-inner' : 'border-slate-100 bg-slate-50'} ${fieldErrors.city ? 'border-red-500' : ''}`}>
                    <MapPin className="text-[#2563EB] w-4 h-4 opacity-60" />
                    <input 
                      disabled={editingSection !== 'basic'} 
                      value={editingSection === 'basic' ? citySearch : currentData.city} 
                      onChange={(e) => { setCitySearch(e.target.value); setIsCitySearching(true); }}
                      onBlur={() => handleBlur('city', currentData.city)}
                      className="bg-transparent w-full font-bold text-slate-700 outline-none text-sm"
                      placeholder="Start typing your city..."
                    />
                  </div>
                  {fieldErrors.city && <span className="text-red-500 text-[10px] font-bold px-1 animate-in slide-in-from-top-1">{fieldErrors.city}</span>}
                  {editingSection === 'basic' && citySearch.length > 1 && isCitySearching && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto no-scrollbar">
                      {filteredCities.map(city => (
                        <button key={city} onClick={() => { selectCity(city); setIsCitySearching(false); }} className="w-full px-5 py-3 text-left hover:bg-blue-50 font-bold text-slate-700 transition-colors border-b border-slate-50 last:border-0">{city}, {CANADIAN_CITY_MAP[city]}</button>
                      ))}
                    </div>
                  )}
                </div>

                <InputGroup label={t.province} icon={<Globe className="w-4 h-4" />} value={currentData.province} isEditing={false} onChange={() => {}} />
             </div>
           </Section>

           {/* Bowling Specifics */}
           <Section title={t.bowlingSpecifics} icon={<Target className="w-5 h-5" />} isEditing={editingSection === 'specifics'} onEdit={() => startEditing('specifics')} onSave={saveEditing} onCancel={() => setEditingSection(null)} lang={lang}>
             <div className="space-y-6">
                <SelectGroup label={t.pinPreference} icon={<Target className="w-4 h-4" />} value={currentData.pinPreference} options={['5-Pin', '10-Pin']} isEditing={editingSection === 'specifics'} onChange={(val) => setDraftData(p => p ? ({ ...p, pinPreference: val, ballWeight: val === '5-Pin' ? '3 lbs 8 oz' : '15 lbs' }) : null)} />
                <SelectGroup label={t.dominantHand} icon={<Hand className="w-4 h-4" />} value={currentData.dominantHand} options={['Right', 'Left']} isEditing={editingSection === 'specifics'} onChange={(val) => setDraftData(p => p ? ({ ...p, dominantHand: val }) : null)} />
                <div className="grid grid-cols-2 gap-4">
                  <SelectGroup label={t.ballWeight} icon={<Weight className="w-4 h-4" />} value={currentData.ballWeight} options={currentData.pinPreference === '5-Pin' ? FIVE_PIN_WEIGHTS : TEN_PIN_WEIGHTS} isEditing={editingSection === 'specifics'} onChange={(val) => setDraftData(p => p ? ({ ...p, ballWeight: val }) : null)} />
                  <InputGroup label="OFFICIAL LEAGUE AVG" icon={<Trophy className="w-4 h-4" />} value={currentData.leagueAverage} isEditing={editingSection === 'specifics'} onChange={(val) => setDraftData(p => p ? ({ ...p, leagueAverage: val }) : null)} />
                </div>
                <InputGroup label="Personal High Series" icon={<Zap className="w-4 h-4" />} value={currentData.highSeries} isEditing={editingSection === 'specifics'} onChange={(val) => setDraftData(p => p ? ({ ...p, highSeries: val }) : null)} />
                
                {/* Dynamic Bowling Math Notice */}
                <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex flex-col space-y-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{currentData.pinPreference} Standard Bowling Math</span>
                    <p className="text-[10px] font-bold text-blue-600/70 leading-relaxed italic">
                      {currentData.pinPreference === '5-Pin' ? (
                        "That “standard bowling math” for average and handicap is the same idea for both 5‑pin and 10‑pin, but it is applied within each game type separately. Total pinfall ÷ total games. O5PBA/YBC use certified 5-pin play only. Disciplines are never mixed."
                      ) : (
                        "Certified bodies apply the standard formula (Total Pinfall ÷ Games) to 10-pin scores only, maintaining their own books or databases. Each discipline has its own certified average and handicap calculations."
                      )}
                    </p>
                  </div>
                </div>
             </div>
           </Section>
        </div>

        {/* Equipment Card Filtered by Context */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title={`Equipment Bag (${currentData.pinPreference})`} icon={<Package className="w-5 h-5" />} isEditing={editingSection === 'equipment'} onEdit={() => startEditing('equipment')} onSave={saveEditing} onCancel={() => setEditingSection(null)} lang={lang}>
             <div className="space-y-4">
                {currentData.equipment
                  .filter(e => currentData.pinPreference === '5-Pin' ? e.type === '5-pin' : e.type === '10-pin')
                  .map((ball) => (
                    <div key={ball.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[24px] hover:bg-white hover:border-blue-100 transition-all group shadow-sm">
                      <div className="flex items-center space-x-5">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full shadow-lg group-hover:scale-110 transition-transform" />
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">{ball.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ball.weight} • {ball.surface}</p>
                        </div>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lifetime Games</span>
                        <span className="text-lg font-black text-slate-800">{ball.gameCount}</span>
                      </div>
                    </div>
                  ))
                }
                {editingSection === 'equipment' && (
                  <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[24px] text-slate-400 font-black text-xs uppercase tracking-[0.1em] hover:border-[#2563EB] hover:text-[#2563EB] transition-all bg-white">
                    + Add New {currentData.pinPreference} Ball
                  </button>
                )}
             </div>
          </Section>

          <Section title={t.privacyConsent} icon={<Shield className="w-5 h-5" />} isEditing={editingSection === 'privacy'} onEdit={() => startEditing('privacy')} onSave={saveEditing} onCancel={() => setEditingSection(null)} lang={lang}>
             <div className="space-y-5">
                <ToggleItem label={t.publicProfile} description={t.publicProfileDesc} icon={<Globe className="w-5 h-5" />} checked={currentData.publicProfile} isEditing={editingSection === 'privacy'} onToggle={(checked) => setDraftData(prev => prev ? ({ ...prev, publicProfile: checked }) : null)} />
                <ToggleItem label={t.emailMarketing} description={t.emailMarketingDesc} icon={<Mail className="w-5 h-5" />} checked={currentData.emailMarketing} isEditing={editingSection === 'privacy'} onToggle={(checked) => setDraftData(prev => prev ? ({ ...prev, emailMarketing: checked }) : null)} />
                <ToggleItem label={t.smsMarketing} description={t.smsMarketingDesc} icon={<MessageSquare className="w-5 h-5" />} checked={currentData.smsMarketing} isEditing={editingSection === 'privacy'} onToggle={(checked) => setDraftData(prev => prev ? ({ ...prev, smsMarketing: checked }) : null)} />
                <ToggleItem label={t.inAppNotifications} description={t.inAppNotificationsDesc} icon={<Bell className="w-5 h-5" />} checked={currentData.inAppNotifications} isEditing={editingSection === 'privacy'} onToggle={(checked) => setDraftData(prev => prev ? ({ ...prev, inAppNotifications: checked }) : null)} />
             </div>
          </Section>
        </div>

      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isEditing: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void; lang: Language; }> = ({ title, icon, children, isEditing, onEdit, onSave, onCancel, lang }) => {
  const t = translations[lang];
  return (
    <div className="bg-white rounded-[32px] border border-white shadow-xl overflow-hidden flex flex-col h-full animate-in fade-in duration-500">
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-2xl text-[#2563EB] shadow-sm">{icon}</div>
          <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter">{title}</h3>
        </div>
        <div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button onClick={onSave} className="bg-green-600 text-white p-3 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-90" title={t.save}><Check className="w-5 h-5" /></button>
              <button onClick={onCancel} className="bg-slate-100 text-slate-400 p-3 rounded-xl hover:bg-slate-200 transition-all active:scale-90" title={t.cancel}><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <button onClick={onEdit} className="text-[#2563EB] bg-blue-50 p-3 rounded-xl hover:bg-blue-100 transition-all active:scale-90 shadow-sm" title={t.editProfile}><Edit3 className="w-5 h-5" /></button>
          )}
        </div>
      </div>
      <div className="p-8 flex-grow">{children}</div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string; icon?: React.ReactNode; value: string; isEditing: boolean; onChange: (val: string) => void; onBlur?: () => void; error?: string; type?: string; placeholder?: string }> = ({ label, icon, value, isEditing, onChange, onBlur, error, type = "text", placeholder }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className={`flex items-center space-x-3.5 p-4 rounded-2xl border-2 transition-all ${isEditing ? 'border-[#2563EB] bg-white ring-4 ring-blue-50 shadow-inner' : 'border-slate-100 bg-slate-50'} ${error ? 'border-red-500 ring-red-50' : ''}`}>
      {icon && <div className={`transition-colors ${error ? 'text-red-500' : 'text-[#2563EB] opacity-60'}`}>{icon}</div>}
      <input 
        type={type}
        value={value} 
        disabled={!isEditing} 
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="bg-transparent w-full font-bold text-slate-700 outline-none text-sm"
      />
    </div>
    {error && <span className="text-red-500 text-[10px] font-bold px-1 animate-in slide-in-from-top-1">{error}</span>}
  </div>
);

const SelectGroup: React.FC<{ label: string; icon?: React.ReactNode; value: string; options: string[]; isEditing: boolean; onChange: (val: string) => void }> = ({ label, icon, value, options, isEditing, onChange }) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className={`p-4 rounded-2xl border-2 transition-all flex items-center space-x-3.5 ${isEditing ? 'border-[#2563EB] bg-white ring-4 ring-blue-50 shadow-inner' : 'border-slate-100 bg-slate-50'}`}>
      {icon && <div className="text-[#2563EB] opacity-60">{icon}</div>}
      {isEditing ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-sm appearance-none">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <div className="font-bold text-slate-700 text-sm">{value}</div>
      )}
      {isEditing && <ChevronDown className="w-4 h-4 text-slate-400" />}
    </div>
  </div>
);

const ToggleItem: React.FC<{ label: string; description: string; icon: React.ReactNode; checked: boolean; isEditing: boolean; onToggle: (val: boolean) => void }> = ({ label, description, icon, checked, isEditing, onToggle }) => (
  <div className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all ${isEditing ? 'border-blue-100 bg-blue-50/10 cursor-pointer shadow-sm' : 'border-slate-50 bg-slate-50/50'}`} onClick={() => isEditing && onToggle(!checked)}>
    <div className="flex items-center space-x-4">
      <div className="text-[#2563EB] bg-white p-2.5 rounded-xl shadow-sm border border-blue-50">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm font-black text-slate-800">{label}</span>
        <span className="text-[10px] font-bold text-slate-400 leading-tight">{description}</span>
      </div>
    </div>
    <div className={`w-12 h-6.5 rounded-full transition-all relative p-1 ${checked ? 'bg-[#2563EB] shadow-lg shadow-blue-200' : 'bg-slate-300'}`}>
      <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all ${checked ? 'translate-x-5.5' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default Profile;
