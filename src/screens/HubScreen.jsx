import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';
import useStore from '../store/useStore';


export default function HubScreen() {
  const navigate = useNavigate();
  const { picker, updatePicker } = useStore();
  const [selected, setSelected] = useState(picker.warehouse ? 'h1' : '');
  const [search, setSearch] = useState('');

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>

        <h1 className="onboarding-heading mb-2">Select Hub</h1>
        <p className="onboarding-subtext mb-8">Choose your primary warehouse.</p>

        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search hubs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="onboarding-input w-full pl-12 pr-4 py-4 text-[16px] font-medium"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div 
            onClick={() => setSelected('h1')}
            className={`onboarding-card p-5 relative overflow-hidden transition-all duration-200 cursor-pointer ${selected === 'h1' ? 'border-[#2FE081] bg-[rgba(47,224,129,0.05)] shadow-[0_0_20px_rgba(47,224,129,0.1)]' : ''}`}
          >
            <div className="absolute top-0 right-0 bg-[#2FE081] text-[#03110D] text-[10px] font-extrabold px-3 py-1.5 rounded-bl-xl tracking-wider">
              RECOMMENDED
            </div>
            <div className="flex items-start justify-between mt-2">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-xl mt-1 flex-shrink-0 flex items-center justify-center ${selected === 'h1' ? 'bg-[#2FE081]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={selected === 'h1' ? '#03110D' : 'rgba(255,255,255,0.5)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className={`text-[18px] font-bold ${selected === 'h1' ? 'text-white' : 'text-[rgba(255,255,255,0.9)]'}`}>Koramangala Hub</h3>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <span className="text-[12px] font-bold text-[#2FE081] bg-[rgba(47,224,129,0.1)] px-2 py-0.5 rounded">2.4 km away</span>
                    <span className="text-[12px] text-[rgba(255,255,255,0.4)]">•</span>
                    <span className="text-[12px] text-[rgba(255,255,255,0.6)]">High volume</span>
                  </div>
                  <p className="text-[13px] text-[rgba(255,255,255,0.5)] leading-relaxed pr-6">
                    80 Feet Rd, 4th Block, Koramangala, Bengaluru, Karnataka 560034
                  </p>
                </div>
              </div>
              <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center mt-3 ${selected === 'h1' ? 'border-[#2FE081]' : 'border-[rgba(255,255,255,0.2)]'}`}>
                {selected === 'h1' && <div className="w-3 h-3 rounded-full bg-[#2FE081]" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn" 
          disabled={!selected}
          onClick={() => {
            if (selected === 'h1') {
              updatePicker({ warehouse: 'Dark Store #07 - Koramangala' });
            }
            navigate('/aadhaar');
          }}
        >
          Confirm Hub
        </button>
      </div>
    </div>
  );
}
