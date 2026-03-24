import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';

// Animated cloth-like mesh using vertex displacement
const ClothMesh = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Create a plane with many segments for smooth deformation
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(6, 8, 60, 80);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      // Wave displacement simulating cloth in wind
      const wave1 = Math.sin(x * 0.8 + time * 1.2) * 0.4;
      const wave2 = Math.cos(y * 0.5 + time * 0.9) * 0.3;
      const wave3 = Math.sin(x * 0.5 + y * 0.3 + time * 0.7) * 0.25;

      positions.setZ(i, wave1 + wave2 + wave3);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -2]} rotation={[0, 0.3, 0]}>
      <meshStandardMaterial
        ref={materialRef}
        color="#1a2a6c"
        emissive="#00b8d4"
        emissiveIntensity={0.15}
        metalness={0.3}
        roughness={0.1}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

// Second cloth panel for depth
const ClothMesh2 = () => {
  const meshRef = useRef();

  const geometry = useMemo(() => new THREE.PlaneGeometry(4, 6, 40, 60), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(x * 1.2 + time * 0.8) * 0.3
        + Math.cos(y * 0.7 + time * 1.1) * 0.25;
      positions.setZ(i, wave);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[3, 1, -3]} rotation={[0, -0.5, 0.2]}>
      <meshStandardMaterial
        color="#0d1b3e"
        emissive="#4fc3f7"
        emissiveIntensity={0.1}
        metalness={0.4}
        roughness={0.15}
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// Orbiting point lights
const OrbitingLights = () => {
  const light1Ref = useRef();
  const light2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (light1Ref.current) {
      light1Ref.current.position.x = Math.cos(t * 0.4) * 6;
      light1Ref.current.position.y = Math.sin(t * 0.3) * 4;
      light1Ref.current.position.z = Math.sin(t * 0.4) * 3;
    }

    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.4 + Math.PI) * 6;
      light2Ref.current.position.y = Math.sin(t * 0.3 + Math.PI) * 4;
      light2Ref.current.position.z = Math.sin(t * 0.4 + Math.PI) * 3;
    }
  });

  return (
    <>
      <pointLight ref={light1Ref} color="#00b8d4" intensity={4} distance={15} />
      <pointLight ref={light2Ref} color="#4fc3f7" intensity={2} distance={12} />
    </>
  );
};

// Cinematic camera dolly on load
const CameraController = () => {
  const { camera } = useThree();
  const startZ = 12;
  const targetZ = 7;
  const progress = useRef(0);

  camera.position.z = startZ;

  useFrame((state, delta) => {
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 0.4);
      const t = 1 - Math.pow(1 - progress.current, 3);
      camera.position.z = startZ + (targetZ - startZ) * t;
    }

    // Subtle mouse parallax
    camera.position.x += (state.mouse.x * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (state.mouse.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// AAM Logo 3D representation (simplified with boxes)
const AAMLogoFloat = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 1, 0]}>
        {/* A letter */}
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.15]} />
          <meshStandardMaterial
            color="#00b8d4"
            emissive="#00b8d4"
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
        {/* A letter 2 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.15]} />
          <meshStandardMaterial
            color="#4fc3f7"
            emissive="#4fc3f7"
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
        {/* M letter */}
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.15]} />
          <meshStandardMaterial
            color="#00b8d4"
            emissive="#00b8d4"
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Main scene content
const SceneContent = () => (
  <>
    <color attach="background" args={['#050d1f']} />
    <fog attach="fog" args={['#050d1f', 15, 40]} />

    <ambientLight intensity={0.1} />
    <directionalLight position={[0, 10, 5]} color="#1565c0" intensity={0.5} />

    <OrbitingLights />
    <CameraController />

    <ClothMesh />
    <ClothMesh2 />
    <AAMLogoFloat />

    <ParticleField count={2000} spread={25} color="#4fc3f7" size={0.04} />

    <Stars radius={50} depth={20} count={800} factor={2} saturation={0} fade speed={0.5} />
  </>
);

const HeroScene = () => {
  return (
    <div className="absolute inset-0 hero-canvas-height">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
      >
        <Suspense fallback={null}>
          <SceneContent />
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.3}
              luminanceSmoothing={0.9}
              height={300}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0005, 0.0005]}
            />
            <Vignette darkness={0.5} offset={0.3} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroScene;
