import React, { useState } from 'react';
import PromoCard from '../PromoCard/PromoCard';
import styles from './PromoSlider.module.scss'; 
import { PromoCardProps } from '../PromoCard/PromoCard';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface PromoSliderProps {
  items: PromoCardProps[];
  itemsPerSlide: number;
}

const PromoSlider: React.FC<PromoSliderProps> = ({ items, itemsPerSlide }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Calculate the total number of slides
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  // Function to navigate to the next slide
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className={styles.slider}>
      <button onClick={prevSlide} className={styles.slideButton}>
        <FaArrowLeft />
      </button>
      <div className={styles.slidesContainer}>
        <div
          className={styles.slides}
          style={{
            transform: `translateX(-${(100 / itemsPerSlide) * currentSlide}%)`,
            transition: 'transform 0.5s ease-in-out',
          }}
        >
          {items.map((item, index) => (
            <div key={index} className={styles.slide} style={{ width: `${100 / itemsPerSlide}%` }}>
              <PromoCard {...item} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={nextSlide} className={styles.slideButton}>
      <FaArrowRight />
      </button>
    </div>
  );
};

export default PromoSlider;
