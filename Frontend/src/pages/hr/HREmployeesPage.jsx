// HR Employee Directory — reuses the same EmployeesPage with HR-appropriate actions
// HR cannot delete employees but can view and edit
import { useEffect, useState, useCallback } from 'react';
import { Search, Eye, Edit2 } from 'lucide-react';
import { employeeService, departmentService, branchService } from '../../services/mockServices';
import { EMPLOYMENT_STATUSES } from '../../data/mockEmployees';
import { statusColor, formatDate } from '../../utils/helpers';
import Avatar from '../../components/common/Avatar';
import Pagination from '../../components/common/Pagination';
import { SkeletonTable } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/States';
import EmployeeDetailModal from '../../components/employees/EmployeeDetailModal';
import EmployeeFormModal from '../../components/employees/EmployeeFormModal';
import toast from 'react-hot-toast';

export default function HREmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', branch: '', status: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [detailModal, setDetailModal] = useState({ open: false, employee: null });
  const [editModal, setEditModal] = useState({ open: false, employee: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [res, depts, brs] = await Promise.all([
        employeeService.getAll({ search, ...filters, page, pageSize }),
        departments.length ? Promise.resolve(departments) : departmentService.getAll(),
        branches.length ? Promise.resolve(branches) : branchService.getAll(),
      ]);
      setEmployees(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      if (!departments.length) setDepartments(depts);
      if (!branches.length) setBranches(brs);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [search, filters, page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { setPage(1); }, [search, filters]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Directory</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} employees</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
            />
          </div>
          <select value={filters.department} onChange={(e) => setFilters((f) => ({ ...f, department: e.target.value }))}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Statuses</option>
            {EMPLOYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {error ? <ErrorState message={error} onRetry={fetchData} /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    {['Employee', 'Department', 'Branch', 'Designation', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {loading ? <SkeletonTable rows={pageSize} cols={7} /> : employees.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState title="No employees found" /></td></tr>
                  ) : employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.fullName} size="sm" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{emp.fullName}</p>
                            <p className="text-xs text-slate-500">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{emp.departmentName}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{emp.branchName}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[140px] truncate">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(emp.status)}`}>{emp.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(emp.joiningDate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setDetailModal({ open: true, employee: emp })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Eye size={14} />
                          </button>
                          <button onClick={() => setEditModal({ open: true, employee: emp })} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!loading && employees.length > 0 && (
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
              </div>
            )}
          </>
        )}
      </div>

      <EmployeeDetailModal
        open={detailModal.open}
        employee={detailModal.employee}
        onClose={() => setDetailModal({ open: false, employee: null })}
        onEdit={(emp) => { setDetailModal({ open: false, employee: null }); setEditModal({ open: true, employee: emp }); }}
      />
      <EmployeeFormModal
        open={editModal.open}
        employee={editModal.employee}
        departments={departments}
        branches={branches}
        onClose={() => setEditModal({ open: false, employee: null })}
        onSave={async (payload) => {
          try {
            await employeeService.update(editModal.employee.id, payload);
            toast.success('Employee updated.');
            setEditModal({ open: false, employee: null });
            fetchData();
          } catch (e) { toast.error(e.message); }
        }}
      />
    </div>
  );
}
