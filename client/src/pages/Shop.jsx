import { useState, useEffect, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock, Phone, ChevronRight, MessageCircle, CalendarCheck, Navigation, Store, Sparkles, Diamond, Menu, X, ArrowLeft } from 'lucide-react';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import api from '@/utils/api';

/* ── Luxury palette ── */
const C = {
  /* backgrounds */
  bg:        '#0a0908',          /* near black warm */
  bgSoft:    '#111009',          /* slightly lighter warm black */
  bgCard:    '#16140f',          /* card surface */
  bgGlass:   'rgba(10,9,8,0.85)',
  /* borders */
  borderGold:  'rgba(201,169,110,0.3)',
  borderGoldHover: 'rgba(201,169,110,0.65)',
  borderFaint: 'rgba(255,255,255,0.07)',
  /* text */
  ink:       '#faf8f4',          /* near white warm */
  inkMid:    'rgba(250,248,244,0.60)',
  inkFaint:  'rgba(250,248,244,0.35)',
  inkGhost:  'rgba(250,248,244,0.12)',
  /* gold */
  gold:      '#c9a96e',
  goldLight: '#e2c98a',
  goldDark:  '#8a6e45',
  /* accent ivory */
  ivory:     '#f5f0e8',
};

/* ── Gold text gradient ── */
const goldGradient = `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 50%, ${C.gold} 100%)`;

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
  'SHOWROOM', '✦', 'COLLECTION EXCLUSIVE', '✦', '6IX BY AAM', '✦',
  '3 BOUTIQUES', '✦', 'TUNISIE', '✦', 'HAUTE COUTURE STREET', '✦',
];
const Marquee = () => (
  <div className="overflow-hidden py-3" style={{
    background: C.bgSoft,
    borderTop: `1px solid ${C.borderGold}`,
    borderBottom: `1px solid ${C.borderGold}`,
  }}>
    <motion.div
      className="flex gap-12 whitespace-nowrap"
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
    >
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
        <span key={i} className="font-mono text-[10px] tracking-[0.45em] uppercase"
          style={{ color: t === '✦' ? C.gold : C.inkFaint }}>
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
    transition={{ delay: index * 0.12, duration: 0.6 }}
    className="relative flex flex-col group"
    style={{
      border: `1px solid ${C.borderGold}`,
      background: C.bgCard,
      transition: 'border-color 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = C.borderGoldHover}
    onMouseLeave={e => e.currentTarget.style.borderColor = C.borderGold}
  >
    {store.tag && (
      <div className="absolute top-4 right-4 px-2 py-1 z-10"
        style={{ background: C.gold }}>
        <span className="font-mono text-[8px] tracking-widest font-black text-black">{store.tag}</span>
      </div>
    )}

    {/* Map visual */}
    <div className="h-40 relative overflow-hidden flex items-center justify-center"
      style={{ background: C.bgSoft, borderBottom: `1px solid ${C.borderGold}` }}>
      {/* Gold grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(${C.borderGold} 1px, transparent 1px), linear-gradient(90deg, ${C.borderGold} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, rgba(201,169,110,0.08) 0%, transparent 70%)` }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: goldGradient, boxShadow: '0 0 24px rgba(201,169,110,0.4)' }}>
          <MapPin size={18} color={C.bg} />
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.gold }}>{store.city}</span>
      </div>
    </div>

    <div className="p-6 flex flex-col flex-1">
      <h3 className="font-mono font-black text-sm tracking-wide mb-4" style={{ color: C.ink }}>{store.name}</h3>
      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-3">
          <MapPin size={12} style={{ color: C.goldDark, marginTop: 2, flexShrink: 0 }} />
          <span className="font-mono text-xs leading-relaxed" style={{ color: C.inkMid }}>{store.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={12} style={{ color: C.goldDark, flexShrink: 0 }} />
          <span className="font-mono text-xs" style={{ color: C.inkMid }}>{store.hours}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={12} style={{ color: C.goldDark, flexShrink: 0 }} />
          <span className="font-mono text-xs" style={{ color: C.inkMid }}>{store.phone}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <a href={store.mapUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 py-2.5 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-all"
          style={{ background: C.bgSoft, color: C.inkMid, border: `1px solid ${C.borderGold}` }}
          onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.inkMid; e.currentTarget.style.borderColor = C.borderGold; }}>
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
    whileHover={{ y: -3, scale: 1.02 }}
    onClick={() => onSelect(product)}
    className="cursor-pointer group relative"
    style={{
      border: isSelected ? `1px solid ${C.gold}` : `1px solid ${C.borderFaint}`,
      background: isSelected ? C.bgCard : C.bgSoft,
      transition: 'all 0.25s',
      boxShadow: isSelected ? `0 0 16px rgba(201,169,110,0.25)` : 'none',
    }}
  >
    <div className="aspect-square overflow-hidden" style={{ background: C.bgCard }}>
      {product.images?.[0] ? (
        <img src={product.images[0]} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-mono font-black text-2xl select-none"
            style={{ background: isSelected ? goldGradient : 'none', WebkitBackgroundClip: isSelected ? 'text' : 'initial', WebkitTextFillColor: isSelected ? 'transparent' : C.inkGhost }}>
            6IX
          </span>
        </div>
      )}
    </div>
    <div className="p-2.5">
      <p className="font-mono font-bold text-[10px] truncate" style={{ color: C.ink }}>{product.name}</p>
      <p className="font-mono text-[10px] mt-0.5" style={{ color: C.gold }}>{product.price} TND</p>
    </div>
    {isSelected && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: goldGradient }} />
    )}
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

/* ─── Gold divider ─── */
const GoldDivider = () => (
  <div className="flex items-center gap-4 my-8">
    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.borderGold})` }} />
    <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
    <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${C.borderGold})` }} />
  </div>
);

