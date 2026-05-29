import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

const ICON_MAP = {
  order: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  incentive: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  system: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.28.46.49.96.6 1.5H21a2 2 0 0 1 0 4h-.09c-.55.11-1.04.32-1.51.6z" />
    </svg>
  ),
  alert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A65" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead, t } = useStore();

  const handleClick = (n) => {
    markNotificationRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
        <p className="text-[18px] font-extrabold text-white">{t('alerts')}</p>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-3 overflow-y-auto flex-1 pb-24 scrollbar-none">
        {notifications.map(n => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={`w-full onboarding-card p-4 flex items-start gap-3.5 text-left transition-all active:scale-[0.99] relative overflow-hidden ${
              !n.read ? 'border-l-4 border-l-[#2FE081]' : ''
            }`}
          >
            <div className="mt-0.5 shrink-0 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center">
              {ICON_MAP[n.type] || ICON_MAP.alert}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-extrabold ${!n.read ? 'text-white' : 'text-[rgba(255,255,255,0.45)]'}`}>
                {n.title}
              </p>
              <p className="text-[12px] text-[rgba(255,255,255,0.55)] mt-1 leading-snug">
                {n.message}
              </p>
              <p className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1.5 font-bold">
                {n.time}
              </p>
            </div>

            {!n.read && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#2FE081] mt-2 shrink-0 shadow-[0_0_6px_#2FE081]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
