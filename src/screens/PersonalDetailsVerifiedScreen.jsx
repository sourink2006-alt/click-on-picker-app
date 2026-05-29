import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';
import useStore from '../store/useStore';

export default function PersonalDetailsVerifiedScreen() {
  const navigate = useNavigate();
  const { picker } = useStore();
  
  const maskedAadhaar = picker.aadhaar 
    ? 'XXXX XXXX ' + picker.aadhaar.slice(-4) 
    : 'XXXX XXXX 7842';

  const handleNext = () => {
    localStorage.setItem('picker_kyc_current_step', 'bank');
    navigate('/bank-details');
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

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Personal Details Verified</h1>
        <p className="onboarding-subtext mb-8">Your KYC is completed and Aadhaar is securely linked.</p>

        <div className="flex flex-col gap-4">
          {/* Success Card 1 */}
          <div className="onboarding-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-0.5">KYC Verification Success</h3>
              <p className="text-[12px] text-[rgba(255,255,255,0.5)]">✔ Aadhaar Verified &nbsp;&nbsp; ✔ PAN Verified</p>
            </div>
          </div>

          {/* Success Card 2 */}
          <div className="onboarding-card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[14px] font-bold text-white mb-0.5">Aadhaar Linked</h3>
              <p className="text-[12px] text-white/70 font-mono tracking-widest mt-1">{maskedAadhaar}</p>
              <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-1.5">Linked to Click On Partner account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          onClick={handleNext}
          className="onboarding-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
