const Badge = ({ children, variant = 'blue', className = '' }) => {
  const style = {
    blue:  { background: 'var(--blue-pale)',           color: 'var(--blue)',  border: '1px solid var(--border-hover)' },
    cyan:  { background: 'var(--blue-pale)',           color: 'var(--blue)',  border: '1px solid var(--border-hover)' },
    gold:  { background: 'rgba(217,119,6,0.08)',       color: 'var(--gold)',  border: '1px solid rgba(217,119,6,0.3)' },
    green: { background: 'rgba(34,197,94,0.08)',       color: '#16a34a',      border: '1px solid rgba(34,197,94,0.3)' },
    red:   { background: 'rgba(239,68,68,0.08)',       color: '#dc2626',      border: '1px solid rgba(239,68,68,0.3)' },
    white: { background: 'rgba(255,255,255,0.1)',      color: '#ffffff',      border: '1px solid rgba(255,255,255,0.2)' },
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase rounded-md ${className}`}
      style={style[variant] || style.blue}
    >
      {children}
    </span>
  );
};

export default Badge;
