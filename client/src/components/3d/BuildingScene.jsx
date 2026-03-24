import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// Single pillar
const Pillar = ({ position }) => (
  <group position={position}>
    {/* Shaft */}
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.18, 0.2, 4, 12]} />
      <meshStandardMaterial color="#c8c0d8" metalness={0.1} roughness={0.4} />
    </mesh>
    {/* Base */}
    <mesh position={[0, -0.15, 0]}>
      <boxGeometry args={[0.5, 0.3, 0.5]} />
      <meshStandardMaterial color="#d0c8e0" metalness={0.05} roughness={0.5} />
    </mesh>
    {/* Capital */}
    <mesh position={[0, 3.2, 0]}>
      <boxGeometry args={[0.45, 0.25, 0.45]} />
      <meshStandardMaterial color="#d0c8e0" metalness={0.05} roughness={0.5} />
    </mesh>
  </group>
);

// Building structure
const AAMBuilding = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  const pillars = [-3, -1.5, 0, 1.5, 3];

  return (
    <group ref={groupRef}>
      {/* Pillars row */}
      {pillars.map((x, i) => (
        <Pillar key={i} position={[x, -1, 0]} />
      ))}

      {/* Entablature (top beam) */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[7.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#e0d8f0" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Pediment (triangular roof) */}
      <mesh position={[0, 4.2, 0]}>
        <coneGeometry args={[3.8, 1.5, 4]} />
        <meshStandardMaterial color="#d8d0e8" metalness={0.1} roughness={0.4} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[9, 0.3, 2]} />
        <meshStandardMaterial color="#b8b0c8" metalness={0.15} roughness={0.4} />
      </mesh>
      <mesh position={[0, -1.7, 0]}>
        <boxGeometry args={[10, 0.25, 2.4]} />
        <meshStandardMaterial color="#a8a0b8" metalness={0.1} roughness={0.5} />
      </mesh>

      {/* AAM sign on pediment */}
      <mesh position={[0, 4.0, 0.5]}>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
        <meshStandardMaterial
          color="#c9a84c"
          emissive="#c9a84c"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

// Floating Guinness medal
const GuinessMedal = () => (
  <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.3}>
    <group position={[0, 6, 0]}>
      {/* Medal disc */}
      <mesh>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 32]} />
        <meshStandardMaterial
          color="#c9a84c"
          emissive="#a07030"
          emissiveIntensity={0.3}
          metalness={0.95}
          roughness={0.05}
        />
      </mesh>
      {/* Medal ring */}
      <mesh>
        <torusGeometry args={[0.72, 0.06, 8, 32]} />
        <meshStandardMaterial color="#f0d080" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Ribbon */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.18, 1.2, 0.04]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.4} />
      </mesh>
    </group>
  </Float>
);

// Atmospheric ground mist
const GroundFog = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#1a2a6c"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
};

// Slow-panning camera
const PanCamera = () => {
  const angleRef = useRef(0);

  useFrame((state, delta) => {
    angleRef.current += delta * 0.08;
    const radius = 12;
    state.camera.position.x = Math.sin(angleRef.current) * radius;
    state.camera.position.z = Math.cos(angleRef.current) * radius;
    state.camera.position.y = 3;
    state.camera.lookAt(0, 2, 0);
  });

  return null;
};

const BuildingScene = ({ height = '500px', autoPan = true }) => (
  <div className="w-full rounded-2xl overflow-hidden" style={{ height }}>
    <Canvas camera={{ position: [0, 3, 12], fov: 55 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#050d1f']} />
      <fog attach="fog" color="#050d1f" near={18} far={40} />

      <ambientLight intensity={0.3} color="#4fc3f7" />
      <directionalLight position={[5, 10, 5]} color="#ffffff" intensity={0.8} />
      <pointLight position={[-6, 4, 4]} color="#1565c0" intensity={2} distance={20} />
      <pointLight position={[6, 4, 4]} color="#00b8d4" intensity={1.5} distance={20} />

      {autoPan && <PanCamera />}
      <Suspense fallback={null}>
        <AAMBuilding />
        <GuinessMedal />
        <GroundFog />
      </Suspense>

      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={0.4} />
        <Vignette darkness={0.6} offset={0.3} />
      </EffectComposer>
    </Canvas>
  </div>
);

export default BuildingScene;
