import { Menu, Bell, Sun, Moon, Search, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMobileMenuOpen, breadcrumbs = [] }) {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const profileItems = [
    { label: 'My Profile', icon: null, onClick: () => navigate(`/${user?.role?.toLowerCase()}/profile`) },
    { label: 'Settings', icon: null, onClick: () => navigate(`/${user?.role?.toLowerCase()}/settings`) },
    { divider: true },
    { label: 'Logout', icon: null, onClick: handleLogout, danger: true },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 flex items-center px-4 gap-4 sticky top-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={14} className="text-slate-400 shrink-0" />}
            {i < breadcrumbs.length - 1 ? (
              <button
                onClick={() => navigate(crumb.to)}
                className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{crumb.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Profile */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1">
              <Avatar name={user?.fullName || ''} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{user?.role}</p>
              </div>
            </button>
          }
          items={profileItems}
        />
      </div>
    </header>
  );
}
