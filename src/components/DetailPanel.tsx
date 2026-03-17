import { useState, useEffect } from 'react';
import { useGlobeStore } from '../store/globeStore';

export default function DetailPanel() {
  const { detailPanel, closeDetailPanel, navigateAnimal } = useGlobeStore();
  const [imageLoaded, setImageLoaded] = useState(false);

  const { animal, country, countryEn, allAnimals, currentIndex } = detailPanel;

  useEffect(() => {
    setImageLoaded(false);
  }, [animal]);

  if (!animal) return null;

  const hasMultiple = allAnimals.length > 1;

  return (
    <div
      className="detail-panel"
      style={{
        position: 'fixed',
        right: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '380px',
        maxHeight: '80vh',
        borderRadius: '16px',
        background: 'rgba(11, 20, 38, 0.98)',
        border: '1px solid rgba(255, 184, 0, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 184, 0, 0.1)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        animation: 'slideInRight 0.4s ease',
        zIndex: 1000,
      }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={closeDetailPanel}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(0, 0, 0, 0.3)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 184, 0, 0.2)';
          e.currentTarget.style.borderColor = '#FFB800';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* 动物图片 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        background: 'linear-gradient(135deg, #0B1426 0%, #1a2a3e 100%)',
      }}>
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 184, 0, 0.2)',
              borderTopColor: '#FFB800',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        )}
        <img
          src={animal.image_url}
          alt={animal.animal_cn}
          onLoad={() => setImageLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220"><rect fill="%230B1426" width="400" height="220"/><text fill="%23FFB800" x="200" y="115" text-anchor="middle" font-size="60">🐾</text></svg>';
            setImageLoaded(true);
          }}
        />

        {/* 图片覆盖层 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(11, 20, 38, 1) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* 分类标签 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          fontSize: '12px',
          color: '#00D4FF',
          fontWeight: 500,
        }}>
          {animal.category}
        </div>

        {/* 保护状态标签 */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '60px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: getConservationColor(animal.conservation_status),
          fontSize: '12px',
          color: '#fff',
          fontWeight: 500,
        }}>
          {animal.conservation_status}
        </div>

        {/* 国家象征标签 */}
        {animal.is_national_animal && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFB800 0%, #CC9300 100%)',
            fontSize: '12px',
            color: '#000',
            fontWeight: 600,
          }}>
            🏆 国家象征
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div style={{
        padding: '20px',
        maxHeight: 'calc(80vh - 240px)',
        overflowY: 'auto',
      }}>
        {/* 国家信息 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 184, 0, 0.1)',
        }}>
          <span style={{ fontSize: '16px' }}>🌍</span>
          <div>
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '13px',
              color: '#FFB800',
              fontWeight: 600,
            }}>
              {country}
            </span>
            <span style={{
              marginLeft: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              {countryEn}
            </span>
          </div>
        </div>

        {/* 动物名称 */}
        <h2 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '28px',
          fontWeight: 700,
          color: '#fff',
          marginBottom: '4px',
          textShadow: '0 0 20px rgba(255, 184, 0, 0.3)',
        }}>
          {animal.animal_cn}
        </h2>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontStyle: 'italic',
          marginBottom: '4px',
        }}>
          {animal.animal_en}
        </p>

        <p style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '16px',
        }}>
          {animal.scientific_name}
        </p>

        {/* 描述 */}
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          marginBottom: '16px',
        }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.8)',
          }}>
            {animal.significance}
          </p>
        </div>

        {/* 趣味知识 */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 184, 0, 0.1) 100%)',
          border: '1px solid rgba(255, 184, 0, 0.2)',
          marginBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '12px',
              color: '#FFB800',
              fontWeight: 600,
            }}>
              趣味知识
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
            {animal.fun_fact}
          </p>
        </div>

        {/* 多动物导航 */}
        {hasMultiple && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button
              onClick={() => navigateAnimal('prev')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                background: 'transparent',
                color: '#FFB800',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 184, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              上一个
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {allAnimals.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: index === currentIndex
                      ? '#FFB800'
                      : 'rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => navigateAnimal('next')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                background: 'transparent',
                color: '#FFB800',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 184, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              下一个
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 根据保护状态获取颜色
function getConservationColor(status: string): string {
  const statusColors: Record<string, string> = {
    '极危': 'rgba(220, 38, 38, 0.9)',
    '濒危': 'rgba(249, 115, 22, 0.9)',
    '易危': 'rgba(234, 179, 8, 0.9)',
    '近危': 'rgba(34, 197, 94, 0.9)',
    '无危': 'rgba(59, 130, 246, 0.9)',
  };
  return statusColors[status] || 'rgba(107, 114, 128, 0.9)';
}
