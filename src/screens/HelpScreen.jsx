import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function HelpScreen() {
  const { t } = useStore();
  const navigate = useNavigate();

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col pb-20">
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
          <p className="text-[18px] font-extrabold text-white">{t('helpTitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-5 overflow-y-auto flex-1 pb-4">
        {/* Operational Guide */}
        <div>
          <p className="text-[10px] font-bold text-[#2FE081] uppercase tracking-wider mb-2.5">{t('operationalGuide')}</p>
          <div className="onboarding-card p-4 space-y-3">
            {[
              ['1.', 'Go online on the HomeScreen'],
              ['2.', 'Scan Order QR code from the Admin Dashboard screen'],
              ['3.', 'Follow the optimized route sequence'],
              ['4.', 'Scan each product barcode at the shelf'],
              ['5.', 'Scan cold bag if order contains frozen items'],
              ['6.', 'Complete packing checklist and mark ready'],
            ].map(([num, text]) => (
              <div key={num} className="flex gap-2 text-[12px] font-semibold leading-relaxed">
                <span className="font-bold text-[#2FE081] w-4 shrink-0">{num}</span>
                <span className="text-[rgba(255,255,255,0.75)]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-[10px] font-bold text-[#2FE081] uppercase tracking-wider mb-2.5">{t('faqs')}</p>
          <div className="space-y-2">
            {[
              [t('faq1q'), t('faq1a')],
              [t('faq2q'), t('faq2a')],
              [t('faq3q'), t('faq3a')],
            ].map(([q, a], idx) => (
              <div key={idx} className="onboarding-card p-4">
                <p className="text-[13px] font-bold text-white leading-snug">{q}</p>
                <p className="text-[12px] text-[rgba(255,255,255,0.5)] mt-1.5 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] font-bold text-[#2FE081] uppercase tracking-wider mb-2.5">{t('contactSupport')}</p>
          <div className="onboarding-card p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
              </svg>
              <span className="text-[13px] text-[rgba(255,255,255,0.8)] font-semibold">{t('supportPhone')}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-[13px] text-[rgba(255,255,255,0.8)] font-semibold">{t('supportEmail')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
