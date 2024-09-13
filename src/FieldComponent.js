import React from 'react';
import { motion } from 'framer-motion';
import './FieldComponent.css';

const FieldComponent = ({ id, isActive, onActivate }) => {
  return (
    <motion.div
      className={`field ${isActive ? 'active' : 'passive'}`}
      onMouseEnter={onActivate} // Setze das Feld aktiv bei Hover
      layout
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <motion.div
        className="content"
        animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1.2 : 1 }}
      >
        {/* Hier kannst du später Inhalte einfügen */}
        {isActive ? <h1>Active</h1> : <p>Passive</p>}
      </motion.div>
    </motion.div>
  );
};

export default FieldComponent;
