import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; 
import { motion } from 'framer-motion';
import './Page3.css';
import SpiralText from './ElegantSpiralText';
import CursorComponent from './CursorComponent';

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

  // Fetch data from Firestore and shuffle
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "uploads"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      shuffleData(items);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Shuffle data and distribute positions
  const shuffleData = (items) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setData(shuffled.slice(0, 6)); // Show 6 random items
    generateCircularPositions(6); // Arrange items in a circular formation
  };

  // Generate circular positions for the thumbnails
  const generateCircularPositions = (count) => {
    const positions = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = 300; // Radius for the circle
    const angleStep = (2 * Math.PI) / count; // Equal spacing in a circle

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      const position = {
        left: centerX + radius * Math.cos(angle) - 150,
        top: centerY + radius * Math.sin(angle) - 100,
        rotateZ: angle * (180 / Math.PI),
      };
      positions.push(position);
    }
    setPositions(positions);
  };

  // Display hover title and bring the hovered item to the front
  const handleMouseEnter = (item) => {
    setHoveredItem(item.id);
    setHoverTitle(item.title);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoverTitle('');
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Background image layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('background2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Circular Shuffle Button */}
      <div className="shuffle-button-container">
        <motion.button
          onClick={fetchData}
          className="shuffle-button"
          style={{
            zIndex: 10, // High enough z-index to stay on top
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '3px solid red',
            backgroundColor: 'transparent',
            color: 'red',
            fontSize: '22px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(0deg)',
            animation: 'rotateShuffle 5s linear infinite',
          }}
        >
          Shuffle
        </motion.button>
      </div>

      {/* Hovered Title - Larger with line breaks */}
      <div className={`hovered-title-large ${hoverTitle ? 'show' : ''}`} style={{ zIndex: 15 }}>
        {hoverTitle.split(' ').map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: Math.random() * 20 - 10 }} // More tilt
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ display: 'inline-block', marginRight: '5px', fontSize: '10rem' }} // Larger text size
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
              className={`thumbnail-item ${
                hoveredItem !== null && hoveredItem !== item.id ? 'blurred' : ''
              }`}
              onClick={() => navigate(`/detail/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
              style={{
                ...positions[index],
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                borderRadius: '15px',
                width: '300px',
                height: '200px',
                zIndex: hoveredItem === item.id ? 6 : 2, // Keep below the shuffle button
                opacity: hoveredItem === item.id ? 1 : 0.4,
                transform: `rotate(${positions[index].rotateZ}deg)`,
                transition: 'opacity 0.5s, z-index 0.5s, transform 0.3s',
                overflow: 'hidden',
              }}
              whileHover={{
                scale: 1.5,
                zIndex: 6,
              }}
            />
          );
        })}
      </div>

      <SpiralText style={{ zIndex: 5 }} />
      <CursorComponent style={{ zIndex: 5 }} />
    </div>
  );
}

export default Page3;
