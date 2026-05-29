import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';

export default function AadhaarScreen() {
  const navigate = useNavigate();
  const [aadhaar, setAadhaar] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);

  const handleSendOtp = () => {
    if (aadhaar.length === 12) setOtpSent(true);
  };

  const isFormValid = otpSent && otp.length === 6 && consent;

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <button 
          onClick={() => {
            localStorage.setItem('picker_kyc_current_step', 'pan');
            navigate('/pan-verification');
          }} 
          className="text-[14px] font-bold text-[rgba(255,255,255,0.5)] pr-2"
        >
          Skip for now
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Verify Aadhaar</h1>
        <p className="onboarding-subtext mb-8">Fast and secure verification.</p>

        <div className="onboarding-card p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[rgba(47,224,129,0.1)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span className="text-[13px] font-bold text-[#2FE081] tracking-wide uppercase">Govt. Verified</span>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] mb-2 block uppercase tracking-wide">Aadhaar Number</label>
            <div className="relative">
              <input 
                type="tel" 
                maxLength={12}
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                placeholder="12-digit UID" 
                className="onboarding-input w-full px-4 py-4 pr-24 text-[16px] font-semibold tracking-[0.2em]"
                disabled={otpSent}
              />
              {!otpSent && (
                <button 
                  onClick={handleSendOtp}
                  disabled={aadhaar.length !== 12}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-bold ${aadhaar.length === 12 ? 'text-[#2FE081]' : 'text-[rgba(255,255,255,0.3)]'}`}
                >
                  Send OTP
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <div>
              <label className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] mb-2 block uppercase tracking-wide">Enter OTP</label>
              <input 
                type="tel" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code" 
                className="onboarding-input w-full px-4 py-4 text-[16px] font-semibold tracking-[0.2em] text-center"
              />
            </div>
          )}

          <div className="mt-2 flex items-start gap-3">
            <div 
              onClick={() => setConsent(!consent)}
              className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${consent ? 'bg-[#2FE081] border-[#2FE081]' : 'border-[rgba(255,255,255,0.3)]'}`}
            >
              {consent && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <p className="text-[12px] text-[rgba(255,255,255,0.4)] leading-relaxed">
              I consent to sharing my Aadhaar details for e-KYC verification purposes only.
            </p>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn" 
          disabled={!isFormValid}
          onClick={() => {
            localStorage.setItem('picker_kyc_current_step', 'pan');
            navigate('/pan-verification');
          }}
        >
          Verify Aadhaar
        </button>
      </div>
    </div>
  );
}
