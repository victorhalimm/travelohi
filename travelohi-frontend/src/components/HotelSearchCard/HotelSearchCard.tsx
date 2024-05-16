import { Hotel, RoomCategory } from "../../models/Hotel";
import styles from "./HotelSearchCard.module.scss";
import UnavailableImage from "../../assets/Hotels/unavailable-image.jpg";
import TravelohiIcon from "../../assets/travelohi-icon.png";
import { FaMapMarker } from "react-icons/fa";
import { useEffect, useState } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

interface HotelSearchCardProps {
  hotel: Hotel;
}

const HotelSearchCard: React.FC<HotelSearchCardProps> = ({ hotel }) => {
  const otherImages = hotel.picture_urls.slice(1, 4);
  const totalImagesNeeded = 3 - otherImages.length;

  const reviewCount = hotel.reviews ? hotel.reviews.length : 0;

  const displayedFacilities = hotel.facilities.slice(0, 4);
  const additionalFacilities =
    hotel.facilities.length > 4 ? `+ ${hotel.facilities.length - 4} more` : "";

  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);

  const navigate = useNavigate();

  // Fetch room categories when the component mounts
  useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/hotel/category/${hotel.ID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch room categories");
        }
        const data: RoomCategory[] = await response.json();
        setRoomCategories(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoomCategories();
  }, [hotel.ID]);

  const handleChooseRoom = (id : number) => {
    navigate(`/hotel/${id}`);
  }

  return (
    <div className={styles.container}>
      <div className={styles.imagesPlaceholder}>
        <div className={styles.mainImage}>
          <img
            src={hotel.picture_urls[0] || UnavailableImage}
            alt="Main Hotel Image"
          />
        </div>
        <div className={styles.otherImages}>
          {otherImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Hotel Image ${index + 1}`}
              className={styles.otherImage}
            />
          ))}
          {[...Array(totalImagesNeeded)].map((_, index) => (
            <img
              key={`placeholder-${index}`}
              src={UnavailableImage}
              alt="Unavailable"
              className={styles.otherImage}
            />
          ))}
        </div>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.headerContainer}>
          <div className={styles.title}>{hotel.name}</div>
          <div className={styles.rating}>
            <div className={styles.icon}>
              <img src={TravelohiIcon} alt="" />
            </div>
            <div>{hotel.overall_rating.toFixed(1)}</div>
            <div className={styles.reviewCount}>
              ({reviewCount.toLocaleString()})
            </div>
          </div>
        </div>
        <div className={styles.locationAndFacilities}>
          <div className={styles.location}>
            <FaMapMarker />
            {hotel.address}
          </div>
          <div className={styles.facilities}>
            {displayedFacilities.map((facility, index) => (
              <div key={index} className={styles.facility}>
                {facility}
              </div>
            ))}
            {additionalFacilities && (
              <div className={styles.facility}>{additionalFacilities}</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.separator}></div>
      {roomCategories.length > 0 && (
        <div className={styles.bookContainer}>
          {/* Assuming you want to display something from the first room category if it exists */}
          <div className={styles.modifiedPrice}>
            Rp. {roomCategories[0].price * 120 / 100}
          </div>
          <div className={styles.price}>Rp. {roomCategories[0].price}</div>
          <Button onClick={() => handleChooseRoom(hotel.ID)} primary>Choose Room</Button>
        </div>
      )}
    </div>
  );
};

export default HotelSearchCard;
