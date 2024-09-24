import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { motion } from 'framer-motion'; // Import framer-motion
import CursorComponent from './CursorComponent';
import RightTextComponent from './RightTextComponent'; // Import the RightTextComponent

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Page2() {
    const [pdf, setPdf] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const canvasRefs = useRef([]);
    const renderQueue = useRef(Promise.resolve());
    const pdfContainerRef = useRef(null);
    const textContainerRef = useRef(null);

    const publicUrl = process.env.PUBLIC_URL || '';

    useEffect(() => {
        const url = `${publicUrl}/masti_upload_version-4.pdf`;

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

    // Sync scroll between the PDF and the text in opposite directions and at different speeds
    useEffect(() => {
        const handleScroll = () => {
            if (pdfContainerRef.current && textContainerRef.current) {
                const scrollY = pdfContainerRef.current.scrollTop;
                textContainerRef.current.scrollTop = scrollY * 0.5; // Scrolls in the same direction, but slower
            }
        };

        if (pdfContainerRef.current) {
            pdfContainerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (pdfContainerRef.current) {
                pdfContainerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                position: 'relative',
            }}
        >
            {/* PDF Rendering */}
            <motion.div
                ref={pdfContainerRef}
                style={{
                    flex: '1',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100vh',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    perspective: '1000px', // Adds 3D perspective
                    scrollbarWidth: 'none', // Hide scrollbar for Firefox
                    msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
                }}
                animate={{ x: 0, y: 0 }}
                transition={{ ease: 'easeOut', duration: 1 }} // Smooth scroll effect for PDF container
            >
                {Array.from({ length: totalPages }, (_, i) => (
                    <canvas
                        key={i}
                        ref={el => canvasRefs.current[i] = el}
                        style={{
                            marginBottom: '20px',
                            maxWidth: '90%',
                            transition: 'transform 1s ease, opacity 1s ease',
                            backgroundColor: 'transparent',
                            transform: `rotateX(${i % 2 === 0 ? 10 : -10}deg) rotateY(${i % 2 === 0 ? -10 : 10}deg)`,
                            boxShadow: '0px 10px 30px rgba(255, 0, 0, 0.5)', // More noticeable and reddish shadow
                            opacity: 0.9, // Slight transparency for the PDF
                        }}
                    />
                ))}
            </motion.div>

            {/* Right Text Component - Scrolls with PDF in the opposite direction, but slower */}
            <motion.div
                ref={textContainerRef}
                style={{
                    flexBasis: '300px', // Increased width of the text container
                    height: '100vh',
                    overflowY: 'scroll', // Enable scrolling for the text container
                    color: '#9370DB', // Light purple (flieder) text color
                    fontSize: '12px', // Small text
                    padding: '10px',
                    textAlign: 'right',
                    zIndex: 3,
                    position: 'relative',
                    transform: 'rotateY(30deg)', // Adds 30-degree 3D rotation on the Y-axis
                    transformStyle: 'preserve-3d',
                    transition: 'scroll 0.2s ease-in-out', // Smooth lazy scrolling
                    scrollbarWidth: 'none', // Hide scrollbar for Firefox
                    msOverflowStyle: 'none', // Hide scrollbar for IE and Edge
                }}
            >
                <RightTextComponent />

                {/* Link Styling */}
                <style jsx>{`
                    a {
                        color: #4B0082; /* Red links */
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                `}</style>
            </motion.div>

            {/* Custom Cursor */}
            <CursorComponent />
        </div>
    );
}

export default Page2;
