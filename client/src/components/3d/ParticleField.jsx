import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = ({
  count = 2000,
  spread = 20,
  color = '#4fc3f7',
  size = 0.05,
  speed = 0.3,
  mouseReactive = true
}) => {
  const pointsRef = useRef();
  const { mouse } = useThree();

  // Generate particle positions
  const { positions, originalPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      const z = (Math.random() - 0.5) * spread * 0.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    return { positions, originalPositions };
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Gentle float animation
      posAttr.array[iy] = originalPositions[iy] + Math.sin(time * speed + i * 0.1) * 0.3;
      posAttr.array[ix] = originalPositions[ix] + Math.cos(time * speed * 0.7 + i * 0.05) * 0.2;

      // Mouse reactive scatter — only first 500 particles for performance
      if (mouseReactive && i < 500) {
        const mx = mouse.x * 10;
        const my = mouse.y * 10;
        const dx = posAttr.array[ix] - mx;
        const dy = posAttr.array[iy] - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 3 - dist);

        posAttr.array[ix] += (dx / dist) * force * 0.02;
        posAttr.array[iy] += (dy / dist) * force * 0.02;
      }
    }

    posAttr.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = time * 0.03;
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
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
