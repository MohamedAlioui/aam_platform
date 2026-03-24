import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Hook to manage a simple Three.js scene imperatively (fallback for non-R3F use)
const use3DScene = (mountRef, initFn) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050d1f);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const { scene, camera, animate, cleanup } = initFn(renderer, width, height);
    sceneRef.current = scene;

    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      animate?.();
      renderer.render(scene, camera);
    };
    render();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      cleanup?.();
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return sceneRef;
};

export default use3DScene;
