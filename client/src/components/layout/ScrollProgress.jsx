import { useEffect, useRef } from 'react';

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[9999]" style={{ height: '3px', background: 'var(--border)' }}>
      <div
        ref={barRef}
        className="h-full w-0 transition-none"
        style={{ background: 'linear-gradient(to right, var(--blue), var(--blue-light))' }}
      />
    </div>
  );
};

export default ScrollProgress;
