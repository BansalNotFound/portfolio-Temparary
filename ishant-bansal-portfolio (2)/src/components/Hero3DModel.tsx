import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function MangaObject() {
  const groupRef = useRef<THREE.Group>(null);
  
  useGSAP(() => {
    if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
            y: Math.PI * 4,
            x: Math.PI,
            scrollTrigger: {
                trigger: '#hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
        
        gsap.to(groupRef.current.position, {
            y: -2,
            z: 2,
            scrollTrigger: {
                trigger: '#hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });
    }
  });

  return (
    <group ref={groupRef} scale={1.5}>
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            {/* Core faceted mesh with outline */}
            <mesh>
                <icosahedronGeometry args={[2.5, 0]} />
                <meshToonMaterial color="#ffffff" />
                {/* Thick Outline effect mimicking manga */}
                <mesh scale={1.08}>
                   <icosahedronGeometry args={[2.5, 0]} />
                   <meshBasicMaterial color="#000000" side={THREE.BackSide} />
                </mesh>
            </mesh>
            
            {/* Inner detail mesh */}
            <mesh scale={0.8}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshToonMaterial color="#dc2626" />
                <mesh scale={1.12}>
                   <octahedronGeometry args={[1.5, 0]} />
                   <meshBasicMaterial color="#000000" side={THREE.BackSide} />
                </mesh>
            </mesh>

            {/* Orbiting fragments */}
            {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={i} position={[Math.cos(i * Math.PI / 3) * 4, Math.sin(i * Math.PI / 3) * 4, Math.cos(i * 2) * 2]} rotation={[i, i*2, 0]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshBasicMaterial color="#000000" />
                </mesh>
            ))}
        </Float>
    </group>
  );
}

export function Hero3DModel() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safety fallback in case preloader is disabled in dev mode
    let fallbackTimer = setTimeout(() => {
      setIsLoading(false);
    }, 8000); 

    const startLoader = () => {
      clearTimeout(fallbackTimer);
      setTimeout(() => {
        setIsLoading(false);
      }, 3500); // 3.5 seconds loading overlay AFTER app fully starts
    };

    window.addEventListener('appStarted', startLoader);
    return () => {
      window.removeEventListener('appStarted', startLoader);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none" id="hero-3d-container">
        
        {/* Loader Overlay */}
        <div className={`absolute inset-0 z-30 bg-black flex items-center justify-center transition-opacity duration-1000 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border-4 border-white border-t-red-600 rounded-full animate-spin"></div>
                <div className="font-manga text-white text-xl tracking-widest mt-4">INITIALIZING CORE...</div>
            </div>
        </div>

        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
            
            <Center>
                <MangaObject />
            </Center>
            
            {/* High contrast Sparkles mimicking manga action dots */}
            <Sparkles count={50} scale={12} size={8} speed={0.2} opacity={1} color="#000000" />
            <Sparkles count={20} scale={10} size={15} speed={0.5} opacity={1} color="#ffffff" />
            <Sparkles count={10} scale={8} size={20} speed={0.8} opacity={1} color="#dc2626" />
        </Canvas>
    </div>
  );
}
