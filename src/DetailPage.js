import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './DetailPage.css'; // Hier legen wir die CSS-Animationen fest

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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page" style={{ backgroundColor: bgColor }}>
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
        {data.description && <p className="detail-description">{data.description}</p>}
        <div className="detail-info">
          {data.category && <p><strong>Category:</strong> {data.category.join(', ')}</p>}
          {data.type && <p><strong>Type:</strong> {data.type}</p>}
          {data.tags && <p><strong>Tags:</strong> {data.tags.join(', ')}</p>}
          {data.uploader && <p><strong>Uploader:</strong> {data.uploader}</p>}
          {data.createdAt && <p><strong>Created At:</strong> {new Date(data.createdAt.seconds * 1000).toLocaleString()}</p>}
        </div>
        {data.source && data.source.includes('youtube.com') ? (
          <div className="youtube-video">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${new URLSearchParams(new URL(data.source).search).get('v')}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          data.source && <p><strong>Source:</strong> <a href={data.source} target="_blank" rel="noopener noreferrer">{data.source}</a></p>
        )}

        {data.additionalInfo && data.additionalInfo.length > 0 && (
          <div className="detail-links">
            <h3>Linked Resources:</h3>
            {data.additionalInfo.map((info, index) => (
              <p key={index}><a href={info} target="_blank" rel="noopener noreferrer">{info}</a></p>
            ))}
          </div>
        )}

        {data.motivation && (
          <div className="detail-motivation">
            <h3>Motivation:</h3>
            <p>{data.motivation}</p>
          </div>
        )}
        {data.mood && (
          <div className="detail-mood">
            <h3>Mood:</h3>
            <p>{data.mood}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPage;
