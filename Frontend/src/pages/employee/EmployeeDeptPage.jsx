import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEES, DEPARTMENTS, BRANCHES } from '../../data/mockEmployees';
import { Building2, Users, MapPin, DollarSign, User } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export default function EmployeeDeptPage() {
  const { user } = useAuth();
  const emp = MOCK_EMPLOYEES.find((e) => e.id === user?.employeeId) || MOCK_EMPLOYEES[24];
  const dept = DEPARTMENTS.find((d) => d.id === emp?.departmentId) || DEPARTMENTS[0];
  const branch = BRANCHES.find((b) => b.id === emp?.branchId) || BRANCHES[0];
  const deptEmployees = MOCK_EMPLOYEES.filter((e) => e.departmentId === dept.id).slice(0, 8);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Department</h1>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Department */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
            <Building2 size={22} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{dept.name}</h2>
          <p className="text-xs text-slate-400 font-mono mb-4">{dept.id}</p>
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><Users size={13} />Employees</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{dept.employeeCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><DollarSign size={13} />Budget</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(dept.budget)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><User size={13} />Head</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">{dept.head}</span>
            </div>
          </div>
        </div>

        {/* Branch */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
            <MapPin size={22} className="text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{branch.name}</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-4">
            <MapPin size={12} />{branch.location}
          </p>
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><Users size={13} />Employees</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{branch.employeeCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5"><User size={13} />Manager</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">{branch.manager}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Branch ID</span>
              <span className="font-mono text-xs text-slate-400">{branch.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department colleagues */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Department Colleagues</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {deptEmployees.map((colleague) => (
            <div key={colleague.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {colleague.fullName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{colleague.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{colleague.designation}</p>
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">{colleague.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
