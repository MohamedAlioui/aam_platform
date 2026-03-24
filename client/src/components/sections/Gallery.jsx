import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';
import { gsap } from '@/utils/animations';
import api from '@/utils/api';

const Lightbox = ({ image, onClose }) => (
  <AnimatePresence>
    {image && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
        onClick={onClose}
      >
        <motion.img
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          src={image.url} alt={image.title_fr}
          className="max-w-4xl max-h-[85vh] object-contain rounded-xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        />
        <button onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl transition-all"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
        >
          <X size={17} />
        </button>
        {image.title_fr && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <p className="font-editorial italic text-white/60 text-lg">{image.title_fr}</p>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

const GalleryGrid = ({ images, onSelect }) => {
  const gridRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        opacity: 0, y: 24, scale: 0.96, duration: 0.6,
        stagger: { amount: 0.7, from: 'start' }, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 78%', toggleActions: 'play none none none' }
      });
    }, gridRef);
    return () => ctx.revert();
  }, [images]);

  return (
    <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {images.map((img, i) => (
        <motion.div key={img._id || i} className="gallery-item relative group cursor-pointer break-inside-avoid"
          onClick={() => onSelect(img)} whileHover={{ scale: 1.015 }} transition={{ duration: 0.25 }}>
          <div className="relative overflow-hidden rounded-xl" style={{ border: '1px solid var(--border)' }}>
            <img src={img.url} alt={img.title_fr || ''} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(37,99,235,0.15)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: 'var(--blue)' }}>
                <ZoomIn size={18} />
              </div>
            </div>
          </div>
          {img.title_fr && (
            <p className="font-editorial italic text-xs mt-2 px-1" style={{ color: 'var(--text-muted)' }}>{img.title_fr}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

const GallerySection = () => {
  const [images, setImages]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/gallery')
      .then(r => { setImages(r.data.images || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Galerie</span>
          <h2 className="section-title" style={{ direction: 'rtl' }}>
            معرض <span className="text-gradient-blue">الأعمال</span>
          </h2>
          <p className="section-subtitle">Collections, défilés & créations de nos étudiants</p>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="skeleton rounded-xl break-inside-avoid" style={{ height: `${180 + (i % 3) * 60}px` }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl"
            style={{ background: 'var(--bg-section)', border: '2px dashed var(--border)' }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--blue-pale)' }}>
              <ImageIcon size={32} style={{ color: 'var(--blue)' }} />
            </div>
            <h3 className="font-arabic text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              المعرض قريباً
            </h3>
            <p className="font-editorial italic text-lg mb-1" style={{ color: 'var(--text-muted)' }}>
              Galerie en cours de préparation
            </p>
            <p className="font-mono text-xs tracking-wider mt-2" style={{ color: 'var(--text-muted)' }}>
              Nos créations seront bientôt disponibles
            </p>
          </motion.div>
        ) : (
          <GalleryGrid images={images} onSelect={setSelected} />
        )}
      </div>

      <Lightbox image={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default GallerySection;
