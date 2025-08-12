import React, { useEffect, useState } from 'react';

const CelebrationOverlay = ({ message, onComplete }) => {
  const [fireworks, setFireworks] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Create multiple fireworks
    const createFireworks = () => {
      const newFireworks = [];
      for (let i = 0; i < 8; i++) {
        newFireworks.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2,
          delay: Math.random() * 2000,
          color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][Math.floor(Math.random() * 6)]
        });
      }
      setFireworks(newFireworks);
    };

    createFireworks();

    // Auto-hide after 4 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible && fireworks.length === 0) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(2px)'
      }}
    >
      {/* Fireworks */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute"
          style={{
            left: firework.x,
            top: firework.y,
            animationDelay: `${firework.delay}ms`
          }}
        >
          {/* Main firework burst */}
          <div className="relative">
            {/* Center burst */}
            <div 
              className="w-4 h-4 rounded-full animate-ping"
              style={{ 
                backgroundColor: firework.color,
                animationDuration: '1s',
                animationDelay: `${firework.delay}ms`
              }}
            />
            
            {/* Sparks radiating outward */}
            {[...Array(12)].map((_, sparkIndex) => (
              <div
                key={sparkIndex}
                className="absolute w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: firework.color,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${sparkIndex * 30}deg) translateY(-${20 + Math.random() * 30}px)`,
                  animationDelay: `${firework.delay + 200}ms`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
            
            {/* Outer ring of smaller sparks */}
            {[...Array(8)].map((_, sparkIndex) => (
              <div
                key={`outer-${sparkIndex}`}
                className="absolute w-1 h-1 rounded-full animate-bounce"
                style={{
                  backgroundColor: firework.color,
                  top: '50%',
                  left: '50%',
                  opacity: 0.7,
                  transform: `translate(-50%, -50%) rotate(${sparkIndex * 45}deg) translateY(-${35 + Math.random() * 25}px)`,
                  animationDelay: `${firework.delay + 400}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Celebration Message */}
      <div className="relative z-10 text-center max-w-md mx-4">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-8 shadow-2xl animate-bounce">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">Congratulations!</h2>
          <p className="text-white text-lg leading-relaxed">{message}</p>
          <div className="mt-6 flex justify-center space-x-2">
            <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>🎊</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
            <span className="text-3xl animate-bounce" style={{ animationDelay: '400ms' }}>🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrationOverlay;