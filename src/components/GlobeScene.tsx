import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import Globe from './Globe';
import AnimalMarkers from './AnimalMarkers';
import { useGlobeStore } from '../store/globeStore';
import { MarkerData } from '../types/data';

interface GlobeSceneProps {
  markerData: MarkerData[];
}

export default function GlobeScene({ markerData }: GlobeSceneProps) {
  const globeRef = useRef<THREE.Group>(null);
  const { isGlobeRotating, isUserInteracting } = useGlobeStore();
  
  // 地球自转
  useFrame((_, delta) => {
    if (globeRef.current && isGlobeRotating && !isUserInteracting) {
      globeRef.current.rotation.y += delta * 0.05; // 缓慢自转
    }
  });
  
  return (
    <group ref={globeRef}>
      {/* 地球本体 */}
      <Globe markerData={markerData} />
      
      {/* 动物标记 */}
      <AnimalMarkers markerData={markerData} />
    </group>
  );
}
