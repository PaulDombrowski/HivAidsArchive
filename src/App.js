import React, { useRef, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Slideshow from './Slideshow';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import DetailPage from './DetailPage';
import './App.css'; // Für die Animation und zusätzliche Styles

function BackgroundText() {
  const [backgroundColor, setBackgroundColor] = useState('#ff69b4'); // Dezenteres Rosa im Ausgangszustand
  const timeoutRef = useRef(null);

  const handleInteraction = () => {
    // Bei Interaktionen den Hintergrund auf Rot ändern
    setBackgroundColor('red');

    // Timeout setzen, um nach einer kurzen Zeit wieder auf rosa zurückzugehen
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setBackgroundColor('#ff69b4'); // Zurück zu einem dezenteren Rosa
    }, 500); // Nach 500ms wieder zurück
  };

  useEffect(() => {
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('mousedown', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('mousedown', handleInteraction);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        zIndex: 0, // Ensures it stays behind other content
        transition: 'background-color 0.5s ease', // Smooth transition between colors
      }}
    >
      <div className="scrolling-text">
        HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS&nbsp;&nbsp;HIV/AIDS
      </div>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {location.pathname === '/' && <BackgroundText />}
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
              <Canvas camera={{ position: [1, 0, 5], fov: 30 }} style={{ width: '100vw', height: '100vh' }}>
                <Slideshow />
              </Canvas>
            </div>
          }
        />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
        <Route path="/page6" element={<Page6 />} />
        <Route path="/page7" element={<Page7 />} />
        <Route path="/detail/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const basename = isLocalhost ? "/" : process.env.PUBLIC_URL;

  return (
    <Router basename={basename}>
      <MainLayout />
    </Router>
  );
}

export default App;
