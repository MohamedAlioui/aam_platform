import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block font-mono text-xs tracking-widest text-blue-light/60 uppercase mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan/40">
          {icon}
        </span>
      )}
      <motion.input
        ref={ref}
        className={`aam-input ${icon ? 'pl-11' : ''} ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="mt-1.5 font-mono text-xs text-red-400">{error}</p>
    )}
  </div>
));

Input.displayName = 'Input';
export default Input;
