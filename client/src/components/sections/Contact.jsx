import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { gsap } from 'gsap';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import api from '@/utils/api';

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-field', {
        y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 78%', toggleActions: 'play none none none' }
      });
    }, formRef);
    return () => ctx.revert();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/contact', { ...form, lang: 'fr' });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { icon: <MapPin size={16} />, label: 'تونس — Tunisie',      sub: 'Siège social' },
    { icon: <Phone size={16} />, label: '+216 XX XXX XXX',     sub: 'Disponible 9h–18h' },
    { icon: <Mail  size={16} />, label: 'contact@aam.tn',      sub: 'Réponse sous 24h' },
  ];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label">Contactez-nous</span>
          <h2 className="section-title" style={{ direction: 'rtl' }}>
            تواصل <span className="text-gradient-blue">معنا</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center gap-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                Parlons Mode
              </h3>
              <p className="font-arabic text-sm leading-loose" style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
                نحن هنا للإجابة على جميع استفساراتك حول برامجنا التدريبية. لا تتردد في التواصل معنا.
              </p>
            </div>

            {contacts.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 rounded-xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
              >
                <div className="mt-0.5 p-2 rounded-lg" style={{ background: 'var(--blue-pale)', color: 'var(--blue)' }}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                  <div className="font-arabic text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <div ref={formRef}>
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center gap-5 py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, delay: 0.1 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ border: '2px solid #22c55e', background: 'rgba(34,197,94,0.06)' }}
                  >
                    <motion.svg viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                      <motion.path d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }} />
                    </motion.svg>
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Message Envoyé !
                  </h3>
                  <p className="font-arabic text-sm text-center" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>
                    شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                  <button onClick={() => setSuccess(false)} className="btn-outline text-sm">
                    Nouveau Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="rounded-2xl p-6 md:p-8 flex flex-col gap-4"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="contact-field">
                      <Input name="name" value={form.name} onChange={handleChange}
                        placeholder="Votre nom / اسمك" required />
                    </div>
                    <div className="contact-field">
                      <Input name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="Email" required />
                    </div>
                  </div>
                  <div className="contact-field">
                    <Input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="Téléphone (optionnel)" />
                  </div>
                  <div className="contact-field">
                    <Input name="subject" value={form.subject} onChange={handleChange}
                      placeholder="Sujet / الموضوع" />
                  </div>
                  <div className="contact-field">
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Votre message / رسالتك..."
                      required
                      rows={5}
                      className="aam-input resize-none"
                    />
                  </div>

                  {error && <p className="font-mono text-xs" style={{ color: '#ef4444' }}>{error}</p>}

                  <Button type="submit" loading={loading} icon={<Send size={15} />} className="contact-field mt-1">
                    Envoyer / إرسال
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
