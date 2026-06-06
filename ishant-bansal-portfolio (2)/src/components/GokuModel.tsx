import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';
import { AnimeVFXModel } from './AnimeVFXModel';

// ─── Mouse tracker (normalized -1 to 1) ───────────────────────────
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}

// ─── Inner Goku Model ──────────────────────────────────────────────
function GokuModel({ mouse }: { mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/nimbus/scene.gltf');

  // Clone the scene so we don't mutate the cached original
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  // Enhance materials for dramatic look
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.max(mat.roughness * 0.8, 0.2);
          mat.metalness = Math.min(mat.metalness + 0.1, 1);
          mat.envMapIntensity = 1.5;
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Noticeable random wandering movement
    groupRef.current.position.x = Math.sin(t * 0.7) * 0.5 + Math.cos(t * 0.4) * 0.3;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.4;

    // Slow auto-rotation
    groupRef.current.rotation.y += delta * 0.3;

    // Mouse-follow parallax (smooth lerp)
    const targetRotX = mouse.y * 0.15;
    const targetRotZ = mouse.x * -0.08;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotZ,
      0.05
    );
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <group ref={groupRef} scale={1.7}>
        <Center position={[0, -0.2, 0]}>
          <primitive object={clonedScene} />
        </Center>
      </group>
    </Float>
  );
}

// ─── Energy Aura Sparkles ──────────────────────────────────────────
function EnergyAura() {
  return (
    <>
      {/* Red energy particles */}
      <Sparkles count={50} scale={12} size={8} speed={0.2} opacity={1} color="#000000" />
      <Sparkles count={20} scale={10} size={15} speed={0.5} opacity={1} color="#ffffff" />
      <Sparkles count={10} scale={8} size={20} speed={0.8} opacity={1} color="#dc2626" />
    </>
  );
}

// ─── Loading Fallback ──────────────────────────────────────────────
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshBasicMaterial color="#dc2626" wireframe />
    </mesh>
  );
}

// ─── Full Scene Export (with Canvas) ───────────────────────────────
export function GokuModelCanvas() {
  const mouse = useMousePosition();

  return (
    <div className="absolute inset-0 z-20 pointer-events-none" id="goku-3d-container">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        {/* Lighting — dramatic anime two-tone */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 4]}
          intensity={2.5}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-4, -3, -2]}
          intensity={1.8}
          color="#dc2626"
        />
        <pointLight position={[0, 3, 3]} intensity={1} color="#ff6b35" />

        <Suspense fallback={<LoadingFallback />}>
          <GokuModel mouse={mouse} />
          <AnimeVFXModel position={[0, -2, -18]} scale={15} />
          <EnergyAura />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/nimbus/scene.gltf');
