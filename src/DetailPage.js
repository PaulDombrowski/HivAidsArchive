import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './DetailPage.css'; // CSS for animations

// Firebase configuration
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

function DetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [bgColor, setBgColor] = useState('white');
  const titleRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "uploads", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const wrapText = (text, maxWords) => {
      const words = text.split(' ');
      if (words.length > maxWords) {
        return words.reduce((acc, word, i) => {
          return acc + (i > 0 && i % maxWords === 0 ? '\n' : ' ') + word;
        });
      }
      return text;
    };

    const adjustFontSize = () => {
      if (!titleRef.current || !data) return;

      const titleElement = titleRef.current;
      const maxFontSize = window.innerWidth < 768 ? 24 : 30;
      const minFontSize = 14;

      let fontSize = Math.max(minFontSize, maxFontSize - (data.title.length * 0.2));
      titleElement.style.fontSize = `${fontSize}px`;
    };

    const startAnimation = () => {
      if (!titleRef.current || !data) return;

      adjustFontSize();

      let directionX = Math.random() > 0.5 ? 1 : -1;
      let directionY = Math.random() > 0.5 ? 1 : -1;
      let posX = window.innerWidth / 2;
      let posY = window.innerHeight / 2;
      const speed = 2;

      const moveTitle = () => {
        if (!titleRef.current) return;

        const title = titleRef.current;
        const titleRect = title.getBoundingClientRect();
        const pageRect = document.documentElement.getBoundingClientRect();

        if (posX + titleRect.width >= pageRect.width || posX <= 0) {
          directionX *= -1;
          posX = Math.max(0, Math.min(posX, pageRect.width - titleRect.width));
          setBgColor(prevColor => (prevColor === 'white' ? 'red' : 'white'));
        }

        if (posY + titleRect.height >= pageRect.height || posY <= 0) {
          directionY *= -1;
          posY = Math.max(0, Math.min(posY, pageRect.height - titleRect.height));
          setBgColor(prevColor => (prevColor === 'white' ? 'red' : 'white'));
        }

        posX += directionX * speed;
        posY += directionY * speed;

        title.style.transform = `translate(${posX}px, ${posY}px)`;

        animationFrameId.current = requestAnimationFrame(moveTitle);
      };

      moveTitle();
    };

    if (data) {
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.textContent = wrapText(data.title, 5);
          startAnimation();
        }
      }, 1000);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current); // Stop the animation when the component unmounts
    };
  }, [data]);

  // 3D Interaction Effect
  useEffect(() => {
    const handleMouseMove = (event) => {
      const elements = document.querySelectorAll('.detail-thumbnail, .detail-image, .detail-info-table'); // Added the table class
      elements.forEach((element) => {
        const { left, top, width, height } = element.getBoundingClientRect();
        const x = event.clientX - (left + width / 2);
        const y = event.clientY - (top + height / 2);
        element.style.transform = `rotateY(${x / 30}deg) rotateX(${-y / 30}deg) translateZ(10px)`; // Subtle 3D effect
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove); // Remove the event listener when unmounting
    };
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`detail-page ${bgColor === 'red' ? 'red-background' : ''}`} style={{ backgroundColor: bgColor }}>
      <div className="detail-title" ref={titleRef}>
        {data.title}
      </div>

      <div className="detail-content">
        <div className="detail-image-container">
          {data.thumbnailURL ? (
            <img 
              src={data.thumbnailURL} 
              alt={data.title} 
              className="detail-thumbnail animated-image" 
            />
          ) : (
            data.fileURLs && data.fileURLs.map((url, index) => (
              <img 
                key={index} 
                src={url} 
                alt={data.title} 
                className="detail-image animated-image"
              />
            ))
          )}
        </div>

        {/* Information Table */}
        <table className="detail-info-table">
          <tbody>
            {/* Title */}
            <tr>
              <th>Title:</th>
              <td>{data.title}</td>
            </tr>
            {data.description && (
              <tr>
                <th>Description:</th>
                <td>{data.description}</td>
              </tr>
            )}
            {data.motivation && (
              <tr>
                <th>Motivation:</th>
                <td>{data.motivation}</td>
              </tr>
            )}
            {data.mood && (
              <tr>
                <th>Mood:</th>
                <td>{data.mood}</td>
              </tr>
            )}
            {data.category && (
              <tr>
                <th>Categories:</th>
                <td className="oval-container">
                  {data.category.map((cat, index) => (
                    <span key={index} className="category-oval">
                      {cat}
                    </span>
                  ))}
                </td>
              </tr>
            )}
            {data.type && (
              <tr>
                <th>Type:</th>
                <td>{data.type}</td>
              </tr>
            )}
            {data.tags && (
              <tr>
                <th>Tags:</th>
                <td>{data.tags.join(', ')}</td>
              </tr>
            )}
            {data.uploader && (
              <tr>
                <th>Uploader:</th>
                <td>{data.uploader}</td>
              </tr>
            )}
            {data.createdAt && (
              <tr>
                <th>Created At:</th>
                <td>{new Date(data.createdAt.seconds * 1000).toLocaleString()}</td>
              </tr>
            )}
            {data.source && (
              <tr>
                <th>Source:</th>
                <td>
                  <a 
                    href={data.source} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'inherit', textDecoration: 'underline' }} // Removes blue color
                  >
                    {data.source}
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailPage;
