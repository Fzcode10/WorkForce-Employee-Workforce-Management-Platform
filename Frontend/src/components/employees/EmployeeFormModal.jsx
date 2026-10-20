import { useEffect, useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { DESIGNATIONS, EMPLOYMENT_STATUSES } from '../../data/mockEmployees';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', designation: '',
  departmentId: '', branchId: '', status: 'Active', joiningDate: '', salary: '', gender: '',
  address: '', nationalId: '', emergencyContact: '',
};

export default function EmployeeFormModal({ open, employee, departments, branches, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        designation: employee.designation || '',
        departmentId: employee.departmentId || '',
        branchId: employee.branchId || '',
        status: employee.status || 'Active',
        joiningDate: employee.joiningDate || '',
        salary: employee.salary || '',
        gender: employee.gender || '',
        address: employee.address || '',
        nationalId: employee.nationalId || '',
        emergencyContact: employee.emergencyContact || '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [employee, open]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email is required.';
    if (!form.departmentId) e.departmentId = 'Department is required.';
    if (!form.branchId) e.branchId = 'Branch is required.';
    if (!form.designation) e.designation = 'Designation is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({ ...form, salary: Number(form.salary) || 0 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={employee ? `Edit — ${employee.fullName}` : 'Add New Employee'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={saving}>
            {employee ? 'Save Changes' : 'Add Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="John" />
            <Input label="Last Name" required value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Smith" />
            <Input label="Email" required type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="john.smith@company.com" />
            <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1-555-0000000" />
            <Select
              label="Gender"
              value={form.gender}
              onChange={set('gender')}
              options={['Male', 'Female', 'Other']}
              placeholder="Select gender"
            />
            <Input label="National ID" value={form.nationalId} onChange={set('nationalId')} placeholder="NID-XXXXXX" />
          </div>
          <Input label="Address" value={form.address} onChange={set('address')} placeholder="123 Main St, City, Country" containerClass="mt-4" />
        </Section>

        <Section title="Employment Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Department"
              required
              value={form.departmentId}
              onChange={set('departmentId')}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              placeholder="Select department"
              error={errors.departmentId}
            />
            <Select
              label="Branch"
              required
              value={form.branchId}
              onChange={set('branchId')}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
              placeholder="Select branch"
              error={errors.branchId}
            />
            <Select
              label="Designation"
              required
              value={form.designation}
              onChange={set('designation')}
              options={DESIGNATIONS}
              placeholder="Select designation"
              error={errors.designation}
            />
            <Select
              label="Employment Status"
              value={form.status}
              onChange={set('status')}
              options={EMPLOYMENT_STATUSES}
            />
            <Input label="Joining Date" type="date" value={form.joiningDate} onChange={set('joiningDate')} />
            <Input label="Salary (USD)" type="number" value={form.salary} onChange={set('salary')} placeholder="65000" />
          </div>
          <Input label="Emergency Contact" value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="+1-555-0000000" containerClass="mt-4" />
        </Section>
      </form>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
        {title}
      </h3>
      {children}
    </div>
  );
}
