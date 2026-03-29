import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

// Floating thread particles
const Thread = ({ x, y, delay, duration, rotate }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0, y: -20, rotate: rotate - 20 }}
    animate={{ opacity: [0, 0.6, 0], y: [0, 80], rotate: [rotate, rotate + 40] }}
    transition={{ delay, duration, repeat: Infinity, ease: 'linear' }}
  >
    <svg width="2" height="40" viewBox="0 0 2 40">
      <path d="M1 0 Q2 10 1 20 Q0 30 1 40" stroke="var(--blue)" strokeWidth="1.5"
        fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  </motion.div>
);

const THREADS = [
  { x: 10, y: 5,  delay: 0,    duration: 6, rotate: -15 },
  { x: 25, y: 0,  delay: 1.2,  duration: 7, rotate: 10  },
  { x: 42, y: 8,  delay: 0.5,  duration: 5, rotate: -5  },
  { x: 60, y: 2,  delay: 2,    duration: 8, rotate: 20  },
  { x: 75, y: 6,  delay: 0.8,  duration: 6, rotate: -20 },
  { x: 88, y: 1,  delay: 1.6,  duration: 7, rotate: 8   },
];

const NotFound = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: 'var(--bg-page)' }}>

      {/* Arabic pattern background */}
      <div className="absolute inset-0 pattern-arabic opacity-20 pointer-events-none" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.12), transparent)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.06), transparent)' }} />

      {/* Falling threads */}
      {THREADS.map((t, i) => <Thread key={i} {...t} />)}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        {/* Scissors icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--blue), var(--blue-light))',
            boxShadow: '0 0 40px rgba(37,99,235,0.35)',
          }}
        >
          <Scissors size={36} color="white" />
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="font-display font-black text-gradient-blue leading-none select-none"
            style={{ fontSize: 'clamp(6rem, 20vw, 11rem)', lineHeight: 1 }}>
            404
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-24 h-[2px] rounded-full my-6"
          style={{ background: 'linear-gradient(to right, var(--blue), transparent)' }}
        />

        {/* Arabic text */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="font-arabic text-2xl font-bold mb-2"
          style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
          الصفحة غير موجودة
        </motion.h1>

        {/* French text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="font-editorial italic text-lg mb-2"
          style={{ color: 'var(--text-muted)' }}>
          Cette page n'existe pas ou a été déplacée.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-mono text-xs mb-10"
          style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          ربما تم نقل الصفحة أو حذفها
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full justify-center">

          <Link to="/"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-display text-sm font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--blue), var(--blue-light))',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Home size={15} />
            العودة للرئيسية
          </Link>

          <Link to="/courses"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-display text-sm font-bold transition-all"
            style={{
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}>
            اكتشف الكورسات
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-14 flex flex-col items-center gap-1">
          <span className="font-display font-black text-2xl text-gradient-blue">AAM</span>
          <span className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text-muted)' }}>Académie Arabe de la Mode</span>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
