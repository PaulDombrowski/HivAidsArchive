// Page4.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setData(items);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Gespeicherte Daten</h1>
      {/* Hover-Titel wird über dem Bildschirm angezeigt */}
      <div className={`hover-title ${hoverTitle ? 'show' : ''}`}>
        {hoverTitle}
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Object Type</th>
            <th>Tags</th>
            <th>Uploader</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => navigate(`/detail/${item.id}`)}
              onMouseEnter={() => setHoverTitle(item.title)}
              onMouseLeave={() => setHoverTitle('')}
              className="clickable-row"
            >
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.category}</td>
              <td>{item.objectType}</td>
              <td>{item.tags.join(', ')}</td>
              <td>{item.uploader}</td>
              <td>{new Date(item.createdAt.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Page4;
