import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RequireAuth, RequireRole, RedirectIfAuth } from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Error pages
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import NotFoundPage from './pages/errors/NotFoundPage';

// Admin pages
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import BranchesPage from './pages/admin/BranchesPage';
import UsersPage from './pages/admin/UsersPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

// HR pages
import HROverviewPage from './pages/hr/HROverviewPage';
import HREmployeesPage from './pages/hr/HREmployeesPage';
import OnboardingPage from './pages/hr/OnboardingPage';

// Employee pages
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import EmployeeProfilePage from './pages/employee/EmployeeProfilePage';
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage';
import EmployeeDeptPage from './pages/employee/EmployeeDeptPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes — redirect if already logged in */}
            <Route element={<RedirectIfAuth />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Error pages */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />

            {/* Protected routes */}
            <Route element={<RequireAuth />}>

              {/* ─── ADMIN ─── */}
              <Route element={<RequireRole roles={['Admin']} />}>
                <Route
                  element={
                    <DashboardLayout
                      breadcrumbs={[{ label: 'Admin', to: '/admin' }]}
                    />
                  }
                >
                  <Route path="/admin" element={<AdminOverviewPage />} />
                  <Route path="/admin/employees" element={<EmployeesPage />} />
                  <Route path="/admin/departments" element={<DepartmentsPage />} />
                  <Route path="/admin/branches" element={<BranchesPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/reports" element={<ReportsPage />} />
                  <Route path="/admin/settings" element={<SettingsPage />} />
                  <Route path="/admin/profile" element={<EmployeeProfilePage />} />
                </Route>
              </Route>

              {/* ─── HR ─── */}
              <Route element={<RequireRole roles={['HR']} />}>
                <Route
                  element={
                    <DashboardLayout
                      breadcrumbs={[{ label: 'HR', to: '/hr' }]}
                    />
                  }
                >
                  <Route path="/hr" element={<HROverviewPage />} />
                  <Route path="/hr/employees" element={<HREmployeesPage />} />
                  <Route path="/hr/onboarding" element={<OnboardingPage />} />
                  <Route path="/hr/departments" element={<DepartmentsPage />} />
                  <Route path="/hr/branches" element={<BranchesPage />} />
                  <Route path="/hr/reports" element={<ReportsPage />} />
                  <Route path="/hr/profile" element={<EmployeeProfilePage />} />
                  <Route path="/hr/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* ─── EMPLOYEE ─── */}
              <Route element={<RequireRole roles={['Employee']} />}>
                <Route
                  element={
                    <DashboardLayout
                      breadcrumbs={[{ label: 'Employee', to: '/employee' }]}
                    />
                  }
                >
                  <Route path="/employee" element={<EmployeeDashboardPage />} />
                  <Route path="/employee/profile" element={<EmployeeProfilePage />} />
                  <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
                  <Route path="/employee/department" element={<EmployeeDeptPage />} />
                  <Route path="/employee/settings" element={<SettingsPage />} />
                </Route>
              </Route>

            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
