import { useState } from 'react';
import { employeeService, departmentService, branchService } from '../../services/mockServices';
import { DESIGNATIONS, EMPLOYMENT_STATUSES } from '../../data/mockEmployees';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { CheckCircle, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '', designation: '',
  departmentId: '', branchId: '', status: 'Active', joiningDate: new Date().toISOString().split('T')[0],
  salary: '', gender: '', address: '', nationalId: '', emergencyContact: '',
};

export default function OnboardingPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    Promise.all([departmentService.getAll(), branchService.getAll()]).then(([d, b]) => {
      setDepartments(d);
      setBranches(b);
    });
  }, []);

  const set = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.departmentId) e.departmentId = 'Required';
    if (!form.branchId) e.branchId = 'Required';
    if (!form.designation) e.designation = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const newEmp = await employeeService.create({ ...form, salary: Number(form.salary) || 0 });
      setDone(newEmp);
      toast.success(`${newEmp.fullName} has been onboarded!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="animate-fade-in max-w-lg mx-auto mt-12 text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Onboarding Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          <strong>{done.fullName}</strong> has been successfully added to the system.
        </p>
        <p className="text-sm text-slate-400 mb-8 font-mono">{done.id}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => { setDone(null); setForm(EMPTY); }}>
            Onboard Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <UserPlus size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Employee Onboarding</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Fill out the form to add a new employee</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal */}
        <Section title="Personal Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="John" />
            <Input label="Last Name" required value={form.lastName} onChange={set('lastName')} error={errors.lastName} placeholder="Smith" />
            <Input label="Email" required type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="john@company.com" />
            <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+1-555-0000000" />
            <Select label="Gender" value={form.gender} onChange={set('gender')} options={['Male', 'Female', 'Other']} placeholder="Select gender" />
            <Input label="National ID" value={form.nationalId} onChange={set('nationalId')} placeholder="NID-XXXXXX" />
          </div>
          <Input label="Address" value={form.address} onChange={set('address')} placeholder="123 Main St" containerClass="mt-4" />
        </Section>

        {/* Employment */}
        <Section title="Employment Details">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Department" required value={form.departmentId} onChange={set('departmentId')} options={departments.map((d) => ({ value: d.id, label: d.name }))} placeholder="Select department" error={errors.departmentId} />
            <Select label="Branch" required value={form.branchId} onChange={set('branchId')} options={branches.map((b) => ({ value: b.id, label: b.name }))} placeholder="Select branch" error={errors.branchId} />
            <Select label="Designation" required value={form.designation} onChange={set('designation')} options={DESIGNATIONS} placeholder="Select designation" error={errors.designation} />
            <Select label="Status" value={form.status} onChange={set('status')} options={EMPLOYMENT_STATUSES} />
            <Input label="Joining Date" type="date" value={form.joiningDate} onChange={set('joiningDate')} />
            <Input label="Salary (USD)" type="number" value={form.salary} onChange={set('salary')} placeholder="65000" />
          </div>
          <Input label="Emergency Contact" value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="+1-555-0000000" containerClass="mt-4" />
        </Section>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => { setForm(EMPTY); setErrors({}); }}>Reset</Button>
          <Button type="submit" loading={saving} icon={UserPlus}>Complete Onboarding</Button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
        {title}
      </h3>
      {children}
    </div>
  );
}
