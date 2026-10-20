import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Users, DollarSign } from 'lucide-react';
import { departmentService } from '../../services/mockServices';
import { formatCurrency } from '../../utils/helpers';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { SkeletonList } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/States';
import toast from 'react-hot-toast';

const EMPTY = { name: '', head: '', budget: '' };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, dept: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, dept: null, loading: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (dept = null) => {
    setForm(dept ? { name: dept.name, head: dept.head || '', budget: dept.budget || '' } : EMPTY);
    setModal({ open: true, dept });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Department name is required.'); return; }
    setSaving(true);
    try {
      if (modal.dept) {
        await departmentService.update(modal.dept.id, { ...form, budget: Number(form.budget) });
        toast.success('Department updated.');
      } else {
        await departmentService.create({ ...form, budget: Number(form.budget) });
        toast.success('Department created.');
      }
      setModal({ open: false, dept: null });
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleteDialog((d) => ({ ...d, loading: true }));
    try {
      await departmentService.delete(deleteDialog.dept.id);
      toast.success('Department deleted.');
      setDeleteDialog({ open: false, dept: null, loading: false });
      fetchData();
    } catch (e) {
      toast.error(e.message);
      setDeleteDialog((d) => ({ ...d, loading: false }));
    }
  };

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{departments.length} departments configured</p>
        </div>
        <Button icon={Plus} onClick={() => openModal()}>Add Department</Button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : loading ? (
        <SkeletonList count={6} />
      ) : departments.length === 0 ? (
        <EmptyState title="No departments yet" action={<Button icon={Plus} onClick={() => openModal()}>Add Department</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 card-hover shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(dept)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteDialog({ open: true, dept, loading: false })} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{dept.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">{dept.id}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <Users size={13} />
                  <span>{dept.employeeCount} employees</span>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(dept.budget)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, dept: null })}
        title={modal.dept ? 'Edit Department' : 'Add Department'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setModal({ open: false, dept: null })} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{modal.dept ? 'Save Changes' : 'Create'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Department Name" required value={form.name} onChange={set('name')} placeholder="e.g. Engineering" />
          <Input label="Department Head (Employee ID)" value={form.head} onChange={set('head')} placeholder="EMP-001" />
          <Input label="Budget (USD)" type="number" value={form.budget} onChange={set('budget')} placeholder="500000" />
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteDialog.open}
        loading={deleteDialog.loading}
        title="Delete Department"
        message={`Are you sure you want to delete the "${deleteDialog.dept?.name}" department?`}
        onClose={() => setDeleteDialog({ open: false, dept: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}
