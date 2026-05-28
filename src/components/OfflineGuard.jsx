import useStore from '../store/useStore';
import { motion } from 'framer-motion';

export default function OfflineGuard({ children }) {
  const { isOnline, toggleOnline, t } = useStore();

  if (!isOnline) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Offline Icon */}
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>

        {/* Text Details */}
        <h2 className="text-[20px] font-bold text-white mb-2">{t('youreOffline')}</h2>
        <p className="text-[13px] text-[rgba(255,255,255,0.5)] mb-8 max-w-[240px] leading-relaxed">
          {t('goOnlineSubtitle') || 'Go online to start receiving orders'}
        </p>

        {/* Go Online CTA */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleOnline}
          className="w-full max-w-[300px] py-4 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-xl text-[#03110D] font-black text-[14px] uppercase tracking-wider shadow-[0_0_24px_rgba(47,224,129,0.2)] border border-[#50FFAA]/35"
        >
          {t('goOnline')}
        </motion.button>
      </div>
    );
  }

  return <>{children}</>;
}
