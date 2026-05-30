import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './OnboardingStyles.css';

// ------------------------------------------------------------------
// 1. HEADER
// ------------------------------------------------------------------
function Header({ currentOrder, pickingTimer, orderTimerLimit, timerCritical, timerUrgent, mm, ss, timerLimitMM, timerLimitSS, setShowRoutePreview }) {
  return (
    <div className={`border-b px-5 pt-5 pb-3.5 shrink-0 backdrop-blur-md transition-colors ${timerCritical ? 'bg-[#FF5252]/10 border-[#FF5252]/30' : 'bg-[#071A14]/80 border-[rgba(255,255,255,0.06)]'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-black text-white">{currentOrder.id}</p>
            <button onClick={() => setShowRoutePreview(true)} className="p-1 rounded bg-white/10 text-white/70 active:scale-95 transition-transform">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
            </button>
          </div>
          <p className="text-[11px] text-[rgba(255,255,255,0.45)] mt-0.5">{currentOrder.customerArea}</p>
        </div>
        <div className="text-right">
          <p className={`text-[20px] font-black tabular-nums ${
            timerCritical ? 'text-[#FF5252] animate-pulse drop-shadow-[0_0_8px_rgba(255,82,82,0.8)]' : timerUrgent ? 'text-[#FF9F43]' : 'text-white'
          }`}>
            {mm}:{ss}
          </p>
          {timerCritical ? (
            <p className="text-[9px] text-[#FF5252] uppercase tracking-wider font-black drop-shadow-[0_0_4px_rgba(255,82,82,0.8)]">
              SLA BREACHED
            </p>
          ) : (
            <p className="text-[9px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider font-bold">
              Limit {timerLimitMM}:{timerLimitSS}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. PROGRESS SECTION
// ------------------------------------------------------------------
function ProgressSection({ pickedCount, total, progress, timerCritical, timerUrgent, remainingRacks, currentItem, items, activeIndex, goToItem, t }) {
  return (
    <div className="flex flex-col shrink-0">
      {/* Progress Bar Component */}
      <div className={`px-5 py-3 border-b border-[rgba(255,255,255,0.06)] backdrop-blur-md ${timerCritical ? 'bg-[#FF5252]/10' : 'bg-[#071A14]/80'}`}>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${timerCritical ? 'bg-[#FF5252] shadow-[0_0_8px_rgba(255,82,82,0.8)]' : timerUrgent ? 'bg-[#FF9F43]' : 'bg-gradient-to-r from-[#2FE081] to-[#25b869]'}`}
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="text-[12px] font-black text-white shrink-0">{pickedCount}/{total}</span>
        </div>
      </div>

      {/* Routing Guide Bar */}
      {remainingRacks.length > 0 && (
        <div className="bg-[#0b221a]/30 px-5 py-2 border-b border-[rgba(255,255,255,0.04)] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[9px] text-[rgba(255,255,255,0.4)] font-extrabold uppercase tracking-widest shrink-0">{t('route')}</span>
          <div className="flex items-center gap-1">
            {(remainingRacks || []).map((r, idx) => (
              <span key={r} className="flex items-center gap-1 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  r === currentItem?.rack 
                    ? 'bg-[#2FE081] text-[#03110D]' 
                    : 'bg-white/5 text-[rgba(255,255,255,0.6)] border border-white/5'
                }`}>{r}</span>
                {idx < remainingRacks.length - 1 && <span className="text-white/20 text-[10px]">→</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Carousel Dots */}
      <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.04)] flex items-center justify-center gap-2">
        {(items || []).map((item, idx) => (
          <button 
            key={item.orderItemId} 
            onClick={() => goToItem(idx)} 
            className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ${
              item.picked 
                ? 'bg-[#2FE081] text-[#03110D]' 
                : item.hasException 
                  ? 'bg-[#FF5252] text-white' 
                  : idx === activeIndex 
                    ? 'bg-transparent text-[#2FE081] border border-[#2FE081]' 
                    : 'bg-white/5 text-[rgba(255,255,255,0.35)] border border-white/5'
            }`}
          >
            {item.picked ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : item.hasException ? (
              "!"
            ) : idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. PRODUCT CAROUSEL
// ------------------------------------------------------------------
function ProductCarousel({ items, activeIndex, setActiveIndex, total, currentOrder, setShowExceptionModal, allPicked, currentItem, coldBagRequired, coldBagScanned, setShowColdBagScanner, scanColdBag, t }) {
  const handleDragEnd = (event, info) => {
    const threshold = 60;
    if (info.offset.x < -threshold && activeIndex < total - 1) {
      setActiveIndex(p => p + 1);
    } else if (info.offset.x > threshold && activeIndex > 0) {
      setActiveIndex(p => p - 1);
    }
  };

  return (
    <div className="flex-1 relative flex items-center justify-center px-6 my-4 min-h-0" style={{ touchAction: "pan-y" }}>
      {!allPicked && currentItem ? (
        <div className="w-full max-w-[340px] h-full max-h-[400px] min-h-[280px] relative flex items-center justify-center shrink-0" style={{ touchAction: "pan-x" }}>
          {(items || []).map((item, idx) => {
            const offset = idx - activeIndex;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const isActive = offset === 0;

            return (
              <motion.div
                key={item.orderItemId}
                drag={isActive ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={handleDragEnd}
                dragDirectionLock
                style={{ zIndex: 10 - Math.abs(offset) }}
                animate={{
                  x: offset * 40,
                  scale: isActive ? 1 : 0.9 - Math.abs(offset) * 0.05,
                  opacity: isActive ? 1 : 0.45 - Math.abs(offset) * 0.15,
                  rotate: isActive ? 0 : offset * 2,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                className={`absolute w-full h-full onboarding-card p-5 flex flex-col justify-between ${
                  isActive 
                    ? 'shadow-[0_0_24px_rgba(47,224,129,0.15)] border-[#2FE081]/30 touch-pan-x' 
                    : 'border-white/5 pointer-events-none'
                }`}
              >
                {/* TOP CENTER: Large Location Badge */}
                <div className="flex justify-center w-full pb-2 border-b border-white/5 shrink-0">
                  <span className="px-4 py-1.5 rounded-xl bg-[#2FE081]/10 border border-[#2FE081]/35 text-[#2FE081] text-[20px] font-black tracking-wider uppercase font-mono shadow-[0_0_12px_rgba(47,224,129,0.1)]">
                    {item.rack}-{item.shelf}
                  </span>
                </div>

                {/* Card Content Area - No scrollbars, fits everything sequentially */}
                <div className="flex-1 flex flex-col items-center justify-center py-2 gap-2 w-full min-h-0 overflow-y-auto scrollbar-none">
                  {/* CENTER: Product Image */}
                  <div className="w-28 h-28 bg-white/5 rounded-2xl p-2 shrink-0 border border-white/5 relative flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain filter drop-shadow-md pointer-events-none select-none" draggable={false} />
                    ) : (
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    )}
                    {item.isCold && (
                      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-[#00D2FF] to-[#3A7BD5] rounded-full flex items-center justify-center border-2 border-[#071A14] shadow-[0_0_8px_rgba(0,210,255,0.4)]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 2v20M17 4l-5 5-5-5M22 12H2M20 17l-5-5-5 5M17 20l-5-5-5 5M4 7l5 5 5-5M4 17l5-5 5 5"/></svg>
                      </div>
                    )}
                  </div>

                  {/* BELOW IMAGE: Quantity Pill Centered */}
                  <div className="shrink-0">
                    <span className="text-[12px] font-black text-[#2FE081] px-4.5 py-1 bg-[#2FE081]/15 border border-[#2FE081]/30 rounded-full uppercase tracking-wider">
                      QTY: {item.qty}
                    </span>
                  </div>

                  {/* BELOW QUANTITY: Product Name & Details */}
                  <div className="w-full text-center flex flex-col items-center gap-1 shrink-0">
                    <h3 className="text-white font-bold text-[14px] leading-tight tracking-wide line-clamp-1 max-w-[280px]">{item.name}</h3>
                    <p className="text-[11px] text-[rgba(255,255,255,0.45)] font-semibold">{item.weight}</p>

                    {/* Barcode details in content area */}
                    <div className="flex items-center gap-1.5 text-[rgba(255,255,255,0.4)] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      <span className="text-[10px] font-mono tracking-widest font-bold uppercase">{item.barcode}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 justify-center mt-0.5">
                      {item.isCold && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-[#00D2FF]/10 border border-[#00D2FF]/20 text-[#00D2FF] rounded font-bold uppercase tracking-wider">Cold-Chain</span>
                      )}
                      {item.isFragile && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-[#FF5252]/10 border border-[#FF5252]/20 text-[#FF5252] rounded font-bold uppercase tracking-wider">Fragile</span>
                      )}
                      {item.picked && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-[#2FE081]/10 border border-[#2FE081]/20 text-[#2FE081] rounded font-bold uppercase tracking-wider">Picked</span>
                      )}
                      {item.hasException && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-[#FF5252]/10 border border-[#FF5252]/20 text-[#FF5252] rounded font-bold uppercase tracking-wider">Shorted</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Scan trigger / Exception */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    {currentOrder.mappedCrate && (
                      <span className="text-[9px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-2 py-0.5 rounded uppercase tracking-wider border border-[#FF9F43]/20">
                        {currentOrder.mappedCrate}
                      </span>
                    )}
                  </div>
                  {isActive && !item.picked && !item.hasException && (
                    <button 
                      onClick={() => setShowExceptionModal(true)}
                      className="text-[9px] text-[#FF5252]/80 uppercase tracking-wider font-bold border border-[#FF5252]/30 px-2.5 py-1 rounded bg-[#FF5252]/10 active:scale-95 transition-all"
                    >
                      Issue?
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : allPicked && coldBagRequired && !coldBagScanned ? (
        /* Cold Bag Scanner Promotion */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-[280px]">
          <div className="w-16 h-16 rounded-2xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2">
              <path d="M12 2v20M2 12h20M12 2l4 4M12 2l-4 4M12 22l4-4M12 22l-4-4M2 12l4 4M2 12l4-4M22 12l-4 4M22 12l-4-4" />
            </svg>
          </div>
          <h2 className="text-[18px] font-black text-white uppercase tracking-wider mb-1.5">Cold Bag Required</h2>
          <p className="text-[12px] text-[rgba(255,255,255,0.5)] mb-6 leading-relaxed">
            Verify cold storage bag to finalize picking for frozen items.
          </p>
          <button 
            onClick={scanColdBag} 
            className="onboarding-btn shadow-[0_0_16px_rgba(47,224,129,0.15)]"
          >
            Verify Cold Bag
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-[280px]">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2.5" className="mb-2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 8 10 16 7 13" />
          </svg>
          <p className="text-[16px] font-bold text-white">{t('allItemsPicked')}</p>
          <p className="text-[12px] text-[rgba(255,255,255,0.4)] mt-1.5">{t('movingToPacking')}</p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// 4. BOTTOM ACTIONS
// ------------------------------------------------------------------
function BottomActions({ allPicked, currentItem, activeIndex, goToItem, total, onPick, t }) {
  return (
    <div className="px-6 pt-2 shrink-0 z-20 flex flex-col gap-3" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))' }}>
      <div className="flex gap-3">
        {!allPicked && currentItem && (
          <>
            <button 
              onClick={() => goToItem(activeIndex - 1)} 
              disabled={activeIndex === 0} 
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            {!currentItem.picked && !currentItem.hasException ? (
              <button 
                onClick={onPick} 
                className="flex-1 py-4 bg-gradient-to-r from-[#2FE081] to-[#25b869] rounded-2xl text-[#03110D] font-black text-[15px] tracking-wide uppercase flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(47,224,129,0.2)] border border-[#50FFAA]/20 transition-all active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Product Picked
              </button>
            ) : (
              <div className={`flex-1 py-4 border rounded-2xl font-extrabold text-[15px] uppercase flex items-center justify-center gap-1.5 ${currentItem.hasException ? 'bg-[#FF5252]/10 border-[#FF5252]/30 text-[#FF5252]' : 'bg-[#2FE081]/10 border-[#2FE081]/30 text-[#2FE081]'}`}>
                {currentItem.hasException ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    {currentItem.exceptionReason}
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="16 8 10 16 7 13" />
                    </svg>
                    {t('picked')}
                  </>
                )}
              </div>
            )}

            <button 
              onClick={() => goToItem(activeIndex + 1)} 
              disabled={activeIndex === total - 1} 
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center disabled:opacity-20 active:scale-95 transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 5. MAIN PICKING SCREEN
// ------------------------------------------------------------------
export default function PickingScreen() {
  const navigate = useNavigate();
  const { 
    currentOrder, 
    scanFeedback, 
    simulateScan, 
    pickingTimer, 
    orderTimerLimit, 
    coldBagRequired, 
    coldBagScanned, 
    scanColdBag, 
    reportException,
    cancelPicking,
    finishPicking,
    completionSummary,
    t 
  } = useStore();

  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Clean up and back tracking guard
  useEffect(() => {
    if (!currentOrder && !completionSummary) {
      navigate('/orders', { replace: true });
    }
  }, [currentOrder, completionSummary, navigate]);

  if (!currentOrder && !completionSummary) return null;
  if (!currentOrder) return null; // We are in transit to completion screen

  const items = currentOrder.items;
  const pickedCount = items.filter(i => i.picked || i.hasException).length;
  const total = items.length;
  const progress = (pickedCount / total) * 100;
  const allPicked = pickedCount === total;
  const timerUrgent = pickingTimer > orderTimerLimit * 0.75;
  const timerCritical = pickingTimer >= orderTimerLimit;
  const mm = Math.floor(pickingTimer / 60).toString().padStart(2, '0');
  const ss = (pickingTimer % 60).toString().padStart(2, '0');
  const timerLimitMM = Math.floor(orderTimerLimit / 60).toString().padStart(2, '0');
  const timerLimitSS = (orderTimerLimit % 60).toString().padStart(2, '0');

  const remainingRacks = [...new Set((items || []).filter(i => !i?.picked).map(i => i?.rack))].sort();
  const currentItem = items[activeIndex];

  const handleException = (reason) => {
    reportException(activeIndex, reason);
    setShowExceptionModal(false);
  };

  const handleScan = (barcode) => {
    simulateScan(barcode, activeIndex);
  };

  const handleColdBagScan = (_barcode) => {
    scanColdBag();
    setShowColdBagScanner(false);
  };

  const goToItem = (idx) => {
    if (idx >= 0 && idx < total) setActiveIndex(idx);
  };

  // Auto-advance
  const prevFeedback = useRef(null);
  useEffect(() => {
    if (scanFeedback?.type === 'success' || (scanFeedback?.type === 'error' && currentItem?.hasException)) {
      if (prevFeedback.current !== scanFeedback) {
        prevFeedback.current = scanFeedback;
        const nextUnpicked = items.findIndex((item, idx) => !item.picked && !item.hasException && idx !== activeIndex);
        if (nextUnpicked !== -1) {
          const timer = setTimeout(() => {
            setActiveIndex(nextUnpicked);
          }, 1100);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [scanFeedback, items, activeIndex, currentItem]);

  // Auto-finish picking when all items are processed
  useEffect(() => {
    let hasFinished = false;
    if (allPicked) {
      if (!coldBagRequired || coldBagScanned) {
        const timer = setTimeout(() => {
          hasFinished = true;
          finishPicking();
          navigate('/picking-completed', { replace: true });
        }, 1500);
        return () => {
          clearTimeout(timer);
          if (!hasFinished) {
            finishPicking();
          }
        };
      }
    }
  }, [allPicked, coldBagRequired, coldBagScanned, finishPicking, navigate]);

  return (
    <div className="screen onboarding-flow flex flex-col justify-between overflow-y-auto" style={{ touchAction: "pan-y" }}>
      
      {/* Scan Feedback Overlay - Centered card over a dimmed backdrop */}
      <AnimatePresence>
        {scanFeedback && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[300] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.85, y: 20 }}
              className={`w-full max-w-[320px] rounded-3xl p-6 flex flex-col items-center text-center gap-4 shadow-xl border ${
                scanFeedback.type === 'success' 
                  ? 'bg-[#071A14] border-[#2FE081]/30 shadow-[0_0_32px_rgba(47,224,129,0.15)]' 
                  : 'bg-[#1A0707] border-[#FF5252]/30 shadow-[0_0_32px_rgba(255,82,82,0.15)]'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                scanFeedback.type === 'success' ? 'bg-[#2FE081]/10 border border-[#2FE081]/30 text-[#2FE081]' : 'bg-[#FF5252]/10 border border-[#FF5252]/30 text-[#FF5252]'
              }`}>
                {scanFeedback.type === 'success' ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              <h2 className={`text-[18px] font-black uppercase tracking-wider ${
                scanFeedback.type === 'success' ? 'text-[#2FE081]' : 'text-[#FF5252]'
              }`}>
                {scanFeedback.type === 'success' ? 'Product Confirmed' : 'Wrong Product'}
              </h2>
              <p className="text-[13px] text-white/80 max-w-[280px]">
                {scanFeedback.type === 'success' 
                  ? scanFeedback.item?.name 
                  : scanFeedback.item?.hasException 
                    ? `Marked as: ${scanFeedback.message}` 
                    : 'Barcode mismatch. Please scan the correct product.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header 
        currentOrder={currentOrder}
        pickingTimer={pickingTimer}
        orderTimerLimit={orderTimerLimit}
        timerCritical={timerCritical}
        timerUrgent={timerUrgent}
        mm={mm}
        ss={ss}
        timerLimitMM={timerLimitMM}
        timerLimitSS={timerLimitSS}
        setShowRoutePreview={setShowRoutePreview}
      />
      
      <ProgressSection 
        pickedCount={pickedCount}
        total={total}
        progress={progress}
        timerCritical={timerCritical}
        timerUrgent={timerUrgent}
        remainingRacks={remainingRacks}
        currentItem={currentItem}
        items={items}
        activeIndex={activeIndex}
        goToItem={goToItem}
        t={t}
      />

      <ProductCarousel 
        items={items}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        total={total}
        currentOrder={currentOrder}
        setShowExceptionModal={setShowExceptionModal}
        allPicked={allPicked}
        currentItem={currentItem}
        coldBagRequired={coldBagRequired}
        coldBagScanned={coldBagScanned}
        scanColdBag={scanColdBag}
        t={t}
      />

      <BottomActions 
        allPicked={allPicked}
        currentItem={currentItem}
        activeIndex={activeIndex}
        goToItem={goToItem}
        total={total}
        onPick={() => simulateScan(currentItem.barcode, activeIndex)}
        t={t}
      />

      <AnimatePresence>
        
        {showExceptionModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-[#071A14] border-t border-[rgba(255,255,255,0.05)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-black text-white uppercase tracking-wide">Report Issue</h3>
                <button onClick={() => setShowExceptionModal(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleException('Out of Stock')} className="w-full py-4 rounded-xl bg-[#FF9F43]/10 border border-[#FF9F43]/30 text-[#FF9F43] font-black tracking-wider uppercase text-[14px] active:scale-[0.98] transition-transform">Out of Stock</button>
                <button onClick={() => handleException('Shelf Empty')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold tracking-wider uppercase text-[14px] active:scale-[0.98] transition-transform">Shelf Empty</button>
                <button onClick={() => handleException('Damaged Item')} className="w-full py-4 rounded-xl bg-[#FF5252]/10 border border-[#FF5252]/30 text-[#FF5252] font-black tracking-wider uppercase text-[14px] active:scale-[0.98] transition-transform">Damaged Item</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {showRoutePreview && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[200] bg-[#03110D]/90 backdrop-blur-sm flex flex-col justify-end"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-[#071A14] border-t border-[rgba(255,255,255,0.05)] rounded-t-[24px] p-6 pb-10 max-w-[430px] mx-auto w-full max-h-[85vh] overflow-y-auto scrollbar-none"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FE081" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                  Route Preview
                </h3>
                <button onClick={() => setShowRoutePreview(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {Object.entries(
                  items.reduce((acc, item) => {
                    if (!acc[item.rack]) acc[item.rack] = [];
                    acc[item.rack].push(item);
                    return acc;
                  }, {})
                ).map(([rack, rackItems]) => (
                  <div key={rack} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                      <span className="text-white font-black text-[15px] tracking-wide">{rack}</span>
                      {rack.includes('C') && rackItems.length >= 1 && (
                         <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/15 px-2 py-0.5 rounded flex items-center gap-1">
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                           High Traffic
                         </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      {(rackItems || []).map(i => (
                        <div key={i.orderItemId} className="flex justify-between items-center">
                          <span className={`text-[13px] font-semibold tracking-wide ${i.picked || i.hasException ? 'text-white/30 line-through' : 'text-white/90'}`}>{i.name}</span>
                          <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded ${i.picked || i.hasException ? 'text-white/30 bg-white/5' : 'text-white/70 bg-white/10'}`}>{i.shelf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
