import React from 'react';
import './WindowComponent.css';

const WindowComponent = ({ isActive, quadrant }) => {
  // Initialgröße der Fenster (1/2 der Breite und Höhe des Bildschirms)
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  return (
    <div
      className={`window ${isActive ? 'active' : 'inactive'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...(quadrant === 'top-left' && { top: 0, left: 0 }),
        ...(quadrant === 'top-right' && { top: 0, right: 0 }),
        ...(quadrant === 'bottom-left' && { bottom: 0, left: 0 }),
        ...(quadrant === 'bottom-right' && { bottom: 0, right: 0 }),
      }}
    >
      {isActive ? (
        <div className="active-content">
          <h1>Aktiv</h1>
        </div>
      ) : (
        <div className="passive-content">
          <p>Inaktiv</p>
        </div>
      )}
    </div>
  );
};

export default WindowComponent;
