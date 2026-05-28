import useStore from '../store/useStore';
import '../screens/OnboardingStyles.css';

export default function GlobalOfflineView() {
  const { picker, toggleOnline, t } = useStore();

  return (
    <div className="flex flex-col justify-between h-full px-6 py-10">
      {/* Offline Message Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-white mb-2">{t('youreOffline')}</h2>
        <p className="text-[13px] text-[rgba(255,255,255,0.5)] text-center max-w-[240px]">
          {t('goOnlineSubtitle')}
        </p>
      </div>

      {/* Bottom Button */}
      <div className="pb-8 shrink-0">
        <button 
          onClick={toggleOnline} 
          className="onboarding-btn shadow-[0_0_24px_rgba(47,224,129,0.2)]"
        >
          {t('goOnline')}
        </button>
      </div>
    </div>
  );
}
