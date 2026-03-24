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
    <main className="min-h-screen bg-navy-deep pt-20">
      {/* Header */}
      <div className="text-center pt-16 pb-8 px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-cyan" />
          <span className="font-mono text-xs tracking-widest text-cyan uppercase">Galerie</span>
          <div className="w-8 h-px bg-cyan" />
        </div>
        <h1 className="section-title text-off-white mb-2" style={{ direction: 'rtl' }}>
          معرض <span className="text-gradient-cyan">الإبداع</span>
        </h1>
        <p className="font-editorial italic text-blue-light/50 text-xl">Galerie de Créations</p>
      </div>

      {/* 3D floating gallery */}
      <div className="relative px-6 mb-8">
        <Suspense fallback={<div className="h-[600px] bg-navy rounded-2xl skeleton" />}>
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
            className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300 ${
              category === cat.value
                ? 'border-cyan text-cyan bg-cyan/10'
                : 'border-cyan/20 text-off-white/40 hover:border-cyan/50 hover:text-off-white/70'
            }`}
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
