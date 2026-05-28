import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

export default function FaceScanModal() {
  const { faceScanActive, completeFaceScan, cancelFaceScan, t } = useStore();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // States: guidance | initializing | scanning | verifying | success | error
  const [status, setStatus] = useState('guidance'); 

  useEffect(() => {
    if (!faceScanActive) return;
    if (status !== 'initializing') return;

    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 640 } }
        });
        if (!mounted) { 
          stream.getTracks().forEach(track => track.stop()); 
          return; 
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus('scanning');
      } catch (err) {
        console.error('Camera access denied:', err);
        if (mounted) setStatus('error');
      }
    };

    startCamera();
    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [faceScanActive, status]);

  // Reset status to guidance when modal opens
  useEffect(() => {
    if (faceScanActive) {
      setStatus('guidance');
    }
  }, [faceScanActive]);

  const handleCapture = () => {
    setStatus('verifying');
    // Simulate backend face verification
    setTimeout(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setStatus('success');
    }, 1800);
  };

  const handleGoOnline = () => {
    completeFaceScan();
  };

  const handleCancel = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    cancelFaceScan();
  };

  const handleSkip = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStatus('success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] bg-[#03110D] onboarding-flow flex flex-col justify-between px-6 py-10"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full shrink-0">
        <button 
          onClick={handleCancel} 
          className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <p className="text-[16px] font-extrabold text-white">{t('faceScan')}</p>
        <div className="w-12 h-12" />
      </div>

      {/* Main card viewport */}
      <div className="flex-1 flex flex-col items-center justify-center w-full my-4">
        <AnimatePresence mode="wait">
          {status === 'guidance' && (
            <motion.div
              key="guidance"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="onboarding-card p-6 flex flex-col items-center text-center w-full max-w-[320px]"
            >
              <div className="w-14 h-14 rounded-full bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-[16px] text-white font-extrabold mb-1">Face Verification Required</p>
              <p className="text-[12px] text-[#2FE081] font-semibold mb-6">Verification required before going online</p>

              <div className="w-full text-left space-y-3.5 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white shrink-0">1</div>
                  <p className="text-[12px] text-[rgba(255,255,255,0.65)] font-semibold">Hold device directly in front of your face</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white shrink-0">2</div>
                  <p className="text-[12px] text-[rgba(255,255,255,0.65)] font-semibold">Remove sunglasses, hats, or masks</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold text-white shrink-0">3</div>
                  <p className="text-[12px] text-[rgba(255,255,255,0.65)] font-semibold">Ensure there is good lighting on your face</p>
                </div>
              </div>

              <button
                onClick={() => setStatus('initializing')}
                className="w-full py-3.5 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-xl text-[#03110D] font-bold text-[14px] uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_16px_rgba(47,224,129,0.15)]"
              >
                Start Verification
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="onboarding-card p-6 flex flex-col items-center justify-center text-center w-full max-w-[320px]"
            >
              <div className="w-14 h-14 rounded-full bg-[#FF5252]/10 border border-[#FF5252]/20 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              </div>
              <p className="text-[16px] text-white font-extrabold mb-1">Camera Access Required</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.5)] mb-6 leading-relaxed">
                Please grant camera access in settings to complete face verification scan.
              </p>
              <button 
                onClick={handleSkip} 
                className="px-6 py-3.5 w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[#2FE081] text-[13px] font-black tracking-wider uppercase active:scale-95 transition-all"
              >
                Skip for Dev
              </button>
            </motion.div>
          )}

          {(status === 'initializing' || status === 'scanning' || status === 'verifying') && (
            <motion.div
              key="cam"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="onboarding-card p-6 flex flex-col items-center justify-center w-full max-w-[320px] aspect-square relative"
            >
              <div className="relative w-52 h-52">
                {/* Circular frame */}
                <div className="w-52 h-52 rounded-full overflow-hidden border-2 border-white/10 relative shadow-[0_0_24px_rgba(255,255,255,0.05)] bg-[#071A14]">
                  {status !== 'initializing' && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  )}
                </div>
                {/* Scan ring animation */}
                {status === 'scanning' && (
                  <motion.div
                    className="absolute inset-[-4px] rounded-full border-[3px] border-transparent border-t-[#2FE081] shadow-[0_0_8px_#2FE081]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                {status === 'verifying' && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-8 h-8 border-[3px] border-[#2FE081]/25 border-t-[#2FE081] rounded-full animate-spin" />
                  </motion.div>
                )}
                {status === 'initializing' && (
                  <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="w-8 h-8 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="onboarding-card p-6 flex flex-col items-center text-center w-full max-w-[320px]"
            >
              <div className="w-16 h-16 rounded-full bg-[#2FE081]/20 border border-[#2FE081]/40 flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(47,224,129,0.25)]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-[18px] text-white font-extrabold mb-2">Identity Verified</p>
              <p className="text-[13px] text-[rgba(255,255,255,0.5)] mb-6 leading-relaxed">
                Face verification completed successfully. You are now eligible to go online.
              </p>
              <button
                onClick={handleGoOnline}
                className="w-full py-3.5 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-xl text-[#03110D] font-bold text-[14px] uppercase tracking-wider active:scale-95 transition-all shadow-[0_0_16px_rgba(47,224,129,0.15)]"
              >
                Go Online Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions / CTA Footer */}
      <div className="w-full pb-4 shrink-0">
        {status === 'scanning' && (
          <div className="flex flex-col gap-4 w-full">
            <p className="text-[13px] text-[rgba(255,255,255,0.5)] text-center leading-relaxed max-w-[260px] mx-auto">
              Align your face in the circular guide and tap Verify below.
            </p>
            <button 
              onClick={handleCapture} 
              className="onboarding-btn shadow-[0_0_24px_rgba(47,224,129,0.2)]"
            >
              Verify Face
            </button>
          </div>
        )}
        {status === 'verifying' && (
          <p className="text-[14px] text-[#2FE081] text-center font-extrabold uppercase tracking-widest">{t('verifying')}</p>
        )}
        {status === 'initializing' && (
          <p className="text-[13px] text-[rgba(255,255,255,0.4)] text-center">Initializing camera feed...</p>
        )}
        {status === 'guidance' && (
          <p className="text-[11px] text-[rgba(255,255,255,0.3)] text-center">Verification required once per shift</p>
        )}
      </div>
    </motion.div>
  );
}
