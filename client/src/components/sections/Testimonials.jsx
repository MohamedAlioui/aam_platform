import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Play } from 'lucide-react';

/* ─────────────────────────────────────────
   ADD YOUR FACEBOOK VIDEO URLS HERE
   Format: { url, name, city, role }
   Just paste the FB share/watch link as-is
───────────────────────────────────────── */
const VIDEOS = [
  {
    url: 'https://www.facebook.com/share/r/1atzrhwYwY',
    name: '',
    city: '',
    role: '',
  },
  // Add more:
  // { url: 'https://www.facebook.com/watch/?v=...', name: 'Fatma', city: 'Tunis', role: 'Étudiante' },
];

const toEmbedUrl = (rawUrl) => {
  const encoded = encodeURIComponent(rawUrl);
  return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=500&autoplay=false`;
};

const VideoCard = ({ video, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.55 }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Video embed */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%', background: 'var(--bg-section)' }}>
        {!active ? (
          /* Poster / play button shown before user clicks */
          <button
            onClick={() => setActive(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center group transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, var(--bg-section), var(--bg-card))' }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'var(--blue)', boxShadow: '0 0 30px rgba(37,99,235,0.35)' }}
              >
                <Play size={24} fill="white" color="white" className="ml-1" />
              </motion.div>
              <span className="font-arabic text-xs" style={{ color: 'var(--text-muted)' }}>
                شاهد الشهادة
              </span>
              <span className="font-editorial italic text-xs" style={{ color: 'var(--text-muted)' }}>
                Voir le témoignage
              </span>
            </div>
          </button>
        ) : (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'var(--bg-section)' }}>
                <div className="w-8 h-8 rounded-full border-2 animate-spin"
                  style={{ borderColor: 'var(--blue)', borderTopColor: 'transparent' }} />
              </div>
            )}
            <iframe
              src={toEmbedUrl(video.url)}
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
              scrolling="no"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              onLoad={() => setLoaded(true)}
              title={`Témoignage ${index + 1}`}
            />
          </>
        )}
      </div>

      {/* Name / city (optional) */}
      {(video.name || video.city || video.role) && (
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))' }}>
            <Quote size={14} color="white" />
          </div>
          <div>
            {video.name && (
              <p className="font-display text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {video.name}
              </p>
            )}
            {(video.role || video.city) && (
              <p className="font-editorial italic text-xs" style={{ color: 'var(--text-muted)' }}>
                {[video.role, video.city].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} className="section-padding" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">شهادات طلابنا — Témoignages</span>
            <h2 className="section-title" style={{ direction: 'rtl' }}>
              ماذا قالوا عن <span className="text-gradient-blue">الأكاديمية</span>
            </h2>
            <p className="font-editorial italic text-lg mt-2" style={{ color: 'var(--text-muted)' }}>
              Ce que disent nos étudiants
            </p>
          </motion.div>
        </div>

        {/* Video grid */}
        <div className={`grid gap-8 ${VIDEOS.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : VIDEOS.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {VIDEOS.map((video, i) => (
            <VideoCard key={i} video={video} index={i} />
          ))}
        </div>

        {/* Facebook note */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center text-xs mt-8"
          style={{ color: 'var(--text-muted)' }}
        >
          Témoignages vidéo via Facebook
        </motion.p>
      </div>
    </section>
  );
};

export default Testimonials;
