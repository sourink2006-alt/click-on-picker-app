import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

const VIDEOS = [
  { id: 'V1', titleKey: 'scannerTraining', descKey: 'scannerTrainingDesc', duration: '4:32', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></svg> },
  { id: 'V2', titleKey: 'packingWorkflow', descKey: 'packingWorkflowDesc', duration: '6:15', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg> },
  { id: 'V3', titleKey: 'warehouseProcess', descKey: 'warehouseProcessDesc', duration: '8:40', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2"><rect x="1" y="6" width="22" height="15" rx="2"/><path d="M1 10h22"/></svg> },
  { id: 'V4', titleKey: 'safetyProtocol', descKey: 'safetyProtocolDesc', duration: '3:18', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
];

export default function TrainingScreen() {
  const { t } = useStore();
  const navigate = useNavigate();

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <p className="text-[18px] font-extrabold text-white">{t('trainingTitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-3 overflow-y-auto flex-1 pb-24">
        {VIDEOS.map(v => (
          <button 
            key={v.id} 
            className="w-full onboarding-card p-4 flex items-center gap-3.5 text-left transition-all active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2FE081]/10 flex items-center justify-center shrink-0">
              {v.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white leading-snug">{t(v.titleKey)}</p>
              <p className="text-[11px] text-[rgba(255,255,255,0.45)] mt-1">{t(v.descKey)}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-[rgba(255,255,255,0.45)] font-semibold">{v.duration}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </button>
        ))}

        <div className="onboarding-card p-4 mt-2 text-center border-dashed">
          <p className="text-[11px] text-[rgba(255,255,255,0.4)]">More videos will be added by admin</p>
        </div>
      </div>
    </div>
  );
}
