import { useState, lazy, Suspense } from 'react';
import LoadingScreen3D from '@/components/3d/LoadingScreen3D';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Courses from '@/components/sections/Courses';
import GallerySection from '@/components/sections/Gallery';
import Shop6ix from '@/components/sections/Shop6ix';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import ToastContainer from '@/components/ui/Toast';

const Home = () => {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {/* Intro animation — max 3s */}
      {!loadingDone && (
        <LoadingScreen3D onComplete={() => setLoadingDone(true)} />
      )}

      <main>
        <Hero />
        <About />
        <Courses />
        <GallerySection />
        <Testimonials />
        <Shop6ix />
        <Contact />
      </main>

      <ToastContainer />
    </>
  );
};

export default Home;
