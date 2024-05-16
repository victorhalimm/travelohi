import styles from "./HotelSearchResult.module.scss";

interface SearchResultProps {
  hotelName: string;
  hotelAddress: string;
  city: string;
  onClick :() =>void ;
}

const HotelSearchResult: React.FC<SearchResultProps> = ({
  hotelName,
  hotelAddress,
  city,
  onClick
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.topContainer}>
        <div className={styles.hotelName}>{hotelName}</div>
        <div className={styles.cityContainer}>{city}</div>
      </div>
      <div className={styles.bottomContainer}>
        {hotelAddress}
      </div>
    </div>
  );
};

export default HotelSearchResult;
