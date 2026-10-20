import { useRef, useEffect, useState } from 'react';

export default function Dropdown({ trigger, items = [], align = 'right', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 mt-1.5 min-w-[160px] bg-white dark:bg-slate-800 border border-slate-200 
            dark:border-slate-700 rounded-xl shadow-xl py-1.5 animate-fade-in
            ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {items.map((item, idx) =>
            item.divider ? (
              <hr key={idx} className="my-1 border-slate-200 dark:border-slate-700" />
            ) : (
              <button
                key={idx}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                disabled={item.disabled}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-left transition-colors
                  ${item.danger
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {item.icon && <item.icon size={15} />}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
