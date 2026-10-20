import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_CREDS = [
  { label: 'Admin', email: 'admin@workforcex.com', password: 'Admin@123', color: 'purple' },
  { label: 'HR', email: 'hr@workforcex.com', password: 'Hr@123', color: 'blue' },
  { label: 'Employee', email: 'employee@workforcex.com', password: 'Emp@123', color: 'emerald' },
];

const ROLE_ROUTES = { Admin: '/admin', HR: '/hr', Employee: '/employee' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(ROLE_ROUTES[user.role] || '/');
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (creds) => setForm({ email: creds.email, password: creds.password });

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WorkForce<span className="text-blue-400">X</span></span>
          </div>
          <div className="max-w-sm space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Manage your<br />
              <span className="text-blue-400">workforce</span> smarter.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              A unified platform for HR teams, managers, and employees to streamline operations.
            </p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { label: 'Employees', value: '60+' },
            { label: 'Departments', value: '8' },
            { label: 'Branches', value: '5' },
            { label: 'Active Rate', value: '98%' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-slate-400 text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">WorkForce<span className="text-blue-400">X</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Sign in</h2>
            <p className="text-slate-400 mt-1.5">Welcome back — enter your credentials to continue.</p>
          </div>

          {/* Demo quick-login */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-500 mb-2.5 uppercase tracking-wide">Quick Demo Login</p>
            <div className="flex gap-2">
              {DEMO_CREDS.map((d) => (
                <button
                  key={d.label}
                  onClick={() => fillDemo(d)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all
                    ${d.color === 'purple' ? 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10 bg-purple-500/5' :
                      d.color === 'blue' ? 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10 bg-blue-500/5' :
                      'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 bg-emerald-500/5'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="name@workforcex.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm
                    placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm
                    placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl
                transition-all duration-150 shadow-lg shadow-blue-600/25 disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in to WorkForceX'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-600">
            WorkForceX v1.0 — Enterprise Workforce Management
          </p>
        </div>
      </div>
    </div>
  );
}
