/** Format ISO date string to readable date */
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/** Format currency */
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

/** Truncate text */
export const truncate = (text, length = 30) =>
  text && text.length > length ? `${text.slice(0, length)}…` : text;

/** Get initials from full name */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

/** Status badge color classes */
export const statusColor = (status) => {
  const map = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
    'On Leave': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Probation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Terminated: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};

/** Role badge color */
export const roleColor = (role) => {
  const map = {
    Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    HR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Employee: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };
  return map[role] || 'bg-slate-100 text-slate-600';
};

/** Generate avatar color based on name */
export const avatarColor = (name = '') => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500',
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

/** Debounce helper */
export const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};
