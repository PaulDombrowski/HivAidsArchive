import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Kein orderBy nötig
import { motion } from 'framer-motion';
import './Page3.css';
import SpiralText from './ElegantSpiralText';

const firebaseConfig = {
  apiKey: "AIzaSyDgxBvHfuv0izCJPwNwBd5Ou9brHzGBSqk",
  authDomain: "hivarchive.firebaseapp.com",
  projectId: "hivarchive",
  storageBucket: "hivarchive.appspot.com",
  messagingSenderId: "783300550035",
  appId: "1:783300550035:web:87ecf7b4d901068a7c9c66",
  measurementId: "G-3DESXXFKL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Page3() {
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverTitle, setHoverTitle] = useState('');
  const navigate = useNavigate();

  // Daten aus Firestore abrufen und shufflen
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "uploads"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      shuffleData(items); // Zufällig mischen nach Abruf
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData(); // Daten beim ersten Laden abrufen
  }, []);

  // Shufflen und Positionen zufällig verteilen
  const shuffleData = (items) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random()); // Items zufällig mischen
    setData(shuffled.slice(0, 6)); // Zeige 6 zufällige Items an
    generateRandomPositions(6); // Generiere zufällige Positionen für die 6 Items
  };

  // Zufällige Positionen für die Items berechnen
  const generateRandomPositions = (count) => {
    const positions = [];
    const spacing = 200; // Mindestabstand zwischen den Items
    const maxWidth = window.innerWidth - spacing;
    const maxHeight = window.innerHeight - spacing;

    for (let i = 0; i < count; i++) {
      let position;
      let tries = 0;

      do {
        position = {
          left: Math.floor(Math.random() * maxWidth),
          top: Math.floor(Math.random() * maxHeight),
          rotateY: 10 // Gleicher Neigungswinkel für alle Items
        };
        tries++;
      } while (
        positions.some(
          (p) =>
            Math.abs(p.left - position.left) < spacing &&
            Math.abs(p.top - position.top) < spacing
        ) && tries < 100
      );
      positions.push(position);
    }
    setPositions(positions);
  };

  // Hover-Titel anzeigen
  const handleMouseEnter = (item) => {
    setHoveredItem(item.id);
    setHoverTitle(item.title); // Setze den Hover-Titel
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoverTitle(''); // Verstecke den Hover-Titel
  };

  return (
    <div className="page-container">
      
      <button onClick={fetchData} className="shuffle-button">
        Shuffle
      </button>

      {/* Hovered Title */}
      <div className={`hover-title ${hoverTitle ? 'show' : ''}`}>
        {hoverTitle.split(' ').map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: Math.random() * 50 - 25, y: Math.random() * 50 - 25 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ display: 'inline-block', marginRight: '5px' }}
          >
            {word}
          </motion.span>
        ))}
      </div>
     
      <div className="thumbnail-container">
        {data.map((item, index) => {
          const backgroundImage = item.thumbnailURL || (item.fileURLs && item.fileURLs[0]);

          return (
            <motion.div
              key={item.id}
              className={`thumbnail-item ${hoveredItem !== null && hoveredItem !== item.id ? 'blurred' : ''}`}
              onClick={() => navigate(`/detail/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
              style={{ ...positions[index], backgroundImage: `url(${backgroundImage})` }}
              initial={{ rotateY: positions[index].rotateY }}
              animate={hoveredItem === item.id ? { rotateY: 0 } : { rotateY: positions[index].rotateY }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.1, rotateY: 0 }}
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: Math.random() * 3 + 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
            />
          );
        })}
      </div>
      <SpiralText/>
    </div>
  );
}

export default Page3;
