import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { LANGUAGES } from '../i18n/translations';
import './OnboardingStyles.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { picker, logout, t, lang, setLanguage, updatePicker, earnings } = useStore();

  // State controls for modals & bottom sheets
  const [showLangModal, setShowLangModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditProfileSheet, setShowEditProfileSheet] = useState(false);
  const [showPayoutSheet, setShowPayoutSheet] = useState(false);
  const [showTaxSheet, setShowTaxSheet] = useState(false);
  const [showHelpSheet, setShowHelpSheet] = useState(false);

  // Temporal storage for editing
  const [tempName, setTempName] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [tempPan, setTempPan] = useState('');
  const [tempAddress, setTempAddress] = useState('');

  const [tempBankName, setTempBankName] = useState('');
  const [tempAccNumber, setTempAccNumber] = useState('');
  const [tempIfsc, setTempIfsc] = useState('');

  const handleOpenEditProfile = () => {
    setTempName(picker.name || '');
    setTempDob(picker.dob || '');
    setTempPan(picker.pan || '');
    setTempAddress(picker.address || '');
    setShowEditProfileSheet(true);
  };

  const handleSaveProfile = () => {
    updatePicker({
      name: tempName,
      dob: tempDob,
      pan: tempPan,
      address: tempAddress,
    });
    setShowEditProfileSheet(false);
  };

  const handleOpenPayout = () => {
    setTempBankName(picker.bankName || '');
    setTempAccNumber(picker.accNumber || '');
    setTempIfsc(picker.ifsc || '');
    setShowPayoutSheet(true);
  };

  const handleSavePayout = () => {
    updatePicker({
      bankName: tempBankName,
      accNumber: tempAccNumber,
      ifsc: tempIfsc,
    });
    setShowPayoutSheet(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col overflow-y-auto scrollbar-none">
      <div className="px-6 mt-[calc(1.5rem+env(safe-area-inset-top,0px))] flex flex-col gap-6 pb-24 flex-1 max-w-3xl mx-auto w-full">
        
        {/* PROFILE CARD */}
        <div className="onboarding-card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#2FE081]/15 border-2 border-[#2FE081] flex items-center justify-center text-[#2FE081] font-black text-xl select-none">
              {picker.name ? picker.name.charAt(0) : ''}
            </div>
            <div>
              <h2 className="text-[18px] font-black text-white leading-tight">{picker.name}</h2>
              <p className="text-[12px] text-[rgba(255,255,255,0.45)] mt-1 font-bold">ID: {picker.id || 'COD-5782'}</p>
            </div>
          </div>
          <button 
            onClick={handleOpenEditProfile}
            className="py-2 px-4 rounded-full bg-[#2FE081]/10 border border-[#2FE081]/20 text-[#2FE081] font-bold text-[12px] active:scale-95 transition-transform hover:bg-[#2FE081]/15"
          >
            Edit Profile
          </button>
        </div>

        {/* PROFILE COMPLETION */}
        <div className="onboarding-card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[13px] font-bold text-white/90">Profile Completion</span>
            <span className="text-[14px] font-black text-[#2FE081]">86%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#2FE081] rounded-full" style={{ width: '86%' }} />
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-3 gap-3">
          <div className="onboarding-card p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[rgba(255,255,255,0.45)] font-bold mb-1">Picking Speed</span>
            <span className="text-[15px] font-black text-white leading-tight">{picker.pickingSpeed || 145} Items/hr</span>
          </div>
          <div className="onboarding-card p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[rgba(255,255,255,0.45)] font-bold mb-1">Total Items</span>
            <span className="text-[15px] font-black text-white leading-tight">{(picker.totalItemsPicked || 28470).toLocaleString()}</span>
          </div>
          <div className="onboarding-card p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-[rgba(255,255,255,0.45)] font-bold mb-1">Earnings</span>
            <span className="text-[15px] font-black text-[#2FE081] leading-tight">₹{((earnings.weekly.total) / 1000).toFixed(1)}K</span>
          </div>
        </div>

        {/* PERSONAL DETAILS SECTION */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#2FE081] uppercase tracking-wider pl-1">Personal Details</p>
          <div className="onboarding-card p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {[
              ['Phone', `+91 ${picker.phone}`],
              ['City', picker.city || 'Bengaluru'],
              ['Assigned Hub', picker.warehouse || 'Koramangala Hub'],
              ['Joined Date', picker.joinDate || '2024-08-15'],
              ['DOB', picker.dob || '1995-08-15'],
              ['PAN ID', picker.pan || 'ABCDE1234F'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center text-[13px] font-semibold border-b border-white/5 pb-2 md:border-none md:pb-0">
                <span className="text-[rgba(255,255,255,0.45)]">{label}</span>
                <span className="text-white text-right font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACCOUNT SECTION */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-[#2FE081] uppercase tracking-wider pl-1">Account & Support</p>
          <div className="onboarding-card overflow-hidden">
            {/* Language */}
            <button 
              onClick={() => setShowLangModal(true)} 
              className="w-full flex items-center gap-3.5 px-5 py-5 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
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

            {/* Payout Methods */}
            <button 
              onClick={handleOpenPayout} 
              className="w-full flex items-center gap-3.5 px-5 py-5 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12" y2="18" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span className="text-[13px] font-bold text-white flex-1">Payout Methods</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Tax Documents */}
            <button 
              onClick={() => setShowTaxSheet(true)} 
              className="w-full flex items-center gap-3.5 px-5 py-5 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="text-[13px] font-bold text-white flex-1">Tax Documents</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Tutorial Videos */}
            <button 
              onClick={() => navigate('/training')} 
              className="w-full flex items-center gap-3.5 px-5 py-5 border-b border-[rgba(255,255,255,0.06)] text-left hover:bg-white/5 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <span className="text-[13px] font-bold text-white flex-1">Tutorial Videos</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Help & Support */}
            <button 
              onClick={() => setShowHelpSheet(true)} 
              className="w-full flex items-center gap-3.5 px-5 py-5 text-left hover:bg-white/5 transition-all"
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
          </div>
        </div>

        {/* Sign Out Danger Button */}
        <button 
          onClick={() => setShowSignOutModal(true)} 
          className="w-full mt-4 py-4 rounded-xl border border-[rgba(255,82,82,0.15)] bg-[#FF5252]/5 text-[#FF5252] hover:text-[#FF6E6E] font-bold text-[14px] uppercase tracking-wider transition-all active:scale-[0.98] mb-6"
        >
          Sign Out
        </button>
      </div>

      {/* LANGUAGE SELECTION DRAWER */}
      <AnimatePresence>
        {showLangModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[16px] font-extrabold text-white uppercase tracking-wider">{t('language')}</p>
                <button 
                  onClick={() => setShowLangModal(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto scrollbar-none pb-4">
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code} 
                    onClick={() => { setLanguage(l.code); setShowLangModal(false); }} 
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all active:scale-[0.98] ${
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

      {/* EDIT PROFILE BOTTOM SHEET */}
      <AnimatePresence>
        {showEditProfileSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full max-h-[90vh] overflow-y-auto scrollbar-none"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[16px] font-extrabold text-white uppercase tracking-wider">Edit Profile</p>
                <button 
                  onClick={() => setShowEditProfileSheet(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Phone</label>
                  <input 
                    type="text" 
                    value={`+91 ${picker.phone}`}
                    disabled
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Date of Birth</label>
                  <input 
                    type="date" 
                    value={tempDob}
                    onChange={(e) => setTempDob(e.target.value)}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">PAN ID</label>
                  <input 
                    type="text" 
                    value={tempPan}
                    onChange={(e) => setTempPan(e.target.value.toUpperCase())}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Residential Address</label>
                  <textarea 
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    className="onboarding-input w-full px-4 py-3 text-[15px] font-semibold h-20 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowEditProfileSheet(false)}
                    className="flex-1 py-3.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-white font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProfile}
                    className="flex-1 py-3.5 rounded-xl bg-[#2FE081] text-[#03110D] font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYOUT METHODS BOTTOM SHEET */}
      <AnimatePresence>
        {showPayoutSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[16px] font-extrabold text-white uppercase tracking-wider">Payout Bank Account</p>
                <button 
                  onClick={() => setShowPayoutSheet(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Bank Name</label>
                  <input 
                    type="text" 
                    value={tempBankName}
                    onChange={(e) => setTempBankName(e.target.value)}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Account Number</label>
                  <input 
                    type="text" 
                    value={tempAccNumber}
                    onChange={(e) => setTempAccNumber(e.target.value.replace(/\D/g, ''))}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">IFSC Code</label>
                  <input 
                    type="text" 
                    value={tempIfsc}
                    onChange={(e) => setTempIfsc(e.target.value.toUpperCase())}
                    className="onboarding-input w-full px-4 py-3.5 text-[15px] font-semibold uppercase font-mono tracking-wider"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setShowPayoutSheet(false)}
                    className="flex-1 py-3.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-white font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSavePayout}
                    className="flex-1 py-3.5 rounded-xl bg-[#2FE081] text-[#03110D] font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAX DOCUMENTS BOTTOM SHEET */}
      <AnimatePresence>
        {showTaxSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[16px] font-extrabold text-white uppercase tracking-wider">Tax Documents</p>
                <button 
                  onClick={() => setShowTaxSheet(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="onboarding-card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-[14px] font-bold text-white">Aadhaar Status</h4>
                    <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">e-KYC verified</p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#2FE081] bg-[#2FE081]/15 px-2.5 py-1 rounded border border-[#2FE081]/20 uppercase tracking-wide">
                    Verified
                  </span>
                </div>

                <div className="onboarding-card p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-[14px] font-bold text-white">PAN Status</h4>
                    <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">Form 60/PAN updated</p>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#2FE081] bg-[#2FE081]/15 px-2.5 py-1 rounded border border-[#2FE081]/20 uppercase tracking-wide">
                    Verified
                  </span>
                </div>

                <button 
                  onClick={() => setShowTaxSheet(false)}
                  className="w-full mt-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HELP & SUPPORT BOTTOM SHEET */}
      <AnimatePresence>
        {showHelpSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 220 }} 
              className="bg-[#071A14] border-t border-[rgba(80,255,170,0.15)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-[16px] font-extrabold text-white uppercase tracking-wider">Help & Support</p>
                <button 
                  onClick={() => setShowHelpSheet(false)} 
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <a 
                  href="tel:+911800123456"
                  className="w-full flex items-center gap-3.5 px-5 py-4 bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-left transition-all active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">Call Support</h4>
                    <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">Toll free 24/7 hotline</p>
                  </div>
                </a>

                <a 
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-3.5 px-5 py-4 bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-left transition-all active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 border border-[#25D366]/25 flex items-center justify-center text-[#25D366]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">WhatsApp Support</h4>
                    <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">Instant chat assistance</p>
                  </div>
                </a>

                <button 
                  onClick={() => { setShowHelpSheet(false); navigate('/help'); }}
                  className="w-full flex items-center gap-3.5 px-5 py-4 bg-white/5 border border-transparent hover:border-white/5 rounded-xl text-left transition-all active:scale-[0.98]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">FAQs & Knowledge Base</h4>
                    <p className="text-[11px] text-[rgba(255,255,255,0.4)] mt-0.5">Browse partner documentation</p>
                  </div>
                </button>

                <button 
                  onClick={() => setShowHelpSheet(false)}
                  className="w-full mt-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase text-[12px] active:scale-[0.98] transition-transform"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGN OUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSignOutModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[400] bg-black/75 backdrop-blur-sm flex items-center justify-center px-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="onboarding-card p-6 w-full max-w-[340px] text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF5252]/15 border border-[#FF5252]/25 flex items-center justify-center text-[#FF5252] mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 className="text-[18px] font-black text-white mb-2">Sign Out</h3>
              <p className="text-[13px] text-[rgba(255,255,255,0.6)] leading-relaxed mb-6">
                Are you sure you want to sign out?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-white font-bold text-[13px]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 rounded-xl bg-[#FF5252] text-white font-bold text-[13px]"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
