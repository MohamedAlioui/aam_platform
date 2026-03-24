import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_STYLES = {
  cyan:  { bg: 'var(--blue-pale)',          border: 'var(--blue)',        text: 'var(--blue)' },
  blue:  { bg: 'var(--blue-pale)',          border: 'var(--blue)',        text: 'var(--blue)' },
  gold:  { bg: 'rgba(217,119,6,0.08)',      border: 'rgba(217,119,6,0.3)', text: 'var(--gold)' },
  green: { bg: 'rgba(22,163,74,0.08)',      border: 'rgba(22,163,74,0.3)', text: '#16a34a' },
};

const StatsCard = ({ label, value, icon, trend, trendValue, color = 'cyan', index = 0 }) => {
  const numRef = useRef(null);
  const cs = COLOR_STYLES[color] || COLOR_STYLES.cyan;

  useEffect(() => {
    if (!numRef.current) return;
    const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
    const suffix = String(value).replace(/[0-9.]/g, '');
    const obj = { v: 0 };
    gsap.to(obj, {
      v: numericValue,
      duration: 1.8,
      ease: 'power2.out',
      delay: index * 0.1,
      onUpdate() {
        if (numRef.current)
          numRef.current.textContent = Math.round(obj.v).toLocaleString() + suffix;
      }
    });
  }, [value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ background: cs.bg, border: `1px solid ${cs.border}` }}
    >
      {/* Background icon */}
      <div className="absolute right-4 top-4 opacity-10 text-5xl">{icon}</div>

      <div className="relative">
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <div ref={numRef} className="font-mono text-3xl font-bold mb-1" style={{ color: cs.text }}>
          {typeof value === 'number' ? '0' : value}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 font-mono text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trendValue || trend)}% ce mois
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
