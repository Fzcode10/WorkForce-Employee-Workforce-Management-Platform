import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, GitBranch, UserCog,
  BarChart3, Settings, ChevronLeft, ChevronRight, Briefcase,
  CalendarDays, UserCircle, ClipboardList, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const navConfig = {
  Admin: [
    { label: 'Overview', icon: LayoutDashboard, to: '/admin' },
    { label: 'Employees', icon: Users, to: '/admin/employees' },
    { label: 'Departments', icon: Building2, to: '/admin/departments' },
    { label: 'Branches', icon: GitBranch, to: '/admin/branches' },
    { label: 'User Management', icon: UserCog, to: '/admin/users' },
    { label: 'Reports', icon: BarChart3, to: '/admin/reports' },
    { label: 'Settings', icon: Settings, to: '/admin/settings' },
  ],
  HR: [
    { label: 'Overview', icon: LayoutDashboard, to: '/hr' },
    { label: 'Employee Directory', icon: Users, to: '/hr/employees' },
    { label: 'Onboarding', icon: ClipboardList, to: '/hr/onboarding' },
    { label: 'Departments', icon: Building2, to: '/hr/departments' },
    { label: 'Branches', icon: GitBranch, to: '/hr/branches' },
    { label: 'Reports', icon: BarChart3, to: '/hr/reports' },
  ],
  Employee: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/employee' },
    { label: 'My Profile', icon: UserCircle, to: '/employee/profile' },
    { label: 'Attendance', icon: CalendarDays, to: '/employee/attendance' },
    { label: 'Department', icon: Building2, to: '/employee/department' },
    { label: 'Settings', icon: Settings, to: '/employee/settings' },
  ],
};

const roleBadgeColors = {
  Admin: 'bg-purple-500/20 text-purple-300',
  HR: 'bg-blue-500/20 text-blue-300',
  Employee: 'bg-emerald-500/20 text-emerald-300',
};

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = navConfig[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-700/50 shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
          <Briefcase size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-lg tracking-tight">WorkForce</span>
            <span className="text-blue-400 font-bold text-lg">X</span>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="px-4 py-4 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name={user.fullName} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${roleBadgeColors[user.role]}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}
      {collapsed && user && (
        <div className="flex justify-center py-3 border-b border-slate-700/50 shrink-0">
          <Avatar name={user.fullName} size="sm" />
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
              ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }
              ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-700/50 shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150
            ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:flex justify-end p-2 shrink-0">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 border-r border-slate-700/50 sidebar-transition
          ${collapsed ? 'w-16' : 'w-60'} fixed top-0 left-0 h-screen z-30`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative flex flex-col w-64 bg-slate-900 border-r border-slate-700/50 h-full z-50 animate-slide-in-left">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
