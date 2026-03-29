import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Award, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { STATS } from '@/utils/constants';

/* ─── Animated counter ─────────────────────────── */
const Counter = ({ value, suffix, label_ar, label_fr, index }) => {
  const numRef = useRef(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const obj = { v: 0 };
        gsap.to(obj, { v: value, duration: 2, ease: 'power2.out', delay: index * 0.15,
          onUpdate() { if (numRef.current) numRef.current.textContent = Math.round(obj.v) + suffix; }
        });
      }
    }, { threshold: 0.5 });
    if (numRef.current) observer.observe(numRef.current);
    return () => observer.disconnect();
  }, [value, suffix, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
      className="text-center py-5 px-4"
    >
      <div ref={numRef} className="font-display text-3xl md:text-4xl font-black text-gradient-blue"
        style={{ fontVariantNumeric: 'tabular-nums' }}>0{suffix}</div>
      <div className="font-arabic text-xs mt-1 font-semibold" style={{ color: 'var(--text-secondary)' }}>{label_ar}</div>
      <div className="font-editorial italic text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label_fr}</div>
    </motion.div>
  );
};

/* ─── Hero ──────────────────────────────────────── */
const Hero = () => {
  const wordsRef = useRef(null);

  useEffect(() => {
    if (!wordsRef.current) return;
    const words = wordsRef.current.dataset.text.split(' ');
    wordsRef.current.innerHTML = words
      .map(w => `<span class="inline-block overflow-hidden"><span class="inline-block hero-word">${w}</span></span>`)
      .join('<span class="inline-block w-3"> </span>');
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { y: '110%', opacity: 0, rotateX: -60, stagger: 0.1, duration: 0.8, ease: 'back.out(1.3)', delay: 0.4 });
    }, wordsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>

      <div className="flex min-h-screen items-center">

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center w-full max-w-3xl mx-auto px-6 md:px-12 pt-28 pb-16">

          {/* Guinness badge */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }} className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs tracking-widest uppercase"
              style={{ border: '1px solid var(--gold)', background: 'rgba(217,119,6,0.07)', color: 'var(--gold)' }}>
              <Award size={12} /> Guinness World Record™
            </span>
          </motion.div>

          {/* Arabic headline */}
          <h1
            ref={wordsRef}
            data-text="أكاديمية عربية للموضة"
            className="font-arabic font-black leading-tight mb-4 text-center"
            style={{ direction: 'rtl', fontSize: 'clamp(2.8rem, 8vw, 6rem)', color: 'var(--text-primary)', perspective: '800px' }}
          >
            أكاديمية عربية للموضة
          </h1>

          {/* Divider */}
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.95, duration: 0.9 }}
            className="mb-4 mx-auto" style={{ width: '140px', height: '3px', borderRadius: '2px', background: 'linear-gradient(to right, transparent, var(--blue), transparent)' }} />

          {/* French subtitle */}
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.6 }}
            className="font-editorial italic mb-2 text-center" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: 'var(--text-muted)' }}>
            Académie Arabe de la Mode
          </motion.p>

          {/* Tagline */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
            className="font-arabic text-sm md:text-base mb-10 text-center" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>
            حيث يلتقي الموروث العربي بموضة الغد
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.55 }}
            className="flex flex-col sm:flex-row gap-3 mb-14 justify-center">
            <Link to="/courses">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn-primary px-8 flex items-center gap-2">
                اكتشف كورساتنا <ArrowRight size={15} />
              </motion.button>
            </Link>
            <Link to="/about">
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="btn-outline px-8">
                En Savoir Plus
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
            className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
            {STATS.map((stat, i) => (
              <div
                key={i}
                /* Mobile 2-col: right border only on left-column items (even index), bottom border on first row */
                /* Desktop 4-col: right border on all except last */
                className={[
                  i % 2 === 0 ? 'border-r' : '',
                  i < 2     ? 'border-b md:border-b-0' : '',
                  i < 3     ? 'md:border-r' : 'md:border-r-0',
                ].join(' ')}
                style={{ borderColor: 'var(--border)' }}
              >
                <Counter {...stat} index={i} />
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 lg:left-1/4">
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }} style={{ color: 'var(--blue)' }}>
          <ChevronDown size={17} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
