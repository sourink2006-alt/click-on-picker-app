import useStore from '../store/useStore';

export default function GlobalHeader() {
  const picker = useStore(state => state.picker);
  const isOnline = useStore(state => state.isOnline);
  const toggleOnline = useStore(state => state.toggleOnline);
  const t = useStore(state => state.t);

  return (
    <div className="px-6 pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between shrink-0 bg-[#03110D]/95 backdrop-blur-md sticky top-0 z-[100] w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center font-extrabold text-[#2FE081]">
          {picker.name.charAt(0)}
        </div>
        <div>
          <p className="text-[14px] font-extrabold text-white leading-tight">{picker.name}</p>
          <p className="text-[10px] text-[rgba(255,255,255,0.4)] leading-tight">{picker.id}</p>
        </div>
      </div>

      <button
        onClick={toggleOnline}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
          isOnline
            ? 'bg-[#2FE081]/10 border-[#2FE081]/30 text-[#2FE081]'
            : 'bg-white/5 border-white/10 text-[rgba(255,255,255,0.5)]'
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all ${
            isOnline ? 'bg-[#2FE081] shadow-[0_0_8px_#2FE081]' : 'bg-[rgba(255,255,255,0.3)]'
          }`}
        />
        <span className="text-[11px] font-black tracking-wider uppercase">
          {isOnline ? t('online') : t('offline')}
        </span>
      </button>
    </div>
  );
}
