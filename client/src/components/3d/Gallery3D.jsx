import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Single floating image panel
const ImagePanel = ({ url, position, rotation, index, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Load texture or use placeholder
  let texture = null;
  try {
    texture = useTexture(url);
  } catch (_) {}

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Gentle floating with different phase per image
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + index * 1.2) * 0.3;
    meshRef.current.rotation.z = Math.sin(t * 0.25 + index * 0.8) * 0.04;

    // Hover zoom
    const targetScale = hovered ? 1.12 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={() => onClick(index)}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <planeGeometry args={[2.4, 3.2]} />
      <meshStandardMaterial
        color={texture ? '#ffffff' : '#0d1b3e'}
        map={texture || null}
        emissive={hovered ? '#00b8d4' : '#000000'}
        emissiveIntensity={hovered ? 0.15 : 0}
        metalness={0.1}
        roughness={0.4}
      />
    </mesh>
  );
};

// Scene camera that follows scroll
const ScrollCamera = ({ scroll }) => {
  const { camera } = useThree();

  useFrame(() => {
    const targetZ = 8 - scroll.current * 0.1;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (-scroll.current * 0.008 - camera.position.y) * 0.05;
    camera.lookAt(0, camera.position.y, 0);
  });

  return null;
};

// Spotlight for each image
const Spotlights = ({ positions }) => (
  <>
    {positions.map((pos, i) => (
      <spotLight
        key={i}
        position={[pos[0], pos[1] + 5, pos[2] + 3]}
        target-position={pos}
        angle={0.35}
        penumbra={0.6}
        intensity={1.5}
        color="#ffffff"
        distance={15}
      />
    ))}
  </>
);

const Gallery3D = ({ images = [], onImageClick }) => {
  const scroll = useRef(0);

  // Place images in 3D space with varied depths
  const layout = [
    [-3.5, 0.5, 0], [0, 1, -1.5], [3.5, 0, -0.5],
    [-3, -0.3, -2], [3, 0.8, -3], [0, -0.5, -4],
    [-3.5, 0.2, -5], [3.5, 0.3, -5.5]
  ];

  const items = images.length > 0
    ? images.slice(0, 8)
    : layout.map((_, i) => ({ url: '', _id: i }));

  // Handle scroll for depth parallax
  const handleWheel = (e) => {
    scroll.current += e.deltaY * 0.01;
    scroll.current = Math.max(0, Math.min(100, scroll.current));
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: '600px' }}
      onWheel={handleWheel}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 65 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#020810']} />
        <fog attach="fog" color="#020810" near={12} far={25} />

        <ambientLight intensity={0.1} />
        <Spotlights positions={layout.slice(0, 4)} />

        <Suspense fallback={null}>
          {items.map((img, i) => (
            <ImagePanel
              key={img._id || i}
              url={img.url}
              position={layout[i % layout.length]}
              rotation={[0, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.1]}
              index={i}
              onClick={(idx) => onImageClick?.(idx)}
            />
          ))}
        </Suspense>

        <ScrollCamera scroll={scroll} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-cyan/40 tracking-widest">
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default Gallery3D;
