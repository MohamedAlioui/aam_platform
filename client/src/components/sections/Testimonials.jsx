import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Play, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      transition={{ delay: index * 0.12, duration: 0.55 }}
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
      .limit(4)
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

        <div className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))' }}>
          {items.map((item, i) => <ReelCard key={item.id} item={item} index={i} />)}
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
