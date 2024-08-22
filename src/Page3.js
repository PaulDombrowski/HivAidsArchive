import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import './Page3.css'; // Importiere die CSS-Datei

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
    const selectedItems = shuffled.slice(0, 15);
    setVisibleData(selectedItems);
    setPositions(selectedItems.map(() => getRandomPosition()));
  };

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (window.innerWidth - 200));
    const y = Math.floor(Math.random() * (window.innerHeight - 200));
    return { left: `${x}px`, top: `${y}px` };
  };

  return (
    <div className="page-container">
      <h1>Entdecke die Thumbnails</h1>
      <button onClick={() => shuffleData()} className="shuffle-button">
        Shuffle
      </button>
      <div className="thumbnail-container">
        {visibleData.map((item, index) => (
          <div
            key={item.id}
            className={`thumbnail-item ${hoveredItem === item.id ? 'hovered' : ''}`}
            onClick={() => navigate(`/detail/${item.id}`)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{ ...positions[index], backgroundImage: `url(${item.thumbnailUrl})` }} // Assuming you have a `thumbnailUrl` in your data
          >
            {hoveredItem === item.id && (
              <div className="thumbnail-info">
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Tags:</strong> {item.tags.join(', ')}</p>
                <p><strong>Uploader:</strong> {item.uploader}</p>
                <p><strong>Created At:</strong> {new Date(item.createdAt.seconds * 1000).toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page3;
