import Header from "../../components/Header/Header";
import { RoomCategory } from "../../models/Hotel";
import styles from "./RoomType.module.scss";
import UnavailableImage from "../../assets/Hotels/unavailable-image.jpg";
import { FaCheck } from "react-icons/fa";
import Divider from "../../components/Divider/Divider";
import Button from "../../components/Button/Button";
import { FaCartShopping } from "react-icons/fa6";
import { useState } from "react";

interface RoomTypeProps {
  roomType: RoomCategory;
  onAddToCart: (hotelRoom: RoomCategory) => void;
}

const RoomType: React.FC<RoomTypeProps> = ({ roomType, onAddToCart }) => {
  const otherImages = roomType.picture_urls.slice(1, 4);
  const totalImagesNeeded = 3 - otherImages.length;

  const [cartSuccess, setCartSuccess] = useState<boolean>(false);

  const handleAddToCart = (hotelRoom: RoomCategory) => {
    try {
      onAddToCart(hotelRoom);
      setCartSuccess(true);
    } catch (error) {
      alert("There is an error while adding to the cart");
    } 
  };

  return (
    <div className={styles.container}>
      <Header>{roomType.category_name}</Header>
      <div className={styles.content}>
        <div className={styles.imagesPlaceholder}>
          <div className={styles.mainImage}>
            <img src={roomType.picture_urls[0]} alt="" />
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
        <div className={styles.typeContainer}>
          <div className={styles.typeContent}>
            <div className={styles.typeHeader}>
              {roomType.category_name} Early Booker
            </div>
            <Divider />
            <div className="text-md font-weight-600">Room Facilities:</div>
            <div className={styles.facilities}>
              {roomType.facilities.map((facility) => (
                <div className={styles.facility}>
                  <FaCheck />
                  {facility}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.separator}></div>
          <div className={styles.priceSection}>
            <div className={styles.modifiedPrice}>Rp. {roomType.price}</div>
            <div className={styles.price}>Rp. {roomType.price}</div>
            <div className={styles.buttonsContainer}>
              <Button
                success={cartSuccess}
                outlined
                fontSize="0.9rem"
                onClick={() => handleAddToCart(roomType)}
              >
                {!cartSuccess ? (
                  <>
                    <FaCartShopping />
                    Add to Cart
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Added to Cart
                  </>
                )}
              </Button>
              <Button fontSize="0.9rem" onClick={() => {}} primary>
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomType;
