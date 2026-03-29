import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle2, XCircle, AlertCircle, ArrowRight, LogIn } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';
import { CardSkeleton } from '@/components/ui/Skeleton';

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  labelAr: 'قيد الانتظار', icon: <AlertCircle size={14} />, color: '#f59e0b',  bg: 'rgba(245,158,11,0.1)'  },
  confirmed: { label: 'Confirmé',    labelAr: 'مؤكد',          icon: <CheckCircle2 size={14} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  cancelled: { label: 'Annulé',      labelAr: 'ملغي',          icon: <XCircle size={14} />,     color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  completed: { label: 'Terminé',     labelAr: 'مكتمل',         icon: <CheckCircle2 size={14} />, color: '#2563eb', bg: 'rgba(37,99,235,0.1)'   },
};

const PAYMENT_CONFIG = {
  paid:     { label: 'Payé',         color: '#22c55e' },
  unpaid:   { label: 'Non payé',     color: '#f59e0b' },
  pending:  { label: 'Non payé',     color: '#f59e0b' }, // legacy fallback
  refunded: { label: 'Remboursé',    color: '#6366f1' },
};

const RegistrationCard = ({ reg, index }) => {
  const course   = reg.courseId;
  const status   = STATUS_CONFIG[reg.status]   || STATUS_CONFIG.pending;
  const payment  = PAYMENT_CONFIG[reg.paymentStatus] || PAYMENT_CONFIG.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.45 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Course image / gradient */}
      <div className="h-36 relative overflow-hidden">
        {course?.image ? (
          <img src={course.image} alt={course.title_fr} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)' }} />

        {/* Status badge */}
        <span className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-lg"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}30` }}>
          {status.icon} {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-arabic text-base font-bold leading-snug mb-1" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
          {course?.title_ar || '—'}
        </h3>
        <p className="font-editorial italic text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
          {course?.title_fr || '—'}
        </p>

        <div className="flex items-center gap-3 text-xs font-mono mb-4" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5"><Clock size={11} style={{ color: 'var(--blue)' }} /> {course?.duration || '—'}</span>
          <span className="flex items-center gap-1.5"><BookOpen size={11} style={{ color: 'var(--blue)' }} /> {course?.level || '—'}</span>
        </div>

        {/* Payment status */}
        <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-xl" style={{ background: 'var(--bg-section)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>Paiement</span>
          <span className="font-mono text-xs font-bold" style={{ color: payment.color }}>{payment.label}</span>
        </div>

        {/* Inscription date */}
        <p className="font-mono text-[10px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Inscrit le {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('fr-FR') : '—'}
        </p>

        {/* CTA */}
        <div className="mt-auto">
          {course?._id && (
            <Link to={`/courses/${course._id}`}>
              <motion.button whileHover={{ x: 3 }}
                className="flex items-center gap-1.5 font-arabic text-sm font-semibold px-4 py-2 rounded-xl transition-all w-full justify-center"
                style={{ background: 'var(--blue-pale)', color: 'var(--blue)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue-pale)'; e.currentTarget.style.color = 'var(--blue)'; }}
              >
                تفاصيل الكورس <ArrowRight size={13} />
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MyCourses = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get('/registrations/my')
      .then(r => { setRegistrations(r.data.registrations || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--bg-section)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--blue-pale)' }}>
            <LogIn size={36} style={{ color: 'var(--blue)' }} />
          </div>
          <h2 className="font-arabic text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>تسجيل الدخول مطلوب</h2>
          <p className="font-editorial italic mb-6" style={{ color: 'var(--text-muted)' }}>Connectez-vous pour voir vos inscriptions</p>
          <Link to="/login">
            <button className="btn-primary px-8">Se Connecter</button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-label">Mon Espace</span>
            <h1 className="font-arabic text-3xl md:text-4xl font-black mt-2 mb-1" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
              مرحباً، <span className="text-gradient-blue">{user?.name?.split(' ')[0] || 'طالب'}</span>
            </h1>
            <p className="font-editorial italic" style={{ color: 'var(--text-muted)' }}>
              Vos inscriptions aux formations AAM
            </p>
          </motion.div>
        </div>

        {/* Summary pills */}
        {!loading && registrations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-8">
            {[
              { label: 'Total',      value: registrations.length,                                       color: 'var(--blue)' },
              { label: 'Confirmés',  value: registrations.filter(r => r.status === 'confirmed').length, color: '#22c55e' },
              { label: 'En attente', value: registrations.filter(r => r.status === 'pending').length,   color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <span className="font-bold text-sm" style={{ color: s.color }}>{s.value}</span>
                <span style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : registrations.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 rounded-3xl text-center"
            style={{ background: 'var(--bg-section)', border: '2px dashed var(--border)' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: 'var(--blue-pale)' }}>
              <BookOpen size={32} style={{ color: 'var(--blue)' }} />
            </div>
            <h3 className="font-arabic text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>لا توجد تسجيلات بعد</h3>
            <p className="font-editorial italic text-lg mb-6" style={{ color: 'var(--text-muted)' }}>
              Vous n'avez pas encore de formations
            </p>
            <Link to="/courses">
              <button className="btn-primary px-8">Découvrir les Cours</button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg, i) => <RegistrationCard key={reg._id} reg={reg} index={i} />)}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyCourses;
