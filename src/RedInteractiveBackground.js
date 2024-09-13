import React, { useState, useEffect } from 'react';

function RedInteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const mouseX = Math.max(0, Math.min(event.clientX, window.innerWidth));
      const mouseY = Math.max(0, Math.min(event.clientY, window.innerHeight));
      setMousePos({ x: mouseX, y: mouseY });
    };

    const handleTouchMove = (event) => {
      if (event.touches && event.touches.length > 0) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        setMousePos({ x: touchX, y: touchY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const scrollEffect = () => {
      setScrollOffset((prevOffset) => prevOffset + 1);
    };

    const intervalId = setInterval(scrollEffect, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      clearInterval(intervalId);
    };
  }, []);

  const backgroundImageStyle = {
    backgroundImage: `url('/_0X5f0CK.jpeg')`, 
    backgroundRepeat: 'repeat',
    backgroundSize: 'cover',
    backgroundPosition: `${scrollOffset}px ${scrollOffset}px`,
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: 1,
  };

  const dynamicBackgroundStyle = {
    background: `linear-gradient(45deg, hsl(0, 100%, 50%), hsl(0, 100%, 70%))`, // Rot
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  };

  const gucklockStyle = {
    background: `radial-gradient(
      circle at ${mousePos.x}px ${mousePos.y}px,
      rgba(255, 0, 0, 0) 100px,  
      rgba(255, 0, 0, 0.3) 150px, 
      rgba(255, 0, 0, 0.8) 250px, 
      rgba(255, 0, 0, 1) 400px   
    )`,
    boxShadow: `0px 0px 30px 10px rgba(255, 0, 0, 0.5)`, 
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'all 0.2s ease-out',
  };

  const titleStyle = {
    position: 'absolute',
    top: '20%',
    width: '100%',
    textAlign: 'center',
    zIndex: 3,
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
  };

  const subtitleStyle = {
    position: 'absolute',
    top: '30%',
    width: '100%',
    textAlign: 'center',
    zIndex: 3,
    color: 'white',
    fontSize: '24px',
  };

  return (
    <>
      <div style={dynamicBackgroundStyle} /> {/* Farbwechsel-Hintergrund */}
      <div style={backgroundImageStyle} /> {/* Scrollendes Hintergrundbild */}
      <div style={gucklockStyle} /> {/* Das Guckloch mit Glow-Effekt */}
      <div style={titleStyle}>DIGITAL TRACES</div> {/* Weißer Titel */}
      <div style={subtitleStyle}>curating an hiv archive (one attempt)</div> {/* Weißer Untertitel */}
    </>
  );
}

export default RedInteractiveBackground;
