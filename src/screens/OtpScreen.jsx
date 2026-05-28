import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function OtpScreen() {
  const navigate = useNavigate();
  const { phoneNumber } = useStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [whatsapp, setWhatsapp] = useState(true);
  const [timer, setTimer] = useState(30);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const isFormValid = otp.every(d => d !== '');

  const handleVerify = () => {
    if (isFormValid) navigate('/city');
  };

  return (
    <div className="onboarding-flow px-6 py-12 flex flex-col">
      <div className="flex-1">
        <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        
        <h1 className="onboarding-heading mb-2">Verify Details</h1>
        <p className="onboarding-subtext mb-10">
          Code sent to +91 {phoneNumber || 'XXXXXXXXXX'}
        </p>

        <div className="onboarding-card p-6 flex flex-col items-center gap-6">
          <div className="flex gap-2 w-full justify-between">
            {otp.map((digit, i) => (
              <input 
                key={i} 
                ref={otpRefs[i]} 
                type="tel" 
                maxLength={1} 
                value={digit} 
                onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))} 
                onKeyDown={(e) => handleOtpKeyDown(i, e)} 
                className="w-12 h-14 text-center text-[22px] font-bold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-xl text-white focus:border-[#2FE081] focus:bg-[rgba(47,224,129,0.05)] outline-none transition-all" 
              />
            ))}
          </div>
          
          <div className="text-center w-full mt-2">
            {timer > 0 ? (
              <p className="text-[13px] text-[rgba(255,255,255,0.55)]">Resend code in <span className="font-bold text-[#2FE081]">00:{timer < 10 ? `0${timer}` : timer}</span></p>
            ) : (
              <button onClick={() => setTimer(30)} className="text-[13px] font-bold text-[#2FE081]">Resend Code</button>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3 px-2">
          <div 
            onClick={() => setWhatsapp(!whatsapp)}
            className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${whatsapp ? 'bg-[#25D366] border-[#25D366]' : 'border-[rgba(255,255,255,0.3)]'}`}
          >
            {whatsapp && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p className="text-[13px] text-[rgba(255,255,255,0.8)] font-medium">
            Send me updates on WhatsApp
          </p>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn" 
          disabled={!isFormValid}
          onClick={handleVerify}
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
}
