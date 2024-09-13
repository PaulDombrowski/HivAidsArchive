import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import Slideshow from './Slideshow';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import DetailPage from './DetailPage';
import GradientBackground from './GradientBackground';
import MagnetWords from './MagnetWords';
import './App.css';

function MainLayout() {
  const location = useLocation();

  const pageVariants = {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {location.pathname === '/' && <GradientBackground />}
      {location.pathname === '/' && <MagnetWords />}
      <AnimatePresence>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 1 }}
              >
                <Canvas camera={{ position: [1, 0, 5], fov: 30 }} style={{ width: '100vw', height: '100vh', pointerEvents: 'auto' }}>
                  <Slideshow />
                </Canvas>
              </motion.div>
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
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basename = isLocalhost ? '/' : process.env.PUBLIC_URL || '/';

  return (
    <Router basename={basename}>
      <MainLayout />
    </Router>
  );
}

export default App;
