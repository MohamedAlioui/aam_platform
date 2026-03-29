import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { NAV_LINKS } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

const Footer = ({ variant = 'default' }) => {
  const { user } = useAuthStore();

  if (variant === '6ix') {
    return (
      <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="py-8 px-6 text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-mono text-2xl font-black text-white tracking-widest">6IX</div>
          <p className="font-mono text-xs tracking-widest">BY ACADÉMIE ARABE DE LA MODE</p>
          <p className="font-mono text-xs">© {new Date().getFullYear()} AAM.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }} className="relative">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display font-black text-4xl text-gradient-blue mb-2">AAM</div>
            <div className="font-arabic text-sm mb-0.5" style={{ color: 'var(--text-muted)' }}>أكاديمية عربية للموضة</div>
            <div className="font-editorial italic text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Académie Arabe de la Mode</div>
            <p className="font-arabic text-sm leading-relaxed max-w-xs mb-5" style={{ color: 'var(--text-secondary)', direction: 'rtl' }}>
              حيث يلتقي الموروث العربي بموضة الغد
            </p>
            <span className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full"
              style={{ border: '1px solid var(--gold)', color: 'var(--gold)', background: 'rgba(217,119,6,0.06)' }}>
              🏆 Guinness World Record™
            </span>
          </div>

          {/* Nav */}
          <div>
            <h3 className="font-arabic text-sm font-bold mb-4" style={{ color: 'var(--blue)' }}>التنقل</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="font-arabic text-sm transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {l.label_ar}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-arabic text-sm font-bold mb-4" style={{ color: 'var(--blue)' }}>تواصل معنا</h3>
            <ul className="space-y-3">
              {[
                { icon: <MapPin size={13} />,    text: 'تونس — Tunisie',           href: null },
                { icon: <Phone size={13} />,     text: '+216 XX XXX XXX',          href: 'tel:+21600000000' },
                { icon: <Mail size={13} />,      text: 'contact@aam.tn',           href: 'mailto:contact@aam.tn' },
                { icon: <Instagram size={13} />, text: '@academie_arabe_mode',     href: 'https://instagram.com/academie_arabe_mode' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span style={{ color: 'var(--blue)' }}>{item.icon}</span>
                  {item.href ? (
                    <a href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-mono text-xs transition-colors"
                      style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >{item.text}</a>
                  ) : (
                    <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Académie Arabe de la Mode. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="font-mono text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >Boutique 6ix</Link>

            {/* Only show Admin link to admins */}
            {user?.role === 'admin' && (
              <Link to="/dashboard" className="font-mono text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >Admin</Link>
            )}

            {/* Show "Mes cours" link to logged-in students */}
            {user && user.role !== 'admin' && (
              <Link to="/my-courses" className="font-mono text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >Mes Cours</Link>
            )}
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute bottom-6 right-6 w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        <ArrowUp size={14} />
      </button>
    </footer>
  );
};

export default Footer;
