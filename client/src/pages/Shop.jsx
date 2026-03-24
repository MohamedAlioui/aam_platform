import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, ChevronRight, Zap, MessageCircle, CalendarCheck, Navigation, Store } from 'lucide-react';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import api from '@/utils/api';

/* ── palette ── */
const C = {
  bg:        '#ffffff',
  bgSoft:    '#f7f7f7',
  bgCard:    '#fafafa',
  border:    'rgba(0,0,0,0.09)',
  borderMed: 'rgba(0,0,0,0.18)',
  ink:       '#0a0a0a',
  inkMid:    'rgba(0,0,0,0.45)',
  inkFaint:  'rgba(0,0,0,0.25)',
  inkGhost:  'rgba(0,0,0,0.12)',
};

/* ─── Store locations ─── */
const STORES = [
  {
    id: 1,
    name: 'Boutique Tunis Centre',
    city: 'Tunis',
    address: 'Avenue Habib Bourguiba, Tunis 1000',
    phone: '+216 XX XXX XXX',
    hours: 'Lun–Sam · 9h–19h',
    tag: 'PRINCIPALE',
    mapUrl: 'https://maps.google.com/?q=Avenue+Habib+Bourguiba+Tunis',
    whatsapp: '21600000000',
  },
  {
    id: 2,
    name: 'Boutique Sfax',
    city: 'Sfax',
    address: 'Rue Habib Maazoun, Sfax 3000',
    phone: '+216 XX XXX XXX',
    hours: 'Lun–Sam · 9h–18h',
    tag: null,
    mapUrl: 'https://maps.google.com/?q=Sfax+Tunisie',
    whatsapp: '21600000000',
  },
  {
    id: 3,
    name: 'Boutique Sousse',
    city: 'Sousse',
    address: 'Avenue Mohamed V, Sousse 4000',
    phone: '+216 XX XXX XXX',
    hours: 'Lun–Sam · 9h–18h',
    tag: 'NOUVEAU',
    mapUrl: 'https://maps.google.com/?q=Sousse+Tunisie',
    whatsapp: '21600000000',
  },
];

