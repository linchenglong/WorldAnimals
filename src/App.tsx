import { Suspense, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Preload } from '@react-three/drei';
import GlobeScene from './components/GlobeScene';
import LoadingScreen from './components/LoadingScreen';
import DetailPanel from './components/DetailPanel';
import HoverPreview from './components/HoverPreview';
import Header from './components/Header';
import { useGlobeStore } from './store/globeStore';
import { prepareMarkerData } from './types/data';
import rawData from '../animals.json';

function App() {
 const {
 isLoading,
 setLoading,
 setLoadingProgress,
 setUserInteracting,
 hoveredMarkerId,
 detailPanel,
 } = useGlobeStore();

  const [markerData] = useState(() => prepareMarkerData(rawData as any[]));

 // 模拟加载进度
 useEffect(() => {
 let progress = 0;
 const interval = setInterval(() => {
 progress += Math.random() * 15;
 setLoadingProgress(progress); // 更新进度
 if (progress >= 100) {
 progress = 100;
 setLoadingProgress(100);
 clearInterval(interval);
 setTimeout(() => setLoading(false), 300);
 }
 }, 100);

 return () => clearInterval(interval);
 }, [setLoading, setLoadingProgress]);

  // 处理用户交互状态
  const handlePointerDown = useCallback(() => {
    setUserInteracting(true);
  }, [setUserInteracting]);

  const handlePointerUp = useCallback(() => {
    setUserInteracting(false);
  }, [setUserInteracting]);

  return (
    <div className="app-container" style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'linear-gradient(180deg, #000000 0%, #0B1426 50%, #000000 100%)'
    }}>
      {/* Header */}
      <Header />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{ background: 'transparent' }}
      >
        {/* 背景星空 */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* 环境光 - 更亮 */}
        <ambientLight intensity={1.2} />

        {/* 主光源 - 更亮 */}
        <directionalLight
          position={[5, 3, 5]}
          intensity={3}
          color="#ffffff"
        />

        {/* 辅助光源 */}
        <directionalLight
          position={[-5, -3, 5]}
          intensity={1.5}
          color="#4488ff"
        />

        {/* 背光 */}
        <pointLight position={[0, 0, -5]} intensity={1} color="#FFB800" />

        {/* 场景内容 */}
        <Suspense fallback={null}>
          <GlobeScene markerData={markerData} />
        </Suspense>

        {/* 控制器 */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />

        {/* 预加载 */}
        <Preload all />
      </Canvas>

      {/* Hover预览 */}
      {hoveredMarkerId && !detailPanel.isOpen && (
        <HoverPreview markerId={hoveredMarkerId} markerData={markerData} />
      )}

      {/* 详情面板 */}
      {detailPanel.isOpen && detailPanel.animal && (
        <DetailPanel />
      )}

      {/* 加载屏幕 */}
      {isLoading && <LoadingScreen />}
    </div>
  );
}

export default App;
