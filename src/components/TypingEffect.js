import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, isComplete, onComplete]);

  return (
    <div className="relative">
      <p className="text-sm" style={{ 
        fontFamily: 'Inter', 
        fontWeight: 400, 
        lineHeight: '1.5', 
        color: '#d5d7da',
        minHeight: '3rem'
      }}>
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-blue-400 ml-1 animate-pulse"></span>
        )}
      </p>
    </div>
  );
};

export default TypingEffect;