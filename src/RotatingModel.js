import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// RotatingModel Component
export function RotatingModel({ modelPath, texturePath }) {
  const modelRef = useRef();

  // Load the GLTF model
  const { scene } = useGLTF(modelPath);

  // Load the texture
  const texture = useTexture(texturePath);

  // Shader Material based on texture
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    envMap: texture, // Environment map using the texture you provided
  });

  // Rotating the model
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01; // Smooth rotation
    }
  });

  return (
    <mesh ref={modelRef}>
      <primitive object={scene} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Main App Component
export default function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      <RotatingModel 
        modelPath="/hivpdf2.glb" // Replace with actual path to .glb file
        texturePath="/public/12.jpg" // Replace with actual path to texture image
      />
    </Canvas>
  );
}
