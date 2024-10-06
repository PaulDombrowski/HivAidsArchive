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
    generateRandomPositions(6); // Distribute items in a creative layout
  };

  // Generate random positions for the thumbnails
  const generateRandomPositions = (count) => {
    const positions = [];
    const maxX = window.innerWidth - 300; // Ensures thumbnails stay within window width
    const maxY = window.innerHeight - 200; // Ensures thumbnails stay within window height

    for (let i = 0; i < count; i++) {
      const position = {
        left: Math.random() * maxX,
        top: Math.random() * maxY,
        rotateZ: Math.random() * 20 - 10, // Random slight tilt
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
    <div className="page-container" style={{ position: 'relative', overflow: 'hidden' }}>
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

      {/* Shuffle Button fixed at top right */}
      <div className="shuffle-button-container">
        <motion.button
          onClick={fetchData}
          className="shuffle-button"
          style={{
            zIndex: 20, // Ensure the button is on top
            width: '200px', // Prominent but not overpowering
            height: '200px',
            borderRadius: '50%',
            border: '3px solid red',
            backgroundColor: 'transparent',
            color: 'red',
            fontSize: '28px', // Large font size
            fontFamily: 'Arial Black, sans-serif', // Arial Black font
            fontStyle: 'italic', // Italic style
            position: 'fixed', // Fixed position
            top: '20px', // Position in the top right corner
            right: '20px',
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

      <div className="thumbnail-container" style={{ position: 'relative', zIndex: 5 }}>
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
                ...positions[index], // Randomly distributed positions
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                borderRadius: '15px',
                width: '250px',
                height: '200px',
                zIndex: hoveredItem === item.id ? 10 : 5, // Bring forward on hover
                opacity: hoveredItem === item.id ? 1 : 0.4,
                transform: `rotate(${positions[index].rotateZ}deg)`,
                transition: 'opacity 0.5s, z-index 0.5s, transform 0.3s',
                overflow: 'hidden',
              }}
              initial={{
                y: 0, // Initial position
              }}
              animate={{
                y: [-5, 5], // Subtle floating effect
              }}
              transition={{
                duration: 5, // Smooth and slow floating effect
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                y: [-10, 10], // Larger floating on hover
                transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }, // Smooth, slow hover float
                scale: 1.05, // Slight scaling effect on hover
                zIndex: 10, // Bring forward on hover
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