/* ─── Main page ─── */
const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('Tout');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const heroRef = useRef(null);
  const storesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const storesInView = useInView(storesRef, { once: true, margin: '-80px' });

  /* parallax */
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

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

  const selectCategory = (cat) => { setCategory(cat); setMobileNavOpen(false); };

  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.ink }}>

      {/* ══ Navbar (fixed, replaces the App-level Navbar for shop) ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ background: C.bgGlass, backdropFilter: 'blur(24px)', borderBottom: `1px solid ${C.borderGold}` }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* Left: back link + logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <Link to="/"
              className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase transition-all shrink-0"
              style={{ color: C.inkFaint }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.inkFaint}
            >
              <ArrowLeft size={11} />
              <span className="hidden sm:inline">AAM</span>
            </Link>
            <div className="w-px h-4 shrink-0" style={{ background: C.borderGold }} />
            <span className="font-mono font-black text-lg sm:text-xl tracking-widest shrink-0" style={{ color: C.gold }}>
              6IX
            </span>
            <span className="hidden xl:block font-mono text-[9px] tracking-[0.4em] uppercase truncate" style={{ color: C.inkFaint }}>
              {STORES.length} Boutiques · Tunisie
            </span>
          </div>

          {/* Center: category tabs (md+) */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            {ALL_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => selectCategory(cat)}
                className="font-mono text-[10px] tracking-[0.3em] uppercase px-3 lg:px-4 py-1.5 transition-all duration-200 whitespace-nowrap"
                style={{
                  color: category === cat ? C.gold : C.inkFaint,
                  borderBottom: category === cat ? `1px solid ${C.gold}` : '1px solid transparent',
                }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Right: boutiques + hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={() => storesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-all"
              style={{ border: `1px solid ${C.borderGold}`, color: C.inkFaint }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderGold; e.currentTarget.style.color = C.inkFaint; }}
            >
              <Store size={11} />
              <span className="hidden lg:inline">Nos Boutiques</span>
              <span className="lg:hidden">Boutiques</span>
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 transition-all"
              style={{ border: `1px solid ${mobileNavOpen ? C.gold : C.borderGold}`, color: mobileNavOpen ? C.gold : C.inkFaint }}
            >
              {mobileNavOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden"
              style={{ background: C.bgCard, borderTop: `1px solid ${C.borderGold}` }}
            >
              <div className="px-4 py-3 space-y-1">
                <p className="font-mono text-[8px] tracking-[0.5em] uppercase mb-2 px-3" style={{ color: C.goldDark }}>
                  Collection
                </p>
                {ALL_CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={cat}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => selectCategory(cat)}
                    className="w-full flex items-center justify-between px-3 py-2.5 font-mono text-[11px] tracking-[0.3em] uppercase transition-all"
                    style={{
                      background: category === cat ? 'rgba(201,169,110,0.1)' : 'transparent',
                      color: category === cat ? C.gold : C.inkMid,
                      border: `1px solid ${category === cat ? C.borderGold : 'transparent'}`,
                    }}
                  >
                    {cat}
                    {category === cat && <span style={{ color: C.gold, fontSize: 10 }}>✦</span>}
                  </motion.button>
                ))}

                <div className="h-px my-2" style={{ background: C.borderGold, opacity: 0.5 }} />

                <button
                  onClick={() => { storesRef.current?.scrollIntoView({ behavior: 'smooth' }); setMobileNavOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] tracking-widest uppercase transition-all"
                  style={{ color: C.inkFaint }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = C.inkFaint}
                >
                  <Store size={12} /> Nos Boutiques
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Navbar height offset */}
      <div style={{ height: 56 }} />

      {/* ── Marquee ── */}
      <Marquee />

      {/* ── Hero ── */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ minHeight: '80vh' }}>
        {/* Dramatic background layers */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {/* Deep diagonal grain texture */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              rgba(201,169,110,0.015) 2px,
              rgba(201,169,110,0.015) 4px
            )`,
          }} />
          {/* Central radial glow */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,169,110,0.07) 0%, transparent 70%)`,
          }} />
          {/* Top vignette */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 30%, transparent 70%, ${C.bg} 100%)`,
          }} />
        </motion.div>

        {/* Decorative vertical gold lines */}
        <div className="absolute left-[8%] top-0 bottom-0 w-px pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${C.borderGold} 30%, ${C.borderGold} 70%, transparent)` }} />
        <div className="absolute right-[8%] top-0 bottom-0 w-px pointer-events-none" style={{ background: `linear-gradient(to bottom, transparent, ${C.borderGold} 30%, ${C.borderGold} 70%, transparent)` }} />

        <div className="max-w-7xl mx-auto px-6 py-28 relative z-10">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="h-px w-16" style={{ background: goldGradient }} />
            <div className="flex items-center gap-2 px-4 py-1.5"
              style={{ border: `1px solid ${C.borderGold}`, background: 'rgba(201,169,110,0.06)' }}>
              <Diamond size={8} style={{ color: C.gold }} />
              <span className="font-mono text-[9px] tracking-[0.55em] uppercase" style={{ color: C.gold }}>
                Catalogue Exclusif — {STORES.length} Boutiques
              </span>
              <Diamond size={8} style={{ color: C.gold }} />
            </div>
            <div className="h-px w-16" style={{ background: goldGradient }} />
          </motion.div>

          {/* Giant 6IX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6"
          >
            <h1
              className="font-mono font-black tracking-tighter leading-none select-none"
              style={{
                fontSize: 'clamp(7rem, 22vw, 18rem)',
                background: goldGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 60px rgba(201,169,110,0.25))',
              }}
            >
              6IX
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="font-mono text-center text-xs tracking-[0.55em] uppercase mb-16"
            style={{ color: C.inkFaint }}
          >
            Découvrez la collection — Achetez en boutique
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex items-stretch justify-center divide-x"
            style={{ borderTop: `1px solid ${C.borderGold}`, borderBottom: `1px solid ${C.borderGold}`, divideColor: C.borderGold }}
          >
            {[
              { value: STORES.length, label: 'Boutiques' },
              { value: products.length || '3+', label: 'Pièces exclusives' },
              { value: 'TN', label: 'Origine Tunisie' },
              { value: '✦', label: 'Édition limitée' },
            ].map(({ value, label }, i) => (
              <div key={i} className="flex-1 text-center py-5 px-4"
                style={{ borderRight: i < 3 ? `1px solid ${C.borderGold}` : 'none' }}>
                <p className="font-mono font-black text-2xl mb-1"
                  style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {value}
                </p>
                <p className="font-mono text-[8px] tracking-widest uppercase" style={{ color: C.inkFaint }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Mobile category tabs ── */}
      <div className="md:hidden flex items-center overflow-x-auto px-4"
        style={{ background: C.bgSoft, borderBottom: `1px solid ${C.borderGold}` }}>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className="font-mono text-[10px] tracking-widest uppercase px-4 py-3 whitespace-nowrap shrink-0 transition-all"
            style={{
              color: category === cat ? C.gold : C.inkFaint,
              borderBottom: category === cat ? `1px solid ${C.gold}` : '1px solid transparent',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Catalogue section ── */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.borderFaint}` }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="font-mono text-[9px] tracking-[0.55em] uppercase" style={{ color: C.gold }}>
              ✦ Collection
            </span>
            <h2 className="font-mono font-black text-3xl md:text-4xl tracking-tight mt-2" style={{ color: C.ink }}>
              {category === 'Tout' ? 'LA COLLECTION' : category.toUpperCase()}
            </h2>
            <p className="font-mono text-xs tracking-widest mt-2" style={{ color: C.inkFaint }}>
              {filteredProducts.length} pièce{filteredProducts.length !== 1 ? 's' : ''} exclusive{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">

            {/* Left: Viewer + thumbnails */}
            <div className="lg:sticky lg:top-20">
              <div className="relative group">
                {/* Gold corner decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none z-20"
                  style={{ borderTop: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}` }} />
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none z-20"
                  style={{ borderTop: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}` }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none z-20"
                  style={{ borderBottom: `2px solid ${C.gold}`, borderLeft: `2px solid ${C.gold}` }} />
                <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none z-20"
                  style={{ borderBottom: `2px solid ${C.gold}`, borderRight: `2px solid ${C.gold}` }} />

                <div style={{ border: `1px solid ${C.borderGold}`, background: C.bgCard }}>
                  <Suspense fallback={
                    <div className="aspect-square flex items-center justify-center"
                      style={{ background: C.bgCard }}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-t-transparent animate-spin"
                          style={{ borderColor: C.gold, borderTopColor: 'transparent' }} />
                        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.goldDark }}>Chargement…</span>
                      </div>
                    </div>
                  }>
                    {selectedProduct && <ProductViewer3D product={selectedProduct} />}
                  </Suspense>
                </div>

                {selectedProduct?.tag && (
                  <div className="absolute top-4 left-4 px-3 py-1 z-20"
                    style={{ background: goldGradient }}>
                    <span className="font-mono text-[9px] tracking-widest font-black text-black uppercase">
                      {selectedProduct.tag}
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 px-2.5 py-1 z-20"
                  style={{ background: 'rgba(10,9,8,0.8)', border: `1px solid ${C.borderGold}`, backdropFilter: 'blur(8px)' }}>
                  <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: C.gold }}>En boutique</span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="mt-5">
                <p className="font-mono text-[9px] tracking-[0.45em] uppercase mb-3 text-center"
                  style={{ color: C.inkFaint }}>
                  {filteredProducts.length} pièces — Sélectionnez
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Category label */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px w-8" style={{ background: goldGradient }} />
                      <span className="font-mono text-[9px] tracking-[0.55em] uppercase" style={{ color: C.gold }}>
                        {selectedProduct.category}
                      </span>
                    </div>

                    <h2 className="font-mono font-black tracking-tight leading-none mb-5"
                      style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: C.ink }}>
                      {selectedProduct.name.toUpperCase()}
                    </h2>

                    <p className="font-mono text-sm leading-relaxed mb-8" style={{ color: C.inkMid }}>
                      {selectedProduct.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-6 p-4"
                      style={{ border: `1px solid ${C.borderGold}`, background: 'rgba(201,169,110,0.04)' }}>
                      <span className="font-mono font-black text-4xl"
                        style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {selectedProduct.price}
                      </span>
                      <span className="font-mono text-sm" style={{ color: C.inkFaint }}>TND</span>
                      <span className="ml-auto font-mono text-[9px] tracking-widest uppercase flex items-center gap-1.5"
                        style={{ color: C.gold }}>
                        <Sparkles size={10} /> Exclusif
                      </span>
                    </div>

                    {/* Colors */}
                    {selectedProduct.colors?.length > 0 && (
                      <div className="mb-8">
                        <p className="font-mono text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: C.gold }}>
                          Coloris disponibles
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.colors.map(col => (
                            <span key={col} className="font-mono text-[10px] px-3 py-1.5"
                              style={{ border: `1px solid ${C.borderGold}`, color: C.inkMid }}>
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available stores */}
                    <div className="mb-8 p-4" style={{ background: C.bgCard, border: `1px solid ${C.borderGold}` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Store size={12} style={{ color: C.gold }} />
                        <span className="font-mono text-[9px] tracking-[0.4em] uppercase" style={{ color: C.gold }}>
                          Disponible dans {STORES.length} boutiques
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {STORES.map(s => (
                          <span key={s.id} className="font-mono text-[10px] px-2 py-1"
                            style={{ border: `1px solid ${C.borderGold}`, color: C.inkMid }}>
                            {s.city}
                          </span>
                        ))}
                      </div>
                    </div>

                    <GoldDivider />

                    {/* CTAs */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        onClick={() => openWhatsApp(selectedProduct.name)}
                        whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(37,211,102,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 font-mono text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                        style={{ background: '#25D366', color: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
                        onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
                      >
                        <MessageCircle size={14} /> Demander via WhatsApp
                      </motion.button>

                      <motion.button
                        onClick={() => storesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        whileHover={{ scale: 1.01, boxShadow: `0 0 30px rgba(201,169,110,0.25)` }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 font-mono text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3"
                        style={{ background: goldGradient, color: C.bg }}
                      >
                        <MapPin size={14} /> Trouver une Boutique
                      </motion.button>

                      <a href="tel:+21600000000"
                        className="w-full py-3 font-mono text-[10px] tracking-widest uppercase text-center flex items-center justify-center gap-2 transition-all"
                        style={{ border: `1px solid ${C.borderGold}`, color: C.inkFaint }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderGold; e.currentTarget.style.color = C.inkFaint; }}
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
                          style={{ borderBottom: `1px solid ${C.borderFaint}` }}>
                          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: C.inkFaint }}>
                            {label}
                          </span>
                          <span className="font-mono text-[10px] flex items-center gap-1" style={{ color: C.inkMid }}>
                            {value} <ChevronRight size={10} style={{ color: C.goldDark }} />
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
      </div>

      {/* ── Stores section ── */}
      <div ref={storesRef} style={{ background: C.bgSoft, borderTop: `1px solid ${C.borderGold}` }}>
        <div className="max-w-7xl mx-auto px-6 py-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={storesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-14 text-center"
          >
            {/* Decorative header */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="h-px w-12" style={{ background: goldGradient }} />
              <div className="inline-flex items-center gap-2 px-4 py-1.5"
                style={{ border: `1px solid ${C.borderGold}`, background: 'rgba(201,169,110,0.06)' }}>
                <Store size={9} style={{ color: C.gold }} />
                <span className="font-mono text-[9px] tracking-[0.5em] uppercase" style={{ color: C.gold }}>
                  Nos Boutiques
                </span>
              </div>
              <div className="h-px w-12" style={{ background: goldGradient }} />
            </div>

            <h2 className="font-mono font-black text-4xl md:text-5xl tracking-tight mb-3" style={{ color: C.ink }}>
              {STORES.length} ADRESSES
            </h2>
            <p className="font-mono text-xs tracking-[0.3em] uppercase mb-6" style={{ color: C.inkFaint }}>
              Partout en Tunisie — Venez nous rendre visite
            </p>

            <a href="https://wa.me/21600000000" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[10px] tracking-widest uppercase transition-all"
              style={{ border: `1px solid ${C.borderGold}`, color: C.gold }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <CalendarCheck size={12} /> Prendre Rendez-vous
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STORES.map((store, i) => <StoreCard key={store.id} store={store} index={i} />)}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-12 pt-8 text-center"
            style={{ borderTop: `1px solid ${C.borderGold}` }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
              <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
              <span style={{ color: C.gold, fontSize: 10 }}>✦</span>
            </div>
            <p className="font-mono text-xs" style={{ color: C.inkFaint }}>
              Chaque pièce de la collection 6IX est disponible dans toutes nos boutiques.<br />
              Contactez-nous pour vérifier la disponibilité d'un article spécifique.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ background: C.bg, borderTop: `1px solid ${C.borderGold}` }} className="py-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-mono font-black text-3xl tracking-widest mb-1"
            style={{ background: goldGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            6IX
          </p>
          <p className="font-mono text-[9px] tracking-[0.45em] uppercase mb-4" style={{ color: C.inkFaint }}>
            By Académie Arabe de la Mode — Tunisie
          </p>
          <div className="h-px max-w-xs mx-auto mb-4" style={{ background: goldGradient, opacity: 0.3 }} />
          <p className="font-mono text-[10px]" style={{ color: C.inkFaint }}>
            © 2025 6IX — Vente en boutique uniquement
          </p>
        </div>
      </div>
    </main>
  );
};

export default ShopPage;
