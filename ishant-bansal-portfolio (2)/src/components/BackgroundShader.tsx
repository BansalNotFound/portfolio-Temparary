import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const fragmentShader = `
uniform float uTime;
uniform vec2 uResolution;
uniform float uScroll;
uniform vec2 uMouse;

varying vec2 vUv;

// Simplex noise implementation snippet
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Classic halftone pattern
float halftone(vec2 st, vec2 m) {
    // Add some dynamic rotation based on time and mouse
    float rotation = 0.785 + sin(uTime * 0.2) * 0.1;
    float size = 180.0 + m.x * 50.0;
    
    // Rotation matrix
    float s = sin(rotation);
    float c = cos(rotation);
    vec2 rotatedSt = vec2(st.x * c - st.y * s, st.x * s + st.y * c);
    
    // Scale for dot size
    rotatedSt *= size;
    return (sin(rotatedSt.x) * sin(rotatedSt.y));
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    vec2 m = uMouse / uResolution.xy;
    st.x *= uResolution.x / uResolution.y;
    m.x *= uResolution.x / uResolution.y;

    float distToMouse = distance(st, m);
    
    // Abstract fluid noise mask to reveal/hide dots
    float noise1 = snoise(st * 1.5 + uTime * 0.1 + uScroll * 1.0);
    float noise2 = snoise(st * 3.0 - uTime * 0.05 + noise1 * 0.5 - uScroll * 1.5);
    
    float mouseEffect = smoothstep(0.4, 0.0, distToMouse) * 0.5;
    float finalNoise = snoise(st * 2.0 + noise2 + mouseEffect);
    
    // Create halftone dots
    float dots = halftone(st, m);
    
    // Use noise to threshold the dots -> organic comic shading
    // Where noise is low, dots are thin/disappear. Where noise is high, dots are thick/solid.
    float c = step(finalNoise * 0.5 + 0.5, dots * 0.5 + 0.5);

    // Color palette: Paper White, Ink Black, Blood Red
    vec3 paperCol = vec3(0.98, 0.98, 0.98);
    vec3 inkCol = vec3(0.05, 0.05, 0.05);
    vec3 redCol = vec3(0.9, 0.0, 0.04);
    
    // Mix based on dots
    vec3 color = mix(paperCol, inkCol, c);

    // Splash of red around cursor
    if (distToMouse < 0.25) {
      float redDots = step(0.6, dots * 0.5 + 0.5);
      float redAura = smoothstep(0.25, 0.0, distToMouse);
      color = mix(color, redCol, redDots * redAura);
    }

    // Comic grain
    float grain = snoise(st * 500.0 + uTime) * 0.05;

    gl_FragColor = vec4(color - grain, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    // Bypassing the projection matrix to make a fullscreen quad from a 2x2 plane
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export function BackgroundShader({ scrollYProgress }: { scrollYProgress: { current: number } }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Invert Y for WebGL
      targetMouse.current.x = e.clientX;
      targetMouse.current.y = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      timeRef.current += delta;
      materialRef.current.uniforms.uTime.value = timeRef.current;
      // Map scroll progress to the shader
      materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScroll.value,
        scrollYProgress.current,
        0.05 // Smoothing
      );
      
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x,
        targetMouse.current.x,
        0.05
      );
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y,
        targetMouse.current.y,
        0.05
      );

      materialRef.current.uniforms.uResolution.value.set(
        state.size.width,
        state.size.height
      );
    }
  });

  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
