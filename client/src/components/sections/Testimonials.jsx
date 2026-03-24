import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/utils/supabase';

const VideoCard = ({ item, index }) => {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.55 }}
      className="flex flex-col rounded-2xl overflow-hidden group"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.button
              key="poster"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActive(true)}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center"
              style={{ background: 'var(--bg-section)' }}
            >
              {item.thumbnail_url && (
                <img src={item.thumbnail_url} alt=""
                  className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))', boxShadow: '0 0 24px rgba(37,99,235,0.4)' }}
                >
                  <Play size={20} fill="white" color="white" className="ml-1" />
                </motion.div>
                <span className="font-arabic text-xs font-bold text-white">شاهد الشهادة</span>
              </div>
            </motion.button>
          ) : (
            <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0">
              <video src={item.video_url} className="w-full h-full object-cover"
                controls autoPlay playsInline />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))' }}>
          <Quote size={13} color="white" />
        </div>
        <div>
          <p className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {item.name || 'طالب/ة من الأكاديمية'}
          </p>
          {(item.role || item.city) && (
            <p className="font-editorial italic text-xs" style={{ color: 'var(--text-muted)' }}>
              {[item.role, item.city].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setItems(data || []));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" ref={ref} className="section-padding" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <span className="section-label">شهادات طلابنا — Témoignages</span>
            <h2 className="section-title" style={{ direction: 'rtl' }}>
              ماذا قالوا عن <span className="text-gradient-blue">الأكاديمية</span>
            </h2>
            <p className="font-editorial italic text-lg mt-2" style={{ color: 'var(--text-muted)' }}>
              Ce que disent nos étudiants
            </p>
          </motion.div>
        </div>

        <div className={`grid gap-8 ${
          items.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
          items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {items.map((item, i) => <VideoCard key={item.id} item={item} index={i} />)}
        </div>

        {/* See all */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-10">
          <Link to="/testimonials"
            className="inline-flex items-center gap-2 font-mono text-sm tracking-wide transition-colors"
            style={{ color: 'var(--blue)' }}>
            Voir tous les témoignages <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
