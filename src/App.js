import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Slideshow from './Slideshow';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6';
import Page7 from './Page7';
import DetailPage from './DetailPage'; // Importiere die DetailPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <Canvas camera={{ position: [1, 0, 5], fov: 30 }} style={{ width: '100vw', height: '100vh' }}>
              <Slideshow />
            </Canvas>
          </div>
        } />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/page3" element={<Page3 />} />
        <Route path="/page4" element={<Page4 />} />
        <Route path="/page5" element={<Page5 />} />
        <Route path="/page6" element={<Page6 />} />
        <Route path="/page7" element={<Page7 />} />
        <Route path="/detail/:id" element={<DetailPage />} /> {/* Neue Route für Detailseite */}
      </Routes>
    </Router>
  );
}

export default App;
