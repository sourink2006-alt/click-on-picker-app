import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { LANGUAGES } from '../i18n/translations';
import './OnboardingStyles.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { picker, earnings, logout, t, lang, setLanguage } = useStore();
  const [showLangModal, setShowLangModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col pb-20">
      {/* Top Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[18px] font-black text-[#2FE081]">
            {picker.name.charAt(0)}
          </div>
          <div>
            <p className="text-[16px] font-extrabold text-white">{picker.name}</p>
            <p className="text-[12px] text-[rgba(255,255,255,0.4)]">{picker.id}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 flex flex-col gap-4 overflow-y-auto flex-1 pb-4">
        {/* Profile Card */}
        <div className="onboarding-card p-5 space-y-3.5">
          {[
            [t('phone'), `+91 ${picker.phone}`],
            [t('store'), picker.warehouse],
            [t('shift'), picker.shift],
            [t('joined'), picker.joinDate],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[13px] font-semibold">
              <span className="text-[rgba(255,255,255,0.45)]">{k}</span>
              <span className="text-white text-right max-w-[200px]">{v}</span>
            </div>
          ))}
        </div>

        {/* Earnings summary */}
        <p className="text-[11px] font-bold text-[#2FE081] uppercase tracking-wider mt-2">{t('earnings')}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="onboarding-card p-4">
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-bold">{t('today')}</p>
            <p className="text-[20px] font-black text-white mt-1">₹{earnings.today.total}</p>
          </div>
          <div className="onboarding-card p-4">
            <p className="text-[11px] text-[rgba(255,255,255,0.4)] font-bold">{t('thisWeek')}</p>
            <p className="text-[20px] font-black text-white mt-1">₹{earnings.weekly.total}</p>
          </div>
        </div>

        {/* Settings */}
        <p className="text-[11px] font-bold text-[#2FE081] uppercase tracking-wider mt-2">{t('settings')}</p>
        <div className="onboarding-card overflow-hidden">
          <button 
            onClick={() => setShowLangModal(true)} 
            className="w-full flex items-center gap-3.5 px-5 py-4 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-[13px] font-bold text-white flex-1">{t('language')}</span>
            <span className="text-[12px] text-[rgba(255,255,255,0.4)]">{currentLang?.native}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          
          <button 
            onClick={() => navigate('/help')} 
            className="w-full flex items-center gap-3.5 px-5 py-4 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-[13px] font-bold text-white flex-1">{t('helpSupport')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <button 
            onClick={() => navigate('/training')} 
            className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-white/5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
            <span className="text-[13px] font-bold text-white flex-1">{t('trainingVideos')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="w-full mt-4 py-3.5 rounded-xl border border-[rgba(255,82,82,0.15)] bg-[#FF5252]/5 text-[#FF5252] hover:text-[#FF6E6E] font-bold text-[13px] tracking-wide transition-all active:scale-[0.98] mb-6"
        >
          {t('logout')}
        </button>
      </div>

      {/* Language Modal */}
      <AnimatePresence>
        {showLangModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-end justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[32px] w-full max-w-[430px] pb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                <p className="text-[16px] font-extrabold text-white">{t('language')}</p>
                <button 
                  onClick={() => setShowLangModal(false)} 
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pt-3 space-y-1.5 max-h-[360px] overflow-y-auto">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => { setLanguage(l.code); setShowLangModal(false); }} 
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl mb-1 border transition-all active:scale-[0.98] ${
                      lang === l.code 
                        ? 'bg-[#2FE081]/10 border-[#2FE081]/30' 
                        : 'bg-white/5 border-transparent hover:border-white/5'
                    }`}
                  >
                    <div>
                      <p className={`text-[14px] font-bold ${lang === l.code ? 'text-[#2FE081]' : 'text-white'}`}>{l.native}</p>
                      <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">{l.label}</p>
                    </div>
                    {lang === l.code && (
                      <div className="w-5 h-5 rounded-full bg-[#2FE081] flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#03110D" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
