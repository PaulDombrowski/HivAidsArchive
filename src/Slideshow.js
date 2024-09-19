import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { TextureLoader } from 'three';
import { a, useSpring } from '@react-spring/three';
import { Html } from '@react-three/drei';
import './Slideshow.css';

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

function ImagePlane({ position, texture, scale, onClick, delay, isChrome, title, onHover }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const springProps = useSpring({
    from: { position: [position[0], position[1] - 10, position[2]], opacity: 0 },
    to: { position, opacity: 1 },
    delay,
    config: { tension: isChrome ? 40 : 80, friction: isChrome ? 10 : 20 },
  });

  const scaleSpring = useSpring({
    scale: hovered ? scale.map(s => s * 1.05) : scale,
    config: { tension: isChrome ? 150 : 200, friction: 10 },
  });

  useFrame(() => {
    if (meshRef.current && position[2] === 0) {
      meshRef.current.rotation.z += isChrome ? 0.001 : 0.003;
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      position={springProps.position}
      scale={scaleSpring.scale}
      onPointerOver={() => {
        setHovered(true);
        onHover(title);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
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
  const [targetZ, setTargetZ] = useState(0);
  const [currentZ, setCurrentZ] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInsideScrollCircle, setIsInsideScrollCircle] = useState(false);
  const [hoveredTitle, setHoveredTitle] = useState(null);

  const browser = detectBrowser();
  const isChrome = browser === 'chrome';

  const images = [
    { path: `${process.env.PUBLIC_URL}/2.png`, title: 'Shuffle' },
    { path: `${process.env.PUBLIC_URL}/3.png`, title: 'Database' },
    { path: `${process.env.PUBLIC_URL}/4.png`, title: 'Search' },
    { path: `${process.env.PUBLIC_URL}/5.png`, title: 'Upload' },
    { path: `${process.env.PUBLIC_URL}/6.png`, title: 'Thesis' },
    { path: `${process.env.PUBLIC_URL}/7.png`, title: 'Impress' },
    { path: `${process.env.PUBLIC_URL}/8.png`, title: 'Image 7' },
  ];

  const [loadedTextures, setLoadedTextures] = useState([]);

  useEffect(() => {
    const loaders = images.map((img) =>
      new TextureLoader().loadAsync(img.path).catch((error) => {
        console.error(`Error loading texture: ${img.path}`, error);
        return null;
      })
    );

    Promise.all(loaders).then((textures) => {
      const filteredTextures = textures.filter(texture => texture !== null);
      setLoadedTextures(filteredTextures);
    });

    const handleScroll = (event) => {
      if (isInsideScrollCircle) {
        setTargetZ((prev) => {
          const newZ = prev + event.deltaY * 0.05;
          if (newZ >= (images.length - 1) * zDistance) {
            return (images.length - 1) * zDistance;
          } else if (newZ <= 0) {
            return 0;
          } else {
            return newZ;
          }
        });
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
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
    title: images[i].title,
  }));

  return (
    <>
      <group
        ref={groupRef}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        onPointerMove={(e) => {
          const circleRadius = 12;
          const x = e.point.x;
          const y = e.point.y;
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
            isChrome={isChrome}
            title={obj.title}
            onHover={setHoveredTitle}
          />
        ))}
      </group>
    
      // Inside the Slideshow component, replace the hoveredTitle rendering section with this updated block:

      {hoveredTitle && (
  <Html fullscreen>
    <div
      className="hover-title-container"
      style={{
        fontSize: '6rem', // Slightly smaller font size
        fontFamily: 'Arial Black, sans-serif',
        position: 'fixed',
        writingMode: 'vertical-rl', // Vertical orientation of the text
        right: '5%', // Positioned a bit further left from the right edge
        bottom: '0%', // Slightly lower near the bottom of the canvas
        transform: isHovered
          ? 'rotateY(-10deg) rotateX(5deg) translateZ(20px) scale(1.1)'
          : 'rotateY(-20deg) rotateX(10deg) translateZ(0)', // Subtle 3D rotation for a refined look
        color: 'rgba(255, 0, 0, 1)', // Bright red for visibility
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        opacity: 0,
        animation: 'smoothFadeIn 1s ease forwards',
        zIndex: 10,
      }}
    >
      {hoveredTitle}
    </div>

    <style>
      {`
        @keyframes smoothFadeIn {
          0% {
            opacity: 0;
            transform: rotateY(-20deg) rotateX(10deg) translateZ(-40px); // Starting with a dynamic perspective
          }
          100% {
            opacity: 1;
            transform: rotateY(-10deg) rotateX(5deg) translateZ(20px); // Final refined 3D positioning
          }
        }

        .hover-title-container {
          transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; // Smooth transition for elegance
        }
      `}
    </style>
  </Html>
)}


    </>
  );
}

export default Slideshow;
