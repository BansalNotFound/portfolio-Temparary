import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function Model() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/son_goku.glb');
  
  // The animation tracks in this GLB are causing severe mesh stretching.
  // We MUST strip out .position and .scale tracks, keeping only .quaternion (rotations)
  const fixedAnimations = useMemo(() => {
    return animations.map(anim => {
      const newAnim = anim.clone();
      newAnim.tracks = newAnim.tracks.filter(track => track.name.includes('.quaternion'));
      return newAnim;
    });
  }, [animations]);

  // Pass 'scene' to useAnimations instead of 'group' so the AnimationMixer binds to the correct root!
  const { actions, names } = useAnimations(fixedAnimations, scene);

  useEffect(() => {
    if (names.length === 0) return;
    
    let currentAnimIndex = 0;
    let timeoutId: NodeJS.Timeout;
    
    const playNextAnimation = () => {
      const actionName = names[currentAnimIndex];
      const action = actions[actionName];
      
      if (action) {
        action.reset().fadeIn(0.5).play();
        
        timeoutId = setTimeout(() => {
          action.fadeOut(0.5);
          currentAnimIndex = (currentAnimIndex + 1) % names.length;
          playNextAnimation();
        }, 5000); // cycle every 5 seconds
      }
    };
    
    playNextAnimation();
    
    return () => {
      clearTimeout(timeoutId);
      names.forEach(name => {
        if (actions[name]) actions[name]?.stop();
      });
    };
  }, [actions, names]);

  useFrame((state) => {
    if (group.current) {
      // Gentle floating rotation only
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <Float
        speed={2} 
        rotationIntensity={0.2} 
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <primitive object={scene} scale={1.5} position={[0, -2, 0]} />
      </Float>
    </group>
  );
}

export function CenterGokuModel() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
      {/* Box container that restricts the model's maximum bounds, pushed down to avoid overlapping text */}
      <div className="w-[80vw] h-[60vh] max-w-[400px] max-h-[600px] overflow-hidden mt-[15vh] md:mt-[200px]">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Environment preset="city" />
          <Model />
        </Canvas>
      </div>
    </div>
  );
}
