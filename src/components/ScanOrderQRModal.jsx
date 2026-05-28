import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import useStore from '../store/useStore';

export default function ScanOrderQRModal({ onClose, onScanSuccess }) {
  const { orders, t } = useStore();
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('initializing'); // initializing | scanning | error
  const [fallback, setFallback] = useState(false);

  const pendingOrders = orders.filter(o => o.status === 'pending');

  // Stabilize callbacks to prevent scanner restarting on every parent render
  const onScanSuccessRef = useRef(onScanSuccess);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
    onCloseRef.current = onClose;
  }, [onScanSuccess, onClose]);

  useEffect(() => {
    let html5QrCode = null;
    let mounted = true;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 15, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
          (decodedText) => {
            if (mounted) {
              // Get latest orders without closure dependency
              const latestOrders = useStore.getState().orders;
              // Try to find order matching the text
              const foundOrder = latestOrders.find(o => o.id === decodedText || decodedText.includes(o.id));
              if (foundOrder) {
                onScanSuccessRef.current(foundOrder.id);
                html5QrCode.stop().catch(() => {});
                onCloseRef.current();
              } else {
                // If it's a generic QR, just try using the text directly as order id
                onScanSuccessRef.current(decodedText);
                html5QrCode.stop().catch(() => {});
                onCloseRef.current();
              }
            }
          },
          () => {} // ignore scan failures
        );
        if (mounted) setStatus('scanning');
      } catch (err) {
        console.error('QR Scanner init error:', err);
        if (mounted) {
          setStatus('error');
          setFallback(true);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, []);

  const handleSimulateScan = (orderId) => {
    onScanSuccessRef.current(orderId);
    onCloseRef.current();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[180] bg-[#03110D]/95 backdrop-blur-md flex flex-col font-sans"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <p className="text-[16px] font-bold text-white uppercase tracking-wider">Scan Order QR</p>
        <div className="w-10" />
      </div>

      {/* Main Scanner Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-2 border-white/10 bg-black/40">
          <div id="qr-reader" className="w-full h-full" />
          
          {/* Target Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-dashed border-[#2FE081]/40 rounded-2xl relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-[#2FE081] rounded-tl-md" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-[#2FE081] rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-[#2FE081] rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-[#2FE081] rounded-br-md" />
              
              {/* Laser Sweep Line */}
              {status === 'scanning' && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-[#2FE081] shadow-[0_0_12px_#2FE081]"
                  animate={{ top: ['5%', '95%', '5%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          </div>

          {status === 'initializing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#071A14]/90 gap-3">
              <div className="w-8 h-8 border-2 border-[#2FE081]/20 border-t-[#2FE081] rounded-full animate-spin" />
              <span className="text-[12px] text-[rgba(255,255,255,0.4)]">Accessing Camera...</span>
            </div>
          )}
        </div>

        <p className="text-[13px] text-[rgba(255,255,255,0.5)] text-center mt-6 max-w-[280px]">
          Point the camera at the Order QR Code on the Admin Dashboard screen.
        </p>
      </div>

      {/* Simulator Section (Always available or fallback) */}
      <div className="bg-[#071A14]/85 border-t border-[rgba(80,255,170,0.1)] rounded-t-[32px] px-6 pt-6 pb-10 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] text-[#2FE081] font-bold uppercase tracking-widest">Simulation Mode</p>
          <div className="h-px flex-1 bg-[rgba(80,255,170,0.1)] ml-3" />
        </div>
        
        {pendingOrders.length === 0 ? (
          <p className="text-[13px] text-[rgba(255,255,255,0.4)] text-center py-2">
            No pending orders available to pick.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] text-[rgba(255,255,255,0.5)] mb-1">
              Select an order to simulate a QR scan:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {pendingOrders.map(order => (
                <button
                  key={order.id}
                  onClick={() => handleSimulateScan(order.id)}
                  className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all hover:border-[#2FE081]/30 active:scale-[0.97]"
                >
                  <p className="text-[14px] font-extrabold text-white">{order.id}</p>
                  <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{order.items.length} items · {order.customerArea ? order.customerArea.split(',')[0] : 'No Area'}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
