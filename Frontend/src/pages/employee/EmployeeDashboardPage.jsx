import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { MOCK_EMPLOYEES, DEPARTMENTS, BRANCHES } from '../../data/mockEmployees';
import Avatar from '../../components/common/Avatar';
import { statusColor, formatDate, formatCurrency } from '../../utils/helpers';
import { User, Briefcase, Building2, GitBranch, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ATTENDANCE_DATA } from '../../data/mockEmployees';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  // Find the mock employee record matching this user
  const emp = MOCK_EMPLOYEES.find((e) => e.id === user?.employeeId) || MOCK_EMPLOYEES[24];
  const dept = DEPARTMENTS.find((d) => d.id === emp?.departmentId);
  const branch = BRANCHES.find((b) => b.id === emp?.branchId);

  // Attendance stats (mock)
  const attendanceStats = [
    { label: 'Present', value: 21, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Absent', value: 2, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Late', value: 1, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'On Leave', value: 0, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Your personal workspace overview</p>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar name={emp?.fullName || user?.fullName} size="2xl" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{emp?.fullName || user?.fullName}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{emp?.designation || user?.designation}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(emp?.status || 'Active')}`}>
                {emp?.status || 'Active'}
              </span>
              <span className="text-xs text-slate-400 font-mono">{emp?.id || user?.employeeId}</span>
              <span className="text-xs text-slate-400">Joined {formatDate(emp?.joiningDate)}</span>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-400">Salary</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(emp?.salary || 0)}</p>
            <p className="text-xs text-slate-400">per year</p>
          </div>
        </div>
      </div>

      {/* Quick info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Department', value: emp?.departmentName || user?.department, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Branch', value: emp?.branchName || user?.branch, icon: GitBranch, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Joining Date', value: formatDate(emp?.joiningDate), icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Manager', value: emp?.manager || 'N/A', icon: User, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((item) => (
          <div key={item.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
              <item.icon size={15} className={item.color} />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance stats + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">This Month's Attendance</h3>
          <div className="space-y-3">
            {attendanceStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{s.label}</span>
                </div>
                <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.value / 24) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Attendance This Month</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={ATTENDANCE_DATA.slice(0, 20)} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="present" fill="#22c55e" stackId="a" radius={[3, 3, 0, 0]} name="Present" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: emp?.email || user?.email },
            { icon: Phone, label: 'Phone', value: emp?.phone },
            { icon: MapPin, label: 'Address', value: emp?.address },
            { icon: Briefcase, label: 'Emergency', value: emp?.emergencyContact },
          ].map((c) => (
            <div key={c.label} className="flex items-start gap-3">
              <c.icon size={15} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">{c.label}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{c.value || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
