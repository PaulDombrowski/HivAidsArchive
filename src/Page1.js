import React, { useRef, useEffect, useState } from 'react';
import LeftTextComponent from './LeftTextComponent';
import { Canvas } from '@react-three/fiber';
import Slideshow from './Slideshow';

const Page1 = () => {
  const rightTextRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filterStyle, setFilterStyle] = useState('none');
  const [cursorSize, setCursorSize] = useState(40);
  const [rightTransform, setRightTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundScaleY, setBackgroundScaleY] = useState(1);
  const [rightTextZIndex, setRightTextZIndex] = useState(-2); // State to control z-index
  const requestRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const relativeY = (clientY / windowHeight - 0.5) * 2; // Scale between -1 and 1 for vertical movement

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

      // Enhanced scaling effect: scaleY only increases as the mouse moves up or down
      const newScaleY = 1 + Math.abs(relativeY * 0.1); // Continuously increasing
      setBackgroundScaleY(newScaleY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseMoveOverRightText = (e) => {
    const updateRightTransform = () => {
      setRightTransform({
        x: e.clientX / 200,
        y: e.clientY / 200,
      });
    };
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(updateRightTransform);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setRightTextZIndex(5); // Bring to front on hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRightTextZIndex(-2); // Reset z-index when not hovered
  };

  return (
    <div style={styles.pageContainer}>
      {/* Lilaner, dynamisch angepasster Gradient um den Cursor */}
      <div
        style={{
          ...styles.gradientAroundCursor,
          top: `${cursorPosition.y - 100}px`,
          left: `${cursorPosition.x - 100}px`,
        }}
      />

      {/* Hintergrundbild mit dynamischen Licht- und Filtereffekten */}
      <div
        className="backgroundImage"
        style={{
          ...styles.backgroundImage,
          filter: filterStyle,
          transform: `scaleY(${backgroundScaleY})`, // Apply vertical scaling
        }}
      />

      {/* Benutzerdefinierter Cursor-Effekt */}
      <div
        style={{
          ...styles.customCursor,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
        }}
      />

      {/* Vertikaler Text auf der linken Seite */}
      <div style={styles.verticalTextContainer}>
        <p style={styles.verticalText}>HIV/AIDS LEGACY: ARCHIVING DIGITAL TRACES (Attempt #1)</p>
      </div>

      {/* Slideshow */}
      <div style={styles.slideshowOverlay}>
        <Canvas camera={{ position: [1, 0, 5], fov: 30 }} style={{ width: '100%', height: '100%' }}>
          <Slideshow />
        </Canvas>
      </div>

      {/* Rechter Text */}
      <div
        style={{
          ...styles.rightTextWrapper,
          ...(!isHovered ? styles.rightTextWrapperDefault : styles.rightTextWrapperHover),
          transform: `translate(${rightTransform.x}px, ${rightTransform.y}px) ${
            isHovered ? 'scale(1.05) rotateY(-20deg)' : 'rotateY(-40deg)'
          }`,
          zIndex: rightTextZIndex,
          transition: 'transform 0.3s ease, z-index 0.3s ease', // Smooth transition for z-index
        }}
        ref={rightTextRef}
        onMouseMove={handleMouseMoveOverRightText}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <LeftTextComponent />
      </div>
    </div>
  );
};

// Styles für das Layout
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
    opacity: 0.85,
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
  verticalTextContainer: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '3rem',
    fontFamily: 'Arial Black, sans-serif',
    color: '#6B14B8',
    zIndex: 5,
    marginRight: '20px',
    marginBottom: '100px'
  },
  verticalText: {
    letterSpacing: '5px',
  },
  rightTextWrapper: {
    width: '30%',
    height: '100vh',
    overflowY: 'scroll',
    fontSize: '1.9rem',
    lineHeight: '1.5',
    textAlign: 'left',
    zIndex: -2,
    padding: '0px 30px',
    marginLeft: '10px',
    marginRight: '250px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    transformStyle: 'preserve-3d',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
  rightTextWrapperDefault: {
    color: '#6B14B8',
  },
  rightTextWrapperHover: {
    color: '#6B14B8',
  },
  slideshowOverlay: {
    position: 'absolute',
    left: '-50px',
    top: '0',
    width: '70%',
    height: '100%',
    zIndex: 3,
    pointerEvents: 'auto',
  },
};

export default Page1;
