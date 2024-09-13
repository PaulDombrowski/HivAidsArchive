import React, { useRef, useEffect, useState } from 'react';
import LeftTextComponent from './LeftTextComponent';
import RightTextComponent from './RightTextComponent';
import { Canvas } from '@react-three/fiber'; // Import Canvas for Three.js context
import Slideshow from './Slideshow'; // Import the Slideshow component

const Page1 = () => {
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const slideshowRef = useRef(null); // Slideshow reference
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [backgroundGradient, setBackgroundGradient] = useState('rgba(245, 245, 245, 1)');
  const [leftTransform, setLeftTransform] = useState({ x: 0, y: 0 });
  const [rightTransform, setRightTransform] = useState({ x: 0, y: 0 });
  const [scrollDirection, setScrollDirection] = useState(1); // Scroll direction: 1 = down, -1 = up

  useEffect(() => {
    // Auto-scrolling logic for the left text
    let scrollSpeed = 0.5; // Speed of the scroll
    const leftContainer = leftTextRef.current;

    const autoScroll = () => {
      if (leftContainer) {
        leftContainer.scrollTop += scrollSpeed * scrollDirection;

        // Reverse the scroll direction when reaching the top or bottom
        if (leftContainer.scrollTop + leftContainer.clientHeight >= leftContainer.scrollHeight) {
          setScrollDirection(-1); // Scroll up
        } else if (leftContainer.scrollTop <= 0) {
          setScrollDirection(1); // Scroll down
        }
      }
      requestAnimationFrame(autoScroll); // Continue scrolling
    };

    requestAnimationFrame(autoScroll); // Start the scrolling loop

    return () => {
      cancelAnimationFrame(autoScroll); // Cleanup on component unmount
    };
  }, [scrollDirection]);

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

  const handleLeftTextTransform = (e) => {
    setLeftTransform({
      x: e.clientX / 100, // Adjust the multiplier to control the speed of transformation
      y: e.clientY / 100,
    });
  };

  const handleRightTextTransform = (e) => {
    setRightTransform({
      x: e.clientX / 100,
      y: e.clientY / 100,
    });
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

      {/* Left text (previously right) comes next */}
      <div
        style={{
          ...styles.leftTextWrapper,
          transform: `translate(${leftTransform.x}px, ${leftTransform.y}px) rotateX(0deg) rotateY(40deg)`, // Apply the 3D transformation here
        }}
        ref={leftTextRef}
        onMouseMove={handleLeftTextTransform}
      >
        <RightTextComponent /> {/* Component for the right text but it's now in the left position */}
      </div>

      {/* Right text (previously left) comes after */}
      <div
        style={{
          ...styles.rightTextWrapper,
          transform: `translate(${rightTransform.x}px, ${rightTransform.y}px) rotateX(0deg) rotateY(-40deg)`, // Apply the 3D transformation here
        }}
        ref={rightTextRef}
        onMouseMove={handleRightTextTransform}
      >
        <LeftTextComponent /> {/* Component for the left text but it's now in the right position */}
      </div>

      {/* Slideshow on the far right covering the full viewport */}
      <div style={styles.slideshowContainer} ref={slideshowRef}>
        <Canvas camera={{ position: [-1, 0, 5], fov: 40 }} style={{ width: '100vw', height: '100vh' }}>
          <Slideshow />
        </Canvas>
      </div>
    </div>
  );
};

// Styles for the layout
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Ensure equal spacing between left and right elements
    alignItems: 'flex-start',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: '50px',
    perspective: '1000px', // Keep perspective for the 3D effect
    overflow: 'hidden', // Prevent scrolling the whole page
    cursor: 'none', // Hide default cursor
    transition: 'background 0.3s ease', // Smooth transition for the background gradient
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

  // Swapped left and right wrappers
  leftTextWrapper: {
    width: '16%', // Adjust width to control spacing
    height: '100vh',
    overflowY: 'scroll', // Enable vertical scrolling for left text
    fontSize: '0.85rem',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
    textAlign: 'right',
    zIndex: 3, // Right text in the foreground
    padding: '10px 30px', // Adds padding to move text inward
    marginRight: '10px', // Adjust margin to move closer to the right text
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
    transformStyle: 'preserve-3d', // Preserve 3D effect for children
  },

  rightTextWrapper: {
    width: '30%',
    height: '100vh',
    overflowY: 'scroll', // Enable vertical scrolling for right text
    fontSize: '1.2rem',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
    textAlign: 'left',
    zIndex: 2, // Left text stays in foreground
    padding: '0px 30px', // Adds padding to move text inward
    marginLeft: '10px',
    marginRight: '400px',  // Adjust margin to move closer to the left text
    scrollbarWidth: 'none', // Hide scrollbar for Firefox
    msOverflowStyle: 'none', // Hide scrollbar for Internet Explorer and Edge
    transformStyle: 'preserve-3d', // Preserve 3D effect for children
    pointerEvents: 'none' // Durchklickbar machen
  },

  slideshowContainer: {
    position: 'fixed', // Cover the entire viewport
    top: 0,
    right: 0, // Positioned on the far right
    width: '100vw',
    height: '100vh',
    zIndex: 1, // Behind the text but still interactive
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
