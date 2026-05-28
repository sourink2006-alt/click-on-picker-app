import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
];

export default function LanguageScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('en');

  return (
    <div className="onboarding-flow px-6 py-12 flex flex-col">
      <div className="onboarding-card p-4 mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#2FE081] flex items-center justify-center shadow-[0_0_15px_rgba(47,224,129,0.2)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <div>
          <h2 className="text-[13px] font-bold text-white tracking-widest uppercase">Click on Picker</h2>
          <p className="text-[12px] text-[#2FE081]">Picker Onboarding Setup</p>
        </div>
      </div>

      <div className="flex-1">
        <h1 className="onboarding-heading mb-8">Choose your<br/>language</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {LANGUAGES.map(lang => (
            <div 
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`onboarding-card p-5 flex flex-col items-start gap-3 transition-all duration-200 ${selected === lang.code ? 'border-[#2FE081] bg-[rgba(47,224,129,0.05)] shadow-[0_0_20px_rgba(47,224,129,0.1)]' : ''}`}
            >
              <div className="w-full flex justify-end">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === lang.code ? 'border-[#2FE081]' : 'border-[rgba(255,255,255,0.2)]'}`}>
                  {selected === lang.code && <div className="w-2.5 h-2.5 rounded-full bg-[#2FE081]" />}
                </div>
              </div>
              <div>
                <div className={`text-[18px] font-bold mb-1 ${selected === lang.code ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'}`}>{lang.nativeName}</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.4)]">{lang.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button className="onboarding-btn" onClick={() => navigate('/login')}>
          Continue
        </button>
      </div>
    </div>
  );
}
