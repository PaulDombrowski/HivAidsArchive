import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { TextureLoader } from 'three';
import { a, useSpring } from '@react-spring/three';

// Function to detect browser type
const detectBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'chrome';
  } else if (userAgent.includes('firefox')) {
    return 'firefox';
  } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return 'safari';
  }
  return 'other';
};

function ImagePlane({ position, texture, scale, onClick, delay, isChrome }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const springProps = useSpring({
    from: { position: [position[0], position[1] - 10, position[2]], opacity: 0 },
    to: { position, opacity: 1 },
    delay,
    config: { tension: isChrome ? 40 : 80, friction: isChrome ? 10 : 20 }, // Adjust animation based on browser
  });

  const scaleSpring = useSpring({
    scale: hovered ? scale.map(s => s * 1.05) : scale,
    config: { tension: isChrome ? 150 : 200, friction: 10 }, // Simpler animation for Chrome
  });

  useFrame(() => {
    if (meshRef.current && position[2] === 0) {
      meshRef.current.rotation.z += isChrome ? 0.001 : 0.003; // Slower rotation for Chrome
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      position={springProps.position}
      scale={scaleSpring.scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <planeGeometry args={[3, 3]} />
      <a.meshBasicMaterial
        map={texture}
        transparent
        opacity={springProps.opacity}
        toneMapped={false}
      />
    </a.mesh>
  );
}

function Slideshow() {
  const navigate = useNavigate();
  const groupRef = useRef();
  const { size } = useThree();
  const zDistance = 10;
  const [targetZ, setTargetZ] = useState(0); // Target Z position
  const [currentZ, setCurrentZ] = useState(0); // Current Z position
  const [isAtEnd, setIsAtEnd] = useState(false); // Track if at the last image
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [isInsideScrollCircle, setIsInsideScrollCircle] = useState(false); // Track if inside the scroll circle

  const touchStartRef = useRef(0);
  const touchEndRef = useRef(0);

  const browser = detectBrowser(); // Detect browser type
  const isChrome = browser === 'chrome'; // Check if Chrome

  const images = [
    `${process.env.PUBLIC_URL}/2.png`,
    `${process.env.PUBLIC_URL}/3.png`,
    `${process.env.PUBLIC_URL}/4.png`,
    `${process.env.PUBLIC_URL}/5.png`,
    `${process.env.PUBLIC_URL}/6.png`,
    `${process.env.PUBLIC_URL}/7.png`,
    `${process.env.PUBLIC_URL}/8.png`,
  ];

  const [loadedTextures, setLoadedTextures] = useState([]);

  useEffect(() => {
    const loaders = images.map((path) =>
      new TextureLoader().loadAsync(path).catch((error) => {
        console.error(`Error loading texture: ${path}`, error);
        return null;
      })
    );

    Promise.all(loaders).then((textures) => {
      const filteredTextures = textures.filter(texture => texture !== null);
      setLoadedTextures(filteredTextures);
    });

    const handleScroll = (event) => {
      // Only scroll when inside the scroll circle
      if (isInsideScrollCircle) {
        setTargetZ((prev) => {
          const newZ = prev + event.deltaY * 0.05;
          if (newZ >= (images.length - 1) * zDistance) {
            setIsAtEnd(true);
            return (images.length - 1) * zDistance; // Limit forward scrolling
          } else if (newZ <= 0) {
            return 0; // Limit backward scrolling
          } else {
            setIsAtEnd(false);
            return newZ;
          }
        });
      }
    };

    const handleTouchStart = (event) => {
      touchStartRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      touchEndRef.current = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (isInsideScrollCircle) {
        const delta = touchStartRef.current - touchEndRef.current;
        setTargetZ((prev) => {
          const newZ = prev + delta * 0.05;
          if (newZ >= (images.length - 1) * zDistance) {
            setIsAtEnd(true);
            return (images.length - 1) * zDistance; // Limit forward scrolling on touch
          } else if (newZ <= 0) {
            return 0; // Limit backward scrolling on touch
          } else {
            setIsAtEnd(false);
            return newZ;
          }
        });
      }
    };

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [images.length, zDistance, isInsideScrollCircle]);

  useFrame(() => {
    if (groupRef.current) {
      setCurrentZ((prev) => {
        const newZ = prev + (targetZ - prev) * 0.1;
        groupRef.current.position.z = newZ;
        return newZ;
      });
    }
  });

  const maxImageScale = 0.4;
  const calculatedScale = Math.min(size.width / 1500, size.height / 1500, maxImageScale);

  const objects = loadedTextures.map((texture, i) => ({
    position: [0, 0, -zDistance * i],
    texture,
    delay: i * 300,
    onClick: () => navigate(`/page${i + 1}`),
  }));

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setIsHovered(true)} // Detect hover to speed up rotation
      onPointerOut={() => setIsHovered(false)}
      onPointerMove={(e) => {
        const circleRadius = 12;
        const x = e.point.x;
        const y = e.point.y;
        // Check if cursor is inside the scroll circle
        const isInside = Math.sqrt(x * x + y * y) <= circleRadius;
        setIsInsideScrollCircle(isInside);
      }}
    >
      {objects.map((obj, i) => (
        <ImagePlane
          key={i}
          position={obj.position}
          texture={obj.texture}
          scale={[calculatedScale, calculatedScale, calculatedScale]}
          onClick={obj.onClick}
          delay={obj.delay}
          isChrome={isChrome} // Pass whether it's Chrome to adjust animations
        />
      ))}
    </group>
  );
}

export default Slideshow;
