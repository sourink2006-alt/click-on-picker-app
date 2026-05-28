import { NavLink } from 'react-router-dom';
import useStore from '../store/useStore';

const tabs = [
  {
    path: '/home',
    labelKey: 'home',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    path: '/orders',
    labelKey: 'orders',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
  },
  {
    path: '/earnings',
    labelKey: 'earnings',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  },
  {
    path: '/notifications',
    labelKey: 'alerts',
    hasBadge: true,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  },
  {
    path: '/profile',
    labelKey: 'profile',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  },
];

export default function BottomNav() {
  const unreadCount = useStore(state => state.unreadCount);
  const pickingLocked = useStore(state => state.pickingLocked);
  const t = useStore(state => state.t);

  if (pickingLocked) return null;

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <NavLink key={tab.path} to={tab.path} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <div className="relative">
            {tab.icon}
            {tab.hasBadge && unreadCount > 0 && <span className="badge-dot" />}
          </div>
          <span>{t(tab.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
