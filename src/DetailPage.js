import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
    <div>
      <h1>{data.title}</h1>
      <p>Category: {data.category}</p>
      <p>Object Type: {data.objectType}</p>
      <p>Tags: {data.tags.join(', ')}</p>
      <p>Uploader: {data.uploader}</p>
      <p>Created At: {new Date(data.createdAt.seconds * 1000).toLocaleString()}</p>
      {data.additionalInfo && data.additionalInfo.map((info, index) => (
        <p key={index}><a href={info} target="_blank" rel="noopener noreferrer">{info}</a></p>
      ))}
      {data.fileURLs && data.fileURLs.map((url, index) => (
        <img key={index} src={url} alt={data.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
      ))}
    </div>
  );
}

export default DetailPage;
