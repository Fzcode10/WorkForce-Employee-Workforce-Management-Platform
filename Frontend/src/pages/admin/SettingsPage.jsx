import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { Sun, Moon, Bell, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });

  const handleSave = () => toast.success('Settings saved (demo — no backend).');

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 dark:border-slate-700">
          <User size={18} className="text-blue-600" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Profile Information</h2>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.fullName} size="xl" />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{user?.fullName}</p>
            <p className="text-sm text-slate-500">{user?.role} · {user?.employeeId}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Department" value={user?.department || ''} disabled containerClass="opacity-70" />
          <Input label="Branch" value={user?.branch || ''} disabled containerClass="opacity-70" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
          {dark ? <Moon size={18} className="text-blue-600" /> : <Sun size={18} className="text-blue-600" />}
          <h2 className="font-semibold text-slate-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">Dark Mode</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggle}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${dark ? 'bg-blue-600' : 'bg-slate-300'}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${dark ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-200 dark:border-slate-700">
          <Shield size={18} className="text-blue-600" />
          <h2 className="font-semibold text-slate-900 dark:text-white">Security</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Password management and JWT authentication are handled by the backend. Connect to your Node.js backend to enable real authentication.
        </p>
        <Button variant="outline" onClick={() => toast('Connect backend to enable password changes.')}>
          Change Password
        </Button>
      </Card>
    </div>
  );
}
