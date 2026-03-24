import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/utils/animations';

// Generic scroll-triggered fade-up
export const useScrollFadeUp = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' },
        ...options
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return ref;
};

// Stagger children on scroll enter
export const useStaggerReveal = (stagger = 0.12) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current.children, {
        y: 40, opacity: 0, stagger,
        duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none none' }
      });
    }, ref);
    return () => ctx.revert();
  }, [stagger]);

  return ref;
};

// Parallax Y offset
export const useParallax = (speed = 0.4) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => ref.current.offsetHeight * speed,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }, ref);
    return () => ctx.revert();
  }, [speed]);

  return ref;
};

export default useScrollFadeUp;
