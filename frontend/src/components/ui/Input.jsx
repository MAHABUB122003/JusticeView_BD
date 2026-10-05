import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', id, icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={`block w-full h-12 px-4 border-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 ${
            error ? 'border-court-red focus:ring-red-200' : 'border-light-gray hover:border-gray-300'
          } ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-court-red flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
