import useStore from '../store/useStore';
import './OnboardingStyles.css';

export default function EarningsScreen() {
  const { earnings, t } = useStore();

  const sections = [
    { key: 'today', label: t('today'), data: earnings.today, accuracy: earnings.accuracy.today },
    { key: 'weekly', label: t('thisWeek'), data: earnings.weekly, accuracy: earnings.accuracy.weekly },
    { key: 'monthly', label: t('thisMonth'), data: earnings.monthly, accuracy: earnings.accuracy.monthly },
  ];

  return (
    <div className="screen screen-padded onboarding-flow flex flex-col pb-20">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0">
        <p className="text-[18px] font-extrabold text-white">{t('earningsTitle')}</p>
      </div>

      {/* Content */}
      <div className="px-6 mt-6 space-y-4 overflow-y-auto flex-1 pb-24 scrollbar-none">
        {sections.map(({ key, label, data, accuracy }) => (
          <div key={key} className="flex flex-col">
            <p className="text-[10px] font-bold text-[#2FE081] uppercase tracking-wider mb-2">{label}</p>
            <div className="onboarding-card p-5">
              <p className="text-[32px] font-black text-white">₹{data.total.toLocaleString()}</p>

              <div className="mt-4 space-y-2.5">
                {[
                  [t('basePay'), `₹${data.basePay}`],
                  [t('incentives'), `₹${data.incentives}`],
                  [t('bonuses'), `₹${data.bonuses}`],
                  [t('ordersCompleted'), String(data.orders)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-[13px] font-semibold">
                    <span className="text-[rgba(255,255,255,0.45)]">{k}</span>
                    <span className="text-white">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3.5 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <span className="text-[12px] text-[rgba(255,255,255,0.45)] font-semibold">{t('accuracyScore')}</span>
                <span className="text-[14px] font-black text-[#2FE081]">{accuracy}%</span>
              </div>
            </div>
          </div>
        ))}

        {/* Per-Order Earnings */}
        {earnings.today.ordersList && (
          <div className="flex flex-col mt-4">
            <p className="text-[10px] font-bold text-[#2FE081] uppercase tracking-wider mb-2">Per-Order Earnings</p>
            <div className="onboarding-card p-4 space-y-3">
              {earnings.today.ordersList.map(order => (
                <div key={order.id} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-extrabold text-white">{order.id}</span>
                    <span className="text-[11px] text-[rgba(255,255,255,0.4)] font-mono">{order.time}</span>
                  </div>
                  <span className="text-[14px] font-black text-[#2FE081]">₹{order.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
