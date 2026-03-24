import * as THREE from 'three';

// ════════════════════════════════════════
// THREE.JS HELPER UTILITIES
// ════════════════════════════════════════

// Create a silk-like material (AAM fashion fabric)
export const createSilkMaterial = (color = '#1a2a6c') => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.3,
    roughness: 0.1,
    envMapIntensity: 1.5,
    side: THREE.DoubleSide
  });
};

// Create an emissive glow material
export const createGlowMaterial = (color = '#00b8d4', intensity = 0.8) => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: intensity,
    metalness: 0.1,
    roughness: 0.2
  });
};

// Create gold material for Guinness medal
export const createGoldMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c9a84c'),
    emissive: new THREE.Color('#8a5e1a'),
    emissiveIntensity: 0.2,
    metalness: 0.9,
    roughness: 0.1
  });
};

// Create marble/pillar material
export const createMarbleMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e8e0f0'),
    metalness: 0.05,
    roughness: 0.3
  });
};

// Dispose geometry and material to prevent memory leaks
export const disposeObject = (obj) => {
  if (!obj) return;
  if (obj.geometry) obj.geometry.dispose();
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach(m => m.dispose());
    } else {
      obj.material.dispose();
    }
  }
  if (obj.children) {
    obj.children.forEach(child => disposeObject(child));
  }
};

// Random position within bounds
export const randomInBox = (spread = 10) => ({
  x: (Math.random() - 0.5) * spread,
  y: (Math.random() - 0.5) * spread,
  z: (Math.random() - 0.5) * spread
});

// Eased interpolation (lerp)
export const lerpSmooth = (current, target, factor = 0.05) => {
  return current + (target - current) * factor;
};

// Create particle buffer geometry
export const createParticleGeometry = (count = 2000, spread = 20) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
    scales[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  return geometry;
};

// Orbit camera position calculation
export const getOrbitPosition = (theta, phi, radius) => ({
  x: radius * Math.sin(phi) * Math.cos(theta),
  y: radius * Math.cos(phi),
  z: radius * Math.sin(phi) * Math.sin(theta)
});

// Map mouse position to normalized device coordinates
export const getNDC = (event) => ({
  x: (event.clientX / window.innerWidth) * 2 - 1,
  y: -(event.clientY / window.innerHeight) * 2 + 1
});

// Spring physics config for react-spring + R3F
export const SPRING_CONFIG = {
  gentle: { mass: 1, tension: 120, friction: 14 },
  wobbly: { mass: 1, tension: 180, friction: 12 },
  stiff: { mass: 1, tension: 210, friction: 20 },
  slow: { mass: 1, tension: 280, friction: 60 }
};
