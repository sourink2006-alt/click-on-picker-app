import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

export default function PermissionsScreen() {
  const navigate = useNavigate();

  const handleGrant = () => {
    navigate('/city');
  };

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
      {/* Header/Back Button */}
      <div className="flex justify-between items-center mb-8">
        <div 
          className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center" 
          onClick={() => navigate(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <button onClick={handleGrant} className="text-[14px] font-bold text-[rgba(255,255,255,0.5)] pr-2">
          Skip for now
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Enable Permissions</h1>
        <p className="onboarding-subtext mb-8">We need camera and location access to verify your account.</p>

        <div className="onboarding-card p-6 flex flex-col gap-6 relative overflow-hidden">
          {/* Permission item 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="3"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-1">Location Access</h3>
              <p className="text-[12px] text-[rgba(255,255,255,0.45)] leading-relaxed">Required to identify nearest warehouse hub and assign orders in your local area.</p>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Permission item 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-1">Camera Access</h3>
              <p className="text-[12px] text-[rgba(255,255,255,0.45)] leading-relaxed">Used to perform face verification selfie capture when logging online to secure your account.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          onClick={handleGrant}
          className="onboarding-btn"
        >
          Grant Permissions
        </button>
      </div>
    </div>
  );
}
