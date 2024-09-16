import React, { useRef, useEffect, useState } from 'react';
import LeftTextComponent from './LeftTextComponent';
import { Canvas } from '@react-three/fiber'; // Import Canvas for Three.js context
import Slideshow from './Slideshow'; // Import the Slideshow component

const Page1 = () => {
  const rightTextRef = useRef(null);
  const slideshowRef = useRef(null); // Slideshow reference
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [backgroundGradient, setBackgroundGradient] = useState('rgba(245, 245, 245, 1)');
  const [rightTransform, setRightTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect
  const requestRef = useRef(null); // For requestAnimationFrame

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      // Dynamically calculate the background gradient based on distance from center
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;

      const distanceFromCenter = Math.sqrt((clientX - centerX) ** 2 + (clientY - centerY) ** 2);
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

      const gradientSize = Math.max(100, 500 * (1 - distanceFromCenter / maxDistance));

      setBackgroundGradient(
        `radial-gradient(circle at ${clientX}px ${clientY}px, rgba(255,0,0,0.3), rgba(245, 245, 245, 0.7) ${gradientSize}px)`
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Throttling the mouse movement using requestAnimationFrame for smooth movement
  const handleMouseMoveOverRightText = (e) => {
    const updateRightTransform = () => {
      setRightTransform({
        x: e.clientX / 200,
        y: e.clientY / 200,
      });
    };
    cancelAnimationFrame(requestRef.current); // Cancel any previous animation frame
    requestRef.current = requestAnimationFrame(updateRightTransform); // Throttle updates
  };

  return (
    <div
      style={{
        ...styles.pageContainer,
        background: backgroundGradient, // Dynamically set the background gradient
      }}
    >
      {/* Glowing cursor */}
      <div
        style={{
          ...styles.customCursor,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
        }}
      />

      {/* Vertical text on the left */}
      <div style={styles.verticalTextContainer}>
        <p style={styles.verticalText}>DIGITAL TRACES _CURATING AN HIV ARCHIVE</p>
      </div>

      {/* Slideshow */}
      <div style={styles.slideshowOverlay}>
        <Canvas camera={{ position: [1, 0, 5], fov: 40 }} style={{ width: '100%', height: '100%' }}>
          <Slideshow />
        </Canvas>
      </div>

      {/* Right text */}
      <div
        style={{
          ...styles.rightTextWrapper,
          ...(!isHovered ? styles.rightTextWrapperDefault : styles.rightTextWrapperHover),
          transform: `translate(${rightTransform.x}px, ${rightTransform.y}px) ${isHovered ? 'scale(1.05) rotateY(-20deg)' : 'rotateY(-40deg)'}`, // Combine both dynamic and hover transforms
        }}
        ref={rightTextRef}
        onMouseMove={handleMouseMoveOverRightText}
        onMouseEnter={() => setIsHovered(true)} // Trigger hover effect
        onMouseLeave={() => setIsHovered(false)} // Reset on hover leave
      >
        <LeftTextComponent /> {/* Component for the left text but it's now on the right */}
      </div>
    </div>
  );
};

// Styles for the layout
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Ensure equal spacing between elements
    alignItems: 'flex-start',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: '50px',
    perspective: '1000px', // Keep perspective for the 3D effect
    overflow: 'hidden', // Prevent scrolling the whole page
    cursor: 'none', // Hide default cursor
    transition: 'background 0.3s ease', // Smooth transition for the background gradient
    position: 'relative', // Ensure absolute positioning works within this container
  },

  verticalTextContainer: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '1.2rem',
    fontFamily: 'Arial Black, sans-serif',
    color: '#000',
    zIndex: 2, // Ensure it's on top of the slideshow
    marginRight: '20px', // Space between vertical text and the next element
  },
  verticalText: {
    letterSpacing: '5px',
  },

  rightTextWrapper: {
    width: '30%',
    height: 'calc(100vh - 100px)', // Add extra height to avoid being cut off due to transform
    overflowY: 'scroll', // Enable vertical scrolling for right text
    fontSize: '1.2rem',
    fontFamily: "'Lora', serif", // Use an elegant Google font
    lineHeight: '1.5',
    textAlign: 'left',
    zIndex: 3, // Right text stays in the foreground
    padding: '50px 30px', // Adds padding at the top and bottom to avoid clipping
    marginLeft: '10px',
    marginRight: '250px', // Adjust margin to move closer to the left text
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
    transformStyle: 'preserve-3d', // Preserve 3D effect for children
    transition: 'color 0.3s ease, transform 0.3s ease', // Smooth transitions for hover effect
  },

  rightTextWrapperDefault: {
    color: '#808080', // Default gray text color
  },

  rightTextWrapperHover: {
    color: '#9370DB', // Flieder color on hover
  },

  slideshowOverlay: {
    position: 'absolute', // Allow the slideshow to overlay all other content
    left: '-100px', // Move slideshow even further to the left
    top: '0',
    width: '70%', // Keep slideshow size large
    height: '100%',
    zIndex: 1, // Behind text, but on top of the background
    pointerEvents: 'auto', // Allow interaction with the canvas
  },

  customCursor: {
    position: 'fixed',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(128,0,0,1) 100%)', // Red gradient
    boxShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.6)', // Glowing red shadow
    pointerEvents: 'none', // Let clicks pass through the custom cursor
    transform: 'translate(-50%, -50%)', // Center the circle around the mouse pointer
    zIndex: 1000, // Ensure it's above everything
    animation: 'pulse 1.5s infinite', // Adding pulsing animation for the glow
  },
};

export default Page1;
