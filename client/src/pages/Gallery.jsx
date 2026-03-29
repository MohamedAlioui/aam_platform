import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Gallery3D from '@/components/3d/Gallery3D';
import GallerySection from '@/components/sections/Gallery';
import { GALLERY_CATEGORIES } from '@/utils/constants';
import api from '@/utils/api';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const params = category !== 'all' ? { category } : {};
    api.get('/gallery', { params }).then(r => setImages(r.data.images || [])).catch(() => {});
  }, [category]);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* Header — explicit dark gradient, theme-independent */}
      <div className="relative pt-28 pb-10 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0b1120 0%, #1e3a5f 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: 'var(--blue)' }} />
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--blue-light)' }}>Galerie</span>
            <div className="w-8 h-px" style={{ background: 'var(--blue)' }} />
          </div>
          <h1 className="section-title mb-2" style={{ color: '#ffffff', direction: 'rtl' }}>
            معرض <span className="text-gradient-blue">الإبداع</span>
          </h1>
          <p className="font-editorial italic text-xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Galerie de Créations
          </p>
        </div>
      </div>

      {/* 3D floating gallery */}
      <div className="relative px-6 mb-8 pt-8">
        <Suspense fallback={
          <div className="h-[600px] rounded-2xl skeleton" style={{ background: 'var(--bg-section)' }} />
        }>
          <Gallery3D images={images} />
        </Suspense>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 px-6 mb-8">
        {GALLERY_CATEGORIES.map(cat => (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCategory(cat.value)}
            className="font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300"
            style={{
              borderColor: category === cat.value ? 'var(--blue)' : 'var(--border)',
              color: category === cat.value ? 'var(--blue)' : 'var(--text-muted)',
              background: category === cat.value ? 'var(--blue-pale)' : 'transparent',
            }}
          >
            {cat.label_fr}
          </motion.button>
        ))}
      </div>

      {/* Masonry grid */}
      <GallerySection />
    </main>
  );
};

export default GalleryPage;
