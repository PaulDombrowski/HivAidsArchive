import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import CursorComponent from './CursorComponent'; 
import './Page4.css'; 

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

function Page4() {
  const [data, setData] = useState([]);
  const [hoverTitle, setHoverTitle] = useState('');
  const [hoverImage, setHoverImage] = useState('');
  const [hoverImagePosition, setHoverImagePosition] = useState({ top: 0, left: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "uploads"));
        const items = [];
        querySnapshot.forEach((doc, index) => {
          items.push({ id: doc.id, number: index + 1, ...doc.data() });
        });
        setData(items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleTouchStart = () => setIsTouch(true);
    window.addEventListener('touchstart', handleTouchStart);
    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  const getRandomPositionStyle = () => {
    const top = Math.min(Math.max(Math.random() * 20 - 10, -5), 5);
    const left = Math.min(Math.max(Math.random() * 20 - 10, -5), 5);
    return {
      transform: `translate(${left}%, ${top}%)`
    };
  };

  const handleRowClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.transition = "opacity 0.5s ease-out";
      element.style.opacity = 0;
      setTimeout(() => navigate(`/detail/${id}`), 500);
    }
  };

  const handleMouseEnter = (item, event) => {
    setHoverTitle(item.title);

    // Random position for hover image near the hovered row
    const randomTop = event.clientY + Math.random() * 30 - 15;
    const randomLeft = event.clientX + Math.random() * 30 - 15;

    setHoverImagePosition({ top: randomTop, left: randomLeft });

    // Show either fileURL or thumbnailURL
    if (item.fileURLs && item.fileURLs.length > 0) {
      setHoverImage(item.fileURLs[0]); // Priority to fileURLs
    } else if (item.thumbnailURL) {
      setHoverImage(item.thumbnailURL);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      setHoverTitle('');
      setHoverImage(''); // Hide image on mouse leave
    }
  };

  const handleTouch = (title) => {
    setHoverTitle(title);
    setTimeout(() => setHoverTitle(''), 3000);
  };

  const calculateFontSize = (title) => {
    const wordCount = title.split(' ').length;
    if (wordCount > 12) {
      return `${Math.max(7, 12 - wordCount)}rem`;
    }
    return '7rem';
  };

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page4-container">
      <h1>ALL CURRENT RECORDS IN THE DATABASE</h1>

      {/* Search field */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-field"
      />

      <div
        className={`hover-title ${hoverTitle ? 'show' : ''}`}
        style={{ fontSize: calculateFontSize(hoverTitle) }}
      >
        {hoverTitle.split(' ').map((word, index) => (
          <span key={index} style={getRandomPositionStyle()}>{word}</span>
        ))}
      </div>

      {/* Hovered Image */}
      {hoverImage && (
        <motion.img
          src={hoverImage}
          alt="Hover Thumbnail"
          className="hover-image"
          style={{
            top: `${hoverImagePosition.top}px`,
            left: `${hoverImagePosition.left}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1.2 }} // Smooth fade-in and slight scaling
          transition={{ duration: 0.3 }}
        />
      )}

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <motion.tr
              key={item.id}
              id={item.id}
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }} 
              onClick={() => handleRowClick(item.id)}
              onMouseEnter={(e) => handleMouseEnter(item, e)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouch(item.title)}
              className={`clickable-row ${searchTerm ? 'found-item' : ''}`} 
            >
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td className="category">
                {item.category.map((cat, idx) => (
                  <span key={idx} className="category-item">{cat}</span>
                ))}
              </td>
              <td>{item.tags.join(', ')}</td>
              <td>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <CursorComponent />
    </div>
  );
}

export default Page4;
