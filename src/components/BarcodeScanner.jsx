import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';

export default function BarcodeScanner({ currentItem, onScan, onClose }) {
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('initializing'); // initializing | scanning | error
  const [fallback, setFallback] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(null); // 'success' | 'error' | null
  const hasScannedRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let html5QrCode = null;
    let mounted = true;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('barcode-reader');
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 280, height: 160 }, aspectRatio: 1.0 },
          (decodedText) => {
            if (mounted) {
              handleBarcodeResult(decodedText);
            }
          },
          () => {} // ignore scan failures
        );
        if (mounted) {
          setStatus('scanning');
          const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
          if (capabilities && capabilities.torchFeature) {
            setHasTorch(capabilities.torchFeature().isSupported());
          }
        }
      } catch (err) {
        console.error('Scanner init error:', err);
        if (mounted) { setStatus('error'); setFallback(true); }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleBarcodeResult = (barcode) => {
    if (hasScannedRef.current) return; // Prevent multiple scans using a stable ref
    hasScannedRef.current = true;

    // Stop scanner camera preview immediately to freeze view
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(() => {});
    }

    const isCorrect = barcode === currentItem?.barcode;

    if (isCorrect) {
      setLocalFeedback('success');
      onScan(barcode);
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setLocalFeedback('error');
      // Trigger haptic vibration simulation
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
      onScan(barcode); // will trigger global mismatch logic
      timeoutRef.current = setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const handleManualScan = (barcode) => {
    if (hasScannedRef.current) return;
    const code = barcode === 'CORRECT' && currentItem ? currentItem.barcode : barcode;
    handleBarcodeResult(code);
  };

  const toggleTorch = () => {
    if (!scannerRef.current || !hasTorch) return;
    const newState = !torchOn;
    scannerRef.current.applyVideoConstraints({ advanced: [{ torch: newState }] })
      .then(() => setTorchOn(newState))
      .catch(console.error);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[180] bg-[#03110D] flex flex-col font-sans"
    >
      {/* Visual Feedback Overlay - Centered card over a dimmed backdrop */}
      <AnimatePresence>
        {localFeedback && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 20 }}
              animate={localFeedback === 'success' 
                ? { scale: [0.85, 1.05, 1], y: 0 } 
                : { x: [-10, 10, -10, 10, 0], scale: 1, y: 0 }
              }
              transition={{ type: 'spring', duration: 0.4 }}
              className={`w-full max-w-[320px] rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-xl border ${
                localFeedback === 'success' 
                  ? 'bg-[#071A14] border-[#2FE081]/30 shadow-[0_0_32px_rgba(47,224,129,0.15)]' 
                  : 'bg-[#1A0707] border-[#FF5252]/30 shadow-[0_0_32px_rgba(255,82,82,0.15)]'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                localFeedback === 'success' ? 'bg-[#2FE081]/10 border border-[#2FE081]/30 text-[#2FE081]' : 'bg-[#FF5252]/10 border border-[#FF5252]/30 text-[#FF5252]'
              }`}>
                {localFeedback === 'success' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              <h2 className={`text-[18px] font-black uppercase tracking-wider ${
                localFeedback === 'success' ? 'text-[#2FE081]' : 'text-[#FF5252]'
              }`}>
                {localFeedback === 'success' ? 'Confirmed' : 'Incorrect'}
              </h2>
              <p className="text-[13px] text-white/80 max-w-[240px]">
                {localFeedback === 'success' ? 'Product verified successfully' : 'Barcode mismatch. Try again.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <p className="text-[16px] font-bold text-white uppercase tracking-wider">
          Scan Barcode
        </p>
        <div className="w-10 h-10 flex items-center justify-center">
          {hasTorch && (
            <button onClick={toggleTorch} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${torchOn ? 'bg-[#2FE081] text-[#03110D]' : 'bg-white/5 border border-white/10 text-white'}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div id="barcode-reader" className="w-full max-w-[320px] rounded-2xl overflow-hidden border border-white/5 bg-black/40" style={{ minHeight: '240px' }} />
        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03110D]/80 gap-2">
            <div className="w-8 h-8 border-[3px] border-[#2FE081]/20 border-t-[#2FE081] rounded-full animate-spin" />
            <span className="text-[12px] text-[rgba(255,255,255,0.4)]">Accessing Camera...</span>
          </div>
        )}
      </div>

      {fallback && (
        <div className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[32px] px-6 pt-6 pb-10 shrink-0">
          <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-bold text-center uppercase tracking-widest mb-4">Camera unavailable — Simulation</p>
          <div className="flex gap-3">
            <button onClick={() => handleManualScan('CORRECT')} className="flex-1 py-4 bg-[#2FE081] rounded-xl text-[#03110D] font-extrabold text-[14px] shadow-[0_0_16px_rgba(47,224,129,0.2)]">Correct Product</button>
            <button onClick={() => handleManualScan('WRONG_BARCODE_999')} className="flex-1 py-4 bg-[#FF5252]/10 border border-[#FF5252]/30 rounded-xl text-[#FF5252] font-bold text-[14px]">Wrong Product</button>
          </div>
        </div>
      )}

      {!fallback && status === 'scanning' && (
        <div className="px-6 pb-10 pt-4 shrink-0">
          <p className="text-[13px] text-[rgba(255,255,255,0.4)] text-center">Point camera at product barcode</p>
        </div>
      )}
    </motion.div>
  );
}
