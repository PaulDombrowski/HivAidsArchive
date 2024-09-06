import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const words = [
  'ANGER', 'BEAUTY', 'COMFORT', 'DENIAL', 'FEAR', 'HOPE', 'INSPIRATION',
  'LOSS', 'LOVE', 'MOURNING', 'LIBERATION', 'PAIN', 'PASSION', 'SEX',
  'SHAME', 'STIGMA', 'STRENGTH', 'TRACES', 'VIOLENCE'
];

function generateRandomPosition() {
  return {
    top: `${Math.random() * 80}vh`,
    left: `${Math.random() * 80}vw`,
  };
}

function MagnetWords() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const numWords = 14;
  const wordElements = [];

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  let paired = false; // Hilfsvariable, um Paare zu erzeugen

  for (let i = 0; i < numWords; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const initialPosition = generateRandomPosition();

    const distance = Math.hypot(
      mousePos.x - parseFloat(initialPosition.left),
      mousePos.y - parseFloat(initialPosition.top)
    );

    const movementThreshold = 200;
    const isNearMouse = distance < movementThreshold;

    if (paired) {
      const secondWord = words[Math.floor(Math.random() * words.length)];
      wordElements.push(
        <motion.div
          key={`${i}-pair`}
          initial={initialPosition}
          animate={{
            x: isNearMouse ? (mousePos.x - parseFloat(initialPosition.left)) / 5 : 0,
            y: isNearMouse ? (mousePos.y - parseFloat(initialPosition.top)) / 5 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          style={{
            position: 'absolute',
            top: initialPosition.top,
            left: initialPosition.left,
            textAlign: 'left',
            zIndex: 2, // Im Vordergrund
            pointerEvents: 'none', // Klicks durchlassen
          }}
        >
          <div style={{ fontSize: '2.5rem', color: 'cyan', whiteSpace: 'nowrap' }}>{randomWord}</div>
          <div style={{ fontSize: '2.5rem', color: 'cyan', whiteSpace: 'nowrap' }}>{secondWord}</div>
        </motion.div>
      );
      paired = false;
    } else {
      wordElements.push(
        <motion.div
          key={i}
          initial={initialPosition}
          animate={{
            x: isNearMouse ? (mousePos.x - parseFloat(initialPosition.left)) / 5 : 0,
            y: isNearMouse ? (mousePos.y - parseFloat(initialPosition.top)) / 5 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          style={{
            position: 'absolute',
            top: initialPosition.top,
            left: initialPosition.left,
            fontSize: '2.5rem',
            color: 'cyan',
            whiteSpace: 'nowrap',
            zIndex: 2, // Im Vordergrund
            pointerEvents: 'none', // Klicks durchlassen
          }}
        >
          {randomWord}
        </motion.div>
      );
      paired = true;
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {wordElements}
    </div>
  );
}

export default MagnetWords;
