import { useGlobeStore } from '../store/globeStore';

export default function LoadingScreen() {
  const { loadingProgress } = useGlobeStore();
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #000000 0%, #0B1426 50%, #000000 100%)',
      zIndex: 9999,
      animation: 'fadeIn 0.5s ease',
    }}>
      {/* Logo 动画 */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '40px',
      }}>
        {/* 外圈旋转 */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#FFB800',
          animation: 'spin 1.5s linear infinite',
        }} />
        
        {/* 中圈反向旋转 */}
        <div style={{
          position: 'absolute',
          inset: '15px',
          borderRadius: '50%',
          border: '2px solid transparent',
          borderBottomColor: '#00D4FF',
          animation: 'spin 1s linear infinite reverse',
        }} />
        
        {/* 内圈 */}
        <div style={{
          position: 'absolute',
          inset: '30px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFB800 0%, #CC9300 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(255, 184, 0, 0.5)',
        }}>
          <span style={{ fontSize: '32px' }}>🌍</span>
        </div>
      </div>
      
      {/* 标题 */}
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '28px',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '4px',
        marginBottom: '8px',
        textShadow: '0 0 20px rgba(255, 184, 0, 0.5)',
      }}>
        世界动物地球仪
      </h1>
      
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: '2px',
        marginBottom: '40px',
      }}>
        WORLD ANIMALS GLOBE
      </p>
      
      {/* 进度条 */}
      <div style={{
        width: '300px',
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        marginBottom: '16px',
      }}>
        <div style={{
          width: `${loadingProgress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FFB800 0%, #00D4FF 100%)',
          borderRadius: '2px',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(255, 184, 0, 0.5)',
        }} />
      </div>
      
      {/* 进度文字 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '14px',
          color: '#FFB800',
        }}>
          {Math.round(loadingProgress)}%
        </span>
        <span style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}>
          加载中...
        </span>
      </div>
      
      {/* 统计数据预览 */}
      <div style={{
        marginTop: '40px',
        display: 'flex',
        gap: '40px',
      }}>
        <StatPreview number={168} label="个国家" delay={0} />
        <StatPreview number={427} label="种动物" delay={200} />
      </div>
    </div>
  );
}

// 统计数字预览
function StatPreview({ number, label, delay }: { number: number; label: string; delay: number }) {
  return (
    <div style={{
      textAlign: 'center',
      animation: `fadeInUp 0.5s ease ${delay}ms both`,
    }}>
      <div style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '32px',
        fontWeight: 700,
        color: '#FFB800',
        textShadow: '0 0 20px rgba(255, 184, 0, 0.3)',
      }}>
        {number}
      </div>
      <div style={{
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: '4px',
      }}>
        {label}
      </div>
    </div>
  );
}
