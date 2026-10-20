import { getInitials, avatarColor } from '../../utils/helpers';

export default function Avatar({ name = '', size = 'md', src = null, className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-800 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} ${avatarColor(name)} rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-slate-800 flex-shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
