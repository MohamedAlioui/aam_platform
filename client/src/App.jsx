import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

// Layout
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollProgress from '@/components/layout/ScrollProgress';
import PageWrapper from '@/components/layout/PageWrapper';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

// Auth guard
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

// Lazy-loaded pages
const Home       = lazy(() => import('@/pages/Home'));
const About      = lazy(() => import('@/pages/About'));
const Courses    = lazy(() => import('@/pages/Courses'));
const CourseDetail = lazy(() => import('@/pages/CourseDetail'));
const Gallery    = lazy(() => import('@/pages/Gallery'));
const Shop       = lazy(() => import('@/pages/Shop'));
const Contact    = lazy(() => import('@/pages/Contact'));
const Login      = lazy(() => import('@/pages/Login'));
const Register   = lazy(() => import('@/pages/Register'));
const Dashboard  = lazy(() => import('@/pages/Dashboard'));
const MyCourses      = lazy(() => import('@/pages/MyCourses'));
const Testimonials   = lazy(() => import('@/pages/Testimonials'));
const NotFoundPage   = lazy(() => import('@/pages/NotFound'));

// Page loader — theme-aware
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--blue-pale)', borderTopColor: 'var(--blue)' }} />
      <span className="font-display font-black text-2xl text-gradient-blue">AAM</span>
      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Chargement...</span>
    </div>
  </div>
);

// Protected route for admin
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated || user?.role !== 'admin') return <Login />;
  return children;
};


// App shell with animated routes
const AppRoutes = () => {
  const location   = useLocation();
  const isShopPage = location.pathname.startsWith('/shop');
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      <ScrollProgress />
      {!isShopPage && !isDashboard && <Navbar />}
      {/* Shop page has its own built-in responsive nav */}

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"            element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about"       element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/courses"     element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/courses/:id" element={<PageWrapper><CourseDetail /></PageWrapper>} />
          <Route path="/gallery"     element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="/shop"        element={<PageWrapper><Shop /></PageWrapper>} />
          <Route path="/contact"     element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/login"       element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register"    element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/my-courses"      element={<PageWrapper><MyCourses /></PageWrapper>} />
          <Route path="/testimonials"    element={<PageWrapper><Testimonials /></PageWrapper>} />
          <Route path="/dashboard/*" element={
            <AdminRoute><PageWrapper><Dashboard /></PageWrapper></AdminRoute>
          } />
          <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>

      {!isShopPage && !isDashboard && <Footer />}
      {/* Shop page has its own built-in footer */}

      {/* WhatsApp button — show on all pages except dashboard */}
      {!isDashboard  && <WhatsAppButton />}
    </>
  );
};

function App() {
  const { checkAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.lenis = lenis;
    return () => lenis.destroy();
  }, []);

  useEffect(() => { initTheme(); },  [initTheme]);
  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
