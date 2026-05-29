import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useStore, { useHydrated } from '../store/useStore';
import ScanOrderQRModal from '../components/ScanOrderQRModal';
import GlobalOfflineView from '../components/GlobalOfflineView';
import './OnboardingStyles.css';

export default function HomeScreen() {
  const picker = useStore(state => state.picker);
  const stats = useStore(state => state.stats);
  const isOnline = useStore(state => state.isOnline);
  const toggleOnline = useStore(state => state.toggleOnline);
  const acceptOrder = useStore(state => state.acceptOrder);
  const currentOrder = useStore(state => state.currentOrder);
  const t = useStore(state => state.t);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const hydrated = useHydrated();
  const navigate = useNavigate();



  // Navigation Guard - Resume active picking or mapping if exists
  useEffect(() => {
    if (currentOrder && (currentOrder.status === 'picking' || currentOrder.status === 'mapping')) {
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

  const handleScanSuccess = (orderId) => {
    acceptOrder(orderId);
    navigate('/picking');
  };

  if (!isOnline) {
    return (
      <div className="screen onboarding-flow flex flex-col justify-between pb-20">
        <GlobalOfflineView />
      </div>
    );
  }

  const pct = Math.round((stats.ordersCompleted / stats.ordersTarget) * 100);

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col">
      {/* Main Actions Area */}
      <div className="px-6 mt-6 shrink-0">
        {/* Glow-girdled primary SCAN QR action */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowQRScanner(true)}
          className="w-full relative overflow-hidden py-5 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-2xl text-[#03110D] font-black text-[16px] tracking-wide uppercase flex items-center justify-center gap-2.5 shadow-[0_0_32px_rgba(47,224,129,0.3)] border border-[#50FFAA]/30 mb-5"
        >
          {/* Animated subtle reflection shimmer */}
          <motion.div 
            className="absolute top-0 bottom-0 w-24 bg-white/20 skew-x-[-25deg]"
            animate={{ left: ['-30%', '130%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="2.5">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <rect x="7" y="7" width="10" height="10" rx="1" />
            <rect x="10" y="10" width="4" height="4" />
          </svg>
          Scan Order QR
        </motion.button>
      </div>

      {/* Stats Section */}
      <div className="px-6 flex flex-col gap-4 overflow-y-auto flex-1">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="onboarding-card p-4 flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">{t('orders')}</p>
            <p className="text-[24px] font-black text-white leading-none mt-2">
              {stats.ordersCompleted}
              <span className="text-[13px] text-[rgba(255,255,255,0.3)] font-extrabold">/{stats.ordersTarget}</span>
            </p>
          </div>
          <div className="onboarding-card p-4 flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">{t('accuracy')}</p>
            <p className="text-[24px] font-black text-[#2FE081] leading-none mt-2">{stats.accuracy}%</p>
          </div>
          <div className="onboarding-card p-4 flex flex-col justify-between min-h-[96px]">
            <p className="text-[10px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-wider">{t('earnings')}</p>
            <p className="text-[24px] font-black text-white leading-none mt-2">₹{stats.earningsToday}</p>
          </div>
        </div>

        {/* Shift Progress */}
        <div className="onboarding-card p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-bold text-[rgba(255,255,255,0.8)]">{t('shiftProgress')}</p>
            <p className="text-[13px] font-extrabold text-[#2FE081]">{pct}%</p>
          </div>
          <div className="h-2.5 bg-white/5 border border-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-full transition-all duration-500" 
              style={{ width: `${pct}%` }} 
            />
          </div>
          <div className="flex justify-between mt-2.5 text-[11px] text-[rgba(255,255,255,0.4)] font-semibold">
            <span>{t('morningShift')}</span>
            <span>6:00 AM – 2:00 PM</span>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="onboarding-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-white">{t('avgPickTime')}</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{t('perOrder')}</p>
          </div>
          <p className="text-[18px] font-extrabold text-white">{stats.avgPickTime}</p>
        </div>

        <div className="onboarding-card p-5 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-white">{t('storeRank')}</p>
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{stats.totalPickers} {t('pickersToday')}</p>
          </div>
          <p className="text-[18px] font-black text-[#2FE081]">#{stats.rank}</p>
        </div>

        {/* Go Offline Button */}
        <div className="mt-2 mb-6">
          <button 
            onClick={toggleOnline} 
            className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#FF5252] hover:text-[#FF6E6E] font-bold text-[13px] tracking-wide transition-all active:scale-[0.98]"
          >
            {t('goOffline')}
          </button>
        </div>
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
