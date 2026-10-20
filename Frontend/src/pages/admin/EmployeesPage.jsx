import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Filter, Download, Eye, Edit2, Trash2,
  MoreVertical, ChevronUp, ChevronDown,
} from 'lucide-react';
import { employeeService, departmentService, branchService } from '../../services/mockServices';
import { EMPLOYMENT_STATUSES } from '../../data/mockEmployees';
import { statusColor, formatDate } from '../../utils/helpers';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import { SkeletonTable } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/States';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Dropdown from '../../components/common/Dropdown';
import toast from 'react-hot-toast';
import EmployeeFormModal from '../../components/employees/EmployeeFormModal';
import EmployeeDetailModal from '../../components/employees/EmployeeDetailModal';

export default function EmployeesPage() {
  const navigate = useNavigate();
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

  const [formModal, setFormModal] = useState({ open: false, employee: null });
  const [detailModal, setDetailModal] = useState({ open: false, employee: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, employee: null, loading: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page, pageSize]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filters]);

  const handleDelete = async () => {
    setDeleteDialog((d) => ({ ...d, loading: true }));
    try {
      await employeeService.delete(deleteDialog.employee.id);
      toast.success('Employee deleted successfully.');
      setDeleteDialog({ open: false, employee: null, loading: false });
      fetchData();
    } catch (e) {
      toast.error(e.message);
      setDeleteDialog((d) => ({ ...d, loading: false }));
    }
  };

  const handleFormSave = async (payload) => {
    try {
      if (formModal.employee) {
        await employeeService.update(formModal.employee.id, payload);
        toast.success('Employee updated successfully.');
      } else {
        await employeeService.create(payload);
        toast.success('Employee added successfully.');
      }
      setFormModal({ open: false, employee: null });
      fetchData();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Department', 'Branch', 'Designation', 'Status', 'Joining Date'];
    const rows = employees.map((e) => [e.id, e.fullName, e.email, e.departmentName, e.branchName, e.designation, e.status, e.joiningDate]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'employees.csv'; a.click();
    toast.success('CSV exported.');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{total} total employees</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download size={15} />
            Export
          </button>
          <button
            onClick={() => setFormModal({ open: true, employee: null })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
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
          <div className="flex gap-2 flex-wrap">
            <FilterSelect
              value={filters.department}
              onChange={(v) => setFilters((f) => ({ ...f, department: v }))}
              placeholder="All Departments"
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />
            <FilterSelect
              value={filters.branch}
              onChange={(v) => setFilters((f) => ({ ...f, branch: v }))}
              placeholder="All Branches"
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
            />
            <FilterSelect
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
              placeholder="All Statuses"
              options={EMPLOYMENT_STATUSES.map((s) => ({ value: s, label: s }))}
            />
            {(filters.department || filters.branch || filters.status || search) && (
              <button
                onClick={() => { setFilters({ department: '', branch: '', status: '' }); setSearch(''); }}
                className="px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    {['Employee', 'Email', 'Department', 'Branch', 'Designation', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {loading ? (
                    <SkeletonTable rows={pageSize} cols={8} />
                  ) : employees.length === 0 ? (
                    <tr><td colSpan={8}><EmptyState title="No employees found" description="Try adjusting your search or filter criteria." /></td></tr>
                  ) : (
                    employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar name={emp.fullName} size="sm" />
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100">{emp.fullName}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{emp.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 max-w-[180px] truncate">{emp.email}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{emp.departmentName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{emp.branchName}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-[150px] truncate">{emp.designation}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatDate(emp.joiningDate)}</td>
                        <td className="px-4 py-3">
                          <Dropdown
                            trigger={
                              <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical size={16} />
                              </button>
                            }
                            items={[
                              { label: 'View Details', icon: Eye, onClick: () => setDetailModal({ open: true, employee: emp }) },
                              { label: 'Edit', icon: Edit2, onClick: () => setFormModal({ open: true, employee: emp }) },
                              { divider: true },
                              { label: 'Delete', icon: Trash2, onClick: () => setDeleteDialog({ open: true, employee: emp, loading: false }), danger: true },
                            ]}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && employees.length > 0 && (
              <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <EmployeeFormModal
        open={formModal.open}
        employee={formModal.employee}
        departments={departments}
        branches={branches}
        onClose={() => setFormModal({ open: false, employee: null })}
        onSave={handleFormSave}
      />
      <EmployeeDetailModal
        open={detailModal.open}
        employee={detailModal.employee}
        onClose={() => setDetailModal({ open: false, employee: null })}
        onEdit={(emp) => { setDetailModal({ open: false, employee: null }); setFormModal({ open: true, employee: emp }); }}
      />
      <ConfirmDialog
        open={deleteDialog.open}
        loading={deleteDialog.loading}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteDialog.employee?.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setDeleteDialog({ open: false, employee: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function FilterSelect({ value, onChange, placeholder, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300
        rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer min-w-[140px]"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
