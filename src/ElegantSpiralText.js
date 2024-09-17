import React, { useRef, useEffect, useState } from 'react';
import './ElegantSpiralText.css';

const ElegantSpiralText = () => {
  const textRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setScrollPosition(scrollTop);
  };

  useEffect(() => {
    const textElement = textRef.current;
    textElement.style.transform = `rotateX(${scrollPosition * 0.3}deg) translateZ(${scrollPosition * -5}px)`;
  }, [scrollPosition]);

  return (
    <div className="elegant-background">
      <div className="text-container" onScroll={handleScroll}>
        <div ref={textRef} className="scroll-text">
          <p><strong>Serendipity</strong> describes the accidental perception of something that was not originally sought and turns out to be a surprising discovery...</p>
          <p>How can this practice of serendipity, which is conditioned by chance, be transferred to the <strong>digital realm</strong>? <strong>HIV/AIDS Legacy</strong>...</p>
          <p>Particularly with regard to <strong>HIV/AIDS history</strong>, it expands our understanding of historical connections between individuals, groups, and more...</p>
          <p><strong>THE DIGITAL AS EPHEMERAL</strong></p>
          {/* Add more elegant, spiral text content here */}
        </div>
      </div>
    </div>
  );
};

export default ElegantSpiralText;
