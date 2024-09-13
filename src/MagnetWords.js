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
  const [scrollOffset, setScrollOffset] = useState(0);
  const [numWords, setNumWords] = useState(14);
  const wordElements = [];

  useEffect(() => {
    const updateNumWords = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setNumWords(8); // Weniger Wörter für kleine Bildschirme
      } else if (width < 1200) {
        setNumWords(12); // Mittelgroße Anzahl von Wörtern
      } else {
        setNumWords(14); // Maximale Anzahl von Wörtern für große Bildschirme
      }
    };

    updateNumWords();
    window.addEventListener('resize', updateNumWords);
    return () => window.removeEventListener('resize', updateNumWords);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let paired = false;

  for (let i = 0; i < numWords; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const initialPosition = generateRandomPosition();

    const distance = Math.hypot(
      mousePos.x - parseFloat(initialPosition.left),
      mousePos.y - parseFloat(initialPosition.top)
    );

    const movementThreshold = 50;
    const isNearMouse = distance < movementThreshold;

    const scale = 1 + scrollOffset / 1000;
    const movementSpeed = isNearMouse ? 0.2 : 0.05; 

    if (paired) {
      const secondWord = words[Math.floor(Math.random() * words.length)];
      wordElements.push(
        <motion.div
          key={`${i}-pair`}
          initial={initialPosition}
          animate={{
            x: isNearMouse ? (mousePos.x - parseFloat(initialPosition.left)) * movementSpeed : 0,
            y: isNearMouse ? (mousePos.y - parseFloat(initialPosition.top)) * movementSpeed : 0,
            scale: scale,
            rotate: scrollOffset % 360, 
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 30,
            duration: 20, // Langsamere Übergänge
          }}
          style={{
            position: 'absolute',
            top: initialPosition.top,
            left: initialPosition.left,
            textAlign: 'left',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.5,
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            fontSize: '2rem',
            color: 'red', // Rot für beide Wörter
            whiteSpace: 'nowrap',
          }}
        >
          <div>{randomWord}</div>
          <div>{secondWord}</div>
        </motion.div>
      );
      paired = false;
    } else {
      wordElements.push(
        <motion.div
          key={i}
          initial={initialPosition}
          animate={{
            x: isNearMouse ? (mousePos.x - parseFloat(initialPosition.left)) * movementSpeed : 0,
            y: isNearMouse ? (mousePos.y - parseFloat(initialPosition.top)) * movementSpeed : 0,
            scale: scale,
            rotate: scrollOffset % 30, 
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 30,
            duration: 20, // Langsamere Übergänge
          }}
          style={{
            position: 'absolute',
            top: initialPosition.top,
            left: initialPosition.left,
            fontSize: '2rem',
            color: 'red', // Rot für das einzelne Wort
            fontFamily: 'Arial Black',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            zIndex: 2,
            pointerEvents: 'none',
            opacity: 0.5,
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
