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
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filterStyle, setFilterStyle] = useState('none'); // State for dynamic filter effect
  const [backgroundZIndex, setBackgroundZIndex] = useState(2); // State to control background z-index
  const navigate = useNavigate();

  // Fetch data from Firestore and shuffle
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "uploads"));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      shuffleData(items); // Shuffle after fetching
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial load
  }, []);

  // Update filter effect based on cursor movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      // Calculate proximity of the cursor to determine filter strength
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const distanceFromCursor = Math.sqrt(
        (clientX - centerX) ** 2 + (clientY - centerY) ** 2
      );

      // Adjust filter intensity: stronger near the cursor
      const maxEffectDistance = 300; // Distance within which the effect is noticeable
      const effectStrength = Math.max(
        0,
        (maxEffectDistance - distanceFromCursor) / maxEffectDistance
      );

      // Set a strong purple tint and moderate contrast near the cursor
      setFilterStyle(
        `hue-rotate(270deg) saturate(${1 + effectStrength * 3}) brightness(${
          1 + effectStrength * 0.3
        })`
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Shuffle data and distribute positions randomly
  const shuffleData = (items) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    setData(shuffled.slice(0, 6)); // Show 6 random items
    generateRandomPositions(6); // Generate random positions for the 6 items
  };

  // Generate random positions for the items
  const generateRandomPositions = (count) => {
    const positions = [];
    const spacing = 200; // Minimum spacing between items
    const maxWidth = window.innerWidth - spacing;
    const maxHeight = window.innerHeight - spacing;

    for (let i = 0; i < count; i++) {
      let position;
      let tries = 0;

      do {
        position = {
          left: Math.floor(Math.random() * maxWidth),
          top: Math.floor(Math.random() * maxHeight),
          rotateY: 10 // Same tilt angle for all items
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

  // Display hover title and bring the hovered item to the front
  const handleMouseEnter = (item) => {
    setHoveredItem(item.id);
    setHoverTitle(item.title);
    setBackgroundZIndex(0); // Move background behind items when hovered
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoverTitle('');
    setBackgroundZIndex(2); // Reset background z-index when not hovering
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      {/* Background image layer with dynamic filter */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('background2.jpg')",
          backgroundSize: 'cover', // Ensure the image covers the entire area
          backgroundPosition: 'center', // Center the image
          backgroundRepeat: 'no-repeat', // Do not repeat the image
          zIndex: backgroundZIndex, // Controlled by state to move behind thumbnails on hover
          opacity: 0.5, // Set background transparency
          pointerEvents: 'none', // Allow clicks to pass through
          transition: 'filter 0.2s ease, z-index 0.2s ease', // Smooth transition when the filter and z-index change
          filter: filterStyle, // Dynamically applied filter to manipulate the image near the cursor
        }}
      />

      {/* Large, hollow shuffle button */}
      <button
        onClick={fetchData}
        className="shuffle-button"
        style={{
          zIndex: 3,
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '20px 40px',
          fontSize: '24px',
          border: '3px solid red',
          backgroundColor: 'transparent',
          color: 'red',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Shuffle
      </button>

      {/* Hovered Title */}
      <div className={`hover-title ${hoverTitle ? 'show' : ''}`} style={{ zIndex: 3 }}>
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

      <div className="thumbnail-container" style={{ zIndex: 1 }}>
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
                backgroundSize: 'contain', // Contain the item area while keeping aspect ratio
                backgroundPosition: 'center',
                borderRadius: '15px', // Rounded corners
                width: '350px', // Uniform width for visibility
                height: '200px', // Fixed height for consistent display
                zIndex: hoveredItem === item.id ? 4 : 0, // Items start behind the background
                opacity: hoveredItem === item.id ? 1 : 0.4, // Higher opacity on hover
                transition: 'opacity 0.5s, z-index 0.5s, transform 0.3s', // Smooth transition for hover and scale
                overflow: 'hidden', // Ensure no overflow with rounded corners
              }}
              initial={{ rotateY: positions[index].rotateY }}
              animate={{
                y: [0, -10, 0], // Floating animation
                rotateY: hoveredItem === item.id ? 0 : positions[index].rotateY,
                transition: {
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                },
              }}
              whileHover={{
                scale: 1.9,
                zIndex: 5, // Bring to front on hover
              }}
            />
          );
        })}
      </div>
      <SpiralText style={{ zIndex: 3 }} />
      <CursorComponent style={{ zIndex: 3 }} />
    </div>
  );
}

export default Page3;
