import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGlobeStore } from '../store/globeStore';
import { MarkerData } from '../types/data';
import { latLngToVector3 } from '../utils/coordinates';

interface AnimalMarkersProps {
  markerData: MarkerData[];
}

// 标记着色器 - 自定义着色器实现发光效果
const markerVertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  attribute float aHovered;
  
  varying vec3 vColor;
  varying float vHovered;
  
  uniform float uTime;
  uniform float uHoverScale;
  
  void main() {
    vColor = aColor;
    vHovered = aHovered;
    
    vec3 pos = position;
    
    // 基础缩放 + 悬停缩放
    float scale = aScale;
    if (aHovered > 0.5) {
      scale *= uHoverScale;
      // 轻微浮动效果
      pos += normal * sin(uTime * 3.0) * 0.02;
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // 固定像素大小，不随距离缩放
    gl_PointSize = aHovered > 0.5 ? scale * 2.0 : scale;
  }
`;

const markerFragmentShader = `
  varying vec3 vColor;
  varying float vHovered;
  
  uniform float uTime;
  
  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    
    // 硬边圆形，超出半径直接丢弃
    if (dist > 0.5) discard;
    
    vec3 color = vColor;
    float alpha = 1.0;
    
    if (vHovered > 0.5) {
      // 悬停：白色边框 + 彩色圆心
      if (dist > 0.35) {
        color = vec3(1.0, 1.0, 1.0); // 白色边框
      } else {
        color = vColor * 1.3;
      }
    } else {
      // 正常：小实心圆点，中心稍亮
      color = mix(vColor * 1.4, vColor, dist * 2.0);
      // 非常轻微的边缘软化
      alpha = 1.0 - smoothstep(0.42, 0.5, dist);
    }
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function AnimalMarkers({ markerData }: AnimalMarkersProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const prevHoveredIndex = useRef<number>(-1);
  
  const {
    hoveredMarkerId,
  } = useGlobeStore();
  
  // 准备实例数据
  const { colors, scales, hoveredFlags } = useMemo(() => {
    const count = markerData.length;
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const hoveredFlags = new Float32Array(count);
    
    const color = new THREE.Color();
    
  markerData.forEach((_, i) => {
    // 设置颜色（琥珀金）
    color.setHSL(0.12 + Math.random() * 0.05, 0.8, 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // 设置缩放
    scales[i] = 5;
    hoveredFlags[i] = 0;
  });
    
    return { colors, scales, hoveredFlags };
  }, [markerData]);
  
  // 创建几何体并设置位置
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    
    // 设置位置
    const positions = new Float32Array(markerData.length * 3);
    markerData.forEach((marker, i) => {
      const position = latLngToVector3(marker.lat, marker.lng, 1.015);
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // 计算法线（用于浮动效果）
    const normals = new Float32Array(markerData.length * 3);
    markerData.forEach((marker, i) => {
      const position = latLngToVector3(marker.lat, marker.lng, 1.015);
      const normal = position.normalize();
      normals[i * 3] = normal.x;
      normals[i * 3 + 1] = normal.y;
      normals[i * 3 + 2] = normal.z;
    });
    geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    
    // 设置其他属性
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));
    geo.setAttribute('aHovered', new THREE.InstancedBufferAttribute(hoveredFlags, 1));
    
    return geo;
  }, [markerData, colors, scales, hoveredFlags]);
  
  // 更新悬停状态
  useEffect(() => {
    if (!meshRef.current) return;
    
    const hoveredAttr = meshRef.current.geometry.getAttribute('aHovered') as THREE.InstancedBufferAttribute;
    const scaleAttr = meshRef.current.geometry.getAttribute('aScale') as THREE.InstancedBufferAttribute;
    
    const hoveredIndex = hoveredMarkerId
      ? markerData.findIndex(m => m.id === hoveredMarkerId)
      : -1;
    
    // 更新所有标记的悬停状态
    for (let i = 0; i < markerData.length; i++) {
      hoveredAttr.array[i] = i === hoveredIndex ? 1 : 0;
      scaleAttr.array[i] = i === hoveredIndex ? 10 : 5;
    }
    
    hoveredAttr.needsUpdate = true;
    scaleAttr.needsUpdate = true;
    
    prevHoveredIndex.current = hoveredIndex;
  }, [hoveredMarkerId, markerData]);
  
  // 每帧只更新着色器时间，hover 检测统一由 Globe.tsx 负责
  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = performance.now() / 1000;
    }
  });
  
  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={markerVertexShader}
        fragmentShader={markerFragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uHoverScale: { value: 1.8 },
        }}
        transparent
        depthWrite={false}
        depthTest={true}
        blending={THREE.NormalBlending}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </points>
  );
}
