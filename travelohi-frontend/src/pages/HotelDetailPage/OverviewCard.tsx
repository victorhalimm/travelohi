import Divider from "../../components/Divider/Divider";
import styles from "./OverviewCard.module.scss";
import { FaStar } from "react-icons/fa";

interface OverviewCardProps {
  name: string;
  address: string;
  description: string;
  rating: number;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  address,
  description,
  name,
  rating,
}) => {
  const ceiledRating = Math.ceil(rating);

  // Create an array of stars based on the ceiledRating
  const starsArray = Array.from(
    { length: ceiledRating },
    (_, index) => index + 1
  );


  return (
    <div className={styles.container}>
      <div className={styles.hotelNameContainer}>
        <div className={styles.hotelName}>{name}</div>
      <div className={styles.starContainer}>
        {
            starsArray.map((star) => (
                <FaStar key={star}/>
            ))
        }
      </div>
      </div>
      <div className={styles.address}>{address}</div>
      <Divider />
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default OverviewCard;
