import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Page2() {
    const [pdf, setPdf] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const canvasRefs = useRef([]);
    const renderQueue = useRef(Promise.resolve());
    const modelRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const backgroundRef = useRef(null);
    const pdfContainerRef = useRef(null);

    const publicUrl = process.env.PUBLIC_URL || '';

    useEffect(() => {
        const url = `${publicUrl}/masti_upload_version-4.pdf`; // Pfad zu deinem PDF-Dokument

        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(loadedPdf => {
            setPdf(loadedPdf);
            setTotalPages(loadedPdf.numPages);
        }, err => {
            console.error('Error loading PDF:', err);
        });
    }, [publicUrl]);

    useEffect(() => {
        if (pdf && totalPages > 0) {
            renderAllPages(pdf);
        }
    }, [pdf, totalPages]);

    const renderAllPages = (loadedPdf) => {
        for (let num = 1; num <= loadedPdf.numPages; num++) {
            const canvas = canvasRefs.current[num - 1];
            if (canvas) {
                queueRenderPage(loadedPdf, num, canvas);
            }
        }
    };

    const queueRenderPage = (loadedPdf, num, canvas) => {
        renderQueue.current = renderQueue.current.then(() => {
            return renderPage(loadedPdf, num, canvas);
        });
    };

    const renderPage = (loadedPdf, num, canvas) => {
        return new Promise((resolve, reject) => {
            loadedPdf.getPage(num).then(page => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale });

                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                    background: 'transparent',
                };

                const renderTask = page.render(renderContext);
                renderTask.promise.then(() => {
                    console.log(`Page ${num} rendered`);
                    canvas.style.opacity = 0;
                    setTimeout(() => {
                        canvas.style.transition = 'opacity 1s';
                        canvas.style.opacity = 1;
                        resolve();
                    }, 50);
                }).catch(error => {
                    if (error.name !== 'RenderingCancelledException') {
                        console.error('Rendering error:', error);
                        reject(error);
                    } else {
                        resolve(); // Treat canceled render as resolved
                    }
                });
            });
        });
    };

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparenter Hintergrund
        document.getElementById('three-container').appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, 5).normalize(); // Licht von vorne
        scene.add(directionalLight);

        const loader = new GLTFLoader();
        loader.load(
            `${publicUrl}/hivpdf.glb`, // Pfad zu deinem .glb-Modell
            (gltf) => {
                const model = gltf.scene;
                modelRef.current = model;
                model.scale.set(0.2, 0.2, 0.2); // Kleinere Skalierung
                model.position.set(2, 2, 0); // Positioniere das Modell in der oberen rechten Ecke
                scene.add(model);

                const animate = function () {
                    requestAnimationFrame(animate);
                    model.rotation.y += 0.002;
                    model.rotation.x += 0.001;
                    model.rotation.z += 0.001;

                    renderer.render(scene, camera);
                };

                animate();
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the model:', error);
            }
        );

        camera.position.z = 5;

        const handleResize = () => {
            if (rendererRef.current && cameraRef.current) {
                const width = window.innerWidth;
                const height = window.innerHeight;
                rendererRef.current.setSize(width, height);
                cameraRef.current.aspect = width / height;
                cameraRef.current.updateProjectionMatrix();

                if (modelRef.current) {
                    modelRef.current.position.set(2 * (width / height), 2, 0);
                }
            }
        };

        window.addEventListener('resize', handleResize);

        const handleScroll = () => {
            if (pdfContainerRef.current) {
                const scrollY = pdfContainerRef.current.scrollTop;
                const scrollX = pdfContainerRef.current.scrollLeft;
                if (backgroundRef.current) {
                    backgroundRef.current.style.backgroundPosition = `${scrollX * 0.5}px ${scrollY * 0.5}px`; // Parallax-Effekt für beide Richtungen
                }
            }
        };

        if (pdfContainerRef.current) {
            pdfContainerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (pdfContainerRef.current) {
                pdfContainerRef.current.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            document.getElementById('three-container').removeChild(renderer.domElement);
        };
    }, [publicUrl]);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px 0',
                position: 'relative',
            }}
        >
            <div
                ref={backgroundRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${publicUrl}/background_wieschwulistaids.jpg)`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: 'auto', // Stellt sicher, dass das Bild in seiner ursprünglichen Größe wiederholt wird
                    zIndex: 1,
                    backgroundPosition: '0px 0px', // Ausgangsposition des Hintergrundbildes
                    transition: 'background-position 0.1s linear', // Smooth scrolling
                }}
            />

            <div
                id="three-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 3,
                }}
            ></div>

            <div
                ref={pdfContainerRef}
                style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh',
                    overflowY: 'scroll',
                    overflowX: 'scroll', // Hinzufügen der horizontalen Scrollbarkeit
                }}
            >
                {Array.from({ length: totalPages }, (_, i) => (
                    <canvas
                        key={i}
                        ref={el => canvasRefs.current[i] = el}
                        style={{
                            marginBottom: '20px',
                            maxWidth: '90%', // Breite des Canvases wie vorher
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
                            transition: 'opacity 1s ease',
                            backgroundColor: 'transparent',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Page2;

