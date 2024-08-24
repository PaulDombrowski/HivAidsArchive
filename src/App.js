import React, { useRef, useEffect } from 'react';
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

function Background({ scrollSpeed = 0.3 }) {
  const backgroundRef = useRef(null);
  const scrollPosition = useRef({ x: 0, y: 0 });

  const handleScroll = (event) => {
    scrollPosition.current.y += event.deltaY * scrollSpeed;
    scrollPosition.current.x += event.deltaX * scrollSpeed;

    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundPosition = `${scrollPosition.current.x}px ${scrollPosition.current.y}px`;
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, []);

  return (
    <div
      ref={backgroundRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url(${process.env.PUBLIC_URL}/background_wieschwulistaids.jpg)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        zIndex: 1,
        backgroundPosition: '0px 0px',
        transition: 'background-position 0.15s ease-out', // Faster and smoother transition
      }}
    />
  );
}

function MainLayout() {
  const location = useLocation();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {location.pathname === '/' && <Background />} {/* Only show the background on the main route */}
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
