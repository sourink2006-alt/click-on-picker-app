import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function LiveSelfieScreen() {
  const navigate = useNavigate();
  const { login } = useStore();

  const handleCapture = () => {
    // Simulate capture and login
    login();
    navigate('/home');
  };

  return (
    <div className="onboarding-flow bg-[#03110D] relative overflow-hidden">
      {/* Simulate camera view background */}
      <div className="absolute inset-0 bg-[#071A14] opacity-50"></div>

      <div className="absolute top-12 left-6 w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] flex items-center justify-center z-10" onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full h-full">
        {/* Dashed Oval Frame */}
        <div className="relative w-64 h-80 rounded-full border-4 border-dashed border-[#2FE081] flex items-center justify-center bg-[rgba(255,255,255,0.03)] shadow-[0_0_50px_rgba(47,224,129,0.1)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
            <p className="text-[15px] font-bold text-white mb-2 shadow-black drop-shadow-md">Align your face inside the frame</p>
            <p className="text-[13px] text-[rgba(255,255,255,0.8)] shadow-black drop-shadow-md">Look straight at the camera</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 w-full flex justify-center z-10">
        <button 
          onClick={handleCapture}
          className="w-20 h-20 rounded-full bg-[rgba(47,224,129,0.2)] border-4 border-[#2FE081] flex items-center justify-center transition-transform active:scale-90"
        >
          <div className="w-14 h-14 rounded-full bg-[#2FE081] shadow-[0_0_20px_rgba(47,224,129,0.5)]"></div>
        </button>
      </div>
    </div>
  );
}
