import React, { useState, useEffect } from 'react';
import './Carousel.css';

const images = [
  'Mizunki.jpg',
  'td.jpg',
  'NikiRiki.png',
  'AbibasUndAboba.jpg',
  'td.jpg',
  'Mizunki.jpg',
  'NikiRiki.png',
  'td.jpg',
  'AbibasUndAboba.jpg'
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const itemsToShow = Math.floor(windowWidth / 300);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - itemsToShow : Math.max(0, prevIndex - 1)
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= images.length - itemsToShow ? 0 : Math.min(images.length - itemsToShow, prevIndex + 1)
    );
  };

  return (
    <div className="carousel">
      <button className="carousel-button left" onClick={prevSlide}>
        &#10094; {/* < */}
      </button>

      <div
        className="carousel-content"
        style={{ transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)` }}
      >
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index}`} className="carousel-image" />
        ))}
      </div>

      <button className="carousel-button right" onClick={nextSlide}>
        &#10095;  {/* > */}
      </button>
    </div>
  );
};

export default Carousel;
