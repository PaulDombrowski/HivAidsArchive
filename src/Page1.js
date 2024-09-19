import React, { useRef, useEffect, useState } from 'react';
import LeftTextComponent from './LeftTextComponent';
import { Canvas } from '@react-three/fiber'; // Import Canvas for Three.js context
import Slideshow from './Slideshow'; // Import the Slideshow component

const Page1 = () => {
  const rightTextRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filterStyle, setFilterStyle] = useState('none');
  const [cursorSize, setCursorSize] = useState(40); // State to manage cursor size
  const [rightTransform, setRightTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect
  const requestRef = useRef(null); // For requestAnimationFrame

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      // Calculate distance from the center of the screen
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const distanceFromCenter = Math.sqrt(
        (clientX - centerX) ** 2 + (clientY - centerY) ** 2
      );

      // Adjust cursor size: smaller near the edges, larger in the center
      const maxSize = 60; // Maximum size of the gradient
      const minSize = 20; // Minimum size of the gradient near the edges
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const size = maxSize - ((distanceFromCenter / maxDistance) * (maxSize - minSize));

      setCursorSize(size);

      // Adjust filter intensity: stronger near the cursor
      const maxEffectDistance = 300; // Distance within which the effect is noticeable
      const effectStrength = Math.max(
        0,
        (maxEffectDistance - distanceFromCenter) / maxEffectDistance
      );

      // Set a strong purple tint and moderate contrast near the cursor
      setFilterStyle(
        `hue-rotate(270deg) saturate(${1 + effectStrength * 3}) brightness(${
          1 + effectStrength * 0.3
        })`
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
    <div style={styles.pageContainer}>
      {/* Background image layer with dynamic filter */}
      <div
        style={{
          ...styles.backgroundImage,
          filter: filterStyle, // Dynamically applied filter to manipulate the image near the cursor
        }}
      />

      {/* Red glowing cursor effect */}
      <div
        style={{
          ...styles.customCursor,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
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
          transform: `translate(${rightTransform.x}px, ${rightTransform.y}px) ${
            isHovered ? 'scale(1.05) rotateY(-20deg)' : 'rotateY(-40deg)'
          }`, // Combine both dynamic and hover transforms
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
    padding: '50px',
    perspective: '1000px', // Keep perspective for the 3D effect
    overflow: 'hidden', // Prevent scrolling the whole page
    cursor: 'none', // Hide default cursor
    position: 'relative', // Ensure absolute positioning works within this container
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: "url('background2.jpg')",
    backgroundSize: 'cover', // Ensure the image covers the entire area
    backgroundPosition: 'center', // Center the image
    backgroundRepeat: 'no-repeat', // Do not repeat the image
    zIndex: 1, // Ensure it is above the tint overlay
    pointerEvents: 'none', // Allow clicks to pass through
    transition: 'filter 0.2s ease', // Smooth transition when the filter effect is applied
  },

  customCursor: {
    position: 'fixed',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(128,0,0,0.5) 100%)', // Red gradient effect
    boxShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)', // Glowing red shadow
    pointerEvents: 'none', // Let clicks pass through the custom cursor
    transform: 'translate(-50%, -50%)', // Center the circle around the mouse pointer
    zIndex: 1000, // Ensure it's above everything
  },

  verticalTextContainer: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    fontSize: '1.2rem',
    fontFamily: 'Arial Black, sans-serif',
    color: '#000',
    zIndex: 3, // Ensure it's on top of the slideshow
    marginRight: '20px', // Space between vertical text and the next element
  },
  verticalText: {
    letterSpacing: '5px',
  },

  rightTextWrapper: {
    width: '30%',
    height: '100vh',
    overflowY: 'scroll', // Enable vertical scrolling for right text
    fontSize: '1.2rem',
    lineHeight: '1.5',
    textAlign: 'left',
    zIndex: 4, // Right text stays in the foreground
    padding: '0px 30px', // Adds padding to move text inward
    marginLeft: '10px',
    marginRight: '250px', // Move text further right
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
    transformStyle: 'preserve-3d', // Preserve 3D effect for children
    transition: 'color 0.3s ease, transform 0.3s ease', // Smooth transitions for hover effect
  },

  rightTextWrapperDefault: {
    color: '#9370DB', // Default gray text color
  },

  rightTextWrapperHover: {
    color: '#6B14B8', // Flieder color on hover
  },

  slideshowOverlay: {
    position: 'absolute', // Allow the slideshow to overlay all other content
    left: '-50px', // Make slideshow a bit larger
    top: '0',
    width: '70%', // Increase the width of the slideshow
    height: '100%',
    zIndex: 3, // Behind text, but on top of the background
    pointerEvents: 'auto', // Allow interaction with the canvas
  },
};

export default Page1;
