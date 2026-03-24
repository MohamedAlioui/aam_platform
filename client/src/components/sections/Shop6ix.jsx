import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingBag, Zap } from 'lucide-react';

const products = [
  { name: 'T-Shirt Oversized', price: '299', category: 'T-SHIRT', tag: 'BESTSELLER' },
  { name: 'Hoodie Signature',  price: '599', category: 'HOODIE',  tag: 'NEW DROP'  },
  { name: 'Cap 6ix',           price: '199', category: 'CAP',     tag: null        },
];

const ProductPreview = ({ product, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -6 }}
    className="group relative cursor-pointer"
  >
    {/* Image box */}
    <div className="relative aspect-square mb-4 overflow-hidden"
      style={{ background: index % 2 === 0 ? '#111' : '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Placeholder visual */}
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-mono font-black text-5xl select-none transition-all duration-500 group-hover:scale-110"
          style={{ color: index % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.08)', fontSize: '5rem' }}>
          6IX
        </span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <ShoppingBag size={16} className="text-black" />
        </div>
      </div>

      {/* Tag */}
      {product.tag && (
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[9px] tracking-widest px-2 py-1 font-bold"
            style={{ background: '#fff', color: '#000' }}>
            {product.tag}
          </span>
        </div>
      )}
    </div>

    <div className="font-mono text-[10px] tracking-[0.3em] mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
      {product.category}
    </div>
    <div className="font-mono font-bold text-white text-lg tracking-wide">{product.name}</div>
    <div className="font-mono text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{product.price} TND</div>
  </motion.div>
);

const Shop6ix = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} style={{ background: '#000', color: '#fff' }} className="relative overflow-hidden">

      {/* Top border accent */}
      <div style={{ height: '3px', background: 'linear-gradient(to right, transparent, #fff, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-[10px] tracking-[0.6em] uppercase mb-4 flex items-center gap-3"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <Zap size={10} /> Sub-brand by Académie Arabe de la Mode
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-mono font-black leading-none tracking-tighter"
              style={{ fontSize: 'clamp(5rem, 15vw, 12rem)' }}
            >
              6IX
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="font-mono text-xs tracking-[0.4em] uppercase mt-4"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Streetwear — Black & White Universe
            </motion.p>
          </div>

          {/* Right side description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-xs"
          >
            <p className="font-mono text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Une collection capsule née de l'académie. L'élégance arabe rencontre le streetwear contemporain.
            </p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: '#fff', color: '#000' }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.4)', color: '#fff', background: 'transparent' }}
              >
                Explorer <ArrowRight size={14} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── Divider ── */}
        <div className="mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

        {/* ── Products grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {products.map((p, i) => <ProductPreview key={i} product={p} index={i} />)}
        </div>

        {/* ── Bottom CTA bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Nouvelle collection disponible
            </p>
            <p className="font-mono font-bold text-white text-lg mt-1">Drop 01 — Tunisie × Mode</p>
          </div>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-mono text-sm tracking-widest uppercase hover:bg-white/90 transition-all duration-300"
            >
              <ShoppingBag size={16} /> Voir le Catalogue
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom border accent */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
    </section>
  );
};

export default Shop6ix;
