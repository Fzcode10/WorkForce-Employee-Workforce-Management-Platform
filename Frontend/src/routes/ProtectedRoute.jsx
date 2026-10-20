import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Redirects unauthenticated users to /login */
export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Redirects users without the required role to /unauthorized */
export function RequireRole({ roles = [] }) {
  const { user } = useAuth();
  if (!user || (roles.length > 0 && !roles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}

/** Redirects authenticated users away from public pages (login, etc.) */
export function RedirectIfAuth() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    const routes = { Admin: '/admin', HR: '/hr', Employee: '/employee' };
    return <Navigate to={routes[user?.role] || '/admin'} replace />;
  }
  return <Outlet />;
}
