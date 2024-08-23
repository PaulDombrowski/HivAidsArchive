import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Flag({ imageUrl }) {
  const placeholderUrl = '/path/to/placeholder.jpg'; // Ein Fallback-Bild
  const texture = useTexture([imageUrl, placeholderUrl]);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.position.z = Math.sin(t) * 0.5;
    meshRef.current.rotation.x = Math.sin(t / 4) / 10;
    meshRef.current.rotation.y = Math.sin(t / 2) / 20;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 3, 32, 32]} />
      <meshStandardMaterial map={texture[0]} onError={(e) => (texture[0] = texture[1])} />
    </mesh>
  );
}

export default Flag;
