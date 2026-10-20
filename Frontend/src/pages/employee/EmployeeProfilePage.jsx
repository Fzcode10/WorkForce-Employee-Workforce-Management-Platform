import { useAuth } from '../../context/AuthContext';
import { MOCK_EMPLOYEES } from '../../data/mockEmployees';
import Avatar from '../../components/common/Avatar';
import { statusColor, formatDate, formatCurrency } from '../../utils/helpers';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const emp = MOCK_EMPLOYEES.find((e) => e.id === user?.employeeId) || MOCK_EMPLOYEES[24];
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(emp?.phone || '');
  const [address, setAddress] = useState(emp?.address || '');
  const [emergency, setEmergency] = useState(emp?.emergencyContact || '');

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated (demo — backend not connected).');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      {/* Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex items-end gap-4 mb-4">
            <Avatar name={emp?.fullName} size="2xl" className="ring-4 ring-white dark:ring-slate-800 shadow-lg" />
            <div className="mb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{emp?.fullName}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{emp?.designation}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(emp?.status)}`}>{emp?.status}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">{emp?.id}</span>
          </div>
        </div>
      </div>

      {/* Info sections */}
      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard title="Employment Information">
          <InfoRow label="Employee ID" value={emp?.id} />
          <InfoRow label="Department" value={emp?.departmentName} />
          <InfoRow label="Branch" value={emp?.branchName} />
          <InfoRow label="Joining Date" value={formatDate(emp?.joiningDate)} />
          <InfoRow label="Salary" value={formatCurrency(emp?.salary)} />
        </InfoCard>
        <InfoCard title="Personal Information">
          <InfoRow label="Gender" value={emp?.gender} />
          <InfoRow label="National ID" value={emp?.nationalId} />
          <InfoRow label="Email" value={emp?.email} />
          <InfoRow label="Role" value={user?.role} />
        </InfoCard>
      </div>

      {/* Editable contact info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">Contact Information</h3>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!editing} />
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!editing} />
          <Input label="Emergency Contact" value={emergency} onChange={(e) => setEmergency(e.target.value)} disabled={!editing} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-right max-w-[180px] truncate">{value || '—'}</span>
    </div>
  );
}
