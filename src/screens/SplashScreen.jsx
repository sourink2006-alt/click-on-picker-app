import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(t); 
          setTimeout(() => navigate('/language'), 400); 
          return 100; 
        }
        return p + 2;
      });
    }, 30);
    return () => clearInterval(t);
  }, [navigate]);

  return (
    <div className="onboarding-flow items-center justify-center relative">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-[24px] bg-[#2FE081] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(47,224,129,0.3)]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h1 className="text-[32px] font-bold text-white tracking-tight font-['Quicksand']">click on</h1>
        <p className="text-[13px] text-[#2FE081] mt-1 font-semibold tracking-[0.2em] uppercase">Picker Partner</p>
      </div>

      <div className="absolute bottom-12 w-full px-12 flex flex-col items-center">
        <p className="text-[12px] text-[rgba(255,255,255,0.55)] font-medium mb-4">Preparing your picker dashboard...</p>
        <div className="w-48 h-1 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
          <div className="h-full bg-[#2FE081] rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(47,224,129,0.5)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
