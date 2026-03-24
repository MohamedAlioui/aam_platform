import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Quote, Star } from 'lucide-react';
import { supabase } from '@/utils/supabase';

const Stars = ({ count = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />
    ))}
  </div>
);

const VideoCard = ({ item, index }) => {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Video area */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.button
              key="poster"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4"
              style={{ background: 'var(--bg-section)' }}
            >
              {/* Thumbnail */}
              {item.thumbnail_url && (
                <img src={item.thumbnail_url} alt=""
                  className="absolute inset-0 w-full h-full object-cover" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
              {/* Play button */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  className="absolute rounded-full"
                  style={{ inset: '-8px', background: 'var(--blue)', opacity: 0.2 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))', boxShadow: '0 0 30px rgba(37,99,235,0.5)' }}
                >
                  <Play size={22} fill="white" color="white" className="ml-1" />
                </motion.div>
                <span className="font-arabic text-sm font-bold text-white relative z-10">شاهد الشهادة</span>
              </div>
            </motion.button>
          ) : (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0">
              <video
                src={item.video_url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card footer */}
      <div className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))' }}>
          <Quote size={14} color="white" />
        </div>
        <div className="flex-1 min-w-0">
          <Stars count={item.stars || 5} />
          <p className="font-display text-sm font-bold mt-1.5" style={{ color: 'var(--text-primary)' }}>
            {item.name || 'طالب/ة من الأكاديمية'}
          </p>
          {(item.role || item.city) && (
            <p className="font-editorial italic text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {[item.role, item.city].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsPage = () => {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        <div className="absolute inset-0 pattern-arabic opacity-30 pointer-events-none" />
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
              <Stars count={5} />
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
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: '1000+', label_ar: 'طالب تخرج', label_fr: 'Diplômés' },
              { value: '5★', label_ar: 'تقييم الطلاب', label_fr: 'Satisfaction' },
              { value: '100%', label_ar: 'تدريب عملي', label_fr: 'Pratique' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="font-display text-2xl md:text-3xl font-black text-gradient-blue">{s.value}</p>
                <p className="font-arabic text-xs mt-1" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>{s.label_ar}</p>
                <p className="font-editorial italic text-xs" style={{ color: 'var(--text-muted)' }}>{s.label_fr}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: 'var(--bg-section)', height: '280px' }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-arabic text-lg" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>
                لا توجد شهادات بعد
              </p>
              <p className="font-editorial italic text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Aucun témoignage pour le moment
              </p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              items.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
              items.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {items.map((item, i) => <VideoCard key={item.id} item={item} index={i} />)}
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
