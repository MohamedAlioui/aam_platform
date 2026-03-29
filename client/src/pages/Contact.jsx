import Contact from '@/components/sections/Contact';
import ToastContainer from '@/components/ui/Toast';

const ContactPage = () => (
  <main className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
    {/* Header — explicit dark gradient so it works in both light and dark themes */}
    <div className="relative pt-28 pb-16 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0b1120 0%, #1e3a5f 100%)' }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px" style={{ background: 'var(--blue)' }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--blue-light)' }}>Contact</span>
          <div className="w-8 h-px" style={{ background: 'var(--blue)' }} />
        </div>
        <h1 className="section-title mb-2" style={{ color: '#ffffff', direction: 'rtl' }}>
          تواصل <span className="text-gradient-blue">معنا</span>
        </h1>
        <p className="font-editorial italic text-xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Contactez-nous
        </p>
      </div>
    </div>

    <Contact />
    <ToastContainer />
  </main>
);

export default ContactPage;
