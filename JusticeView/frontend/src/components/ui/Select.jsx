import { forwardRef } from 'react';

const Select = forwardRef(({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`block w-full h-12 px-4 border-2 rounded-lg text-sm bg-white transition-all duration-200 focus:outline-none focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 appearance-none cursor-pointer ${
          error ? 'border-court-red focus:ring-red-200' : 'border-light-gray hover:border-gray-300'
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
        {...props}
      >
        {placeholder && <option value="" className="text-gray-400">{placeholder}</option>}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-court-red flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
