import { ATTENDANCE_DATA } from '../../data/mockEmployees';
import { formatDate } from '../../utils/helpers';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_MAP = {
  present: { label: 'Present', icon: CheckCircle, color: 'text-emerald-600' },
  absent: { label: 'Absent', icon: XCircle, color: 'text-red-500' },
  late: { label: 'Late', icon: Clock, color: 'text-amber-500' },
};

export default function EmployeeAttendancePage() {
  const days = ATTENDANCE_DATA.slice(0, 24);
  const myDays = days.map((d) => ({
    ...d,
    myStatus: d.day % 9 === 0 ? 'absent' : d.day % 7 === 0 ? 'late' : 'present',
  }));

  const summary = {
    present: myDays.filter((d) => d.myStatus === 'present').length,
    late: myDays.filter((d) => d.myStatus === 'late').length,
    absent: myDays.filter((d) => d.myStatus === 'absent').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Attendance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">October 2026 attendance overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(summary).map(([key, val]) => {
          const s = STATUS_MAP[key];
          return (
            <div key={key} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 text-center">
              <s.icon size={28} className={`${s.color} mx-auto mb-2`} />
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{val}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Team Attendance Overview</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={days} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="present" fill="#22c55e" stackId="a" name="Present" />
            <Bar dataKey="late" fill="#f59e0b" stackId="a" name="Late" />
            <Bar dataKey="absent" fill="#ef4444" stackId="a" radius={[3, 3, 0, 0]} name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Day-by-day */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Daily Log</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {myDays.slice(0, 15).map((d) => {
            const s = STATUS_MAP[d.myStatus];
            return (
              <div key={d.day} className="px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {d.day}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Oct {d.day}, 2026</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <s.icon size={14} className={s.color} />
                  <span className={`text-sm font-medium ${s.color}`}>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
