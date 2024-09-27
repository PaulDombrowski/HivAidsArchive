import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Slideshow from './Slideshow';

const Page1 = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filterStyle, setFilterStyle] = useState('none');
  const [cursorSize, setCursorSize] = useState(40);
  const [backgroundScaleY, setBackgroundScaleY] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const relativeY = (clientY / windowHeight - 0.5) * 2;

      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const distanceFromCenter = Math.sqrt(
        (clientX - centerX) ** 2 + (clientY - centerY) ** 2
      );

      const maxSize = 60;
      const minSize = 20;
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const size = maxSize - (distanceFromCenter / maxDistance) * (maxSize - minSize);
      setCursorSize(size);

      const maxEffectDistance = 400;
      const effectStrength = Math.max(
        0,
        (maxEffectDistance - distanceFromCenter) / maxEffectDistance
      );

      const lightStrengthX = (clientX / windowWidth - 0.5) * 100;
      const lightStrengthY = (clientY / windowHeight - 0.5) * 100;

      setFilterStyle(
        `drop-shadow(${lightStrengthX}px ${lightStrengthY}px 20px rgba(255, 255, 255, 0.3)) blur(${
          effectStrength * 1.5
        }px) brightness(${1 + effectStrength * 0.2}) contrast(${1 + effectStrength * 0.3})`
      );

      const newScaleY = 1 + Math.abs(relativeY * 0.1);
      setBackgroundScaleY(newScaleY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div style={styles.pageContainer}>
      <div
        style={{
          ...styles.gradientAroundCursor,
          top: `${cursorPosition.y - 100}px`,
          left: `${cursorPosition.x - 100}px`,
        }}
      />

      <div
        className="backgroundImage"
        style={{
          ...styles.backgroundImage,
          filter: filterStyle,
          transform: `scaleY(${backgroundScaleY})`,
        }}
      />

      <div
        style={{
          ...styles.customCursor,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
        }}
      />

      <Canvas
        camera={{ position: [-1, 0, 7], fov: 20 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 5}}
      >
        <Slideshow />
      </Canvas>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100vh',
    width: '100%',
    padding: '50px',
    perspective: '1000px',
    overflow: 'hidden',
    cursor: 'none',
    position: 'relative',
    background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
  },
  gradientAroundCursor: {
    position: 'fixed',
    width: '1000px',
    height: '1000px',
    borderRadius: '20%',
    background: 'radial-gradient(circle, rgba(106, 13, 173, 0.9) 0%, rgba(106, 13, 173, 0) 80%)',
    mixBlendMode: 'color-dodge',
    pointerEvents: 'none',
    zIndex: 2,
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
    filter: 'blur(400px)',
  },
  backgroundImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: "url('background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    opacity: 0.5,
    pointerEvents: 'none',
    transition: 'transform 0.3s ease-out, filter 0.2s ease-out, opacity 0.2s ease-out',
    willChange: 'transform, filter, opacity',
  },
  customCursor: {
    position: 'fixed',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(128,0,0,0.5) 100%)',
    boxShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  },
};

export default Page1;
