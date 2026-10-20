import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';
import { branchService } from '../../services/mockServices';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { SkeletonList } from '../../components/common/Skeleton';
import { EmptyState, ErrorState } from '../../components/common/States';
import toast from 'react-hot-toast';

const EMPTY = { name: '', location: '', manager: '' };

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ open: false, branch: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, branch: null, loading: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await branchService.getAll();
      setBranches(data);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openModal = (branch = null) => {
    setForm(branch ? { name: branch.name, location: branch.location || '', manager: branch.manager || '' } : EMPTY);
    setModal({ open: true, branch });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Branch name is required.'); return; }
    if (!form.location.trim()) { toast.error('Location is required.'); return; }
    setSaving(true);
    try {
      if (modal.branch) {
        await branchService.update(modal.branch.id, form);
        toast.success('Branch updated.');
      } else {
        await branchService.create(form);
        toast.success('Branch created.');
      }
      setModal({ open: false, branch: null });
      fetchData();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleteDialog((d) => ({ ...d, loading: true }));
    try {
      await branchService.delete(deleteDialog.branch.id);
      toast.success('Branch deleted.');
      setDeleteDialog({ open: false, branch: null, loading: false });
      fetchData();
    } catch (e) {
      toast.error(e.message);
      setDeleteDialog((d) => ({ ...d, loading: false }));
    }
  };

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const BRANCH_COLORS = ['blue', 'purple', 'emerald', 'amber', 'red'];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Branches</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{branches.length} branches configured</p>
        </div>
        <Button icon={Plus} onClick={() => openModal()}>Add Branch</Button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : loading ? (
        <SkeletonList count={5} />
      ) : branches.length === 0 ? (
        <EmptyState title="No branches yet" action={<Button icon={Plus} onClick={() => openModal()}>Add Branch</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {branches.map((branch, idx) => {
            const color = BRANCH_COLORS[idx % BRANCH_COLORS.length];
            const bgMap = { blue: 'bg-blue-50 dark:bg-blue-900/20', purple: 'bg-purple-50 dark:bg-purple-900/20', emerald: 'bg-emerald-50 dark:bg-emerald-900/20', amber: 'bg-amber-50 dark:bg-amber-900/20', red: 'bg-red-50 dark:bg-red-900/20' };
            const txtMap = { blue: 'text-blue-600 dark:text-blue-400', purple: 'text-purple-600 dark:text-purple-400', emerald: 'text-emerald-600 dark:text-emerald-400', amber: 'text-amber-600 dark:text-amber-400', red: 'text-red-600 dark:text-red-400' };
            return (
              <div key={branch.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 card-hover shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
                    <GitBranchIcon size={18} className={txtMap[color]} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(branch)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteDialog({ open: true, branch, loading: false })} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{branch.name}</h3>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <MapPin size={13} />
                  <span>{branch.location}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <Users size={13} />
                    <span>{branch.employeeCount} employees</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{branch.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, branch: null })}
        title={modal.branch ? 'Edit Branch' : 'Add Branch'}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setModal({ open: false, branch: null })} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>{modal.branch ? 'Save Changes' : 'Create'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Branch Name" required value={form.name} onChange={set('name')} placeholder="e.g. London Office" />
          <Input label="Location" required value={form.location} onChange={set('location')} placeholder="London, UK" />
          <Input label="Branch Manager (Employee ID)" value={form.manager} onChange={set('manager')} placeholder="EMP-015" />
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteDialog.open}
        loading={deleteDialog.loading}
        title="Delete Branch"
        message={`Are you sure you want to delete "${deleteDialog.branch?.name}"?`}
        onClose={() => setDeleteDialog({ open: false, branch: null, loading: false })}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function GitBranchIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}
