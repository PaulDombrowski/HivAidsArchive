

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './DetailPage.css';

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

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-page">
      <div className="detail-image-container">
        {data.thumbnailURL ? (
          <img src={data.thumbnailURL} alt={data.title} className="detail-thumbnail" />
        ) : (
          data.fileURLs && data.fileURLs.map((url, index) => (
            <img key={index} src={url} alt={data.title} className="detail-image" />
          ))
        )}
      </div>
      <div className="detail-content">
        {data.title && <h1 className="detail-title">{data.title}</h1>}
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
      </div>
    </div>
  );
}

export default DetailPage;
