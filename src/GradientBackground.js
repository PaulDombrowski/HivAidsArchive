import React, { useState, useEffect } from 'react';

function GradientBackground() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({
        x: event.clientX || event.touches[0].clientX,
        y: event.clientY || event.touches[0].clientY
      });
    };

    const handleTouchMove = (event) => {
      setMousePos({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
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
      rgba(255, 20, 147, 0.8), /* Intensives Violett-Rot in der Mitte */
      rgba(255, 105, 180, 0.6) 40%, /* Sanftes Pink */
      rgba(211, 211, 211, 0.4) 70%, /* Helles Grau */
      rgba(169, 169, 169, 0.2) 100% /* Dunkleres Grau außen */
    )`,
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1, // Hintergrund hinter allen Elementen
    transition: 'background 0.1s ease',
  };

  return <div style={gradientStyle} />;
}

export default GradientBackground;
