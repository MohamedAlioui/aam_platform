import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Individual letter with fly-in animation
const AAMLetter = ({ char, targetX, startX, startY, startZ, delay }) => {
  const meshRef = useRef();
  const [animated, setAnimated] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (animated && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 1.5);
      const t = 1 - Math.pow(1 - progress.current, 3); // ease-out cubic

      meshRef.current.position.x = THREE.MathUtils.lerp(startX, targetX, t);
      meshRef.current.position.y = THREE.MathUtils.lerp(startY, 0, t);
      meshRef.current.position.z = THREE.MathUtils.lerp(startZ, 0, t);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, t);
    }

    // Pulse glow after assembly
    if (progress.current >= 1) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.8;
      if (meshRef.current.material) {
        meshRef.current.material.emissiveIntensity = pulse;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[startX, startY, startZ]}>
      <boxGeometry args={[1.2, 1.6, 0.3]} />
      <meshStandardMaterial
        color="#00b8d4"
        emissive="#00b8d4"
        emissiveIntensity={0.5}
        metalness={0.6}
        roughness={0.1}
      />
    </mesh>
  );
};

// Particle field for loading screen
const LoadingParticles = () => {
  const pointsRef = useRef();
  const count = 800;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4fc3f7"
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
};

// 3D "AAM" logo made of boxes
const AAMLogo = () => {
  const letters = [
    { char: 'A', targetX: -2, startX: -15, startY: 10, startZ: -10, delay: 200 },
    { char: 'A', targetX: 0, startX: 0, startY: -15, startZ: 10, delay: 400 },
    { char: 'M', targetX: 2, startX: 15, startY: 5, startZ: -8, delay: 600 }
  ];

  return (
    <group position={[0, 0, 0]}>
      {letters.map((letter, i) => (
        <AAMLetter key={i} {...letter} />
      ))}
    </group>
  );
};

const LoadingScreen3D = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 600);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 3D Canvas */}
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            className="absolute inset-0"
          >
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} color="#00b8d4" intensity={2} />
            <pointLight position={[-5, -5, -5]} color="#4fc3f7" intensity={1} />
            <AAMLogo />
            <LoadingParticles />
          </Canvas>

          {/* Overlay text */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="font-arabic text-blue-light/60 text-sm tracking-widest"
            >
              أكاديمية عربية للموضة
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ delay: 0.5, duration: 2.2, ease: 'linear' }}
              className="h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="font-mono text-[10px] tracking-[0.4em] text-cyan/40 uppercase"
            >
              Académie Arabe de la Mode
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen3D;
