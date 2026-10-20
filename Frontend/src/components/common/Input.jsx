import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon: Icon = null,
    iconRight: IconRight = null,
    size = 'md',
    className = '',
    containerClass = '',
    required = false,
    ...props
  },
  ref,
) {
  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${containerClass}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-slate-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full border rounded-lg bg-white dark:bg-slate-800 
            text-slate-900 dark:text-slate-100 placeholder-slate-400
            border-slate-300 dark:border-slate-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-150
            ${Icon ? 'pl-10' : 'pl-3'} ${IconRight ? 'pr-10' : 'pr-3'}
            ${sizes[size]}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}`}
          {...props}
        />
        {IconRight && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <IconRight size={16} className="text-slate-400" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
});

export default Input;
