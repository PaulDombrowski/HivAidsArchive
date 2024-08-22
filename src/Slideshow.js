import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { TextureLoader } from 'three';
import { a, useSpring } from '@react-spring/three';

function ImagePlane({ position, texture, scale, onClick, delay, isThird }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const springProps = useSpring({
    from: { position: [position[0], position[1] - 10, position[2]], opacity: 0 },
    to: { position, opacity: 1 },
    delay, // Verzögerung der Animation für jedes Bild
    config: { tension: 80, friction: 20 }, // Langsamere Animation
    onRest: () => console.log(`Animation for image at position ${position} finished.`),
  });

  const scaleSpring = useSpring({
    scale: hovered ? scale.map(s => s * 1.1) : scale,
    config: { tension: 200, friction: 10 },
  });

  useFrame(() => {
    if (isThird && meshRef.current) {
      meshRef.current.rotation.z += 0.003; // Langsame Rotation
    }
  });

  return (
    <a.mesh
      ref={meshRef}
      position={springProps.position}
      scale={scaleSpring.scale}
      onPointerOver={() => {
        console.log(`Hovering over image at position ${position}`);
        setHovered(true);
      }}
      onPointerOut={() => {
        console.log(`Stopped hovering over image at position ${position}`);
        setHovered(false);
      }}
      onPointerDown={() => {
        console.log(`Clicked on image at position ${position}`);
        onClick();
      }}
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
    console.log('Start loading textures');
    const loaders = images.map((path, index) =>
      new TextureLoader().loadAsync(path)
        .then(texture => {
          console.log(`Loaded texture ${index + 1}: ${path}`);
          return texture;
        })
        .catch((error) => {
          console.error(`Error loading texture: ${path}`, error);
          return null;
        })
    );

    Promise.all(loaders).then((textures) => {
      const filteredTextures = textures.filter(texture => texture !== null);
      setLoadedTextures(filteredTextures);
      console.log(`Loaded ${filteredTextures.length} of ${textures.length} textures successfully.`);
    });

    const handleScroll = (event) => {
      setTargetZ((prev) => {
        const newZ = Math.max(prev + event.deltaY * 0.05, 0);
        console.log(`Scroll event: New target Z position = ${newZ}`);
        return newZ;
      });
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      console.log('Cleaning up event listener');
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      setCurrentZ((prev) => {
        const newZ = prev + (targetZ - prev) * 0.1;
        groupRef.current.position.z = newZ;
        return newZ;
      });
      console.log(`Frame update: Current Z position = ${currentZ}`);
    }
  });

  const maxImageScale = 0.6;
  const calculatedScale = Math.min(size.width / 1500, size.height / 1500, maxImageScale);
  console.log(`Calculated image scale = ${calculatedScale}`);

  const objects = loadedTextures.map((texture, i) => ({
    position: [0, 0, -zDistance * i],
    texture,
    delay: i * 300,
    onClick: () => {
      console.log(`Navigating to /page${i + 1}`);
      navigate(`/page${i + 1}`);
    },
    isThird: i === 2,
  }));

  console.log('Rendering slideshow with objects:', objects);

  return (
    <group ref={groupRef}>
      {objects.map((obj, i) => (
        <ImagePlane
          key={i}
          position={obj.position}
          texture={obj.texture}
          scale={[calculatedScale, calculatedScale, calculatedScale]}
          onClick={obj.onClick}
          delay={obj.delay}
          isThird={obj.isThird}
        />
      ))}
    </group>
  );
}

export default Slideshow;
