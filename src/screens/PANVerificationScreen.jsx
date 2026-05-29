import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './OnboardingStyles.css';
import useStore from '../store/useStore';

export default function PANVerificationScreen() {
  const navigate = useNavigate();
  const { picker, updatePicker } = useStore();
  const [panImage, setPanImage] = useState(null);
  const [showPanSheet, setShowPanSheet] = useState(false);
  const [panLoading, setPanLoading] = useState(false);

  const handleSelectPan = (method) => {
    setShowPanSheet(false);
    if (method !== 'cancel') {
      setPanImage(`pan_card_${method === 'camera' ? 'photo' : 'gallery'}.jpg`);
    }
  };

  const handleVerifyPan = () => {
    setPanLoading(true);
    setTimeout(() => {
      setPanLoading(false);
      updatePicker({ pan: picker.pan || 'ABCDE1234F' });
      localStorage.setItem('picker_kyc_current_step', 'bank');
      navigate('/bank-details');
    }, 1200);
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
        <h1 className="onboarding-heading mb-2">PAN Verification</h1>
        <p className="onboarding-subtext mb-8">Upload a clear PAN card photo for tax and payout verification.</p>

        <div className="onboarding-card p-6 flex flex-col items-center justify-center min-h-[220px] gap-4 text-center border-dashed border-2 border-[rgba(80,255,170,0.3)]">
          {panImage ? (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="relative w-48 h-32 rounded-xl overflow-hidden border-2 border-[#2FE081] shadow-[0_0_15px_rgba(47,224,129,0.15)] flex items-center justify-center bg-black/40">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div className="absolute inset-0 bg-[#2FE081]/5 border-2 border-dashed border-[#2FE081] rounded-xl pointer-events-none" />
              </div>
              <p className="text-[12px] text-[rgba(255,255,255,0.5)] font-mono">{panImage}</p>
              <button 
                onClick={() => setShowPanSheet(true)}
                className="text-[12px] text-[#2FE081] font-bold underline active:scale-95 transition-transform"
              >
                Retake Photo
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[rgba(255,255,255,0.4)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-bold text-white mb-1">Upload PAN Card Photo</p>
                <p className="text-[11px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[220px] mx-auto">Ensure all details are clearly visible and not blurred.</p>
              </div>
              <button 
                onClick={() => setShowPanSheet(true)}
                className="mt-2 py-2 px-6 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[13px] active:scale-95 transition-transform hover:bg-white/10"
              >
                Upload Photo
              </button>
            </>
          )}
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          disabled={!panImage || panLoading}
          onClick={handleVerifyPan}
          className="onboarding-btn"
        >
          {panLoading ? 'Verifying...' : 'Verify PAN'}
        </button>
      </div>

      {/* Bottom Sheet Drawer */}
      <AnimatePresence>
        {showPanSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#071A14] border-t border-[rgba(255,255,255,0.05)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <h3 className="text-[16px] font-black text-white uppercase tracking-wide mb-6">Upload Document</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleSelectPan('camera')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold tracking-wider uppercase text-[13px] active:scale-[0.98] transition-transform">Take Photo</button>
                <button onClick={() => handleSelectPan('gallery')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold tracking-wider uppercase text-[13px] active:scale-[0.98] transition-transform">Choose From Gallery</button>
                <button onClick={() => handleSelectPan('cancel')} className="w-full py-4 rounded-xl border border-[rgba(255,82,82,0.15)] bg-[#FF5252]/5 text-[#FF5252] font-bold tracking-wider uppercase text-[13px] active:scale-[0.98] transition-transform">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
