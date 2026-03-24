import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Image, ShoppingBag,
  Users, ClipboardList, Package, LogOut, X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const links = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Tableau de bord', end: true },
  { to: '/dashboard/courses', icon: <BookOpen size={18} />, label: 'Cours' },
  { to: '/dashboard/registrations', icon: <ClipboardList size={18} />, label: 'Inscriptions' },
  { to: '/dashboard/gallery', icon: <Image size={18} />, label: 'Galerie' },
  { to: '/dashboard/products', icon: <Package size={18} />, label: 'Produits 6ix' },
  { to: '/dashboard/orders', icon: <ShoppingBag size={18} />, label: 'Commandes' },
  { to: '/dashboard/users', icon: <Users size={18} />, label: 'Utilisateurs' }
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { logout, user } = useAuthStore();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto flex flex-col`}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="font-display font-black text-2xl text-gradient-blue">AAM</div>
            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Admin Panel</div>
          </div>
          <button onClick={onClose} className="lg:hidden transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'var(--blue)' }}>
              <span className="font-mono text-sm text-white font-bold">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <div className="font-arabic text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name || 'Admin'}</div>
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 font-mono text-xs tracking-wide transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? 'var(--blue-pale)' : 'transparent',
                    color: isActive ? 'var(--blue)' : 'var(--text-muted)',
                    border: isActive ? '1px solid var(--blue-pale)' : '1px solid transparent',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--blue)' : 'var(--text-muted)' }}>{link.icon}</span>
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--blue)' }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all duration-200 font-mono text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
