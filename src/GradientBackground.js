import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three'; // Importiere THREE für die Materialeigenschaften
import MagnetWords from './MagnetWords'; // Importiere MagnetWords-Komponente

// Custom component to load the 3D model
function Model({ isChrome }) {
  const { scene } = useGLTF(`${process.env.PUBLIC_URL}/hivpdf.glb`); // Verwende process.env.PUBLIC_URL für das 3D-Modell

  // Set model with red base color, lila reflections, and strong chrome effect
  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.material = new THREE.MeshStandardMaterial({
          color: 0xff0000, // Rot als Grundfarbe für den Chrome-Effekt
          metalness: 1.0,  // Maximale Metallicity für den Chrome-Effekt
          roughness: 0.0,  // Extrem glatt für perfekte Reflexionen
          envMapIntensity: 0.2, // Stärkere Reflexionen von der Umgebung
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

  // Background image style (similar to Blender's World settings)
  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/0X5f0CK.jpeg)`, // Verwende process.env.PUBLIC_URL für das Hintergrundbild
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
      rgba(255, 0, 0, 1) 9px,
      rgba(255, 0, 0, 0.2) 70px,
      rgba(255, 0, 0, 0.2) 90px,
      rgba(10, 10, 13, 1) 150px
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
      {/* Scrolling background */}
      <div style={backgroundImageStyle} /> 
      
      {/* MagnetWords component */}
      <MagnetWords /> 
      
      {/* Guckloch effect */}
      <div style={gucklockStyle} />

      {/* Canvas for 3D model and lighting */}
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
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
          color={new THREE.Color(0x800080)} // Lila point light für lila Reflexionen
          intensity={3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Directional purple light */}
        <directionalLight 
          color={new THREE.Color(0x800080)} // Lila directional light
          position={[0, 10, 10]} 
          intensity={2} 
          castShadow 
        />
        
        {/* Load the 3D model */}
        <Model isChrome={isChrome} />

        {/* Environment for JPEG reflections */}
        <Environment
          files={`${process.env.PUBLIC_URL}/reflexions.jpg`} // Pfad zur JPEG-Datei
          background={false} // Nicht als Hintergrund verwenden, nur für Reflexionen
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
