import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { picker, setPhoneNumber, updatePicker } = useStore();
  const phoneNumber = picker.phone || '';
  const [fullName, setFullName] = useState(picker.name === 'Rajesh Kumar' ? '' : picker.name);
  const [dob, setDob] = useState(picker.dob === '1995-08-15' ? '' : picker.dob);
  const [consent, setConsent] = useState(false);

  const isFormValid = fullName.length > 2 && phoneNumber.length === 10 && dob && consent;

  const handleContinue = () => {
    if (isFormValid) {
      updatePicker({ name: fullName, dob });
      navigate('/otp');
    }
  };

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
      <div className="flex-1 flex flex-col justify-start mt-4">
        <h1 className="onboarding-heading">Join as a<br/><span className="text-[#2FE081]">Picker Partner</span></h1>
        <p className="onboarding-subtext mb-10">Start your journey with us today.</p>

        <div className="onboarding-card p-6 flex flex-col gap-5">
          <div>
            <label className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] mb-2 block uppercase tracking-wide">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter as per Aadhaar" 
              className="onboarding-input w-full px-4 py-4 text-[16px] font-semibold"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] mb-2 block uppercase tracking-wide">Mobile Number</label>
            <div className="flex items-center onboarding-input px-4 py-4">
              <span className="text-[16px] font-bold text-[rgba(255,255,255,0.7)] mr-3">+91</span>
              <div className="w-px h-5 bg-[rgba(255,255,255,0.2)] mr-3" />
              <input 
                type="tel" 
                maxLength={10} 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} 
                placeholder="10-digit number" 
                className="flex-1 bg-transparent text-[16px] font-semibold text-white placeholder:text-[rgba(255,255,255,0.3)] tracking-wider outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[rgba(255,255,255,0.7)] mb-2 block uppercase tracking-wide">Date of Birth</label>
            <input 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={`onboarding-input w-full px-4 py-4 text-[16px] font-semibold ${!dob ? 'text-[rgba(255,255,255,0.3)]' : 'text-white'}`}
              style={{ colorScheme: 'dark' }}
            />
          </div>
        </div>
        
        <div className="mt-8 flex items-start gap-3 px-2">
          <div 
            onClick={() => setConsent(!consent)}
            className={`w-6 h-6 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all mt-0.5 ${consent ? 'bg-[#2FE081] border-[#2FE081]' : 'border-[rgba(255,255,255,0.3)]'}`}
          >
            {consent && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <p className="text-[12px] text-[rgba(255,255,255,0.55)] leading-relaxed">
            I agree to the <span className="text-[#2FE081] font-bold">Terms of Service</span> and <span className="text-[#2FE081] font-bold">Privacy Policy</span>. I confirm that I am 18 years or older.
          </p>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          className="onboarding-btn" 
          disabled={!isFormValid}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
