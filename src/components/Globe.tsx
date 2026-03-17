import { useRef, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useGlobeStore } from '../store/globeStore';
import { MarkerData } from '../types/data';
import { latLngToVector3 } from '../utils/coordinates';

// NASA Blue Marble 纹理 URL
const EARTH_TEXTURE_URL = 'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg';

interface GlobeProps {
  markerData: MarkerData[];
}

// 内部 Globe 组件 - 使用 useTexture
function GlobeInner({ markerData }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl, raycaster, pointer } = useThree();
  const {
    hoveredMarkerId,
    setHoveredMarker,
    setSelectedMarker,
    openDetailPanel,
  } = useGlobeStore();

  const prevHoveredId = useRef<string | null>(null);

  // 使用 useTexture hook 加载纹理 - 这是正确的方式
  const earthTexture = useTexture(EARTH_TEXTURE_URL);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.minFilter = THREE.LinearMipmapLinearFilter;
  earthTexture.magFilter = THREE.LinearFilter;
  earthTexture.anisotropy = 16;

  // 射线检测 - 检测鼠标位置是否靠近某个动物标记点
  useFrame(() => {
    if (!meshRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      // 将交点从世界坐标转换到 group 局部坐标，消除地球旋转的影响
      const worldPoint = intersects[0].point.clone();
      const parent = meshRef.current.parent;
      const localPoint = parent
        ? worldPoint.applyMatrix4(parent.matrixWorld.clone().invert())
        : worldPoint;

      // 查找最近的动物标记
      let nearestMarker: MarkerData | null = null;
      let minDistance = Infinity;
      const HOVER_THRESHOLD = 0.05;

      for (const marker of markerData) {
        const markerPos = latLngToVector3(marker.lat, marker.lng, 1);
        const distance = localPoint.distanceTo(markerPos);
        if (distance < minDistance && distance < HOVER_THRESHOLD) {
          minDistance = distance;
          nearestMarker = marker;
        }
      }

      if (nearestMarker) {
        if (prevHoveredId.current !== nearestMarker.id) {
          setHoveredMarker(nearestMarker.id);
          prevHoveredId.current = nearestMarker.id;
          gl.domElement.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMarkerId) {
          setHoveredMarker(null);
          prevHoveredId.current = null;
          gl.domElement.style.cursor = 'grab';
        }
      }
    } else {
      if (hoveredMarkerId) {
        setHoveredMarker(null);
        prevHoveredId.current = null;
        gl.domElement.style.cursor = 'grab';
      }
    }
  });

  // 点击处理
  useEffect(() => {
    const handleClick = () => {
      if (hoveredMarkerId) {
        const marker = markerData.find(m => m.id === hoveredMarkerId);
        if (marker && marker.animals.length > 0) {
          setSelectedMarker(hoveredMarkerId);
          openDetailPanel(
            marker.animals[0],
            marker.country,
            marker.country_en,
            marker.animals,
            0
          );
        }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [gl, hoveredMarkerId, markerData, setSelectedMarker, openDetailPanel]);

  // 自动旋转由 GlobeScene 的父 group 统一控制，此处不再单独旋转

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        metalness={0.05}
        roughness={0.6}
      />
    </mesh>
  );
}

// 备用：程序生成的纹理（用于加载失败时）
function createFallbackTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 海洋渐变背景
  const oceanGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  oceanGradient.addColorStop(0, '#1a4a8a');
  oceanGradient.addColorStop(0.5, '#0d3a6a');
  oceanGradient.addColorStop(1, '#1a4a8a');
  ctx.fillStyle = oceanGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制简化的大陆
  const continents = [
    { path: [[0.08, 0.20], [0.12, 0.15], [0.20, 0.18], [0.28, 0.22], [0.30, 0.30], [0.25, 0.40], [0.20, 0.48], [0.10, 0.45], [0.06, 0.30]], color: '#3d7a4a' },
    { path: [[0.22, 0.52], [0.30, 0.50], [0.35, 0.58], [0.32, 0.75], [0.25, 0.80], [0.20, 0.65]], color: '#4a8a4a' },
    { path: [[0.45, 0.22], [0.55, 0.20], [0.58, 0.30], [0.52, 0.35], [0.45, 0.32]], color: '#5a9a5a' },
    { path: [[0.42, 0.40], [0.52, 0.38], [0.58, 0.48], [0.55, 0.65], [0.45, 0.70], [0.40, 0.55]], color: '#6aaa5a' },
    { path: [[0.55, 0.15], [0.70, 0.12], [0.85, 0.18], [0.90, 0.35], [0.80, 0.42], [0.65, 0.40], [0.55, 0.30]], color: '#4a8a4a' },
    { path: [[0.78, 0.58], [0.88, 0.55], [0.92, 0.62], [0.88, 0.70], [0.80, 0.68]], color: '#7aba5a' },
  ];

  continents.forEach(continent => {
    ctx.fillStyle = continent.color;
    ctx.beginPath();
    ctx.moveTo(continent.path[0][0] * canvas.width, continent.path[0][1] * canvas.height);
    continent.path.slice(1).forEach(p => ctx.lineTo(p[0] * canvas.width, p[1] * canvas.height));
    ctx.closePath();
    ctx.fill();
  });

  // 极地冰盖
  ctx.fillStyle = 'rgba(220, 240, 255, 0.8)';
  ctx.fillRect(0, 0, canvas.width, 50);
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 备用 Globe 组件（无纹理）
function FallbackGlobe({ markerData }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl, raycaster, pointer } = useThree();
  const {
    hoveredMarkerId,
    setHoveredMarker,
    setSelectedMarker,
    openDetailPanel,
  } = useGlobeStore();

  const prevHoveredId = useRef<string | null>(null);
  const fallbackTexture = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    fallbackTexture.current = createFallbackTexture();
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const worldPoint = intersects[0].point.clone();
      const parent = meshRef.current.parent;
      const localPoint = parent
        ? worldPoint.applyMatrix4(parent.matrixWorld.clone().invert())
        : worldPoint;
      let nearestMarker: MarkerData | null = null;
      let minDistance = Infinity;
      const HOVER_THRESHOLD = 0.05;

      for (const marker of markerData) {
        const markerPos = latLngToVector3(marker.lat, marker.lng, 1);
        const distance = localPoint.distanceTo(markerPos);
        if (distance < minDistance && distance < HOVER_THRESHOLD) {
          minDistance = distance;
          nearestMarker = marker;
        }
      }

      if (nearestMarker) {
        if (prevHoveredId.current !== nearestMarker.id) {
          setHoveredMarker(nearestMarker.id);
          prevHoveredId.current = nearestMarker.id;
          gl.domElement.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMarkerId) {
          setHoveredMarker(null);
          prevHoveredId.current = null;
          gl.domElement.style.cursor = 'grab';
        }
      }
    } else {
      if (hoveredMarkerId) {
        setHoveredMarker(null);
        prevHoveredId.current = null;
        gl.domElement.style.cursor = 'grab';
      }
    }
  });

  useEffect(() => {
    const handleClick = () => {
      if (hoveredMarkerId) {
        const marker = markerData.find(m => m.id === hoveredMarkerId);
        if (marker && marker.animals.length > 0) {
          setSelectedMarker(hoveredMarkerId);
          openDetailPanel(
            marker.animals[0],
            marker.country,
            marker.country_en,
            marker.animals,
            0
          );
        }
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [gl, hoveredMarkerId, markerData, setSelectedMarker, openDetailPanel]);

  // 自动旋转由 GlobeScene 的父 group 统一控制，此处不再单独旋转

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={fallbackTexture.current}
        metalness={0.05}
        roughness={0.6}
      />
    </mesh>
  );
}

// 导出主组件 - 带 Suspense 包裹
export default function Globe({ markerData }: GlobeProps) {
  return (
    <Suspense fallback={<FallbackGlobe markerData={markerData} />}>
      <GlobeInner markerData={markerData} />
    </Suspense>
  );
}
