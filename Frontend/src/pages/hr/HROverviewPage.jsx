import { useEffect, useState } from 'react';
import { Users, UserCheck, Building2, GitBranch, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '../../components/common/Card';
import { reportsService } from '../../services/mockServices';
import { MOCK_EMPLOYEES } from '../../data/mockEmployees';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import { statusColor, formatDate } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function HROverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const recentHires = MOCK_EMPLOYEES.slice(0, 5);

  useEffect(() => {
    reportsService.getSummary().then((s) => { setStats(s); setLoading(false); });
  }, []);

  const statCards = [
    { title: 'Total Employees', value: stats?.totalEmployees ?? '—', icon: Users, color: 'blue' },
    { title: 'Active', value: stats?.activeEmployees ?? '—', icon: UserCheck, color: 'emerald', delta: '98% rate', deltaType: 'up' },
    { title: 'Departments', value: stats?.departments ?? '—', icon: Building2, color: 'purple' },
    { title: 'New Hires (Month)', value: stats?.newHiresThisMonth ?? '—', icon: TrendingUp, color: 'cyan', delta: 'This month', deltaType: 'up' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HR Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Welcome back, {user?.fullName?.split(' ')[0]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} loading={loading} />)}
      </div>

      {/* Recent hires */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Recent Hires</h2>
          <Link to="/hr/employees" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {recentHires.map((emp) => (
            <div key={emp.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <Avatar name={emp.fullName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{emp.fullName}</p>
                <p className="text-xs text-slate-500">{emp.designation} · {emp.departmentName}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(emp.status)}`}>{emp.status}</span>
                <p className="text-xs text-slate-400 mt-1">{formatDate(emp.joiningDate)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Onboard Employee', to: '/hr/onboarding', color: 'bg-blue-600 text-white hover:bg-blue-700', desc: 'Add a new hire' },
          { label: 'View Directory', to: '/hr/employees', color: 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600', desc: 'Browse all employees' },
          { label: 'Generate Report', to: '/hr/reports', color: 'bg-emerald-600 text-white hover:bg-emerald-700', desc: 'Workforce analytics' },
        ].map((a) => (
          <Link key={a.label} to={a.to} className={`${a.color} rounded-2xl p-5 transition-colors`}>
            <p className="font-semibold text-base mb-1">{a.label}</p>
            <p className="text-sm opacity-75">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
