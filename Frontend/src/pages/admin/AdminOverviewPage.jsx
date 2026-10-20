import { useEffect, useState } from 'react';
import { Users, Building2, GitBranch, UserCheck, TrendingUp, UserX, Clock, Award } from 'lucide-react';
import { StatCard } from '../../components/common/Card';
import { reportsService } from '../../services/mockServices';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MONTHLY_HEADCOUNT, DEPT_HEADCOUNT, STATUS_DISTRIBUTION, ATTENDANCE_DATA } from '../../data/mockEmployees';
import { useAuth } from '../../context/AuthContext';

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsService.getSummary().then((s) => { setStats(s); setLoading(false); });
  }, []);

  const statCards = [
    { title: 'Total Employees', value: stats?.totalEmployees ?? '—', icon: Users, color: 'blue', delta: '+4 this month', deltaType: 'up' },
    { title: 'Active Employees', value: stats?.activeEmployees ?? '—', icon: UserCheck, color: 'emerald', delta: '98% active rate', deltaType: 'up' },
    { title: 'Departments', value: stats?.departments ?? '—', icon: Building2, color: 'purple' },
    { title: 'Branches', value: stats?.branches ?? '—', icon: GitBranch, color: 'amber' },
    { title: 'New Hires', value: stats?.newHiresThisMonth ?? '—', icon: TrendingUp, color: 'cyan', delta: 'This month', deltaType: 'up' },
    { title: 'On Leave', value: stats?.onLeave ?? '—', icon: Clock, color: 'amber' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Good {getGreeting()}, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Here's what's happening with your workforce today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} loading={loading} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Headcount trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Headcount Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_HEADCOUNT} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} name="Employees" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Employment Status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={STATUS_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                {STATUS_DISTRIBUTION.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {STATUS_DISTRIBUTION.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department headcount + attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Headcount by Department</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_HEADCOUNT} margin={{ top: 0, right: 10, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Monthly Attendance (Oct)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ATTENDANCE_DATA.slice(0, 20)} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" fill="#22c55e" radius={[3, 3, 0, 0]} name="Present" stackId="a" />
              <Bar dataKey="late" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Late" stackId="a" />
              <Bar dataKey="absent" fill="#ef4444" radius={[3, 3, 0, 0]} name="Absent" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
