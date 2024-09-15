/**
 * Background Component
 *
 * This component renders a background with Vanta.js effect.
 * It creates a dynamic background with dots animation.
 * The background element is controlled using useRef and useEffect hooks.
 *
 * @returns {JSX.Element} The Background component
 */
import { useEffect, useRef, useState } from "react";
import DOTS from "vanta/dist/vanta.dots.min";

const Background = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Initialize Vanta.js effect on component mount
    if (!vantaEffect) {
      setVantaEffect(
        DOTS({
          el: bgRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          showLines: false,
          backgroundColor: 0x0d1117,
          color: 0xf20dd3,
        }),
      );
    }

    // Clean up Vanta.js effect on component unmount
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <>
      {/* Background element */}
      <div
        ref={bgRef}
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "0",
        }}
      ></div>
    </>
  );
};

export default Background;
