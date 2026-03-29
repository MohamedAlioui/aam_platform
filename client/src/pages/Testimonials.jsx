import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const ReelCard = ({ item, index }) => {
  const [playing, setPlaying] = useState(false);
  const vRef = useRef(null);

  const toggle = () => {
    if (!vRef.current) return;
    if (playing) { vRef.current.pause(); setPlaying(false); }
    else          { vRef.current.play();  setPlaying(true);  }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={toggle}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ aspectRatio: '9/16', background: '#000', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}
    >
      {/* Media */}
      {item.thumbnail_url && !playing && (
        <img src={item.thumbnail_url} alt=""
          className="absolute inset-0 w-full h-full object-cover" />
      )}
      <video ref={vRef} src={item.video_url} loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: (!item.thumbnail_url || playing) ? 'block' : 'none' }} />

      {/* Gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)' }} />

      {/* Stars top-right */}
      <div className="absolute top-4 right-4 flex items-center gap-0.5">
        {Array.from({ length: item.stars || 5 }).map((_, i) => (
          <Star key={i} size={12} fill="#facc15" color="#facc15" />
        ))}
      </div>

      {/* Play / pause button */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute w-16 h-16 rounded-full"
              style={{ background: 'rgba(37,99,235,0.25)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))', boxShadow: '0 0 30px rgba(37,99,235,0.5)' }}>
              <Play size={20} fill="white" color="white" className="ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay on hover while playing */}
      {playing && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
            <span className="text-white text-sm font-bold tracking-widest">II</span>
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="font-display text-sm font-bold text-white leading-tight drop-shadow-lg">
          {item.name || 'طالب/ة من الأكاديمية'}
        </p>
        {(item.role || item.city) && (
          <p className="font-editorial italic text-xs mt-0.5 text-white/65">
            {[item.role, item.city].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>

      {/* Right sidebar — reel style */}
      <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
        {['♡', '💬', '➤'].map((icon, i) => (
          <span key={i} className="text-lg text-white/70 drop-shadow">{icon}</span>
        ))}
      </div>
    </motion.div>
  );
};

const TestimonialsPage = () => {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, []);

  return (
    <main style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

      {/* Banner */}
      <section className="relative pt-24 pb-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--bg-section) 0%, var(--bg-page) 100%)' }}>
        <div className="absolute inset-0 pattern-arabic opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(37,99,235,0.12), transparent)' }} />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="section-label">شهادات طلابنا — Témoignages</span>
            <h1 className="section-title mb-3" style={{ direction: 'rtl' }}>
              ماذا قالوا عن <span className="text-gradient-blue">الأكاديمية</span>
            </h1>
            <p className="font-editorial italic text-lg" style={{ color: 'var(--text-muted)' }}>
              Ce que disent nos étudiants
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="var(--gold)" color="var(--gold)" />
              ))}
              <span className="font-display text-sm font-bold" style={{ color: 'var(--gold)' }}>5.0</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                · {items.length} témoignage{items.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 border-y" style={{ background: 'var(--bg-section)', borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            {[
              { value: '1000+', label_ar: 'طالب تخرج',    label_fr: 'Diplômés'    },
              { value: '5★',    label_ar: 'تقييم الطلاب', label_fr: 'Satisfaction' },
              { value: '100%',  label_ar: 'تدريب عملي',   label_fr: 'Pratique'    },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="py-2"
              >
                <p className="font-display font-black text-gradient-blue"
                  style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>{s.value}</p>
                <p className="font-arabic text-xs mt-1" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>{s.label_ar}</p>
                <p className="font-editorial italic text-xs" style={{ color: 'var(--text-muted)' }}>{s.label_fr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reel grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))' }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-2xl animate-pulse"
                  style={{ aspectRatio: '9/16', background: 'var(--bg-section)' }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-arabic text-lg" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>لا توجد شهادات بعد</p>
              <p className="font-editorial italic text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Aucun témoignage pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))' }}>
              {items.map((item, i) => <ReelCard key={item.id} item={item} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center" style={{ background: 'var(--bg-section)' }}>
        <div className="max-w-xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-arabic text-2xl font-bold mb-2" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
              انضم إلى آلاف الطلاب الناجحين
            </h2>
            <p className="font-editorial italic text-base mb-6" style={{ color: 'var(--text-muted)' }}>
              Rejoignez nos étudiants et lancez votre carrière dans la mode
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/courses" className="btn-primary px-8">اكتشف الكورسات</a>
              <a href="/contact" className="btn-secondary px-8">تواصل معنا</a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default TestimonialsPage;
