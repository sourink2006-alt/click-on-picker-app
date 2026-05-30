import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './OnboardingStyles.css';
import useStore from '../store/useStore';

export default function PANVerificationScreen() {
  const navigate = useNavigate();
  const { picker, updatePicker } = useStore();
  const [panImage, setPanImage] = useState(null); // Will hold the preview URL
  const [panFile, setPanFile] = useState(null); // Actual File object
  const [showPanSheet, setShowPanSheet] = useState(false);
  const [panLoading, setPanLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (panImage && panImage.startsWith('blob:')) {
        URL.revokeObjectURL(panImage);
      }
    };
  }, [panImage]);

  const handleSelectPan = (method) => {
    setShowPanSheet(false);
    if (method === 'camera' && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else if (method === 'gallery' && galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    setUploadError(null);
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setUploadError('Only JPEG or PNG images are allowed.');
        e.target.value = '';
        return;
      }
      // Validate file size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB.');
        e.target.value = '';
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPanImage(previewUrl);
      setPanFile(file);
    }
    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleVerifyPan = () => {
    if (!panFile) return;
    setPanLoading(true);
    
    // Simulate FormData preparation for backend upload
    const formData = new FormData();
    formData.append('document_type', 'PAN');
    formData.append('file', panFile);
    
    // Simulate network delay
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
                {panImage.startsWith('blob:') ? (
                  <img src={panImage} alt="PAN Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
                <div className="absolute inset-0 bg-[#2FE081]/5 border-2 border-dashed border-[#2FE081] rounded-xl pointer-events-none" />
              </div>
              <p className="text-[12px] text-[rgba(255,255,255,0.5)] font-mono text-center">{panFile ? panFile.name : panImage}</p>
              {uploadError && <p className="text-[12px] text-red-500 font-bold text-center">{uploadError}</p>}
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

      {/* Hidden File Inputs */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />
      <input 
        type="file" 
        accept="image/*" 
        ref={galleryInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

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
              className="bg-[#071A14] border-t border-[rgba(255,255,255,0.05)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full flex flex-col max-h-[85vh] overflow-y-auto scrollbar-none"
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
