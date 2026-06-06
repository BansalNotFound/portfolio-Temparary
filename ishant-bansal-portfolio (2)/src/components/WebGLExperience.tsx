import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BackgroundShader } from "./BackgroundShader";
import { FloatingObjects } from "./FloatingObjects";
import { Preload, Environment } from "@react-three/drei";

export function WebGLExperience({ scrollProgress }: { scrollProgress: { current: number } }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Fullscreen shader background */}
        <BackgroundShader scrollYProgress={scrollProgress} />

        {/* 3D floating objects that react to scroll */}
        <FloatingObjects scrollYProgress={scrollProgress} />

        <Environment preset="city" />
        <Preload all />
      </Canvas>
    </div>
  );
}
