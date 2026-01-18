import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  type?: string;
  options?: string[];
}

const Input: React.FC<InputProps> = ({ label, type = 'text', options, className = '', ...props }) => {
  const baseClasses = `
    w-full 
    bg-white dark:bg-slate-900/50 
    border border-slate-300 dark:border-white/10 
    rounded-xl px-4 py-3 
    text-slate-900 dark:text-white 
    placeholder-slate-400 dark:placeholder-slate-500
    focus:outline-none focus:border-neon-blue 
    focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] 
    transition-all duration-300
    appearance-none
  `;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      {type === 'select' ? (
        <div className="relative">
          <select className={baseClasses} {...(props as any)}>
            {options?.map((opt) => (
              <option key={opt} value={opt} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      ) : (
        <input type={type} className={baseClasses} {...props} />
      )}
    </div>
  );
};

export default Input;