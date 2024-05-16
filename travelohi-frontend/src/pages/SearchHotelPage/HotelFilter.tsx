import { useEffect, useState } from "react";
import styles from "./HotelFilter.module.scss";
import FormLabel from "../../components/FormLabel/FormLabel";
import { availableFacilities } from "../../models/Hotel";

interface HotelFilterProps {
  onFilterChange: (filters: {
    ratingMin: number;
    ratingMax: number;
    priceMin: number;
    priceMax: number;
    facilities : string[],
  }) => void;
}

export interface Filter {
  ratingMin: number;
  ratingMax: number;
  priceMin: number;
  priceMax: number;
  facilities : string[];
}

const HotelFilter: React.FC<HotelFilterProps> = ({ onFilterChange }) => {
  const [ratingMin, setRatingMin] = useState<number>(0);
  const [ratingMax, setRatingMax] = useState<number>(5);
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(10000000);

  const [facilities, setFacilities] = useState<string[]>([
  ]);

  const handleFilterChange = () => {
    onFilterChange({
      ratingMin,
      ratingMax,
      priceMin,
      priceMax,
      facilities
    });
  };

  const toggleFacility = (facility: string) => {
    setFacilities((prevFacilities) => {
      if (prevFacilities.includes(facility)) {
        return prevFacilities.filter((f) => f !== facility);
      } else {
        return [...prevFacilities, facility];
      }
    });
  };

  // Invoke handleFilterChange whenever any slider value changes
  useEffect(() => {
    handleFilterChange();
  }, [ratingMin, ratingMax, priceMin, priceMax, facilities]);

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <FormLabel size="lg" text="Rating Filter" />
        <FormLabel size="md" text="Minimum Rating" />
        <input
          type="range"
          min="1"
          max="5"
          step={0.1}
          value={ratingMin}
          onChange={(e) => setRatingMin(Number(e.target.value))}
        />
        <FormLabel size="md" text="Maximum Rating" />
        <input
          type="range"
          min="1"
          max="5"
          step={0.1}
          value={ratingMax}
          onChange={(e) => setRatingMax(Number(e.target.value))}
        />
        <div className={styles.valueContainer}>
          <div className={styles.value}>Min: {ratingMin}</div>
          <div className={styles.value}>Max: {ratingMax}</div>
        </div>
      </div>
      <div className={styles.filterContainer}>
        <FormLabel size="lg" text="Price Filter" />
        <FormLabel size="md" text="Minimum Price" />
        <input
          type="range"
          min="0"
          max="10000000"
          value={priceMin}
          step={100000}
          onChange={(e) => setPriceMin(Number(e.target.value))}
        />
        <FormLabel size="md" text="Maximum Price" />
        <input
          type="range"
          min="0"
          max="10000000"
          step={100000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
        />
        <div className={styles.valueContainer}>
          <div className={styles.value}>Min: {priceMin}</div>
          <div className={styles.value}>Max: {priceMax}</div>
        </div>
      </div>
      <div className={styles.filterContainer}>
        <FormLabel size="lg" text="Facilities" />
        {availableFacilities.map((facility) => (
          <div key={facility}>
            <input
              type="checkbox"
              id={facility}
              checked={facilities.includes(facility)}
              onChange={() => toggleFacility(facility)}
            />
            <label htmlFor={facility}>{facility}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelFilter;
