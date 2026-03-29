import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ToastContainer, { useToastStore } from '@/components/ui/Toast';

const PasswordField = ({ label, value, onChange, placeholder, error, required }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block font-mono text-xs tracking-widest uppercase mb-2"
        style={{ color: 'var(--text-muted)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-muted)' }}>
          <Lock size={15} />
        </span>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`aam-input pl-11 pr-11 ${error ? 'border-red-500/50' : ''}`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          aria-label={show ? 'Masquer' : 'Afficher'}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {error && <p className="mt-1.5 font-mono text-xs text-red-400">{error}</p>}
    </div>
  );
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { error: showError } = useToastStore();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated]);
  useEffect(() => { if (error) { showError(error); clearError(); } }, [error]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Le nom est requis';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Email invalide';
    if (form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    if (result.success) navigate('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: 'var(--bg-section)' }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8 md:p-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}>

          <div className="text-center mb-8">
            <div className="font-display font-black text-5xl text-gradient-blue mb-1">AAM</div>
            <p className="font-arabic text-sm" style={{ color: 'var(--text-muted)' }}>أكاديمية عربية للموضة</p>
            <div className="mx-auto mt-3 h-px w-16"
              style={{ background: 'linear-gradient(to right, transparent, var(--blue), transparent)' }} />
          </div>

          <h2 className="font-display text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Créer un Compte
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Nom complet" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Votre nom" icon={<User size={15} />} error={errors.name} required />
            <Input label="Email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com" icon={<Mail size={15} />} error={errors.email} required />
            <Input label="Téléphone" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+216 XX XXX XXX" icon={<Phone size={15} />} />
            <PasswordField
              label="Mot de passe"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <PasswordField
              label="Confirmer le mot de passe"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
              error={errors.confirm}
              required
            />

            <Button type="submit" loading={isLoading} className="mt-1 w-full">
              Créer mon Compte
            </Button>
          </form>

          <p className="text-center font-arabic text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-semibold transition-colors"
              style={{ color: 'var(--blue)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--blue)'}
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </motion.div>
      <ToastContainer />
    </main>
  );
};

export default Register;
