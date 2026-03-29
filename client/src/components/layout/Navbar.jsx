import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { NAV_LINKS } from '@/utils/constants';

/* ─── Mobile drawer — defined OUTSIDE Navbar so React keeps stable identity ─── */
const MobileDrawer = ({ open, onClose, location, lang, setLang, theme, toggleTheme, user, isAuthenticated, logout, isDark }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="bd"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Drawer panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(300px, 85vw)',
              zIndex: 9999,
              background: isDark ? '#0f1117' : '#ffffff',
              borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 20px',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            }}>
              <span style={{
                fontFamily: 'var(--font-display, monospace)',
                fontWeight: 900, fontSize: 20, letterSpacing: '0.12em',
                color: isDark ? '#ffffff' : '#0a0a0a',
              }}>AAM</span>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  background: 'transparent', color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                  cursor: 'pointer', borderRadius: 6,
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '10px 12px' }}>
              {NAV_LINKS.map((link, i) => {
                const active = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '11px 14px', marginBottom: 3, borderRadius: 9,
                        textDecoration: 'none',
                        fontFamily: 'var(--font-arabic, sans-serif)',
                        fontSize: 15, fontWeight: active ? 700 : 500,
                        color: active ? 'var(--blue)' : isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
                        background: active
                          ? isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.07)'
                          : 'transparent',
                      }}
                    >
                      {lang === 'ar' ? link.label_ar : link.label_fr}
                      {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', flexShrink: 0 }} />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer controls */}
            <div style={{
              padding: '14px 20px',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={toggleTheme}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 12px', borderRadius: 8,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    background: 'transparent', color: 'var(--blue)',
                    fontFamily: 'var(--font-arabic, sans-serif)', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  {isDark ? <Sun size={14} /> : <Moon size={14} />}
                  {isDark ? 'Mode Clair' : 'Mode Sombre'}
                </button>
                <button
                  onClick={() => setLang(l => l === 'ar' ? 'fr' : 'ar')}
                  style={{
                    padding: '9px 16px', borderRadius: 8,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    background: 'transparent',
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                    fontFamily: 'monospace', fontSize: 12, cursor: 'pointer', letterSpacing: '0.1em',
                  }}
                >
                  {lang === 'ar' ? 'FR' : 'AR'}
                </button>
              </div>

              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        padding: '9px 12px', borderRadius: 8,
                        border: '1px solid rgba(37,99,235,0.3)',
                        background: 'rgba(37,99,235,0.07)', color: 'var(--blue)',
                        fontFamily: 'monospace', fontSize: 12, textDecoration: 'none',
                      }}
                    >
                      <LayoutDashboard size={13} /> Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); onClose(); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      padding: '9px 12px', borderRadius: 8,
                      border: '1px solid rgba(239,68,68,0.3)',
                      background: 'transparent', color: '#ef4444',
                      fontFamily: 'monospace', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    <LogOut size={13} /> Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 12px', borderRadius: 8,
                    background: 'var(--blue)', color: '#fff',
                    fontFamily: 'var(--font-arabic, sans-serif)', fontSize: 13, textDecoration: 'none',
                  }}
                >
                  <User size={13} /> Connexion
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

/* ─── Navbar ─── */
const Navbar = ({ variant = 'default' }) => {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang]             = useState('ar');
  const location                    = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme }      = useThemeStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--navbar-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        transition: 'background 0.35s ease, border-color 0.35s ease',
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6"
          style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, textDecoration: 'none' }}>
            <span className="font-display font-black text-2xl tracking-wider text-gradient-blue">AAM</span>
            <div className="hidden md:block" style={{ borderLeft: '1px solid var(--border)', paddingLeft: 12 }}>
              <div className="font-arabic text-[11px] leading-tight" style={{ color: 'var(--text-muted)' }}>
                أكاديمية عربية للموضة
              </div>
            </div>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-arabic text-sm"
                  style={{
                    padding: '6px 10px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
                    color: active ? 'var(--blue)' : 'var(--text-secondary)',
                    background: active ? 'var(--blue-pale)' : 'transparent',
                    fontWeight: active ? 700 : 500,
                    transition: 'color 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-pale)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {lang === 'ar' ? link.label_ar : link.label_fr}
                </Link>
              );
            })}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* Language — desktop only */}
            <button
              onClick={() => setLang(l => l === 'ar' ? 'fr' : 'ar')}
              className="hidden md:flex font-mono text-xs"
              style={{ padding: '5px 10px', border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'transparent', cursor: 'pointer', borderRadius: 6, transition: 'color 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              {lang === 'ar' ? 'FR' : 'AR'}
            </button>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', color: 'var(--blue)', background: 'var(--bg-card)', cursor: 'pointer', borderRadius: 8 }}
              title={isDark ? 'Mode Clair' : 'Mode Sombre'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
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

            {/* Auth — desktop only */}
            {isAuthenticated ? (
              <div className="hidden md:flex" style={{ alignItems: 'center', gap: 2 }}>
                {user?.role === 'admin' && (
                  <Link to="/dashboard" style={{ padding: 6, borderRadius: 8, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    <LayoutDashboard size={16} />
                  </Link>
                )}
                <button onClick={logout}
                  style={{ padding: 6, borderRadius: 8, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="hidden md:flex items-center gap-2 font-arabic text-sm"
                style={{ padding: '6px 16px', borderRadius: 8, background: 'var(--blue)', color: '#fff', textDecoration: 'none', fontWeight: 600, transition: 'background 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--blue)'}
              >
                <User size={13} />
                {lang === 'ar' ? 'دخول' : 'Connexion'}
              </Link>
            )}

            {/* Hamburger — ONLY on mobile (md:hidden) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden"
              style={{
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--border)', color: 'var(--text-primary)',
                background: 'transparent', cursor: 'pointer', borderRadius: 8,
              }}
              aria-label="Ouvrir le menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — portal into document.body, shown only when mobileOpen */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        location={location}
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        isDark={isDark}
      />
    </>
  );
};

export default Navbar;
