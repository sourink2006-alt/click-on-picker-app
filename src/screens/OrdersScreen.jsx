import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useStore, { useHydrated } from '../store/useStore';
import ScanOrderQRModal from '../components/ScanOrderQRModal';
import OfflineGuard from '../components/OfflineGuard';
import './OnboardingStyles.css';

export default function OrdersScreen() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const hydrated = useHydrated();
  const navigate = useNavigate();

  const t = useStore(state => state.t);
  const isOnline = useStore(state => state.isOnline);
  const currentOrder = useStore(state => state.currentOrder);
  const completionSummary = useStore(state => state.completionSummary);
  const orders = useStore(state => state.orders);
  const acceptOrder = useStore(state => state.acceptOrder);

  // Navigation Guard - Resume active picking or completion if exists
  useEffect(() => {
    // Read directly from Zustand to avoid React 18 Route unmount race condition
    const currentSummary = useStore.getState().completionSummary;
    if (currentSummary) {
      navigate('/picking-completed', { replace: true });
    } else if (currentOrder && (currentOrder.status === 'picking' || currentOrder.status === 'mapping')) {
      navigate('/picking', { replace: true });
    }
  }, [currentOrder, navigate]);

  if (!hydrated) {
    return (
      <div className="screen onboarding-flow flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#2FE081]/25 border-t-[#2FE081] rounded-full animate-spin" />
      </div>
    );
  }

  const completedOrders = orders.filter(o => o.status === 'delivered');

  const formatCompletionTime = (sec) => {
    if (!sec) return '1m 24s';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const handleScanSuccess = (orderId) => {
    acceptOrder(orderId);
  };

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col pb-20">
      <div className="px-6 mt-6 flex flex-col gap-4 overflow-y-auto flex-1 items-center">
        <OfflineGuard>
          {/* Online View Content */}
          <div className="w-full flex flex-col gap-6 items-center flex-1 py-4 justify-start">
            
            {/* Primary SCAN ORDER QR CTA */}
            <div className="w-full flex flex-col items-center gap-4 mt-2 shrink-0">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowQRScanner(true)}
                className="w-full max-w-[340px] relative overflow-hidden py-5 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-2xl text-[#03110D] font-black text-[16px] tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-[0_0_32px_rgba(47,224,129,0.25)] border border-[#50FFAA]/30"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="2.5">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                  <rect x="7" y="7" width="10" height="10" rx="1" />
                </svg>
                Scan Order QR
              </motion.button>
              <p className="text-[12px] text-[rgba(255,255,255,0.4)] text-center">Scan warehouse tote or order ticket to begin picking</p>
            </div>
            
            {/* PREVIOUS ORDERS */}
            <div className="flex flex-col gap-3.5 w-full max-w-[340px] text-left mt-6 shrink-0 pb-6">
              <p className="text-[11px] font-black text-[#2FE081] uppercase tracking-wider mb-1">
                Previous Orders ({completedOrders.length})
              </p>
              {completedOrders.length === 0 ? (
                <div className="py-8 text-center w-full onboarding-card border border-dashed border-white/5 bg-transparent">
                  <p className="text-[12px] text-[rgba(255,255,255,0.4)]">No completed orders yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {completedOrders.map(order => (
                    <div key={order.id} className="onboarding-card p-4 flex flex-col gap-3 border border-white/5 bg-[#071A14]/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[15px] font-black text-white leading-tight">{order.id}</p>
                          <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-1">
                            {order.customerArea ? order.customerArea.split(',')[0] : 'Koramangala'}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="text-[9px] font-bold text-[#2FE081] bg-[#2FE081]/15 px-2 py-0.5 rounded border border-[#2FE081]/30 uppercase tracking-wide">
                            Completed
                          </span>
                          {order.accuracy !== undefined && (
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                              order.accuracy >= 95 
                                ? 'text-[#2FE081] bg-[#2FE081]/5 border-[#2FE081]/25' 
                                : 'text-[#FF9F43] bg-[#FF9F43]/5 border-[#FF9F43]/25'
                            }`}>
                              {order.accuracy}% Acc
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="h-px bg-white/5" />
                      <div className="flex justify-between items-center text-[12px] text-[rgba(255,255,255,0.5)]">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{order.items.length} items</span>
                          <span className="text-[rgba(255,255,255,0.2)]">|</span>
                          <span>{formatCompletionTime(order.completionTime)}</span>
                        </div>
                        <span className="font-black text-[#2FE081] text-[13px]">
                          +₹{order.earnings || 25}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </OfflineGuard>
      </div>

      {/* QR Scanner Modal Overlay */}
      <AnimatePresence>
        {showQRScanner && (
          <ScanOrderQRModal 
            onClose={() => setShowQRScanner(false)} 
            onScanSuccess={handleScanSuccess} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
