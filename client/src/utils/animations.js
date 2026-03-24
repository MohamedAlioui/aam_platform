import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════
// GSAP ANIMATION PRESETS
// ════════════════════════════════════════

// Text letter-by-letter split animation
export const splitTextReveal = (element, delay = 0) => {
  const text = element.textContent;
  element.innerHTML = '';

  const chars = text.split('').map(char => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(40px) rotateX(-90deg)';
    element.appendChild(span);
    return span;
  });

  return gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    stagger: 0.04,
    duration: 0.8,
    ease: 'back.out(1.7)',
    delay
  });
};

// Slide in from left
export const slideInLeft = (element, options = {}) => {
  return gsap.from(element, {
    x: -80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options
  });
};

// Slide in from right
export const slideInRight = (element, options = {}) => {
  return gsap.from(element, {
    x: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    ...options
  });
};

// Fade up
export const fadeUp = (element, options = {}) => {
  return gsap.from(element, {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    ...options
  });
};

// Counter animation (number count-up)
export const animateCounter = (element, target, duration = 2, suffix = '') => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix;
    }
  });
};

// Clip-path reveal (wipe from left to right)
export const clipReveal = (element, options = {}) => {
  return gsap.from(element, {
    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
    duration: 1.2,
    ease: 'power4.inOut',
    ...options
  });
};

// Parallax Y offset
export const createParallax = (element, speed = 0.5, trigger = null) => {
  return ScrollTrigger.create({
    trigger: trigger || element,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set(element, {
        y: self.progress * 100 * speed
      });
    }
  });
};

// Stagger cards cascade
export const staggerCards = (elements, options = {}) => {
  return gsap.from(elements, {
    y: 60,
    opacity: 0,
    scale: 0.95,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out',
    ...options
  });
};

// ScrollTrigger fade-in utility
export const scrollFadeIn = (element, options = {}) => {
  return gsap.from(element, {
    y: 40,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    ...options
  });
};

// Horizontal scroll section setup
export const createHorizontalScroll = (container, items) => {
  const totalWidth = items.reduce((w, el) => w + el.offsetWidth, 0);

  return gsap.to(items, {
    x: () => -(totalWidth - window.innerWidth + 120),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => `+=${totalWidth}`
    }
  });
};

// Background color transition on scroll
export const bgColorTransition = (element, fromColor, toColor) => {
  return gsap.to(element, {
    backgroundColor: toColor,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: true
    }
  });
};

// 6ix text scale mega animation
export const megaTextScale = (element) => {
  return gsap.to(element, {
    scale: 8,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: element.parentElement,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      pin: element.parentElement
    }
  });
};

// Guinness badge spin
export const guinessSpin = (element) => {
  return gsap.from(element, {
    rotation: -360,
    scale: 0,
    duration: 1.5,
    ease: 'elastic.out(1, 0.5)',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
};

// Export GSAP for direct use
export { gsap, ScrollTrigger };
