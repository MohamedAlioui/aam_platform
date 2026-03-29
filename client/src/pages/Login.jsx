import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ToastContainer, { useToastStore } from '@/components/ui/Toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { error: showError } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended page, or / as fallback
  const from = location.state?.from || '/';

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated]);
  useEffect(() => { if (error) { showError(error); clearError(); } }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate(from, { replace: true });
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
        {/* Card */}
        <div className="rounded-2xl p-8 md:p-10"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-hover)' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="font-display font-black text-5xl text-gradient-blue mb-1">AAM</div>
            <p className="font-arabic text-sm" style={{ color: 'var(--text-muted)' }}>أكاديمية عربية للموضة</p>
            <div className="mx-auto mt-3 h-px w-16"
              style={{ background: 'linear-gradient(to right, transparent, var(--blue), transparent)' }} />
          </div>

          <h2 className="font-display text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="votre@email.com"
              icon={<Mail size={15} />}
              required
            />

            {/* Password field with properly centered toggle */}
            <div>
              <label className="block font-mono text-xs tracking-widest uppercase mb-2"
                style={{ color: 'var(--text-muted)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--text-muted)' }}>
                  <Lock size={15} />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="aam-input pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={isLoading} className="mt-1 w-full">
              Se Connecter
            </Button>
          </form>

          <p className="text-center font-arabic text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            ليس لديك حساب؟{' '}
            <Link to="/register" className="font-semibold transition-colors"
              style={{ color: 'var(--blue)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blue-light)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--blue)'}
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </motion.div>

      <ToastContainer />
    </main>
  );
};

export default Login;
