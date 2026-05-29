import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingStyles.css';
import { permissionService } from '../services/permissionService';

export default function PermissionsScreen() {
  const navigate = useNavigate();
  const [camera, setCamera] = useState('denied'); // 'granted' | 'denied' | 'permanently_denied'
  const [location, setLocation] = useState('denied');
  const [notifications, setNotifications] = useState('denied');

  const checkAll = async () => {
    const cam = await permissionService.queryPermission('camera');
    const loc = await permissionService.queryPermission('location');
    const notif = await permissionService.queryPermission('notifications');
    setCamera(cam);
    setLocation(loc);
    setNotifications(notif);
  };

  useEffect(() => {
    checkAll();
    
    // Check permission state when window gets focus (e.g. user returns from settings)
    window.addEventListener('focus', checkAll);
    return () => window.removeEventListener('focus', checkAll);
  }, []);

  const handleRequest = async (type) => {
    const result = await permissionService.requestPermission(type);
    if (type === 'camera') setCamera(result);
    if (type === 'location') setLocation(result);
    if (type === 'notifications') setNotifications(result);
    checkAll();
  };

  const handleOpenSettings = () => {
    permissionService.openSettings();
  };

  const allGranted = camera === 'granted' && location === 'granted' && notifications === 'granted';

  const handleContinue = () => {
    if (allGranted) {
      navigate('/city');
    }
  };

  const renderStatus = (status, type) => {
    if (status === 'granted') {
      return (
        <span className="text-[12px] font-extrabold text-[#2FE081] bg-[#2FE081]/15 px-2.5 py-1 rounded border border-[#2FE081]/20 uppercase tracking-wide">
          ✔ Granted
        </span>
      );
    }
    if (status === 'permanently_denied') {
      return (
        <button
          onClick={handleOpenSettings}
          className="py-1.5 px-3 rounded-full bg-[#FF5252]/10 border border-[#FF5252]/20 text-[#FF5252] font-bold text-[11px] hover:bg-[#FF5252]/20 active:scale-95 transition-transform"
        >
          Open Settings
        </button>
      );
    }
    return (
      <button
        onClick={() => handleRequest(type)}
        className="py-1.5 px-4 rounded-full bg-[#2FE081]/10 border border-[#2FE081]/20 text-[#2FE081] font-bold text-[11px] hover:bg-[#2FE081]/20 active:scale-95 transition-transform"
      >
        Grant
      </button>
    );
  };

  return (
    <div className="onboarding-flow px-6 py-safe flex flex-col">
      {/* Header/Back Button */}
      <div className="flex justify-between items-center mb-8">
        <div 
          className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer" 
          onClick={() => navigate(-1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <button 
          onClick={() => navigate('/city')} 
          className="text-[14px] font-bold text-[rgba(255,255,255,0.5)] pr-2"
        >
          Skip for now
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h1 className="onboarding-heading mb-2">Enable Permissions</h1>
        <p className="onboarding-subtext mb-8">We need device access to verify your identity and warehouse routing.</p>

        <div className="onboarding-card p-5 flex flex-col gap-5 relative overflow-hidden">
          {/* Permission item 1: Location */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-0.5">Location Access</h3>
                <p className="text-[11.5px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[170px]">
                  Required to identify nearest warehouse hub and assign nearby orders.
                </p>
                {location !== 'granted' && (
                  <p className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 font-semibold">
                    {location === 'permanently_denied' 
                      ? 'Blocked: please reset site permissions.' 
                      : 'Not granted yet. Geolocation is required.'}
                  </p>
                )}
              </div>
            </div>
            <div className="shrink-0 pt-1">
              {renderStatus(location, 'location')}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Permission item 2: Camera */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-0.5">Camera Access</h3>
                <p className="text-[11.5px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[170px]">
                  Used to perform face scan selfie checks and scanning QR codes.
                </p>
                {camera !== 'granted' && (
                  <p className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 font-semibold">
                    {camera === 'permanently_denied' 
                      ? 'Blocked: please reset site permissions.' 
                      : 'Camera hardware access is required.'}
                  </p>
                )}
              </div>
            </div>
            <div className="shrink-0 pt-1">
              {renderStatus(camera, 'camera')}
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Permission item 3: Notifications */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2FE081]/15 border border-[#2FE081]/25 flex items-center justify-center text-[#2FE081] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white mb-0.5">Notifications</h3>
                <p className="text-[11.5px] text-[rgba(255,255,255,0.45)] leading-relaxed max-w-[170px]">
                  Receive real-time alerts for newly assigned batch picking orders.
                </p>
                {notifications !== 'granted' && (
                  <p className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 font-semibold">
                    {notifications === 'permanently_denied' 
                      ? 'Notifications are blocked in settings.' 
                      : 'Alert permission required.'}
                  </p>
                )}
              </div>
            </div>
            <div className="shrink-0 pt-1">
              {renderStatus(notifications, 'notifications')}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 pt-4">
        <button 
          onClick={handleContinue}
          disabled={!allGranted}
          className="onboarding-btn disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
