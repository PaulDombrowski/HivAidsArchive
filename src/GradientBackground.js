import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three'; // Import THREE for material properties
import MagnetWords from './MagnetWords'; // Import MagnetWords component

// Custom component to load the 3D model
function Model({ isChrome }) {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/hivpdf.glb`); // Use process.env.PUBLIC_URL for the 3D model

  // Set model with red base color, purple reflections, and strong chrome effect
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.material = new THREE.MeshStandardMaterial({
          color: 0xff0000, // Red as the base color for the chrome effect
          metalness: 1.0, // Maximum metallicity for the chrome effect
          roughness: 0.0, // Extremely smooth for perfect reflections
          envMapIntensity: 0.2, // Stronger reflections from the environment
        });
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  // Apply rotation animation
  useFrame(() => {
    const speedMultiplier = isChrome ? 2 : 1; // Slower for Chrome
    scene.rotation.y += 0.002 * speedMultiplier;
    scene.rotation.x += 0.001 * speedMultiplier;
  });

  return <primitive object={scene} scale={[0.3, 0.3, 0.3]} position={[0, 0, 0]} />;
}

function RedInteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isChrome, setIsChrome] = useState(false); // Track if the browser is Chrome
  const navigate = useNavigate();

  // Detect if Chrome is the browser and set the state
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('chrome') && !userAgent.includes('edge') && !userAgent.includes('opr')) {
      setIsChrome(true);
    }
  }, []);

  // Handle mouse movement for lighting and interaction
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

  // Navigation handler
  const handleClick = () => {
    navigate('/page1');
  };

  // Moving background image style
  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/0X5f0CK.jpeg)`, // Use process.env.PUBLIC_URL for the moving background
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
    backgroundColor: 'black',
  };

  // Updated Guckloch effect style
  const gucklockStyle = {
    background: `radial-gradient(
      circle at ${mousePos.x}px ${mousePos.y}px,
      rgba(255, 0, 0, 1) 10px,
      rgba(255, 0, 0, 0.2) 60px,
      rgba(255, 0, 0, 0.1) 70px,
      rgba(255, 255, 255, 0.93) 90px
    )`,
    boxShadow: `0 0 30px 20px rgba(255, 0, 0, 0.2)`,
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out',
  };

  // Updated Semi-transparent overlay background style with stretching effect
  const overlayBackgroundStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/background2.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    opacity: 0.6,
    maskImage: `radial-gradient(
      circle at ${mousePos.x}px ${mousePos.y}px,
      transparent 0px, 
      transparent 120px, 
      rgba(0, 0, 0, 0.6) 180px
    )`, // Creates a transparent area around the cursor
    maskSize: '200vw 200vh',
    transform: `scaleY(${1 + Math.abs((mousePos.y / window.innerHeight) * 0.1)})`, // Stretch effect based on mouse position
    transition: 'transform 0.3s ease', // Smooth transition for stretching
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Scrolling background */}
      <div style={backgroundImageStyle} />

      {/* MagnetWords component */}
      <MagnetWords />

      {/* Guckloch effect */}
      <div style={gucklockStyle} />

      {/* Semi-transparent overlay with stretching effect */}
      <div style={overlayBackgroundStyle} />

      {/* Canvas for 3D model and lighting */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 100 }}
        camera={{ position: [3, 4, 5], fov: isChrome ? 60 : 50 }} // Adjust FOV for Chrome
        shadows
      >
        {/* Ambient purple light */}
        <ambientLight color={new THREE.Color(0x800080)} intensity={2.0} />

        {/* Point light that follows the mouse */}
        <pointLight
          position={[
            (mousePos.x / window.innerWidth) * 10 - 5,
            (mousePos.y / window.innerHeight) * 10 - 5,
            5,
          ]}
          color={new THREE.Color(0x800080)} // Purple point light for reflections
          intensity={3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Directional purple light */}
        <directionalLight
          color={new THREE.Color(0x800080)} // Purple directional light
          position={[0, 10, 10]}
          intensity={2}
          castShadow
        />

        {/* Load the 3D model */}
        <Model isChrome={isChrome} />

        {/* Environment for JPEG reflections */}
        <Environment
          files={`${process.env.PUBLIC_URL}/reflexions.jpg`} // Path to the JPEG file for reflections
          background={false} // Not used as background, only for reflections
        />

        {/* Camera controls */}
        <OrbitControls />
      </Canvas>

      {/* Clickable overlay */}
      <div
        onClick={handleClick}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'auto',
          background: 'transparent',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

export default RedInteractiveBackground;
