import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 大气层着色器 - 只在边缘有细微的蓝色光晕
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // 菲涅尔效应：只在球体边缘有发光
  vec3 viewDirection = normalize(-vPosition);
  float fresnel = dot(viewDirection, vNormal);
  
  // 只有边缘极窄区域才有光（fresnel < 0.3 表示接近边缘）
  float edgeGlow = 1.0 - smoothstep(0.0, 0.4, fresnel);
  edgeGlow = pow(edgeGlow, 3.0);

  // 淡蓝色大气，非常低的透明度
  vec3 color = vec3(0.3, 0.6, 1.0);
  float alpha = edgeGlow * 0.25;

  gl_FragColor = vec4(color, alpha);
}
`;

export default function Atmosphere() {
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const atmosphereMaterial = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    // 无需更新 uniform，静态大气层
  });

  return (
    <group>
      {/* 大气边缘光 */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.04, 64, 64]} />
        <shaderMaterial
          ref={atmosphereMaterial}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={{}}
          transparent
          side={THREE.BackSide}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
