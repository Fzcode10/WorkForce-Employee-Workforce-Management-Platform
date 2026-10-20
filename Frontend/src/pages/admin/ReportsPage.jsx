import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MONTHLY_HEADCOUNT, DEPT_HEADCOUNT, STATUS_DISTRIBUTION, ATTENDANCE_DATA } from '../../data/mockEmployees';
import { Download, TrendingUp, Users, UserCheck, Clock } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Workforce insights and analytics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <Download size={15} />
          Export Report
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Tenure', value: '2.8 yrs', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', delta: '↑ 0.3 yrs' },
          { label: 'Attrition Rate', value: '4.2%', icon: TrendingUp, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', delta: '↓ 0.5%' },
          { label: 'Headcount YoY', value: '+12', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', delta: '↑ 25%' },
          { label: 'Active Rate', value: '98.3%', icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', delta: '↑ 1.2%' },
        ].map((k) => (
          <div key={k.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon size={16} className={k.color} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{k.value}</p>
            <p className="text-xs text-emerald-600 mt-1">{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Headcount Growth (2026)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_HEADCOUNT} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} name="Headcount" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Headcount">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPT_HEADCOUNT} margin={{ left: -20, right: 10, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#94a3b8' }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employment Status Distribution">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={STATUS_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {STATUS_DISTRIBUTION.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {STATUS_DISTRIBUTION.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-slate-600 dark:text-slate-400">{s.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Attendance (Last 30 Days)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ATTENDANCE_DATA} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="present" fill="#22c55e" stackId="a" name="Present" />
              <Bar dataKey="late" fill="#f59e0b" stackId="a" name="Late" />
              <Bar dataKey="absent" fill="#ef4444" stackId="a" radius={[3, 3, 0, 0]} name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
