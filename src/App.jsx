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

const PublicRoute = ({ children }) => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isKycCompleted = localStorage.getItem('picker_kyc_completed') === 'true';
  if (isAuthenticated) return <Navigate to={isKycCompleted ? "/home" : "/permissions"} replace />;
  return children;
};

const KycRoute = ({ children }) => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isKycCompleted = localStorage.getItem('picker_kyc_completed') === 'true';
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isKycCompleted) return <Navigate to="/home" replace />;
  return children;
};

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  const isKycCompleted = localStorage.getItem('picker_kyc_completed') === 'true';
  const pickingLocked = useStore(state => state.pickingLocked);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isKycCompleted) return <Navigate to="/permissions" replace />;
  
  return children;
};

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
        {/* Public Routes (Unauthenticated only) */}
        <Route path="/" element={<PublicRoute><SplashScreen /></PublicRoute>} />
        <Route path="/language" element={<PublicRoute><LanguageScreen /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/otp" element={<PublicRoute><OtpScreen /></PublicRoute>} />

        {/* KYC Routes (Authenticated but KYC Pending) */}
        <Route path="/permissions" element={<KycRoute><PermissionsScreen /></KycRoute>} />
        <Route path="/city" element={<KycRoute><CityScreen /></KycRoute>} />
        <Route path="/hub" element={<KycRoute><HubScreen /></KycRoute>} />
        <Route path="/aadhaar" element={<KycRoute><AadhaarScreen /></KycRoute>} />
        <Route path="/pan-verification" element={<KycRoute><PANVerificationScreen /></KycRoute>} />
        <Route path="/personal-details-verified" element={<KycRoute><PersonalDetailsVerifiedScreen /></KycRoute>} />
        <Route path="/bank-details" element={<KycRoute><BankAccountDetailsScreen /></KycRoute>} />
        <Route path="/bank-submitted" element={<KycRoute><BankVerificationSubmittedScreen /></KycRoute>} />
        <Route path="/selfie-guide" element={<KycRoute><SelfieGuideScreen /></KycRoute>} />
        <Route path="/live-selfie" element={<KycRoute><LiveSelfieScreen /></KycRoute>} />

        {/* Protected Dashboard Routes (Authenticated + KYC Complete) */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersScreen /></ProtectedRoute>} />
        <Route path="/picking" element={<ProtectedRoute><PickingScreen /></ProtectedRoute>} />
        <Route path="/picking-completed" element={<ProtectedRoute><PickingCompletedScreen /></ProtectedRoute>} />
        
        {/* Lock access to generic routes if currently picking */}
        <Route path="/earnings" element={<ProtectedRoute>{pickingLocked ? <Navigate to="/orders" replace /> : <EarningsScreen />}</ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute>{pickingLocked ? <Navigate to="/orders" replace /> : <NotificationsScreen />}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>{pickingLocked ? <Navigate to="/orders" replace /> : <ProfileScreen />}</ProtectedRoute>} />
        
        <Route path="/help" element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><TrainingScreen /></ProtectedRoute>} />
        
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
