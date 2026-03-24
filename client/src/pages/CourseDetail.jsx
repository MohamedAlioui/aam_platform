import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, ArrowLeft, ChevronDown, BookOpen, Award } from 'lucide-react';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ToastContainer from '@/components/ui/Toast';

const CurriculumItem = ({ week, topic_ar, topic_fr }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden mb-2"
      style={{ border: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ background: open ? 'var(--blue-pale)' : 'var(--bg-card)' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'var(--bg-card)'; }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs w-14 text-left" style={{ color: 'var(--blue)' }}>Sem. {week}</span>
          <span className="font-arabic text-sm" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>{topic_ar}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ color: 'var(--text-muted)' }}>
          <ChevronDown size={15} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-4 pb-3 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
              <p className="font-editorial italic text-sm" style={{ color: 'var(--text-muted)' }}>{topic_fr}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToastStore();

  useEffect(() => {
    api.get(`/courses/${id}`)
      .then(r => { setCourse(r.data.course); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) { showError('Connectez-vous pour vous inscrire'); return; }
    setRegistering(true);
    try {
      await api.post('/registrations', { courseId: id, message });
      success('Inscription envoyée avec succès !');
    } catch (e) {
      showError(e.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 px-6" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-6xl mx-auto"><CardSkeleton /></div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center">
        <p className="font-arabic mb-4" style={{ color: 'var(--text-muted)' }}>الكورس غير موجود</p>
        <Link to="/courses" className="btn-outline">← Retour</Link>
      </div>
    </div>
  );

  return (
    <main style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Hero image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {course.image ? (
          <img src={course.image} alt={course.title_fr} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, var(--blue-pale), var(--bg-section))' }} />
        )}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--bg-page))' }} />
        <div className="absolute bottom-4 left-6">
          <Badge variant="blue">{course.category}</Badge>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2">
            <Link to="/courses" className="inline-flex items-center gap-2 font-mono text-xs mb-6 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ArrowLeft size={13} /> Tous les cours
            </Link>

            <h1 className="font-arabic text-3xl md:text-4xl font-bold mb-2 leading-tight"
              style={{ direction: 'rtl', color: 'var(--text-primary)' }}>
              {course.title_ar}
            </h1>
            <p className="font-editorial italic text-xl mb-6" style={{ color: 'var(--text-muted)' }}>
              {course.title_fr}
            </p>

            <div className="flex flex-wrap gap-4 mb-8 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-2">
                <Clock size={13} style={{ color: 'var(--blue)' }} /> {course.duration}
              </span>
              <span className="flex items-center gap-2">
                <Users size={13} style={{ color: 'var(--blue)' }} /> {course.enrolledCount} inscrits
              </span>
              <span className="flex items-center gap-2">
                <BookOpen size={13} style={{ color: 'var(--blue)' }} /> {course.level}
              </span>
              <span className="flex items-center gap-2">
                <Award size={13} style={{ color: 'var(--gold)' }} /> Certificat AAM
              </span>
            </div>

            {/* Description */}
            <div className="rounded-2xl p-6 mb-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <p className="font-mono text-xs mb-3 uppercase tracking-widest" style={{ color: 'var(--blue)' }}>Description</p>
              <p className="font-arabic text-sm leading-loose mb-3"
                style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
                {course.description_ar}
              </p>
              <p className="font-arabic text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {course.description_fr}
              </p>
            </div>

            {/* Instructor */}
            {course.instructor && (
              <div className="rounded-2xl p-6 mb-6"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
                <p className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: 'var(--blue)' }}>Instructeur</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))' }}>
                    <span className="font-display text-lg font-bold text-white">
                      {course.instructor.name?.[0] || 'I'}
                    </span>
                  </div>
                  <div>
                    <p className="font-arabic font-bold" style={{ color: 'var(--text-primary)' }}>
                      {course.instructor.name}
                    </p>
                    <p className="font-arabic text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum */}
            {course.curriculum?.length > 0 && (
              <div>
                <p className="font-mono text-xs mb-4 uppercase tracking-widest" style={{ color: 'var(--blue)' }}>Programme</p>
                {course.curriculum.map((item, i) => (
                  <CurriculumItem key={i} {...item} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl p-6"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}>

              <div className="font-display text-4xl font-bold mb-1" style={{ color: 'var(--blue)' }}>
                {course.price?.toLocaleString()} TND
              </div>
              <p className="font-mono text-xs mb-6 tracking-widest" style={{ color: 'var(--text-muted)' }}>
                PRIX DE LA FORMATION
              </p>

              <div className="flex items-center justify-between text-sm mb-5 pb-4"
                style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="font-arabic" style={{ color: 'var(--text-secondary)' }}>المقاعد المتبقية</span>
                <span className="font-mono font-bold" style={{ color: 'var(--blue)' }}>
                  {course.availableSeats || course.seats}
                </span>
              </div>

              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Message (optionnel)..."
                  rows={3}
                  className="aam-input resize-none text-sm"
                />
              </div>

              <Button onClick={handleRegister} loading={registering} className="w-full">
                {isAuthenticated ? "S'inscrire Maintenant" : "Connexion pour s'inscrire"}
              </Button>

              <div className="mt-5 space-y-2.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-2">
                  <Award size={12} style={{ color: 'var(--gold)' }} /> Certificat AAM inclus
                </div>
                <div className="flex items-center gap-2">
                  <Users size={12} style={{ color: 'var(--blue)' }} /> Accès groupe WhatsApp
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={12} style={{ color: 'var(--blue)' }} /> Support de cours fourni
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
};

export default CourseDetail;
