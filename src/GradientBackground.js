import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three'; // Import for material properties
import MagnetWords from './MagnetWords'; // Importiere MagnetWords-Komponente

// Custom component to load the 3D model
function Model({ isChrome }) {
  const { scene } = useGLTF('/hivpdf.glb');
  
  // Apply material properties to the model
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xFF0000), // Red color
          metalness: 0.7,
          roughness: 0.1,
          emissive: new THREE.Color(0xFF0000), // Slight red glow
          emissiveIntensity: 0.3,
        });
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  // Adjust rotation and animation speeds based on whether it's Chrome
  useFrame(() => {
    const speedMultiplier = isChrome ? 2 : 1; // Slower for Chrome
    scene.rotation.y += 0.002 * speedMultiplier;
    scene.rotation.x += 0.001 * speedMultiplier;
  });

  // Return the model component with adjusted scale and position
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

  // Background image style
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
    backgroundColor: 'black',
  };

  // Guckloch effect style
  const gucklockStyle = {
    background: `radial-gradient(
      circle at ${mousePos.x}px ${mousePos.y}px,
      rgba(255, 0, 0, 1) 5px,
      rgba(255, 0, 0, 0.6) 70px,
      rgba(255, 0, 0, 0.4) 100px,
      rgba(0, 0, 0, 1) 150px
    )`,
    boxShadow: `0 0 30px 20px rgba(255, 0, 0, 0.5)`,
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'all 0.1s ease-out',
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div style={backgroundImageStyle} /> {/* Scrolling background */}
      <MagnetWords /> {/* MagnetWords component */}
      <div style={gucklockStyle} /> {/* Guckloch effect */}

      {/* Canvas for 3D model and lighting */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
        camera={{ position: [3, 4, 5], fov: isChrome ? 60 : 50 }} // Adjust FOV for Chrome
        shadows
      >
        {/* Ambient light */}
        <ambientLight intensity={isChrome ? 1.0 : 1.5} /> {/* Lower intensity for Chrome */}
        
        {/* Point light that follows the mouse */}
        <pointLight 
          position={[
            (mousePos.x / window.innerWidth) * 10 - 5,
            (mousePos.y / window.innerHeight) * 10 - 5,
            5,
          ]}
          intensity={isChrome ? 2 : 4} // Reduce intensity for Chrome
          castShadow
          shadow-mapSize-width={isChrome ? 512 : 1024} // Lower shadow resolution for Chrome
          shadow-mapSize-height={isChrome ? 512 : 1024}
        />
        
        {/* Additional directional lights */}
        <directionalLight position={[0, 10, 10]} intensity={isChrome ? 1 : 2} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={isChrome ? 1 : 1.5} castShadow />
        <pointLight position={[5, -5, -5]} intensity={isChrome ? 1 : 1.5} />

        {/* Load the 3D model */}
        <Model isChrome={isChrome} />

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
