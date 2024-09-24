import React, { useEffect, useRef } from 'react';

const CanvasOverlay = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/background2.jpg'; // Passe den Pfad zu deinem Bild an.

    // Funktion, um die Größe des Canvas an die Fenstergröße anzupassen.
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.globalAlpha = 0.9; // Setze die Transparenz des Bildes
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.onload = resizeCanvas;
    window.addEventListener('resize', resizeCanvas);

    // Erzeugt den Radiergummieffekt
    const drawLargeDiffuseEffect = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out'; // Modus zum Löschen
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = 70;
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';

      // Zeichne mehrere diffuse Formen für den Erase-Effekt
      for (let i = 0; i < 10; i++) {
        const offsetX = x + Math.random() * 60 - 30;
        const offsetY = y + Math.random() * 60 - 30;
        const width = Math.random() * 80 + 60;
        const height = Math.random() * 80 + 60;
        ctx.beginPath();
        ctx.ellipse(offsetX, offsetY, width, height, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const handleMouseMove = (event) => {
      // Berechne die Position der Maus relativ zum Canvas
      const { left, top } = canvas.getBoundingClientRect();
      const offsetX = event.clientX - left;
      const offsetY = event.clientY - top;
      drawLargeDiffuseEffect(offsetX, offsetY);
    };

    // Erlaube Erase-Funktion, aber nicht das Scrollen blockieren
    const enableErasing = () => {
      canvas.style.pointerEvents = 'auto'; // Canvas reagiert auf Mausbewegungen
      canvas.addEventListener('mousemove', handleMouseMove);
    };

    // Deaktiviere Mausinteraktionen, wenn nicht benötigt
    const disableErasing = () => {
      canvas.style.pointerEvents = 'none'; // Blockiert Scrollen nicht
      canvas.removeEventListener('mousemove', handleMouseMove);
    };

    // Event-Listener, die aktiviert werden, wenn der Mauszeiger über das Canvas bewegt wird
    canvas.addEventListener('mouseenter', enableErasing);
    canvas.addEventListener('mouseleave', disableErasing);

    // Cleanup, wenn die Komponente entladen wird
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mouseenter', enableErasing);
      canvas.removeEventListener('mouseleave', disableErasing);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const canvasStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    pointerEvents: 'none', // Standardmäßig blockiert es keine Scroll-Interaktionen
    width: '100%',
    height: '100vh',
  };

  return <canvas ref={canvasRef} style={canvasStyles} />;
};

export default CanvasOverlay;
