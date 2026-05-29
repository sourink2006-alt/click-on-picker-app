import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

export default function BankVerificationSubmittedScreen() {
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem('picker_kyc_current_step', 'selfie');
    navigate('/selfie-guide');
  };

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
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
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Animated Success check */}
        <div className="w-16 h-16 rounded-full bg-[#2FE081]/15 border border-[#2FE081]/35 flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="4">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        <h1 className="onboarding-heading text-center mb-2">Bank Verification Submitted</h1>
        <p className="onboarding-subtext text-center mb-8 max-w-[260px] mx-auto">Your bank details have been submitted for verification.</p>

        {/* Status Card */}
        <div className="onboarding-card w-full p-5 space-y-4">
          <div className="flex justify-between items-center text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">Verification Status</span>
            <span className="font-extrabold text-[#FF9F43] bg-[#FF9F43]/15 px-2.5 py-0.5 rounded border border-[#FF9F43]/20 uppercase tracking-wide text-[10px]">
              In Progress
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between items-center text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">Estimated Time</span>
            <span className="text-white font-bold">24–48 Hours</span>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          onClick={handleComplete}
          className="onboarding-btn"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
