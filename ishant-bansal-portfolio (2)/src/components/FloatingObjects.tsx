import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Line } from '@react-three/drei';

export function FloatingObjects({ scrollYProgress }: { scrollYProgress: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        scrollYProgress.current * Math.PI * 0.5,
        0.05
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        0,
        scrollYProgress.current * 10,
        0.1
      );
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 40; i++) {
      pts.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10 - 5
      ));
    }
    return pts;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Node connections */}
      {points.map((p1, i) => 
        points.slice(i + 1, i + 3).map((p2, j) => (
          <Line
            key={`line-${i}-${j}`}
            points={[p1, p2]}
            color="#000000"
            lineWidth={0.5}
            transparent
            opacity={0.15}
          />
        ))
      )}

      {/* Nodes */}
      {points.map((p, i) => (
        <Float key={`node-${i}`} speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={p}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={i % 4 === 0 ? "#cc0000" : "#000000"} opacity={0.5} transparent />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

