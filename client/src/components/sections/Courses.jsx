import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight, Star } from 'lucide-react';
import CourseCarousel3D from '@/components/3d/CourseCarousel3D';
import api from '@/utils/api';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { COURSE_CATEGORIES } from '@/utils/constants';

const CATEGORY_COLORS = {
  'تصميم':         { bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', light: '#eff6ff' },
  'خياطة':         { bg: 'linear-gradient(135deg,#0d9488,#38bdf8)', light: '#f0fdfa' },
  'مولاج':         { bg: 'linear-gradient(135deg,#4f46e5,#8b5cf6)', light: '#f5f3ff' },
  'كورساج':        { bg: 'linear-gradient(135deg,#be185d,#f472b6)', light: '#fdf2f8' },
  'فستان الزفاف':  { bg: 'linear-gradient(135deg,#7c3aed,#c084fc)', light: '#faf5ff' },
  'تجميل':         { bg: 'linear-gradient(135deg,#d97706,#fbbf24)', light: '#fffbeb' },
  'تسويق':         { bg: 'linear-gradient(135deg,#0f766e,#34d399)', light: '#f0fdf4' },
  '6ix Streetwear':{ bg: 'linear-gradient(135deg,#111827,#374151)', light: '#f9fafb' },
};
const DEFAULT_COLOR = { bg: 'linear-gradient(135deg,#1e3a8a,#60a5fa)', light: '#eff6ff' };

const CourseCard = ({ course, index }) => {
  const colors = CATEGORY_COLORS[course.category] || DEFAULT_COLOR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >
      {/* Image / gradient header */}
      <div className="relative h-48 overflow-hidden">
        {course.image ? (
          <img src={course.image} alt={course.title_fr}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        ) : (
          <div className="w-full h-full" style={{ background: colors.bg }} />
        )}
        {/* Overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />

        {/* Category badge */}
        <span className="absolute top-3 right-3 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg text-white"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
          {course.category}
        </span>

        {/* Featured star */}
        {course.featured && (
          <span className="absolute top-3 left-3">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="font-arabic text-base font-bold leading-snug mb-1"
          style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
          {course.title_ar}
        </h3>
        <p className="font-editorial italic text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          {course.title_fr}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <Clock size={11} style={{ color: 'var(--blue)' }} /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={11} style={{ color: 'var(--blue)' }} /> {course.enrolledCount || 0} inscrits
          </span>
        </div>

        {/* Level pill */}
        <div className="mb-4">
          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg"
            style={{ background: colors.light, color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            {course.level}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <span className="font-display text-xl font-black" style={{ color: 'var(--blue)' }}>
            {course.price?.toLocaleString()}
            <span className="font-mono text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>TND</span>
          </span>
          <Link to={`/courses/${course._id}`}>
            <motion.button
              whileHover={{ x: 3 }}
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

const Courses = () => {
  const [courses, setCourses]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    api.get('/courses')
      .then(r => { setCourses(r.data.courses || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? courses
    : courses.filter(c => c.category === activeCategory);

  return (
    <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label">Nos Formations</span>
          <h2 className="section-title mb-2" style={{ direction: 'rtl' }}>
            كورساتنا <span className="text-gradient-blue">المتخصصة</span>
          </h2>
          <p className="section-subtitle">Découvrez nos cours de mode professionnels</p>
        </div>

        {/* Featured Carousel */}
        <div className="mb-16 rounded-3xl overflow-hidden"
          style={{ background: 'var(--bg-section)', border: '1px solid var(--border)' }}>
          <CourseCarousel3D courses={courses} />
        </div>

        {/* Filter pills — horizontal scroll on mobile */}
        <div className="filter-scroll justify-center md:flex-wrap mb-10">
          {COURSE_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className="font-arabic text-sm px-4 rounded-full transition-all duration-200 shrink-0"
              style={{
                background: activeCategory === cat.value ? 'var(--blue)' : 'var(--bg-card)',
                color:      activeCategory === cat.value ? '#ffffff' : 'var(--text-muted)',
                border:     activeCategory === cat.value ? '1px solid var(--blue)' : '1px solid var(--border)',
                fontWeight: activeCategory === cat.value ? '700' : '400',
                boxShadow:  activeCategory === cat.value ? '0 4px 12px var(--blue-glow)' : 'none',
                minHeight: 40,
                whiteSpace: 'nowrap',
              }}
            >
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
            <div className="col-span-full text-center py-16 rounded-2xl font-arabic"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              لا توجد كورسات في هذه الفئة
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Courses;
