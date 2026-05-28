import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

const CITIES = [
  { id: 'c1', name: 'Bengaluru', active: true, statusText: 'Hiring active' },
  { id: 'c2', name: 'Mumbai', active: false, statusText: 'More cities coming soon' },
  { id: 'c3', name: 'Delhi NCR', active: false, statusText: 'More cities coming soon' },
  { id: 'c4', name: 'Hyderabad', active: false, statusText: 'More cities coming soon' }
];

export default function CityScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState('');

  const filteredCities = CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="onboarding-flow px-6 py-12 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Select Work City</h1>
        <p className="onboarding-subtext mb-8">Where do you want to work?</p>

        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search city..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="onboarding-input w-full pl-12 pr-4 py-4 text-[16px] font-medium"
          />
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          <div className="px-4 py-2 rounded-full bg-[rgba(47,224,129,0.1)] border border-[rgba(47,224,129,0.2)] text-[#2FE081] text-[13px] font-bold whitespace-nowrap flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
            </svg>
            Use my current location
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredCities.map(city => (
            <div 
              key={city.id}
              onClick={() => city.active && setSelected(city.id)}
              className={`onboarding-card p-5 flex items-center justify-between transition-all duration-200 ${
                city.active ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'
              } ${selected === city.id ? 'border-[#2FE081] bg-[rgba(47,224,129,0.05)] shadow-[0_0_20px_rgba(47,224,129,0.1)]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected === city.id ? 'bg-[#2FE081]' : 'bg-white/5 border border-white/5'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selected === city.id ? '#03110D' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" y1="22" x2="4" y2="15"></line>
                  </svg>
                </div>
                <div>
                  <div className={`text-[16px] font-bold ${selected === city.id ? 'text-white' : 'text-[rgba(255,255,255,0.8)]'}`}>{city.name}</div>
                  <div className="text-[12px] text-[rgba(255,255,255,0.4)] mt-0.5">{city.statusText}</div>
                </div>
              </div>
              {city.active ? (
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected === city.id ? 'border-[#2FE081]' : 'border-[rgba(255,255,255,0.2)]'}`}>
                  {selected === city.id && <div className="w-3 h-3 rounded-full bg-[#2FE081]" />}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/5 border border-transparent flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn" 
          disabled={!selected}
          onClick={() => navigate('/hub')}
        >
          Confirm City
        </button>
      </div>
    </div>
  );
}
