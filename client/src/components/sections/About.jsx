import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from '@/utils/animations';
import { Award, Users, Star, Globe } from 'lucide-react';

const features = [
  { icon: <Award size={18} />, label_ar: 'رقم قياسي غينيس',  label_fr: 'Guinness World Record', gold: true  },
  { icon: <Users size={18} />, label_ar: '+1000 طالب',        label_fr: '+1000 Étudiants',        gold: false },
  { icon: <Star  size={18} />, label_ar: '10 سنوات خبرة',     label_fr: '10 Ans d\'Expérience',   gold: false },
  { icon: <Globe size={18} />, label_ar: 'معروفون دولياً',    label_fr: 'Reconnaissance Internationale', gold: false },
];

const About = () => {
  const sectionRef = useRef(null);
  const leftRef    = useRef(null);
  const rightRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' }
      });
      gsap.from(rightRef.current, {
        x: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding pattern-arabic"
      style={{ background: 'var(--bg-section)' }}>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — text */}
          <div ref={leftRef}>
            {/* Label */}
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase"
              style={{ background: 'var(--blue-pale)', color: 'var(--blue)', border: '1px solid var(--border)' }}>
              Notre Histoire
            </div>

            <h2 className="section-title mb-2" style={{ direction: 'rtl' }}>
              أكاديمية عربية
              <span className="block text-gradient-blue">للموضة</span>
            </h2>

            <p className="font-editorial italic text-lg mb-5" style={{ color: 'var(--text-muted)' }}>
              Académie Arabe de la Mode
            </p>

            <p className="font-arabic text-sm leading-loose mb-6"
              style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
              تأسست أكاديمية عربية للموضة بروح الإبداع والشغف، لتكون منارة للتصميم العربي على المستوى العالمي.
              نحن نفخر بحملنا للرقم القياسي العالمي لجينيس، مما يجعلنا الأكاديمية العربية الرائدة في مجال تصميم الأزياء.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl p-4 transition-all duration-250"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.gold ? 'var(--gold)' : 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ color: f.gold ? 'var(--gold)' : 'var(--blue)' }}>{f.icon}</span>
                  <p className="font-arabic text-xs mt-2 font-semibold"
                    style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
                    {f.label_ar}
                  </p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {f.label_fr}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — badge + quote */}
          <div ref={rightRef} className="flex flex-col items-center gap-8">

            {/* Guinness badge */}
            <div className="relative">
              <div className="w-44 h-44 rounded-full flex flex-col items-center justify-center"
                style={{
                  border: '2px solid var(--gold)',
                  background: 'var(--bg-card)',
                  boxShadow: '0 0 40px rgba(217,119,6,0.12)',
                }}
              >
                <span className="text-4xl mb-2">🏆</span>
                <div className="font-mono text-xs text-center" style={{ color: 'var(--gold)', letterSpacing: '0.18em' }}>
                  <div>GUINNESS</div>
                  <div>WORLD RECORD™</div>
                </div>
                <div className="font-arabic text-xs mt-1" style={{ color: 'var(--gold)', opacity: 0.7 }}>رقم قياسي عالمي</div>
              </div>
              <div className="absolute inset-0 rounded-full animate-spin-slow"
                style={{ border: '1px dashed var(--gold)', opacity: 0.2 }} />
            </div>

            {/* Quote */}
            <blockquote className="rounded-2xl p-6 max-w-sm text-center w-full"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <div className="text-2xl mb-3" style={{ color: 'var(--blue)', opacity: 0.3 }}>"</div>
              <p className="font-arabic leading-loose text-sm"
                style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
                الموضة ليست فقط ملابس — إنها لغة تحكي حضارة
              </p>
              <footer className="mt-4 font-editorial italic text-sm" style={{ color: 'var(--text-muted)' }}>
                — Fondatrice, Académie Arabe de la Mode
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
