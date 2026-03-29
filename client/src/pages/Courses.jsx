import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, Star, Search, SlidersHorizontal } from 'lucide-react';
import api from '@/utils/api';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { COURSE_CATEGORIES } from '@/utils/constants';
import ToastContainer from '@/components/ui/Toast';

const CATEGORY_COLORS = {
  'تصميم':        { bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', light: '#eff6ff' },
  'خياطة':        { bg: 'linear-gradient(135deg,#0d9488,#38bdf8)', light: '#f0fdfa' },
  'مولاج':        { bg: 'linear-gradient(135deg,#4f46e5,#8b5cf6)', light: '#f5f3ff' },
  'كورساج':       { bg: 'linear-gradient(135deg,#be185d,#f472b6)', light: '#fdf2f8' },
  'فستان الزفاف': { bg: 'linear-gradient(135deg,#7c3aed,#c084fc)', light: '#faf5ff' },
  'تجميل':        { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', light: '#fffbeb' },
  'تسويق':        { bg: 'linear-gradient(135deg,#0f766e,#34d399)', light: '#f0fdf4' },
  '6ix Streetwear':{ bg: 'linear-gradient(135deg,#111827,#374151)', light: '#f9fafb' },
};
const DEFAULT_COLOR = { bg: 'linear-gradient(135deg,#1e3a8a,#60a5fa)', light: '#eff6ff' };

const LEVEL_MAP = {
  'مبتدئ':  'Débutant',
  'متوسط':  'Intermédiaire',
  'متقدم':  'Avancé',
};

const CourseCard = ({ course, index }) => {
  const colors = CATEGORY_COLORS[course.category] || DEFAULT_COLOR;
  const isFull = course.seats > 0 && course.enrolledCount >= course.seats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.45 }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {course.image
          ? <img src={course.image} alt={course.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full" style={{ background: colors.bg }} />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
          {course.category}
        </span>

        {course.featured && <span className="absolute top-3 left-3"><Star size={14} fill="#f59e0b" color="#f59e0b" /></span>}

        {isFull && (
          <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-lg text-white"
            style={{ background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(6px)' }}>
            Complet
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-arabic text-base font-bold leading-snug mb-1" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
          {course.title_ar}
        </h3>
        <p className="font-editorial italic text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{course.title_fr}</p>

        <div className="flex items-center gap-4 text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: 'var(--blue)' }} /> {course.duration}</span>
          <span className="flex items-center gap-1.5"><Users size={11} style={{ color: 'var(--blue)' }} /> {course.enrolledCount || 0} inscrits</span>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg"
            style={{ background: colors.light, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {course.level}{LEVEL_MAP[course.level] ? ` — ${LEVEL_MAP[course.level]}` : ''}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="font-display text-xl font-black" style={{ color: 'var(--blue)' }}>
            {course.price?.toLocaleString()}
            <span className="font-mono text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>TND</span>
          </span>
          <Link to={`/courses/${course._id}`}>
            <motion.button whileHover={{ x: 3 }}
              className="flex items-center gap-1.5 font-arabic text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: 'var(--blue-pale)', color: 'var(--blue)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-pale)'; e.currentTarget.style.color = 'var(--blue)'; }}
            >
              تفاصيل <ArrowRight size={13} />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch]             = useState('');

  useEffect(() => {
    api.get('/courses')
      .then(r => { setCourses(r.data.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = courses
    .filter(c => activeCategory === 'all' || c.category === activeCategory)
    .filter(c => !search || c.title_ar?.includes(search) || c.title_fr?.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ── Page Hero Banner ── */}
      <div className="relative pt-28 pb-16 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0ea5e9 100%)' }}>
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="cpat" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#cpat)" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block font-mono text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 text-white"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Toutes les Formations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-arabic font-black text-white mb-3"
            style={{ direction: 'rtl', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            كورساتنا <span style={{ opacity: 0.8 }}>المتخصصة</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="font-editorial italic text-white/70 text-xl mb-8"
          >
            Nos Formations Professionnelles en Mode
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث عن كورس..."
              className="w-full pl-11 pr-4 py-3 rounded-xl font-arabic text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', backdropFilter: 'blur(10px)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Filter + Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {COURSE_CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className="font-arabic text-sm px-4 py-2 rounded-full transition-all duration-200"
              style={{
                background: activeCategory === cat.value ? 'var(--blue)' : 'var(--bg-card)',
                color:      activeCategory === cat.value ? '#ffffff' : 'var(--text-muted)',
                border:     activeCategory === cat.value ? '1px solid var(--blue)' : '1px solid var(--border)',
                fontWeight: activeCategory === cat.value ? '700' : '400',
                boxShadow:  activeCategory === cat.value ? '0 4px 12px var(--blue-glow)' : 'none',
              }}>
              {cat.label_fr}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-center font-mono text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} formation{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : filtered.map((course, i) => <CourseCard key={course._id} course={course} index={i} />)
          }
          {!loading && filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 rounded-2xl font-arabic"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {search ? `لا نتائج لـ "${search}"` : 'لا توجد كورسات في هذه الفئة'}
            </div>
          )}
        </div>
      </div>

      <ToastContainer />
    </main>
  );
};

export default CoursesPage;
