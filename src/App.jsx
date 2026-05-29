import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useStore, { useHydrated } from './store/useStore';
import BottomNav from './components/BottomNav';
import FaceScanModal from './components/FaceScanModal';
import SplashScreen from './screens/SplashScreen';
import LanguageScreen from './screens/LanguageScreen';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import CityScreen from './screens/CityScreen';
import HubScreen from './screens/HubScreen';
import AadhaarScreen from './screens/AadhaarScreen';
import SelfieGuideScreen from './screens/SelfieGuideScreen';
import LiveSelfieScreen from './screens/LiveSelfieScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import PANVerificationScreen from './screens/PANVerificationScreen';
import PersonalDetailsVerifiedScreen from './screens/PersonalDetailsVerifiedScreen';
import BankAccountDetailsScreen from './screens/BankAccountDetailsScreen';
import BankVerificationSubmittedScreen from './screens/BankVerificationSubmittedScreen';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import PickingScreen from './screens/PickingScreen';
import PickingCompletedScreen from './screens/PickingCompletedScreen';
import EarningsScreen from './screens/EarningsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import HelpScreen from './screens/HelpScreen';
import TrainingScreen from './screens/TrainingScreen';
import GlobalHeader from './components/GlobalHeader';
import ErrorBoundary from './components/ErrorBoundary';

function AppRoutes() {
  const location = useLocation();
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const pickingLocked = useStore(state => state.pickingLocked);
  const faceScanActive = useStore(state => state.faceScanActive);

  console.log('[DEBUG_APP_ROUTE] path:', location.pathname, 'isAuthenticated:', isAuthenticated);

  const mainPaths = ['/home', '/orders', '/earnings', '/notifications', '/profile'];
  const showNav = isAuthenticated && mainPaths.includes(location.pathname) && !pickingLocked;
  const showHeader = showNav && location.pathname !== '/profile';

  return (
    <div className="app-shell bg-[#03110D]">
      {showHeader && <GlobalHeader />}
      
      <Routes location={location}>
        {/* Unauthenticated routes: Redirect authenticated users to /home */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <SplashScreen />} />
        <Route path="/language" element={isAuthenticated ? <Navigate to="/home" replace /> : <LanguageScreen />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginScreen />} />
        <Route path="/otp" element={isAuthenticated ? <Navigate to="/home" replace /> : <OtpScreen />} />
        <Route path="/permissions" element={isAuthenticated ? <Navigate to="/home" replace /> : <PermissionsScreen />} />
        <Route path="/city" element={isAuthenticated ? <Navigate to="/home" replace /> : <CityScreen />} />
        <Route path="/hub" element={isAuthenticated ? <Navigate to="/home" replace /> : <HubScreen />} />
        <Route path="/aadhaar" element={isAuthenticated ? <Navigate to="/home" replace /> : <AadhaarScreen />} />
        <Route path="/pan-verification" element={isAuthenticated ? <Navigate to="/home" replace /> : <PANVerificationScreen />} />
        <Route path="/personal-details-verified" element={isAuthenticated ? <Navigate to="/home" replace /> : <PersonalDetailsVerifiedScreen />} />
        <Route path="/bank-details" element={isAuthenticated ? <Navigate to="/home" replace /> : <BankAccountDetailsScreen />} />
        <Route path="/bank-submitted" element={isAuthenticated ? <Navigate to="/home" replace /> : <BankVerificationSubmittedScreen />} />
        <Route path="/selfie-guide" element={isAuthenticated ? <Navigate to="/home" replace /> : <SelfieGuideScreen />} />
        <Route path="/live-selfie" element={isAuthenticated ? <Navigate to="/home" replace /> : <LiveSelfieScreen />} />

        {/* Authenticated routes: Redirect unauthenticated users to /login */}
        <Route path="/home" element={isAuthenticated ? <HomeScreen /> : <Navigate to="/login" replace />} />
        <Route path="/orders" element={isAuthenticated ? <OrdersScreen /> : <Navigate to="/login" replace />} />
        <Route path="/picking" element={isAuthenticated ? <PickingScreen /> : <Navigate to="/login" replace />} />
        <Route path="/picking-completed" element={isAuthenticated ? <PickingCompletedScreen /> : <Navigate to="/login" replace />} />
        <Route path="/earnings" element={isAuthenticated ? (pickingLocked ? <Navigate to="/orders" replace /> : <EarningsScreen />) : <Navigate to="/login" replace />} />
        <Route path="/notifications" element={isAuthenticated ? (pickingLocked ? <Navigate to="/orders" replace /> : <NotificationsScreen />) : <Navigate to="/login" replace />} />
        <Route path="/profile" element={isAuthenticated ? (pickingLocked ? <Navigate to="/orders" replace /> : <ProfileScreen />) : <Navigate to="/login" replace />} />
        <Route path="/help" element={isAuthenticated ? <HelpScreen /> : <Navigate to="/login" replace />} />
        <Route path="/training" element={isAuthenticated ? <TrainingScreen /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showNav && <BottomNav />}

      <AnimatePresence>
        {faceScanActive && <FaceScanModal />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const hydrated = useHydrated();
  console.log('[DEBUG_APP_MOUNT] hydrated:', hydrated);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#03110D] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#2FE081]/25 border-t-[#2FE081] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
