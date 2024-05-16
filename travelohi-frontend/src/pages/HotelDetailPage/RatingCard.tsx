import styles from "./RatingCard.module.scss";
import { FaStar } from "react-icons/fa";

interface RatingProps {
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  comfortRating: number;
  serviceRating: number;
}

const RatingCard: React.FC<RatingProps> = ({
  cleanlinessRating,
  comfortRating,
  locationRating,
  overallRating,
  serviceRating,
}) => {
  const getRatingStyle = (rating : number) => {
    if (rating >= 4) {
      return styles.good;
    } else if (rating >= 3) {
      return styles.mid;
    } else {
      return styles.bad;
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Overall {overallRating.toFixed(2)}
        <FaStar className={styles.star} />
      </div>
      <div className={styles.ratingColumn}>
        <div className={`${styles.ratingRow} ${getRatingStyle(cleanlinessRating)}`}>Cleanliness {cleanlinessRating.toFixed(2)}</div>
        <div className={`${styles.ratingRow} ${getRatingStyle(comfortRating)}`}>Comfort {comfortRating.toFixed(2)}</div>
        <div className={`${styles.ratingRow} ${getRatingStyle(locationRating)}`}>Location {locationRating.toFixed(2)}</div>
        <div className={`${styles.ratingRow} ${getRatingStyle(serviceRating)}`}>Service {serviceRating.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default RatingCard;
