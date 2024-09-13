import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GradientBackground from './GradientBackground'; // Statische relative Pfade
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import DetailPage from './DetailPage';
import './App.css';

// Page transition animations
const pageVariants = {
  initial: {
    opacity: 1,
    backgroundColor: 'rgba(255, 0, 0, 1)', // Strong red during transition
  },
  in: {
    opacity: 1,
    backgroundColor: 'rgba(255, 0, 0, 0)', // Fade out red
    transitionEnd: {
      backgroundColor: 'transparent', // Ensure background is transparent after the red fades out
    },
  },
  out: {
    opacity: 0,
    backgroundColor: 'rgba(255, 0, 0, 1)', // Strong red while leaving the page
  },
};

// Page content fade-in animations
const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Smooth transition settings
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.6,
};

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showGradientBackground, setShowGradientBackground] = useState(true);

  // Toggle background visibility based on current route
  useEffect(() => {
    if (location.pathname !== '/') {
      setTimeout(() => {
        setShowGradientBackground(false);
      }, 600);
    } else {
      setShowGradientBackground(true);
    }
  }, [location.pathname]);

  // handleClick function to navigate to Page1 when clicking on the gradient background
  const handleGradientClick = () => {
    navigate('/page1');
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Gradient Background only on the home page */}
      <AnimatePresence mode="wait">
        {location.pathname === '/' && showGradientBackground && (
          <motion.div
            key="gradient-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 1000, // Erhöhte Priorität, damit es über allen anderen Elementen ist
              cursor: 'pointer',
            }}
            onClick={handleGradientClick}
          >
            <GradientBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ position: 'relative', zIndex: 1, width: '100vw', height: '100vh' }}
              >
                {/* No Slideshow here */}
              </motion.div>
            }
          />
          <Route
            path="/page1"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                style={{ position: 'relative', zIndex: 1, width: '100vw', height: '100vh' }}
              >
                {/* Page content that fades in */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={contentVariants}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Page1 />
                </motion.div>
              </motion.div>
            }
          />
          {/* Weitere Routen */}
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const basename = isLocalhost ? '/' : process.env.PUBLIC_URL;

  return (
    <Router basename={basename}>
      <MainLayout />
    </Router>
  );
}

export default App;
