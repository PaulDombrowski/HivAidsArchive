import React, { useState, useEffect } from 'react';

function GradientBackground() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (event.type === 'mousemove') {
        setMousePos({ x: event.clientX, y: event.clientY });
      }
    };

    const handleTouchMove = (event) => {
      if (event.touches && event.touches.length > 0) {
        setMousePos({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const gradientStyle = {
    background: `radial-gradient(
      circle at ${mousePos.x}px ${mousePos.y}px,
      rgba(255, 20, 147, 0.8),
      rgba(255, 105, 180, 0.6) 20%,  /* Kleinere pinke Fläche */
      rgba(211, 211, 211, 0.4) 40%,
      rgba(169, 169, 169, 0.2) 60%
    )`,
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    transition: 'background 0.1s ease',
  };

  return <div style={gradientStyle} />;
}

export default GradientBackground;
