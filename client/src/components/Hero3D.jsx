import { useMemo } from 'react';

export default function Hero3D() {
  // Generate particles with random positions and delays
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${4 + Math.random() * 6}s`,
      size: `${2 + Math.random() * 3}px`,
      opacity: 0.3 + Math.random() * 0.5
    }));
  }, []);

  // Generate floating monitor nodes
  const nodes = useMemo(() => {
    const positions = [
      { top: '20%', left: '15%', color: '#10b981' },
      { top: '35%', left: '80%', color: '#06b6d4' },
      { top: '60%', left: '10%', color: '#7c3aed' },
      { top: '25%', left: '65%', color: '#10b981' },
      { top: '50%', left: '85%', color: '#f59e0b' },
      { top: '70%', left: '30%', color: '#06b6d4' },
      { top: '15%', left: '45%', color: '#10b981' },
      { top: '55%', left: '55%', color: '#7c3aed' },
    ];
    return positions.map((pos, i) => ({
      ...pos,
      id: i,
      delay: `${i * 0.8}s`,
      animDuration: `${5 + Math.random() * 3}s`
    }));
  }, []);

  return (
    <div className="hero-3d-container">
      {/* Perspective Grid Floor */}
      <div className="grid-floor"></div>

      {/* Scan Line */}
      <div className="scan-line"></div>

      {/* 3D Rotating Globe */}
      <div className="globe-wrapper">
        <div className="globe">
          <div className="globe-ring"></div>
          <div className="globe-ring"></div>
          <div className="globe-ring"></div>
          <div className="globe-ring"></div>
          <div className="globe-ring"></div>
          <div className="globe-ring"></div>
        </div>
        <div className="globe-core"></div>
      </div>

      {/* Floating Monitor Nodes */}
      {nodes.map(node => (
        <div
          key={node.id}
          className="monitor-node"
          style={{
            top: node.top,
            left: node.left,
            background: node.color,
            color: node.color,
            animationDelay: node.delay,
            animationDuration: node.animDuration,
            boxShadow: `0 0 12px ${node.color}60`
          }}
        />
      ))}

      {/* Floating Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '0',
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, #030014 70%)'
        }}
      />
    </div>
  );
}
