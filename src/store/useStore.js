import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { MOCK_ORDERS, DASHBOARD_STATS, PICKER_PROFILE, NOTIFICATIONS, EARNINGS_DATA, getOptimizedRoute, calculateTimerSeconds } from '../data/mockData';
import translations from '../i18n/translations';

const useStore = create(
  persist(
    (set, get) => ({
      // --- Language ---
  lang: 'en',
  t: (key) => {
    const lang = get().lang;
    return (translations[lang] && translations[lang][key]) || translations.en[key] || key;
  },
  setLanguage: (code) => set({ lang: code }),

  // --- Auth ---
  isAuthenticated: false,
  otpSent: false,

  // --- Picker Verification / Face Scan ---
  isVerified: false,
  faceScanActive: false,
  faceScanStep: 'guidance', // guidance | scanning | verifying | success | error

  // --- Picker ---
  picker: PICKER_PROFILE,
  isOnline: false,

  // --- Dashboard ---
  stats: DASHBOARD_STATS,

  // --- Orders ---
  orders: MOCK_ORDERS,
  currentOrder: null,
  orderAlert: null,
  pickingTimer: 0,
  pickingTimerInterval: null,
  pickingLocked: false,
  orderTimerLimit: 0, // dynamic SLA in seconds
  completionSummary: null,

  // --- Cold bag ---
  coldBagRequired: false,
  coldBagScanned: false,

  // --- Scanner ---
  scanFeedback: null,
  continuousScanMode: false,

  // --- Notifications ---
  notifications: NOTIFICATIONS,
  unreadCount: NOTIFICATIONS.filter(n => !n.read).length,

  // --- Earnings ---
  earnings: EARNINGS_DATA,

  // --- Packing checklist ---
  packingChecklist: { coldSeparated: false, fragilePacked: false, labelAttached: false, bagsCorrect: false },

  // --- OTP resend ---
  resendCooldown: 0,
  resendInterval: null,

  // --- Toast ---
  toast: null,

  // ======== Auth Actions ========
  setPhoneNumber: (phone) => set(state => ({ picker: { ...state.picker, phone } })),
  updatePicker: (updates) => set(state => ({ picker: { ...state.picker, ...updates } })),
  sendOtp: () => {
    const oldIv = get().resendInterval;
    if (oldIv) clearInterval(oldIv);

    set({ otpSent: true, resendCooldown: 30 });
    const iv = setInterval(() => {
      const cd = get().resendCooldown;
      if (cd <= 1) { clearInterval(iv); set({ resendCooldown: 0, resendInterval: null }); }
      else set({ resendCooldown: cd - 1 });
    }, 1000);
    set({ resendInterval: iv });
  },
  resendOtp: () => {
    if (get().resendCooldown > 0) return;
    
    const oldIv = get().resendInterval;
    if (oldIv) clearInterval(oldIv);

    set({ resendCooldown: 30, toast: { message: get().t('otpSentSuccess'), type: 'success' } });
    setTimeout(() => set({ toast: null }), 2500);
    const iv = setInterval(() => {
      const cd = get().resendCooldown;
      if (cd <= 1) { clearInterval(iv); set({ resendCooldown: 0, resendInterval: null }); }
      else set({ resendCooldown: cd - 1 });
    }, 1000);
    set({ resendInterval: iv });
  },
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    const { resendInterval, pickingTimerInterval } = get();
    if (resendInterval) clearInterval(resendInterval);
    if (pickingTimerInterval) clearInterval(pickingTimerInterval);
    set({ 
      isAuthenticated: false, 
      otpSent: false, 
      picker: { ...get().picker, phone: '' },
      isOnline: false, 
      resendCooldown: 0, 
      resendInterval: null,
      faceScanActive: false, 
      isVerified: false,
      currentOrder: null,
      orderAlert: null,
      pickingTimer: 0,
      pickingTimerInterval: null,
      pickingLocked: false,
      orderTimerLimit: 0,
      completionSummary: null,
      coldBagRequired: false,
      coldBagScanned: false,
      scanFeedback: null,
      continuousScanMode: false,
      packingChecklist: { coldSeparated: false, fragilePacked: false, labelAttached: false, bagsCorrect: false },
      toast: null
    });
  },

  // ======== Face Verification ========
  startFaceScan: () => set({ faceScanActive: true, faceScanStep: 'guidance' }),
  setFaceScanStep: (step) => set({ faceScanStep: step }),
  completeFaceScan: () => {
    set({ faceScanActive: false, isVerified: true, isOnline: true });
  },
  cancelFaceScan: () => set({ faceScanActive: false }),

  // ======== Online/Offline ========
  toggleOnline: () => {
    const { isOnline } = get();
    if (!isOnline) {
      set({ faceScanActive: true, faceScanStep: 'guidance', isVerified: false });
    } else {
      set({ isOnline: false, isVerified: false });
    }
  },

  // ======== Order Actions ========
  acceptOrder: (orderId) => {
    const { orders } = get();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const sortedItems = getOptimizedRoute(order.items);
    const updated = { ...order, status: 'picking', items: sortedItems };
    const timerLimit = Math.round(calculateTimerSeconds(sortedItems.length));
    const hasCold = sortedItems.some(i => i.isCold);
    set({
      currentOrder: updated,
      orderAlert: null,
      orders: orders.map(o => o.id === orderId ? updated : o),
      pickingTimer: 0,
      pickingLocked: true,
      orderTimerLimit: timerLimit,
      coldBagRequired: hasCold,
      coldBagScanned: false,
    });
    const interval = setInterval(() => {
      set(state => ({ pickingTimer: state.pickingTimer + 1 }));
    }, 1000);
    set({ pickingTimerInterval: interval });
  },

  // Enhancement layer: optional crate mapping (does NOT block picking)
  mapCrate: (crateId) => {
    const { currentOrder, orders } = get();
    if (!currentOrder) return;
    const updated = { ...currentOrder, mappedCrate: crateId };
    set({
      currentOrder: updated,
      orders: orders.map(o => o.id === currentOrder.id ? updated : o),
    });
  },

  autoAcceptAlert: () => {
    const { orderAlert } = get();
    if (orderAlert) get().acceptOrder(orderAlert.id);
  },

  // ======== Scanning ========
  simulateScan: (barcode, activeIndex) => {
    const { currentOrder } = get();
    if (!currentOrder) return;
    const activeItem = currentOrder.items[activeIndex];
    if (!activeItem) return;

    if (activeItem.barcode === barcode) {
      const updated = [...currentOrder.items];
      updated[activeIndex] = { ...updated[activeIndex], picked: true };
      const updatedOrder = { ...currentOrder, items: updated };
      const allPicked = updated.every(i => i.picked || i.hasException);
      set({
        currentOrder: updatedOrder,
        scanFeedback: { type: 'success', message: get().t('itemConfirmed'), item: updated[activeIndex] },
      });
      setTimeout(() => set({ scanFeedback: null }), 1200);
      if (allPicked) {
        setTimeout(() => {
          const { pickingTimerInterval, coldBagScanned } = get();
          const hasPickedCold = updated.some(i => i.isCold && i.picked);
          if (pickingTimerInterval) clearInterval(pickingTimerInterval);
          if (hasPickedCold && !coldBagScanned) {
            set({ pickingTimerInterval: null, coldBagRequired: true });
            return;
          }
          // Auto-finish and navigate happens in the component now.
        }, 1500);
      }
    } else {
      set({ scanFeedback: { type: 'error', message: get().t('wrongProductScanned') } });
      setTimeout(() => set({ scanFeedback: null }), 2500);
    }
  },

  reportException: (activeIndex, reason) => {
    const { currentOrder } = get();
    if (!currentOrder) return;
    
    const updated = [...currentOrder.items];
    updated[activeIndex] = { ...updated[activeIndex], hasException: true, exceptionReason: reason };
    const updatedOrder = { ...currentOrder, items: updated };
    const allPicked = updated.every(i => i.picked || i.hasException);
    
    set({
      currentOrder: updatedOrder,
      scanFeedback: { type: 'error', message: reason, item: updated[activeIndex] },
    });
    
    setTimeout(() => set({ scanFeedback: null }), 1500);
    
    if (allPicked) {
      setTimeout(() => {
        const { pickingTimerInterval, coldBagScanned } = get();
        const hasPickedCold = updated.some(i => i.isCold && i.picked);
        if (pickingTimerInterval) clearInterval(pickingTimerInterval);
        if (hasPickedCold && !coldBagScanned) {
          set({ pickingTimerInterval: null, coldBagRequired: true });
          return;
        }
        // Auto-finish and navigate happens in the component now.
        // The component will watch allPicked and trigger finishPicking().
      }, 1500);
    }
  },

  toggleContinuousScanMode: () => set(state => ({ continuousScanMode: !state.continuousScanMode })),

  // ======== Cold bag ========
  scanColdBag: () => {
    const { currentOrder } = get();
    set({ coldBagScanned: true, scanFeedback: { type: 'success', message: get().t('coldBagVerified') } });
    setTimeout(() => set({ scanFeedback: null }), 1200);
    if (currentOrder && currentOrder.items.every(i => i.picked || i.hasException)) {
      // Auto-finish handled by component
    }
  },

  // ======== Finish picking (creates summary and clears currentOrder) ========
  finishPicking: () => {
    const { currentOrder, orders, stats, pickingTimerInterval, pickingTimer } = get();
    if (!currentOrder) return;
    
    if (pickingTimerInterval) clearInterval(pickingTimerInterval);
    
    const pickedCount = currentOrder.items.filter(i => i.picked).length;
    const unavailableCount = currentOrder.items.filter(i => i.hasException).length;
    
    const summary = {
      orderId: currentOrder.id,
      deliveryAgent: currentOrder.deliveryAgent || 'Pending',
      bagCount: currentOrder.bagCount || 1,
      pickedCount,
      unavailableCount,
      totalItems: currentOrder.items.length,
      completionTime: pickingTimer,
      earnings: 25 // mock earnings
    };
    
    set({
      completionSummary: summary,
      currentOrder: null,
      pickingLocked: false,
      orders: orders.map(o => o.id === currentOrder.id ? { 
        ...o, 
        status: 'delivered',
        completionTime: pickingTimer,
        earnings: 25,
        accuracy: Math.round((pickedCount / (pickedCount + unavailableCount || 1)) * 100)
      } : o),
      stats: { ...stats, ordersCompleted: stats.ordersCompleted + 1 },
      pickingTimerInterval: null,
      pickingTimer: 0,
      coldBagRequired: false,
      coldBagScanned: false,
      scanFeedback: null,
      continuousScanMode: false
    });
  },

  clearCompletion: () => {
    set({ completionSummary: null });
  },

  // ======== Cancel picking / state cleanup ========
  cancelPicking: () => {
    const { pickingTimerInterval } = get();
    if (pickingTimerInterval) clearInterval(pickingTimerInterval);
    set({
      currentOrder: null,
      pickingLocked: false,
      pickingTimerInterval: null,
      pickingTimer: 0,
      coldBagRequired: false,
      coldBagScanned: false,
      scanFeedback: null,
      continuousScanMode: false
    });
  },

  // ======== Notifications ========
  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      unreadCount: state.notifications.filter(n => !n.read && n.id !== id).length,
    }));
  },

  // ======== Demo ========
  triggerNewOrder: () => {
    const pending = get().orders.filter(o => o.status === 'pending');
    if (pending.length > 0) set({ orderAlert: pending[0] });
  },
    }),
    {
      name: 'picker-store-v4', // bump version to clear potentially corrupted state
      partialize: (state) => ({
        isOnline: state.isOnline,
        isAuthenticated: state.isAuthenticated,
        continuousScanMode: state.continuousScanMode,
        isVerified: state.isVerified,
      }),
    }
  )
);

// Hydration hook: components can await store rehydration before rendering
export function useHydrated() {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated());
  useEffect(() => {
    console.log('[DEBUG] useHydrated hook mount, hasHydrated:', useStore.persist.hasHydrated());
    const unsub = useStore.persist.onFinishHydration(() => {
      console.log('[DEBUG] persist.onFinishHydration triggered');
      setHydrated(true);
    });
    return unsub;
  }, []);
  return hydrated;
}

export default useStore;
