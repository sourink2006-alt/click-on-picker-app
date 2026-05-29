import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './OnboardingStyles.css';
import useStore from '../store/useStore';

const MOCK_BANKS = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];

export default function BankAccountDetailsScreen() {
  const navigate = useNavigate();
  const { picker, updatePicker } = useStore();
  const [selectedBank, setSelectedBank] = useState(picker.bankName || 'HDFC Bank');
  const [showBankSheet, setShowBankSheet] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState(picker.ifsc || '');
  const [bankLoading, setBankLoading] = useState(false);

  // Validation Warnings
  const [accWarning, setAccWarning] = useState('');
  const [ifscWarning, setIfscWarning] = useState('');

  const isBankFormValid = 
    selectedBank && 
    accountNumber && 
    confirmAccountNumber && 
    accountNumber === confirmAccountNumber && 
    ifscCode.length === 11;

  const handleSkip = () => {
    localStorage.setItem('picker_kyc_current_step', 'selfie');
    navigate('/selfie-guide');
  };

  const handleVerifyBank = () => {
    setAccWarning('');
    setIfscWarning('');

    if (accountNumber !== confirmAccountNumber) {
      setAccWarning('Account numbers do not match');
      return;
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      setIfscWarning('Invalid IFSC format (e.g. HDFC0001234)');
      return;
    }

    if (isBankFormValid) {
      setBankLoading(true);
      setTimeout(() => {
        setBankLoading(false);
        const masked = 'XXXX XXXX ' + accountNumber.slice(-4);
        updatePicker({ bankName: selectedBank, accNumber: masked, ifsc: ifscCode });
        localStorage.setItem('picker_kyc_current_step', 'selfie');
        navigate('/selfie-guide');
      }, 1200);
    }
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
        <button 
          onClick={handleSkip}
          className="text-[14px] font-bold text-[rgba(255,255,255,0.5)] pr-2"
        >
          Skip for now
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Bank Account Details</h1>
        <p className="onboarding-subtext mb-8">Add payout bank details to receive weekly earnings.</p>

        <div className="flex flex-col gap-4 mb-6">
          {/* Bank selector */}
          <div>
            <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Select Bank</label>
            <button 
              onClick={() => setShowBankSheet(true)}
              className="w-full onboarding-input px-5 py-4 flex items-center justify-between text-left"
            >
              <span className="text-[15px] font-bold text-white">{selectedBank}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Form Inputs */}
          <div>
            <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Account Number</label>
            <input 
              type="password"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter Bank Account Number"
              className="w-full onboarding-input px-5 py-4 text-[15px] font-semibold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">Confirm Account Number</label>
            <input 
              type="tel"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Re-enter Account Number"
              className="w-full onboarding-input px-5 py-4 text-[15px] font-semibold"
            />
            {accWarning && <p className="text-[11px] text-[#FF5252] mt-1.5 font-bold">⚠️ {accWarning}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-[rgba(255,255,255,0.4)] mb-2 block uppercase tracking-wide">IFSC Code</label>
            <input 
              type="text"
              maxLength={11}
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
              className="w-full onboarding-input px-5 py-4 text-[15px] font-mono font-bold tracking-wider"
            />
            {ifscWarning && <p className="text-[11px] text-[#FF5252] mt-1.5 font-bold">⚠️ {ifscWarning}</p>}
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          disabled={!isBankFormValid || bankLoading}
          onClick={handleVerifyBank}
          className="onboarding-btn"
        >
          {bankLoading ? 'Continuing...' : 'Continue'}
        </button>
      </div>

      {/* Shared Drawers */}
      <AnimatePresence>
        {/* Bank Selection bottom sheet */}
        {showBankSheet && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[300] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#071A14] border-t border-[rgba(255,255,255,0.05)] rounded-t-[24px] p-6 pb-8 max-w-[430px] mx-auto w-full max-h-[70vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[16px] font-black text-white uppercase tracking-wide">Select Bank</h3>
                <button onClick={() => setShowBankSheet(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="overflow-y-auto space-y-1.5 scrollbar-none pb-4 flex-1">
                {MOCK_BANKS.map(bank => (
                  <button 
                    key={bank} 
                    onClick={() => { setSelectedBank(bank); setShowBankSheet(false); }} 
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border text-left transition-all active:scale-[0.98] ${
                      selectedBank === bank 
                        ? 'bg-[#2FE081]/10 border-[#2FE081]/30' 
                        : 'bg-white/5 border-transparent hover:border-white/5'
                    }`}
                  >
                    <span className={`text-[14px] font-bold ${selectedBank === bank ? 'text-[#2FE081]' : 'text-white'}`}>{bank}</span>
                    {selectedBank === bank && (
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
