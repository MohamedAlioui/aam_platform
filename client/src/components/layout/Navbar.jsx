import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';
import { NAV_LINKS } from '@/utils/constants';

const Navbar = ({ variant = 'default' }) => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang]             = useState('ar');
  const location                    = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items, toggleCart }       = useCartStore();
  const { theme, toggleTheme }      = useThemeStore();
  const is6ix = variant === '6ix';

  const totalCartItems = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  /* ─── 6ix variant ─── */
  if (is6ix) {
    return (
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(0,0,0,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-black text-2xl tracking-widest text-white">6IX</Link>
          <button onClick={toggleCart} className="relative text-white p-1.5">
            <ShoppingBag size={19} />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full bg-white text-black">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'var(--navbar-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.35s ease',
    }}>
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-18 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="font-display font-black text-2xl tracking-wider text-gradient-blue">AAM</span>
          <div className="hidden md:block" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '12px' }}>
            <div className="font-arabic text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>أكاديمية عربية للموضة</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 py-2 rounded-lg font-arabic text-sm transition-all duration-200"
                style={{
                  color: active ? 'var(--blue)' : 'var(--text-secondary)',
                  background: active ? 'var(--blue-pale)' : 'transparent',
                  fontWeight: active ? '700' : '500',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--blue)';
                    e.currentTarget.style.background = 'var(--blue-pale)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {lang === 'ar' ? link.label_ar : link.label_fr}
              </Link>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Language */}
          <button
            onClick={() => setLang(l => l === 'ar' ? 'fr' : 'ar')}
            className="hidden md:flex font-mono text-xs px-2.5 py-1.5 rounded-md transition-all duration-200"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            {lang === 'ar' ? 'FR' : 'AR'}
          </button>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ border: '1px solid var(--border)', color: 'var(--blue)', background: 'var(--bg-card)' }}
            title={theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Sun size={14} />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Moon size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Cart (shop only) */}
          {location.pathname.startsWith('/shop') && (
            <button onClick={toggleCart} className="relative p-1.5" style={{ color: 'var(--text-secondary)' }}>
              <ShoppingBag size={18} />
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold flex items-center justify-center rounded-full text-white"
                  style={{ background: 'var(--blue)' }}
                >
                  {totalCartItems}
                </motion.span>
              )}
            </button>
          )}

          {/* Auth */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1">
              {user?.role === 'admin' && (
                <Link to="/dashboard" className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <LayoutDashboard size={16} />
                </Link>
              )}
              <button onClick={logout} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 font-arabic text-sm px-4 py-1.5 rounded-lg transition-all duration-200"
              style={{ background: 'var(--blue)', color: '#fff', fontWeight: '600' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
            >
              <User size={13} />
              {lang === 'ar' ? 'دخول' : 'Connexion'}
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--text-primary)' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: 'var(--bg-page)', paddingTop: '5rem' }}
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-6" style={{ color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>

            <div className="flex flex-col px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="block font-arabic text-xl py-3 px-4 rounded-xl transition-all"
                    style={{
                      color: location.pathname === link.path ? 'var(--blue)' : 'var(--text-secondary)',
                      background: location.pathname === link.path ? 'var(--blue-pale)' : 'transparent',
                      fontWeight: location.pathname === link.path ? '700' : '500',
                    }}
                  >
                    {lang === 'ar' ? link.label_ar : link.label_fr}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.05 + 0.1 }}
                className="flex items-center gap-3 mt-6 pt-6"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 font-arabic text-sm px-4 py-2 rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--blue)' }}
                >
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
                </button>
                <button onClick={() => setLang(l => l === 'ar' ? 'fr' : 'ar')}
                  className="font-mono text-xs px-3 py-2 rounded-lg"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  {lang === 'ar' ? 'FR' : 'AR'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
