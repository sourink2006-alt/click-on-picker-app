import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

export default function SelfieGuideScreen() {
  const navigate = useNavigate();

  return (
    <div className="onboarding-flow px-6 py-12 flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6" onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Selfie Verification</h1>
        <p className="onboarding-subtext mb-8">We need a clear photo of your face.</p>

        <div className="onboarding-card p-6 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-4 border-b border-[rgba(255,255,255,0.1)] pb-8">
            <div className="w-24 h-24 rounded-full bg-[rgba(47,224,129,0.1)] border-4 border-[#2FE081] flex items-center justify-center relative overflow-hidden">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#2FE081] rounded-tl-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="translate-x-1 translate-y-1">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-[16px] font-bold text-white mb-1">Good Lighting & Clear Face</h3>
              <p className="text-[13px] text-[rgba(255,255,255,0.5)]">Make sure your face is clearly visible</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5 flex items-center justify-center relative">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="12" r="3" />
                  <path d="M9 12h6" />
                  <path d="M3 12c0-3 1.5-5 3-5M21 12c0-3-1.5-5-3-5" />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="#FF5252" strokeWidth="2.2" />
                </svg>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5252] border-2 border-[#03110D] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </div>
              <p className="text-[12px] font-bold text-[rgba(255,255,255,0.5)]">No Glasses</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-white/5 flex items-center justify-center relative">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="8" width="16" height="8" rx="2" />
                  <line x1="4" y1="11" x2="20" y2="11" />
                  <line x1="4" y1="13" x2="20" y2="13" />
                  <path d="M4 10c-2 0-3 1-3 2s1 2 3 2M20 10c2 0 3 1 3 2s-1 2-3 2" />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="#FF5252" strokeWidth="2.2" />
                </svg>
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF5252] border-2 border-[#03110D] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              </div>
              <p className="text-[12px] font-bold text-[rgba(255,255,255,0.5)]">No Masks/Caps</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn flex gap-3" 
          onClick={() => navigate('/live-selfie')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          Take Selfie
        </button>
      </div>
    </div>
  );
}
