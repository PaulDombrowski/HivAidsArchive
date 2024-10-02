import React, { useEffect, useState } from 'react';

const Header = () => {
  const [mouseSpeed, setMouseSpeed] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const speed = Math.abs(clientX + clientY) / 150; // Speed increases based on mouse movement
      setMouseSpeed(1 + speed); // Adjust speed based on mouse movement
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const createMovingText = (direction, speedMultiplier) => {
    const animationSpeed = 10 * speedMultiplier * mouseSpeed; // Control the speed here
    return {
      animation: `${direction === 'up' ? 'scrollUp' : 'scrollDown'} ${animationSpeed}s linear infinite`,
      // Keine Verzögerung für sofortige Sichtbarkeit
    };
  };

  return (
    <div style={styles.container}>
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          style={{
            ...styles.verticalText,
            ...createMovingText(index % 2 === 0 ? 'up' : 'down', 0.7 + index * 0.1), // Keine Verzögerung
          }}
        >
          <span style={styles.text}>{'ABOUT ABOUT '.repeat(10)}</span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-around', // Distribute the vertical lines across the viewport
  },

  verticalText: {
    writingMode: 'vertical-rl', // Make the text vertical
    fontSize: '10vw', // Set the text size to 6vw as requested
    fontFamily: 'Arial Black, sans-serif',
    fontStyle: 'italic',
    color: 'rgba(200, 200, 260, 0.4)', // Lighter gray for background effect
    whiteSpace: 'nowrap',
    paddingBottom: '2vh',
    overflow: 'visible', // Allow overflow of text beyond the container
    minWidth: '6vw', // Ensure the text container is large enough
    minHeight: '200%', // Ensure the container is tall enough to display all text
    position: 'relative',
    zIndex: 1000,
  },

  // Text styling
  text: {
    fontSize: 'inherit',
    color: 'inherit',
  },
};

// Keyframes for scrolling animations
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes scrollUp {
    0% { transform: translateY(100%); }
    100% { transform: translateY(-100%); }
  }

  @keyframes scrollDown {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`;
document.head.appendChild(styleSheet);

export default Header;
