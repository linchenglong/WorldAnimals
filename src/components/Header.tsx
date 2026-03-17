import { useState } from 'react';

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header className="header" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'auto',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFB800 0%, #CC9300 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(255, 184, 0, 0.4)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="2"/>
            <path d="M12 2C6.5 2 2 6.5 2 12" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 2C17.5 2 22 6.5 22 12" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 12H22" stroke="#000" strokeWidth="2"/>
            <path d="M12 2V22" stroke="#000" strokeWidth="2"/>
          </svg>
        </div>

        <div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '2px',
            textShadow: '0 0 20px rgba(255, 184, 0, 0.5)',
            margin: 0,
          }}>
            世界动物地球仪
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            letterSpacing: '1px',
            margin: 0,
          }}>
            WORLD ANIMALS GLOBE
          </p>
        </div>
      </div>

      {/* 右侧信息 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        pointerEvents: 'auto',
      }}>
        {/* 统计信息 */}
        <div style={{
          display: 'flex',
          gap: '24px',
        }}>
          <StatItem label="国家" value="168" />
          <StatItem label="动物" value="427" />
        </div>

        {/* 帮助按钮 */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 184, 0, 0.3)',
            background: 'rgba(11, 20, 38, 0.8)',
            color: '#FFB800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 184, 0, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 184, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(11, 20, 38, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(255, 184, 0, 0.3)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>
      </div>

      {/* 帮助信息面板 */}
      {showInfo && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '40px',
          padding: '20px',
          borderRadius: '12px',
          background: 'rgba(11, 20, 38, 0.95)',
          border: '1px solid rgba(255, 184, 0, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          maxWidth: '320px',
          animation: 'fadeInDown 0.3s ease',
        }}>
          <h3 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '14px',
            color: '#FFB800',
            marginBottom: '12px',
          }}>
            使用说明
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.8',
          }}>
            <li>🖱️ 拖动旋转地球仪</li>
            <li>🔍 滚轮缩放视角</li>
            <li>✨ 悬停标记查看预览</li>
            <li>👆 点击标记查看详情</li>
          </ul>
        </div>
      )}
    </header>
  );
}

// 统计项组件
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '24px',
        fontWeight: 700,
        color: '#FFB800',
        textShadow: '0 0 10px rgba(255, 184, 0, 0.3)',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.5)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        {label}
      </div>
    </div>
  );
}
