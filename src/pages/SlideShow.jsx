// src/components/SlideShow.jsx
import React, { useState, useEffect } from "react";

const SlideShow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Slide duration: 4 seconds

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        overflow: "hidden",
        borderRadius: 24,
        position: "relative",
      }}
    >
      <img
        key={images[currentIndex].src}
        src={images[currentIndex].src}
        alt={images[currentIndex].alt || `slide-${currentIndex + 1}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "opacity 0.5s ease",
          opacity: 1,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default SlideShow;
