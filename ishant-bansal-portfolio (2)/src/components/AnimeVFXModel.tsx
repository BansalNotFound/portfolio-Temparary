import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Anime VFX Effect Model ───────────────────────────────────────
// This component is designed to be placed INSIDE an existing Canvas
// (e.g., the HeroGokuScene Canvas). It does NOT create its own Canvas.

export function AnimeVFXModel({
  position = [0.8, 0.5, 0.5] as [number, number, number],
  scale = 0.5,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/anime_vfx.glb');

  // Clone the scene to avoid mutating the cached original
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Make materials semi-transparent and emissive
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat) => {
          if (mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const stdMat = mat as THREE.MeshStandardMaterial;
            stdMat.transparent = true;
            stdMat.opacity = 0.6;
            stdMat.emissive = new THREE.Color('#ff4500'); // Red-orange glow
            stdMat.emissiveIntensity = 0.8;
            stdMat.side = THREE.DoubleSide;
            stdMat.depthWrite = false;
            stdMat.needsUpdate = true;
          } else if (mat) {
            // For non-standard materials, clone as basic
            const basicMat = mat as THREE.MeshBasicMaterial;
            basicMat.transparent = true;
            basicMat.opacity = 0.6;
            basicMat.side = THREE.DoubleSide;
            basicMat.depthWrite = false;
            basicMat.needsUpdate = true;
          }
        });
      }
    });
  }, [clonedScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth slow rotation to revolve cleanly around Goku
    groupRef.current.rotation.y -= delta * 0.8;
    // Removed the wobbly x and z rotation to keep the aura stable

    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the VFX model
useGLTF.preload('/models/anime_vfx.glb');
