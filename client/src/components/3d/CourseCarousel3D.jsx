import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_GRADIENTS = {
  'تصميم':        'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
  'خياطة':        'linear-gradient(135deg, #0d9488 0%, #38bdf8 100%)',
  'مولاج':        'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%)',
  'كورساج':       'linear-gradient(135deg, #be185d 0%, #f472b6 100%)',
  'فستان الزفاف': 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
  'تجميل':        'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  'تسويق':        'linear-gradient(135deg, #0f766e 0%, #34d399 100%)',
  '6ix Streetwear':'linear-gradient(135deg, #111827 0%, #374151 100%)',
  'default':      'linear-gradient(135deg, #1e3a8a 0%, #60a5fa 100%)',
};

const FeaturedCard = ({ course, isActive, onClick }) => {
  const gradient = CATEGORY_GRADIENTS[course.category] || CATEGORY_GRADIENTS.default;

  return (
    <motion.div
      onClick={onClick}
      animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.55 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="cursor-pointer shrink-0 rounded-2xl overflow-hidden shadow-xl"
      style={{
        width: isActive ? '340px' : '240px',
        height: isActive ? '420px' : '320px',
        transition: 'width 0.4s ease, height 0.4s ease',
      }}
    >
      {/* Image / gradient */}
      <div className="relative w-full h-full">
        {course.image ? (
          <img src={course.image} alt={course.title_fr} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: gradient }} />
        )}

        {/* Overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 60%)' }} />

        {/* Category pill */}
        <div className="absolute top-4 left-4">
          <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded-full text-white"
            style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            {course.category}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-arabic text-white font-bold text-lg leading-tight mb-1"
            style={{ direction: 'rtl' }}>
            {course.title_ar}
          </h3>
          <p className="font-editorial italic text-white/70 text-sm mb-3">{course.title_fr}</p>

          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-4 text-white/60 text-xs font-mono mb-4">
                <span className="flex items-center gap-1.5"><Clock size={11} /> {course.duration}</span>
                <span className="flex items-center gap-1.5"><Users size={11} /> {course.enrolledCount || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-black text-white">
                  {course.price?.toLocaleString()} <span className="text-sm font-mono opacity-70">TND</span>
                </span>
                <Link to={`/courses/${course._id}`} onClick={e => e.stopPropagation()}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1.5 text-white font-arabic text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                  >
                    تفاصيل <ArrowRight size={13} />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PLACEHOLDERS = [
  { _id: '1', title_fr: 'Design de Mode', title_ar: 'تصميم الأزياء', category: 'تصميم', price: 2500, duration: '3 mois', enrolledCount: 12 },
  { _id: '2', title_fr: 'Haute Couture', title_ar: 'هوت كوتور', category: 'خياطة', price: 3200, duration: '4 mois', enrolledCount: 8 },
  { _id: '3', title_fr: 'Moulage', title_ar: 'المولاج', category: 'مولاج', price: 3500, duration: '3 mois', enrolledCount: 5 },
  { _id: '4', title_fr: 'Robe de Mariée', title_ar: 'فستان الزفاف', category: 'فستان الزفاف', price: 5800, duration: '5 mois', enrolledCount: 6 },
  { _id: '5', title_fr: 'Beauté', title_ar: 'التجميل', category: 'تجميل', price: 2800, duration: '3 mois', enrolledCount: 14 },
];

const CourseCarousel3D = ({ courses = [] }) => {
  const items = courses.length > 0 ? courses : PLACEHOLDERS;
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + items.length) % items.length);
  const next = () => setActive(i => (i + 1) % items.length);

  // Show 3 cards centered around active
  const visible = [-1, 0, 1].map(offset => {
    const idx = (active + offset + items.length) % items.length;
    return { course: items[idx], isActive: offset === 0, idx };
  });

  return (
    <div className="relative w-full py-8">
      {/* Cards */}
      <div className="flex items-center justify-center gap-4 overflow-hidden px-4" style={{ minHeight: '460px' }}>
        {visible.map(({ course, isActive, idx }) => (
          <FeaturedCard
            key={idx}
            course={course}
            isActive={isActive}
            onClick={() => setActive(idx)}
          />
        ))}
      </div>

      {/* Navigation */}
      <button onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl flex items-center justify-center transition-all"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--blue)', boxShadow: 'var(--shadow-card)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <ChevronLeft size={18} />
      </button>
      <button onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl flex items-center justify-center transition-all"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--blue)', boxShadow: 'var(--shadow-card)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? '24px' : '8px',
              height: '8px',
              background: i === active ? 'var(--blue)' : 'var(--border)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseCarousel3D;
