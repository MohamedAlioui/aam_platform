import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Quote, Plus, Star } from 'lucide-react';

/* ─────────────────────────────────────────
   ADD MORE VIDEOS HERE — just paste the FB URL
───────────────────────────────────────── */
const VIDEOS = [
  {
    url: 'https://www.facebook.com/share/r/1atzrhwYwY',
    name: '',
    city: '',
    role: '',
    stars: 5,
  },
  // { url: 'https://www.facebook.com/watch/?v=...', name: 'Fatma B.', city: 'Tunis', role: 'Étudiante Moulage', stars: 5 },
  // { url: 'https://www.facebook.com/share/r/...', name: 'Sana M.', city: 'Sousse', role: 'Diplômée 2024', stars: 5 },
];

const toEmbedUrl = (raw) =>
  `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(raw)}&show_text=false&width=560&autoplay=false`;

const Stars = ({ count = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={12} fill="var(--gold)" color="var(--gold)" />
    ))}
  </div>
);

/* ── Single video card ── */
const VideoCard = ({ video, index }) => {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 transition-all"
              style={{ background: 'linear-gradient(135deg, var(--bg-section) 0%, var(--bg-card) 100%)' }}
            >
              {/* Animated ring */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--blue)', opacity: 0.15 }}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))', boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}
                >
                  <Play size={22} fill="white" color="white" className="ml-1" />
                </motion.div>
              </div>
              <div className="text-center px-4">
                <p className="font-arabic text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
                  شاهد الشهادة
                </p>
                <p className="font-editorial italic text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Cliquez pour voir
                </p>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="iframe"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
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
          {video.stars > 0 && <Stars count={video.stars} />}
          {video.name ? (
            <p className="font-display text-sm font-bold mt-1.5" style={{ color: 'var(--text-primary)' }}>
              {video.name}
            </p>
          ) : (
            <p className="font-arabic text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              طالب/ة من الأكاديمية
            </p>
          )}
          {(video.role || video.city) && (
            <p className="font-editorial italic text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {[video.role, video.city].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Page ── */
const TestimonialsPage = () => (
  <main style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

    {/* Banner */}
    <section className="relative pt-24 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--bg-section) 0%, var(--bg-page) 100%)' }}>
      <div className="absolute inset-0 pattern-arabic opacity-30 pointer-events-none" />

      {/* Blue glow */}
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

          {/* Stars row */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <Stars count={5} />
            <span className="font-display text-sm font-bold" style={{ color: 'var(--gold)' }}>5.0</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              · {VIDEOS.length} témoignage{VIDEOS.length > 1 ? 's' : ''}
            </span>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Stats bar */}
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

    {/* Videos grid */}
    <section className="section-padding">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid gap-8 ${
          VIDEOS.length === 1
            ? 'grid-cols-1 max-w-xl mx-auto'
            : VIDEOS.length === 2
            ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {VIDEOS.map((v, i) => <VideoCard key={i} video={v} index={i} />)}
        </div>

        {/* Add more placeholder — visible only in dev / to the admin */}
        {VIDEOS.length < 6 && (
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-8 border-2 border-dashed rounded-2xl p-10 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <Plus size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="font-arabic text-sm" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>
              أضف المزيد من الشهادات عبر ملف Testimonials.jsx
            </p>
            <p className="font-editorial italic text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Ajoutez vos vidéos dans <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--bg-section)' }}>pages/Testimonials.jsx</code>
            </p>
          </motion.div>
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
            <a href="/courses" className="btn-primary px-8">
              اكتشف الكورسات
            </a>
            <a href="/contact" className="btn-secondary px-8">
              تواصل معنا
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  </main>
);

export default TestimonialsPage;
