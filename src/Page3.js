import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './Page3.css';

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
  const [visibleData, setVisibleData] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [positions, setPositions] = useState([]); // Stores the random positions
  const [hoverTitle, setHoverTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "uploads"));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
        shuffleData(items); // Shuffle data on first load
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const shuffleData = (items = data) => {
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selectedItems = shuffled.slice(0, 6); // Only select 6 items
    setVisibleData(selectedItems);
    setPositions(selectedItems.map(() => getRandomPosition())); // Generate random positions for each thumbnail
  };

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (window.innerWidth - 200));
    const y = Math.floor(Math.random() * (window.innerHeight - 200));
    return { left: `${x}px`, top: `${y}px` };
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item.id);
    setHoverTitle(item.title);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoverTitle('');
  };

  return (
    <div className="page-container">
      <h1>Entdecke die Thumbnails</h1>
      <button onClick={() => shuffleData()} className="shuffle-button">
        Shuffle
      </button>

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
        {visibleData.map((item, index) => {
          const backgroundImage = item.thumbnailURL || (item.fileURLs && item.fileURLs[0]);

          return (
            <div
              key={item.id}
              className={`thumbnail-item ${hoveredItem === item.id ? 'hovered' : ''}`}
              onClick={() => navigate(`/detail/${item.id}`)}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
              style={{ ...positions[index], backgroundImage: `url(${backgroundImage})` }}
            >
              {hoveredItem === item.id && (
                <div className="thumbnail-info">
                  <p><strong>{item.title}</strong></p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page3;
