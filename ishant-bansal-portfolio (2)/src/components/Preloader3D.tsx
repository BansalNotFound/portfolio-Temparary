import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// A single floating glass shard
function GlassShard({ position, rotation, scale, isRed }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          transmission={1}
          opacity={1}
          metalness={0.1}
          roughness={0.05}
          ior={1.5}
          thickness={1.5}
          specularIntensity={1}
          clearcoat={1}
          color={isRed ? "#ff0000" : "#ffffff"}
        />
        {/* Manga style outline */}
        <mesh scale={1.05}>
           <icosahedronGeometry args={[1, 0]} />
           <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>
      </mesh>
    </Float>
  );
}

// Group of shards
function FloatingShards() {
  const shards = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 2
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      scale: Math.random() * 1.5 + 0.5,
      isRed: Math.random() > 0.8
    }));
  }, []);

  return (
    <>
      {shards.map((props, i) => <GlassShard key={i} {...props} />)}
    </>
  );
}

// Background Speed Lines / Sunburst
function MangaBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= delta * 0.1; // slow spin
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial color="#111111" />
      {/* We can use a wireframe sunburst by overlaying multiple planes or just keep it dark so the glass pops */}
      <mesh position={[0, 0, 0.1]}>
         <planeGeometry args={[60, 60, 32, 32]} />
         <meshBasicMaterial color="#dc2626" wireframe transparent opacity={0.15} />
      </mesh>
    </mesh>
  );
}

export function Preloader3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-80" id="preloader-3d">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={3} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={2} color="#dc2626" />
        
        {/* Environment map for realistic glass refraction */}
        <Environment preset="city" />
        
        <FloatingShards />
        <MangaBackground />
        
        <Sparkles count={150} scale={20} size={8} speed={0.5} color="#ffffff" opacity={0.5} />
        <Sparkles count={50} scale={20} size={15} speed={0.8} color="#dc2626" opacity={0.8} />
      </Canvas>
    </div>
  );
}