/* ─── Marquee ─── */
const TICKER_ITEMS = [
  'SHOWROOM', '—', '3 BOUTIQUES', '—', 'TUNISIE', '—',
  'COLLECTION EXCLUSIVE', '—', '6IX BY AAM', '—', 'VISITE EN BOUTIQUE', '—',
];
const Marquee = () => (
  <div className="overflow-hidden py-3" style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
    <motion.div
      className="flex gap-10 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
        <span key={i} className="font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{ color: t === '—' ? C.inkGhost : C.inkFaint }}>
          {t}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── Store card ─── */
const StoreCard = ({ store, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative flex flex-col"
    style={{ border: `1px solid ${C.border}`, background: C.bg }}
  >
    {store.tag && (
      <div className="absolute top-4 right-4 px-2 py-1" style={{ background: C.ink }}>
        <span className="font-mono text-[8px] tracking-widest font-black text-white">{store.tag}</span>
      </div>
    )}

    {/* Map visual */}
    <div className="h-36 relative overflow-hidden flex items-center justify-center"
      style={{ background: C.bgSoft, borderBottom: `1px solid ${C.border}` }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.ink }}>
          <MapPin size={18} color="#fff" />
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.inkFaint }}>{store.city}</span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-mono font-black text-sm tracking-wide mb-4" style={{ color: C.ink }}>{store.name}</h3>
      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-3">
          <MapPin size={12} style={{ color: C.inkFaint, marginTop: 2, flexShrink: 0 }} />
          <span className="font-mono text-xs leading-relaxed" style={{ color: C.inkMid }}>{store.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={12} style={{ color: C.inkFaint, flexShrink: 0 }} />
          <span className="font-mono text-xs" style={{ color: C.inkMid }}>{store.hours}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={12} style={{ color: C.inkFaint, flexShrink: 0 }} />
          <span className="font-mono text-xs" style={{ color: C.inkMid }}>{store.phone}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <a href={store.mapUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-all"
          style={{ background: C.ink, color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#333'}
          onMouseLeave={e => e.currentTarget.style.background = C.ink}>
          <Navigation size={11} /> Itinéraire
        </a>
        <a href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Bonjour, je voudrais visiter votre boutique à ${store.city}.`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-all"
          style={{ background: '#25D366', color: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
          onMouseLeave={e => e.currentTarget.style.background = '#25D366'}>
          <MessageCircle size={11} /> WhatsApp
        </a>
      </div>
    </div>
  </motion.div>
);

/* ─── Product thumbnail card ─── */
const ProductCard = ({ product, onSelect, isSelected }) => (
  <motion.div
    whileHover={{ y: -4 }}
    onClick={() => onSelect(product)}
    className="cursor-pointer group"
    style={{
      border: `1px solid ${isSelected ? C.ink : C.border}`,
      background: isSelected ? C.bgSoft : C.bg,
      transition: 'border-color 0.2s, background 0.2s',
    }}
  >
    <div className="aspect-square overflow-hidden" style={{ background: C.bgSoft }}>
      {product.images?.[0] ? (
        <img src={product.images[0]} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono font-black text-3xl select-none"
            style={{ color: isSelected ? 'rgba(0,0,0,0.3)' : C.inkGhost }}>
            6IX
          </span>
        </div>
      )}
    </div>
    <div className="p-3">
      <p className="font-mono font-bold text-xs truncate" style={{ color: C.ink }}>{product.name}</p>
      <p className="font-mono text-xs mt-1" style={{ color: C.inkFaint }}>{product.price} TND</p>
    </div>
  </motion.div>
);

/* ─── Default products ─── */
const PLACEHOLDER_PRODUCTS = [
  { _id: '1', name: 'T-Shirt Oversized', category: 'T-Shirt', price: 299, description: 'Coupe oversize en coton épais. Sérigraphie 6IX au dos. Edition limitée.', colors: ['Noir', 'Blanc'], images: [], tag: 'BESTSELLER' },
  { _id: '2', name: 'Hoodie Signature',  category: 'Hoodie',  price: 599, description: 'Hoodie premium double épaisseur. Broderie 6IX en relief. Coupe boxy.',   colors: ['Noir', 'Blanc', 'Gris'], images: [], tag: 'NEW DROP' },
  { _id: '3', name: 'Cap 6ix',           category: 'Cap',     price: 199, description: 'Casquette snapback ajustable. Logo brodé 6IX. Coloris exclusifs.',        colors: ['Noir', 'Blanc'], images: [], tag: null },
];

const ALL_CATEGORIES = ['Tout', 'T-Shirt', 'Hoodie', 'Cap'];

const openWhatsApp = (productName) => {
  const msg = encodeURIComponent(`Bonjour ! Je suis intéressé(e) par "${productName}" vu sur votre catalogue. Pouvez-vous m'indiquer dans quelle boutique je peux le trouver ?`);
  window.open(`https://wa.me/21600000000?text=${msg}`, '_blank');
};

/* ─── Main page ─── */
const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('Tout');
  const heroRef = useRef(null);
  const storesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const storesInView = useInView(storesRef, { once: true, margin: '-80px' });

  useEffect(() => {
    api.get('/products').then(r => {
      const data = r.data.products || [];
      setProducts(data.length > 0 ? data : PLACEHOLDER_PRODUCTS);
    }).catch(() => setProducts(PLACEHOLDER_PRODUCTS));
  }, []);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) setSelectedProduct(products[0]);
  }, [products]);

  useEffect(() => {
    setFilteredProducts(
      category === 'Tout' ? products : products.filter(p => p.category === category)
    );
  }, [products, category]);

  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.ink }}>

      {/* ── Sticky nav ── */}
      <div className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono font-black text-xl tracking-widest" style={{ color: C.ink }}>6IX</span>
            <span className="hidden sm:block w-px h-4" style={{ background: C.border }} />
            <span className="hidden sm:block font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: C.inkFaint }}>
              {STORES.length} Boutiques en Tunisie
            </span>
          </div>

          {/* Category tabs */}
          <div className="hidden md:flex items-center">
            {ALL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-1.5 transition-all duration-200"
                style={{
                  color: category === cat ? C.ink : C.inkFaint,
                  borderBottom: category === cat ? `1px solid ${C.ink}` : '1px solid transparent',
                }}>
                {cat}
              </button>
            ))}
          </div>

          <motion.button
            onClick={() => storesRef.current?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-4 py-2 font-mono text-[10px] tracking-widest uppercase transition-all"
            style={{ border: `1px solid ${C.borderMed}`, color: C.inkMid }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.ink; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMed; e.currentTarget.style.color = C.inkMid; }}
          >
            <Store size={12} /> Nos Boutiques
          </motion.button>
        </div>
      </div>

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Hero ── */}
      <div ref={heroRef} className="relative overflow-hidden"
        style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        {/* subtle dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(${C.inkGhost} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }} />
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end gap-10">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-5 px-3 py-1"
                style={{ border: `1px solid ${C.border}` }}
              >
                <Zap size={9} style={{ color: C.inkFaint }} />
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase" style={{ color: C.inkFaint }}>
                  Catalogue — {STORES.length} Boutiques
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-mono font-black tracking-tighter leading-none"
                style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', color: C.ink }}
              >
                6IX
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="font-mono text-xs tracking-[0.4em] uppercase mt-4"
                style={{ color: C.inkFaint }}
              >
                Découvrez la collection — Achetez en boutique
              </motion.p>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex items-center gap-8"
            >
              {[
                { value: STORES.length, label: 'Boutiques' },
                { value: products.length || '3+', label: 'Pièces' },
                { value: 'TN', label: 'Origine' },
              ].map(({ value, label }, i) => (
                <div key={i} className="text-center">
                  <p className="font-mono font-black text-3xl" style={{ color: C.ink }}>{value}</p>
                  <p className="font-mono text-[9px] tracking-widest uppercase mt-1" style={{ color: C.inkFaint }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Mobile category tabs ── */}
      <div className="md:hidden flex items-center overflow-x-auto px-4"
        style={{ background: C.bgSoft, borderBottom: `1px solid ${C.border}` }}>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="font-mono text-[10px] tracking-widest uppercase px-4 py-3 whitespace-nowrap shrink-0 transition-all"
            style={{
              color: category === cat ? C.ink : C.inkFaint,
              borderBottom: category === cat ? `1px solid ${C.ink}` : '1px solid transparent',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Catalogue section ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

          {/* Left: Viewer + thumbnails */}
          <div className="lg:sticky lg:top-20">
            <div className="relative">
              <Suspense fallback={
                <div className="aspect-square flex items-center justify-center"
                  style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: C.inkFaint }}>Chargement…</span>
                </div>
              }>
                {selectedProduct && <ProductViewer3D product={selectedProduct} />}
              </Suspense>

              {selectedProduct?.tag && (
                <div className="absolute top-4 left-4 px-2.5 py-1" style={{ background: C.ink }}>
                  <span className="font-mono text-[9px] tracking-widest font-black text-white uppercase">
                    {selectedProduct.tag}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 px-2.5 py-1"
                style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid ${C.border}` }}>
                <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: C.inkMid }}>En boutique</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="font-mono text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: C.inkFaint }}>
                {category === 'Tout' ? 'Collection' : category} · {filteredProducts.length} pièces
              </p>
              <div className="grid grid-cols-4 gap-2">
                {filteredProducts.map(p => (
                  <ProductCard key={p._id} product={p}
                    onSelect={setSelectedProduct}
                    isSelected={selectedProduct?._id === p._id} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product detail */}
          <div>
            {selectedProduct && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProduct._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3" style={{ color: C.inkFaint }}>
                    {selectedProduct.category}
                  </div>
                  <h2 className="font-mono font-black tracking-tight leading-tight mb-4"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: C.ink }}>
                    {selectedProduct.name.toUpperCase()}
                  </h2>
                  <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: C.inkMid }}>
                    {selectedProduct.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="font-mono font-black text-4xl" style={{ color: C.ink }}>{selectedProduct.price}</span>
                    <span className="font-mono text-sm" style={{ color: C.inkFaint }}>TND</span>
                  </div>

                  {/* Colors */}
                  {selectedProduct.colors?.length > 0 && (
                    <div className="mb-8">
                      <p className="font-mono text-[9px] tracking-[0.4em] uppercase mb-2" style={{ color: C.inkFaint }}>
                        Coloris disponibles
                      </p>
                      <p className="font-mono text-xs" style={{ color: C.inkMid }}>
                        {selectedProduct.colors.join(' · ')}
                      </p>
                    </div>
                  )}

                  {/* Available stores */}
                  <div className="mb-8 p-4" style={{ background: C.bgSoft, border: `1px solid ${C.border}` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Store size={12} style={{ color: C.inkFaint }} />
                      <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: C.inkFaint }}>
                        Disponible dans {STORES.length} boutiques
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STORES.map(s => (
                        <span key={s.id} className="font-mono text-[10px] px-2 py-1"
                          style={{ border: `1px solid ${C.borderMed}`, color: C.inkMid }}>
                          {s.city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-px mb-8" style={{ background: C.border }} />

                  {/* CTAs */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={() => openWhatsApp(selectedProduct.name)}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 font-mono text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                      style={{ background: '#25D366', color: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
                      onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                    >
                      <MessageCircle size={14} /> Demander via WhatsApp
                    </motion.button>

                    <motion.button
                      onClick={() => storesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-4 font-mono text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-colors"
                      style={{ background: C.ink, color: '#fff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#222'}
                      onMouseLeave={e => e.currentTarget.style.background = C.ink}
                    >
                      <MapPin size={14} /> Trouver une Boutique
                    </motion.button>

                    <a href="tel:+21600000000"
                      className="w-full py-3 font-mono text-[10px] tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all"
                      style={{ border: `1px solid ${C.borderMed}`, color: C.inkMid }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.ink; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMed; e.currentTarget.style.color = C.inkMid; }}
                    >
                      <Phone size={11} /> Appeler la boutique
                    </a>
                  </div>

                  {/* Info rows */}
                  <div className="mt-10">
                    {[
                      { label: 'Essayage', value: 'En boutique' },
                      { label: 'Sur mesure', value: 'Disponible' },
                      { label: 'Paiement', value: 'Cash · Carte · Virement' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-4"
                        style={{ borderBottom: `1px solid ${C.border}` }}>
                        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.inkFaint }}>
                          {label}
                        </span>
                        <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: C.inkMid }}>
                          {value} <ChevronRight size={10} style={{ color: C.inkGhost }} />
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── Stores section ── */}
      <div ref={storesRef} style={{ background: C.bgSoft, borderTop: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-6 py-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1"
              style={{ border: `1px solid ${C.border}` }}>
              <Store size={9} style={{ color: C.inkFaint }} />
              <span className="font-mono text-[9px] tracking-[0.5em] uppercase" style={{ color: C.inkFaint }}>
                Nos Boutiques
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="font-mono font-black text-4xl md:text-5xl tracking-tight" style={{ color: C.ink }}>
                  {STORES.length} ADRESSES
                </h2>
                <p className="font-mono text-xs mt-3 tracking-[0.3em] uppercase" style={{ color: C.inkFaint }}>
                  Partout en Tunisie — Venez nous rendre visite
                </p>
              </div>
              <a href="https://wa.me/21600000000" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-widest uppercase self-start sm:self-auto transition-all"
                style={{ border: `1px solid ${C.borderMed}`, color: C.inkMid }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.ink; e.currentTarget.style.color = C.ink; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMed; e.currentTarget.style.color = C.inkMid; }}
              >
                <CalendarCheck size={12} /> Prendre RDV
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORES.map((store, i) => <StoreCard key={store.id} store={store} index={i} />)}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-12 pt-8 text-center"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <p className="font-mono text-xs" style={{ color: C.inkFaint }}>
              Chaque pièce de la collection 6IX est disponible dans toutes nos boutiques.<br />
              Contactez-nous pour vérifier la disponibilité d'un article spécifique.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.border}` }} className="py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-mono font-black text-2xl tracking-widest" style={{ color: C.ink }}>6IX</p>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase mt-1" style={{ color: C.inkFaint }}>
              By Académie Arabe de la Mode — Tunisie
            </p>
          </div>
          <p className="font-mono text-[10px]" style={{ color: C.inkFaint }}>
            © 2025 6IX — Vente en boutique uniquement
          </p>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
