import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyDgxBvHfuv0izCJPwNwBd5Ou9brHzGBSqk",
  authDomain: "hivarchive.firebaseapp.com",
  projectId: "hivarchive",
  storageBucket: "hivarchive.appspot.com",
  messagingSenderId: "783300550035",
  appId: "1:783300550035:web:87ecf7b4d901068a7c9c66",
  measurementId: "G-3DESXXFKL1"
};

// Firebase initialisieren
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Optional: Firebase Analytics initialisieren
let analytics;
try {
  analytics = getAnalytics(app);
  console.log("Firebase Analytics initialized successfully");
} catch (error) {
  console.error("Firebase Analytics initialization error:", error);
}

// Firestore initialisieren
let db;
try {
  db = getFirestore(app);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firestore initialization error:", error);
}

// Firebase Storage initialisieren
let storage;
try {
  storage = getStorage(app);
  console.log("Firebase Storage initialized successfully");
} catch (error) {
  console.error("Firebase Storage initialization error:", error);
}

export { db, storage };
