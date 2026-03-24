import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  gold: 'btn-gold',
  ghost: 'text-cyan/70 hover:text-cyan font-mono text-sm tracking-widest uppercase transition-colors duration-300',
  danger: 'px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 hover:border-red-400 hover:text-red-300 font-mono text-sm tracking-widest uppercase transition-all duration-300'
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-4 py-2',
    md: '',
    lg: 'text-base px-10 py-4'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.04, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`
        ${variants[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        inline-flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
