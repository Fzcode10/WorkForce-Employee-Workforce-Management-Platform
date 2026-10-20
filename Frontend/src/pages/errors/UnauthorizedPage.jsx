import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <ShieldX size={44} className="text-red-400" />
        </div>
        <h1 className="text-6xl font-black text-white mb-2">403</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          You don't have permission to access this page. Contact your administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Go back home
        </Link>
      </div>
    </div>
  );
}
