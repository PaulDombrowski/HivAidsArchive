import React, { useRef, useEffect, useState } from 'react';

const Page7 = () => {
  const rightTextRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [filterStyle, setFilterStyle] = useState('none');
  const [cursorSize, setCursorSize] = useState(40);
  const [rightTransform, setRightTransform] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundScaleY, setBackgroundScaleY] = useState(1);
  const [rightTextZIndex, setRightTextZIndex] = useState(-2);
  const requestRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setCursorPosition({ x: clientX, y: clientY });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const relativeY = (clientY / windowHeight - 0.5) * 2;

      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      const distanceFromCenter = Math.sqrt(
        (clientX - centerX) ** 2 + (clientY - centerY) ** 2
      );

      const maxSize = 60;
      const minSize = 20;
      const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
      const size = maxSize - (distanceFromCenter / maxDistance) * (maxSize - minSize);
      setCursorSize(size);

      const maxEffectDistance = 400;
      const effectStrength = Math.max(
        0,
        (maxEffectDistance - distanceFromCenter) / maxEffectDistance
      );

      const lightStrengthX = (clientX / windowWidth - 0.5) * 100;
      const lightStrengthY = (clientY / windowHeight - 0.5) * 100;

      setFilterStyle(
        `drop-shadow(${lightStrengthX}px ${lightStrengthY}px 20px rgba(255, 255, 255, 0.3)) blur(${
          effectStrength * 1.5
        }px) brightness(${1 + effectStrength * 0.2}) contrast(${1 + effectStrength * 0.3})`
      );

      const newScaleY = 1 + Math.abs(relativeY * 0.1);
      setBackgroundScaleY(newScaleY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleMouseMoveOverRightText = (e) => {
    const updateRightTransform = () => {
      setRightTransform({
        x: e.clientX / 200,
        y: e.clientY / 200,
      });
    };
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(updateRightTransform);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setRightTextZIndex(5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRightTextZIndex(-2);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Cursor Gradient Effect */}
      <div
        style={{
          ...styles.gradientAroundCursor,
          top: `${cursorPosition.y - 100}px`,
          left: `${cursorPosition.x - 100}px`,
        }}
      />

      {/* Background Image with Dynamic Effects */}
      <div
        className="backgroundImage"
        style={{
          ...styles.backgroundImage,
          filter: filterStyle,
          transform: `scaleY(${backgroundScaleY})`,
        }}
      />

      {/* Custom Cursor */}
      <div
        style={{
          ...styles.customCursor,
          top: `${cursorPosition.y}px`,
          left: `${cursorPosition.x}px`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
        }}
      />

      {/* Right Text Wrapper with Impressum */}
      <div
        style={{
          ...styles.rightTextWrapper,
          ...(!isHovered ? styles.rightTextWrapperDefault : styles.rightTextWrapperHover),
          transform: `translate(${rightTransform.x}px, ${rightTransform.y}px) ${
            isHovered ? 'scale(1.05) rotateY(20deg)' : 'rotateY(40deg)'
          }`,
          zIndex: rightTextZIndex,
          transition: 'transform 0.3s ease, z-index 0.3s ease',
        }}
        ref={rightTextRef}
        onMouseMove={handleMouseMoveOverRightText}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

      <br />  <br />  <br />  <br />  <br />  <br />   <br />
        <h1>IMPRESSUM</h1>
        


        <p>Email: [pleasearchiveme@gmail.com]</p>
       
  
        <p><strong>Project Purpose</strong></p>
        <p>
          The Open HIV Archive is an artistic project and digital collection dedicated to preserving and curating digital traces related to HIV/AIDS. Our platform allows users to upload content and aims to reflect the diverse history and narratives associated with HIV/AIDS. Content available on this site, including images and texts, may often originate from external sources, with attributions and links provided to the original creators wherever possible.
        </p>

        <p><strong>Content Liability</strong></p>
        <p>
          We take great care in curating the content on this website; however, we cannot guarantee the accuracy, completeness, or current relevance of the information provided. The Open HIV Archive is not a permanent archive but rather a collection of curated digital traces.
        </p>

        <p><strong>External Links</strong></p>
        <p>
          Our site contains links to external websites. We do not have control over the content of these external sites and cannot accept responsibility for their content. The respective provider or operator of the linked pages is always responsible for their content. At the time of linking, the pages were checked for potential legal violations, and no illegal content was recognizable. Permanent control of the linked pages is unreasonable without concrete indications of a legal violation. Upon notification of such infringements, we will remove the respective links immediately.
        </p>

        <p><strong>Copyright Notice</strong></p>
        <p>
          All rights to the content featured on this site, such as images, texts, and media, remain with their respective copyright holders. We strive to respect copyright laws and accurately credit all sources. If you are the owner of any content featured here and do not wish for it to be included, please contact us at [your.email@example.com], and we will promptly address your concerns.
        </p>

        <p><strong>Liability for User Contributions</strong></p>
        <p>
          The platform allows user contributions. We do not verify, endorse, or support the authenticity of content uploaded by third parties. Users are solely responsible for the material they contribute. Should any third-party content infringe on your rights, please contact us, and we will take appropriate action.
        </p>

        <p><strong>No Warranty</strong></p>
        <p>
          This website and its content are provided "as is" without any warranties of any kind, either express or implied. We do not guarantee that the site will be uninterrupted, error-free, or free from harmful components.
        </p>

        <p><strong>Limitation of Liability</strong></p>
        <p>
          Under no circumstances shall we be liable for any direct, indirect, incidental, special, or consequential damages arising out of the use of, or inability to use, this site or any content herein, even if advised of the possibility of such damages.
        </p>

        <p><strong>Right to Amend Content</strong></p>
        <p>
          We reserve the right to amend, update, or remove any content on this platform without prior notice. The Open HIV Archive is a living project, and its content evolves continuously.
        </p>

        <p><strong>Contact for Content Concerns</strong></p>
        <p>
          If you have any questions, concerns, or believe that any material on this site should not be displayed, please contact us at [pleasearchiveme@gmail.com]. We are committed to reviewing and addressing your concerns promptly.
        </p>

        <p><strong>Dispute Resolution</strong></p>
        <p>
          We are not willing or obligated to participate in dispute resolution proceedings before a consumer arbitration board.
        </p>
        <br />  <br />  <br />   <br />
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100vh',
    width: '100%',
    padding: '50px',
    perspective: '1000px',
    overflow: 'hidden',
    cursor: 'none',
    position: 'relative',
    background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
  },
  gradientAroundCursor: {
    position: 'fixed',
    width: '1000px',
    height: '1000px',
    borderRadius: '20%',
    background: 'radial-gradient(circle, rgba(106, 13, 173, 0.9) 0%, rgba(106, 13, 173, 0) 80%)',
    mixBlendMode: 'color-dodge',
    pointerEvents: 'none',
    zIndex: 2,
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
    filter: 'blur(400px)',
  },
  backgroundImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: "url('background2.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 1,
    opacity: 0.4,
    pointerEvents: 'none',
    transition: 'transform 0.3s ease-out, filter 0.2s ease-out, opacity 0.2s ease-out',
    willChange: 'transform, filter, opacity',
  },
  customCursor: {
    position: 'fixed',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(128,0,0,0.5) 100%)',
    boxShadow: '0 0 20px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
  },
  rightTextWrapper: {
    width: '70%',
    height: '100vh',
    overflowY: 'scroll',
    fontSize: '1.2rem',
    lineHeight: '1.5',
    textAlign: 'left',
    zIndex: -5,
    padding: '20px 40px',
    marginLeft: '300px',
    marginRight: '0px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    transformStyle: 'preserve-3d',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
  rightTextWrapperDefault: {
    color: '#6B14B8',
  },
  rightTextWrapperHover: {
    color: '#FF0000',
  },
};

export default Page7;
