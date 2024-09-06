import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import './Page4.css'; // Importiere die CSS-Datei

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

  const getRandomPositionStyle = () => {
    const top = Math.random() * 20 - 10; // Zufällige Positionierung nach oben/unten
    const left = Math.random() * 20 - 10; // Zufällige Positionierung nach links/rechts
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

  return (
    <div className="page4-container">
   
      <h1>ALL RECORDS</h1>
      <div className={`hover-title ${hoverTitle ? 'show' : ''}`}>
        {hoverTitle.split(' ').map((word, index) => (
          <span key={index} style={getRandomPositionStyle()}>{word}</span>
        ))}
      </div>
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
          {data.map((item, index) => (
            <motion.tr
              key={item.id}
              id={item.id}
              initial={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleRowClick(item.id)}
              onMouseEnter={() => setHoverTitle(item.title)}
              onMouseLeave={() => setHoverTitle('')}
              className="clickable-row"
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
    </div>
  );
}

export default Page4;
