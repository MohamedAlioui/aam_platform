import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// T-shirt 3D geometry (simplified)
const TShirtModel = ({ color }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const mat = {
    color: new THREE.Color(color === 'white' ? '#f5f5f5' : '#111111'),
    roughness: 0.8,
    metalness: 0.05
  };

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 3, 0.3]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Left sleeve */}
      <mesh position={[-1.8, 0.8, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[1.2, 0.8, 0.28]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Right sleeve */}
      <mesh position={[1.8, 0.8, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[1.2, 0.8, 0.28]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 1.6, 0]}>
        <torusGeometry args={[0.5, 0.15, 8, 16, Math.PI]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* 6ix logo embossed */}
      <mesh position={[0, 0.3, 0.16]}>
        <boxGeometry args={[0.8, 0.25, 0.02]} />
        <meshStandardMaterial
          color={color === 'white' ? '#333333' : '#ffffff'}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

// Hoodie model
const HoodieModel = ({ color }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const mat = {
    color: new THREE.Color(color === 'white' ? '#f0f0f0' : '#0a0a0a'),
    roughness: 0.9,
    metalness: 0
  };

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2.8, 3.5, 0.35]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 1.8, -0.1]}>
        <sphereGeometry args={[0.9, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Sleeves */}
      <mesh position={[-2, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.4, 0.9, 0.3]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      <mesh position={[2, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.4, 0.9, 0.3]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Kangaroo pocket */}
      <mesh position={[0, -0.8, 0.18]}>
        <boxGeometry args={[1.5, 0.6, 0.02]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ddd' : '#1a1a1a'}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
};

// Cap model
const CapModel = ({ color }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  const mat = {
    color: new THREE.Color(color === 'white' ? '#f5f5f5' : '#111111'),
    roughness: 0.8,
    metalness: 0.05
  };

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0]}>
      {/* Cap dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Brim */}
      <mesh position={[0, -0.4, 0.5]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 24, 1, false, -Math.PI * 0.5, Math.PI]} />
        <meshStandardMaterial {...mat} />
      </mesh>
      {/* Brim underside */}
      <mesh position={[0, -0.35, 0.5]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[1.49, 1.49, 0.08, 24, 1, false, -Math.PI * 0.5, Math.PI]} />
        <meshStandardMaterial
          color={color === 'white' ? '#e0e0e0' : '#1a1a1a'}
          roughness={0.9}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Sweatband */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[1.19, 0.08, 8, 24]} />
        <meshStandardMaterial
          color={color === 'white' ? '#ddd' : '#222'}
          roughness={0.95}
        />
      </mesh>
    </group>
  );
};

// Model map
const MODELS = {
  'T-Shirt': TShirtModel,
  'Hoodie': HoodieModel,
  'Cap': CapModel
};

// Size label floating in 3D
const SizeLabel = ({ size }) => (
  <Html position={[2.2, 0, 0]}>
    <div style={{
      background: 'rgba(0,0,0,0.8)',
      border: '1px solid #ffffff',
      color: '#ffffff',
      padding: '8px 12px',
      fontFamily: 'Space Mono',
      fontSize: '14px',
      fontWeight: 700,
      letterSpacing: '2px'
    }}>
      {size}
    </div>
  </Html>
);

const ProductViewer3D = ({ product }) => {
  const [color, setColor] = useState('black');
  const [size, setSize] = useState('M');

  const category = product?.category || 'T-Shirt';
  const ModelComponent = MODELS[category] || TShirtModel;
  const sizes = product?.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="w-full bg-black" style={{ height: '500px', position: 'relative' }}>
      {/* Pure black & white — 6ix universe */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={color === 'white' ? 0.8 : 0.3} color="#ffffff" />
        <directionalLight position={[5, 5, 5]} color="#ffffff" intensity={2} />
        <directionalLight position={[-5, -5, -5]} color="#ffffff" intensity={0.5} />
        <pointLight position={[0, 0, 4]} color="#ffffff" intensity={1} />

        <Suspense fallback={null}>
          <ModelComponent color={color} />
          <SizeLabel size={size} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>

      {/* Controls overlay (B&W only) */}
      <div className="absolute bottom-4 inset-x-0 flex flex-col items-center gap-4 px-4">
        {/* Color toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setColor('black')}
            className={`w-8 h-8 border-2 transition-all ${
              color === 'black' ? 'border-white scale-110' : 'border-white/30'
            } bg-black`}
          />
          <button
            onClick={() => setColor('white')}
            className={`w-8 h-8 border-2 transition-all ${
              color === 'white' ? 'border-black scale-110' : 'border-white/30'
            } bg-white`}
          />
        </div>

        {/* Size selector */}
        <div className="flex gap-2 flex-wrap justify-center">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`w-10 h-10 font-mono text-xs border transition-all ${
                size === s
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/60'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductViewer3D;
