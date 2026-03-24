import Contact from '@/components/sections/Contact';
import ToastContainer from '@/components/ui/Toast';

const ContactPage = () => (
  <main className="min-h-screen bg-navy-deep pt-20">
    <div className="text-center pt-16 pb-4 px-6">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-8 h-px bg-cyan" />
        <span className="font-mono text-xs tracking-widest text-cyan uppercase">Contact</span>
        <div className="w-8 h-px bg-cyan" />
      </div>
      <h1 className="section-title text-off-white" style={{ direction: 'rtl' }}>
        تواصل <span className="text-gradient-cyan">معنا</span>
      </h1>
      <p className="font-editorial italic text-blue-light/50 text-xl mt-2">Contactez-nous</p>
    </div>
    <Contact />
    <ToastContainer />
  </main>
);

export default ContactPage;
