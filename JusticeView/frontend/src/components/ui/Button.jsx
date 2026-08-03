import { forwardRef } from 'react';

const variants = {
  primary: 'bg-justice-blue text-white hover:bg-justice-blue-dark shadow-md hover:shadow-lg',
  gold: 'bg-justice-gold text-white hover:bg-justice-gold-dark shadow-md hover:shadow-lg shadow-gold/30',
  danger: 'bg-court-red text-white hover:bg-court-red-dark shadow-md hover:shadow-lg',
  success: 'bg-success-green text-white hover:bg-green-700 shadow-md hover:shadow-lg',
  outline: 'border-2 border-justice-gold text-justice-gold hover:bg-justice-gold hover:text-white',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
  link: 'text-justice-gold hover:text-justice-gold-dark underline-offset-2 hover:underline',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-xl',
  xl: 'px-10 py-5 text-xl rounded-xl',
};

const Button = forwardRef(({ children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, type = 'button', onClick, icon, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-justice-gold/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="text-lg">{icon}</span>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
