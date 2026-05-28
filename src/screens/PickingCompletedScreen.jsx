import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function PickingCompletedScreen() {
  const navigate = useNavigate();
  const { completionSummary, clearCompletion, t } = useStore();

  useEffect(() => {
    return () => clearCompletion();
  }, [clearCompletion]);

  if (!completionSummary) {
    return (
      <div className="screen flex items-center justify-center bg-[#03110D]">
        <div className="text-center">
          <p className="text-white/50 text-[14px]">No completion data available.</p>
          <button 
            onClick={() => navigate('/orders', { replace: true })}
            className="mt-4 px-6 py-2 bg-white/10 rounded-lg text-white font-bold"
          >
            Return to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    clearCompletion();
    navigate('/orders', { replace: true });
  };

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col justify-between pb-20">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
        <p className="text-[18px] font-extrabold text-white">{t('pickingCompleted')}</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[20px] font-black text-[#2FE081] mb-6 uppercase tracking-wider">{t('pickingCompleted')}</p>

        <div className="onboarding-card w-full p-5 space-y-4">
          <div className="flex justify-between text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">{t('orders')}</span>
            <span className="font-extrabold text-white">{completionSummary.orderId}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">{t('deliveryAgent')}</span>
            <span className="text-white">{completionSummary.deliveryAgent}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">{t('items')}</span>
            <span className="text-[#2FE081] font-bold">
              {completionSummary.pickedCount} {t('picked')}
              {completionSummary.unavailableCount > 0 && (
                <span className="text-[#FF5252]"> ({completionSummary.unavailableCount} unavailable)</span>
              )}
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between text-[13px] font-semibold">
            <span className="text-[rgba(255,255,255,0.45)]">{t('totalBags')}</span>
            <span className="text-white font-bold">{completionSummary.bagCount}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-4 pt-2 shrink-0">
        <button 
          onClick={handleComplete} 
          className="onboarding-btn shadow-[0_0_24px_rgba(47,224,129,0.2)]"
        >
          {t('markReady')}
        </button>
      </div>
    </div>
  );
}
