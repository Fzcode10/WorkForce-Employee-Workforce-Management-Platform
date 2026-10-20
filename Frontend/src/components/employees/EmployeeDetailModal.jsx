import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { statusColor, formatDate, formatCurrency, roleColor } from '../../utils/helpers';
import { Edit2, Mail, Phone, MapPin, Calendar, Briefcase, Building2, GitBranch, BadgeCheck } from 'lucide-react';

export default function EmployeeDetailModal({ open, employee, onClose, onEdit }) {
  if (!employee) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Employee Details"
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button variant="primary" icon={Edit2} onClick={() => onEdit(employee)}>Edit Employee</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Profile header */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <Avatar name={employee.fullName} size="xl" />
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{employee.fullName}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{employee.designation}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(employee.status)}`}>
                {employee.status}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor(employee.role)}`}>
                {employee.role}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{employee.id}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact */}
          <InfoSection title="Contact Information">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow icon={Phone} label="Phone" value={employee.phone} />
            <InfoRow icon={MapPin} label="Address" value={employee.address} />
            <InfoRow icon={BadgeCheck} label="Emergency" value={employee.emergencyContact} />
          </InfoSection>

          {/* Employment */}
          <InfoSection title="Employment Details">
            <InfoRow icon={Building2} label="Department" value={employee.departmentName} />
            <InfoRow icon={GitBranch} label="Branch" value={employee.branchName} />
            <InfoRow icon={Briefcase} label="Designation" value={employee.designation} />
            <InfoRow icon={Calendar} label="Joined" value={formatDate(employee.joiningDate)} />
          </InfoSection>

          {/* Personal */}
          <InfoSection title="Personal Details">
            <InfoRow icon={BadgeCheck} label="Gender" value={employee.gender} />
            <InfoRow icon={BadgeCheck} label="National ID" value={employee.nationalId} />
            <InfoRow icon={BadgeCheck} label="Salary" value={formatCurrency(employee.salary)} />
          </InfoSection>
        </div>
      </div>
    </Modal>
  );
}

function InfoSection({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">{title}</h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-slate-400 uppercase">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}
