import { useEffect, useState } from 'react';
import { MarkerData } from '../types/data';
import { useGlobeStore } from '../store/globeStore';

interface HoverPreviewProps {
  markerId: string;
  markerData: MarkerData[];
}

export default function HoverPreview({ markerId, markerData }: HoverPreviewProps) {
  const { setHoveredAnimalIndex, hoveredAnimalIndex } = useGlobeStore();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const marker = markerData.find(m => m.id === markerId);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  if (!marker) return null;
  
  const currentAnimal = marker.animals[hoveredAnimalIndex] || marker.animals[0];
  const hasMultipleAnimals = marker.animals.length > 1;
  
  return (
    <div
      className="hover-preview"
      style={{
        position: 'fixed',
        left: `${Math.min(position.x + 20, window.innerWidth - 320)}px`,
        top: `${Math.min(position.y - 20, window.innerHeight - 200)}px`,
        zIndex: 1000,
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(11, 20, 38, 0.95)',
        border: '1px solid rgba(255, 184, 0, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 184, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        minWidth: '280px',
        animation: 'fadeInUp 0.2s ease',
        pointerEvents: 'auto',
      }}
    >
      {/* 国家信息 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          background: 'linear-gradient(135deg, #FFB800 0%, #CC9300 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
        }}>
          🌍
        </div>
        <div>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFB800',
          }}>
            {marker.country}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            {marker.country_en}
          </div>
        </div>
      </div>
      
      {/* 动物图片 */}
      {currentAnimal.image_url && (
        <div style={{
          width: '100%',
          height: '120px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '12px',
          position: 'relative',
        }}>
          <img
            src={currentAnimal.image_url}
            alt={currentAnimal.animal_cn}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230B1426" width="100" height="100"/><text fill="%23FFB800" x="50" y="55" text-anchor="middle" font-size="40">🐾</text></svg>';
            }}
          />
          {/* 图片上的分类标签 */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.6)',
            fontSize: '10px',
            color: '#00D4FF',
          }}>
            {currentAnimal.category}
          </div>
        </div>
      )}
      
      {/* 动物名称 */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '16px',
          fontWeight: 600,
          color: '#fff',
          marginBottom: '2px',
        }}>
          {currentAnimal.animal_cn}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          fontStyle: 'italic',
        }}>
          {currentAnimal.animal_en}
        </div>
      </div>
      
      {/* 保护状态 */}
      <div style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        background: getConservationColor(currentAnimal.conservation_status),
        fontSize: '11px',
        color: '#fff',
        marginBottom: hasMultipleAnimals ? '12px' : '0',
      }}>
        {currentAnimal.conservation_status}
      </div>
      
      {/* 多动物切换 */}
      {hasMultipleAnimals && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            共 {marker.animals.length} 种动物
          </span>
          <div style={{
            display: 'flex',
            gap: '8px',
          }}>
            {marker.animals.map((_, index) => (
              <button
                key={index}
                onClick={() => setHoveredAnimalIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  background: index === hoveredAnimalIndex 
                    ? '#FFB800' 
                    : 'rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* 提示 */}
      <div style={{
        marginTop: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)',
        textAlign: 'center',
      }}>
        点击查看详细信息
      </div>
    </div>
  );
}

// 根据保护状态获取颜色
function getConservationColor(status: string): string {
  const statusColors: Record<string, string> = {
    '极危': 'rgba(220, 38, 38, 0.8)',
    '濒危': 'rgba(249, 115, 22, 0.8)',
    '易危': 'rgba(234, 179, 8, 0.8)',
    '近危': 'rgba(34, 197, 94, 0.8)',
    '无危': 'rgba(59, 130, 246, 0.8)',
  };
  return statusColors[status] || 'rgba(107, 114, 128, 0.8)';
}
