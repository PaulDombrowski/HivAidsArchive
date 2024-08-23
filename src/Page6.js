import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Page2() {
    useEffect(() => {
        // Create the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality on high DPI screens
        renderer.setClearColor(0x000000, 0); // Transparent background
        document.body.appendChild(renderer.domElement);

        // Add lighting to the scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Lower intensity
        scene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1); // Soft, ambient light
        hemisphereLight.position.set(0, 1, 0);
        scene.add(hemisphereLight);

        const pointLight = new THREE.PointLight(0xffffff, 1.5, 10); // Softer light with distance
        pointLight.position.set(0, 0, 5); // Light coming from the front
        pointLight.castShadow = true; // Enable shadows for softer light
        pointLight.shadow.mapSize.width = 2048; // Increase shadow quality
        pointLight.shadow.mapSize.height = 2048; // Increase shadow quality
        pointLight.shadow.camera.near = 0.5; // Adjust near clipping plane
        pointLight.shadow.camera.far = 10; // Adjust far clipping plane
        scene.add(pointLight);

        // Load the GLTF model
        const loader = new GLTFLoader();
        loader.load(
            '/hivpdf.glb', // Replace with the path to your .glb file
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, 0, 0); // Center the model

                // Scale the model to make it smaller
                model.scale.set(0.5, 0.5, 0.5); // Scale factor

                // Correctly orient the model
                model.rotation.x = -Math.PI / 6; // Rotate -30 degrees around the X axis to tilt backward
                model.rotation.y = 0; // Set Y rotation to 0

                // Set material properties for better lighting effect
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: 0xff0000, // Red color
                            roughness: 0.5, // Slightly rough surface
                            metalness: 0.8 // High metalness for shininess
                        });
                    }
                });

                scene.add(model);
                console.log('Model loaded');

                // Animation loop with gentle rocking motion
                let clock = new THREE.Clock();
                const animate = function () {
                    requestAnimationFrame(animate);
                    
                    // Calculate elapsed time
                    const elapsedTime = clock.getElapsedTime();
                    
                    // Rock the model back and forth
                    model.rotation.z = 0.1 * Math.sin(elapsedTime * 2); // Gentle rocking motion around Z axis
                    
                    renderer.render(scene, camera);
                };
                animate();
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );

        // Position the camera
        camera.position.set(0, 0, 5); // Move the camera closer to the model
        camera.lookAt(0, 0, 0); // Ensure camera is looking at the center of the scene

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Clean up on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {/* The canvas will be appended to the body by three.js */}
        </div>
    );
}

export default Page2;
