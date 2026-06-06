import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Center, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Core() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* Outer wireframe */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial color="#000" wireframe />
        </mesh>
        
        {/* Inner solid */}
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <MeshDistortMaterial
            color="#dc2626"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.8}
            roughness={0.2}
            distort={0.4}
            speed={3}
          />
        </mesh>
      </Float>

      {/* Floating particles */}
      <Sparkles count={100} scale={10} size={4} speed={0.4} opacity={0.5} color="#000" />
      <Sparkles count={50} scale={8} size={6} speed={0.6} opacity={0.8} color="#dc2626" />
    </group>
  );
}

export function About3DModel() {
  return (
    <div className="w-full h-[400px] md:h-[600px] relative about-line">
       {/* Frame decorations */}
       <div className="absolute inset-0 border-4 border-black bg-white shadow-[8px_8px_0_#dc2626] z-0 overflow-hidden pointer-events-none">
          {/* Halftone / Burst Background */}
          <div className="absolute inset-0 bg-red-600 mix-blend-multiply opacity-10"></div>
          <div className="absolute inset-0 z-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] mix-blend-overlay opacity-50"></div>
       </div>

       {/* Floating UI Elements */}
       <div className="absolute top-4 left-4 border-[3px] border-black bg-black text-white px-3 py-1 text-sm font-impact tracking-widest uppercase z-20 shadow-[4px_4px_0_#dc2626]">
          OBJ: CORE_01
       </div>
       <div className="absolute bottom-4 right-4 border-[3px] border-black bg-white text-black px-3 py-1 font-manga text-xl z-20 shadow-[4px_4px_0_#000] -rotate-3">
          超立体
       </div>

       {/* Crosshair accents */}
       <div className="absolute top-1/2 left-0 w-4 h-[2px] bg-black z-20"></div>
       <div className="absolute top-1/2 right-0 w-4 h-[2px] bg-black z-20"></div>
       <div className="absolute top-0 left-1/2 w-[2px] h-4 bg-black z-20"></div>
       <div className="absolute bottom-0 left-1/2 w-[2px] h-4 bg-black z-20"></div>

       <div className="absolute inset-0 z-10 cursor-crosshair">
         <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#ff0000" />
            
            <Center>
              <Core />
            </Center>

            <OrbitControls 
              enableZoom={false} 
              autoRotate 
              autoRotateSpeed={1.5}
              maxPolarAngle={Math.PI / 2 + 0.3}
              minPolarAngle={Math.PI / 2 - 0.3}
            />
         </Canvas>
       </div>
    </div>
  );
}
