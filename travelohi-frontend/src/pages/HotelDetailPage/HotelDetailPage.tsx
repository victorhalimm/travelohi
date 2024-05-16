import {  useEffect, useState } from "react";
import MainLayout from "../Layout/MainLayout";
import styles from "./HotelDetailPage.module.scss";
import { Hotel, RoomCategory } from "../../models/Hotel";
import { useParams } from "react-router-dom";
import DetailMenu from "./DetailMenu";
import OverviewCard from "./OverviewCard";
import FacilitiesCard from "./FacilitiesCard";
import RatingCard from "./RatingCard";
import Header from "../../components/Header/Header";
import RoomType from "./RoomType";
import ReviewCard from "./ReviewCard";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useUser } from "../../contexts/UserContext";
import { HotelCart, defaultHotelCart, insertHotelCart } from "../../models/Cart";

const HotelDetailPage = () => {
  const [hotel, setHotel] = useState<Hotel>();
  const { user } = useUser();

  const { id } = useParams();

  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");

  const [dateErr, setDateErr] = useState<string>("");

  const fetchHotel = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/api/hotel/${id}`);

      if (!response.ok) {
        console.log(response.status);
        throw new Error("Network Error");
      }

      const data = await response.json();
      setHotel(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getNextIndex = (currentIndex: number, arrayLength: number) => {
    if (currentIndex < arrayLength) {
      return currentIndex;
    } else {
      return currentIndex % arrayLength;
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  const handleAddCart = (hotelRoom: RoomCategory) => {


    if (!checkInDate || !checkOutDate) {
      setDateErr("Date of reservation must be filled!");
      throw new Error("Check-out date must be after check-in date.")
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) {
      setDateErr("Check-out date must be after check-in date!");
      throw new Error("Check-out date must be after check-in date.")
    }

    setDateErr("");

    const hotelCart: HotelCart = {
      ...defaultHotelCart,
      user_id: user ?  user.id : 0,
      hotel_id: hotelRoom.hotel_id,
      room_category_id: hotelRoom.ID,
      id: 0,
      checkin_date: checkIn,
      checkout_date: checkOut,
    };

    console.log(hotelCart);

    insertHotelCart(hotelCart)
    
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.imageGrid}>
          <div className={styles.bigImage}>
            <img src={hotel?.picture_urls[0]} alt="Hotel Image" />
          </div>
          <div className={styles.subImages}>
            <div className={styles.subImageContainer}>
              <div className={styles.smallImage}>
                <img
                  src={
                    hotel?.picture_urls[
                      getNextIndex(1, hotel?.picture_urls.length)
                    ]
                  }
                  alt=""
                />
              </div>
              <div className={styles.smallImage}>
                <img
                  src={
                    hotel?.picture_urls[
                      getNextIndex(2, hotel?.picture_urls.length)
                    ]
                  }
                  alt=""
                />
              </div>
            </div>
            <div className={styles.subImageContainer}>
              <div className={styles.smallImage}>
                <img
                  src={
                    hotel?.picture_urls[
                      getNextIndex(3, hotel?.picture_urls.length)
                    ]
                  }
                  alt=""
                />
              </div>
              <div className={styles.smallImage}>
                <img
                  src={
                    hotel?.picture_urls[
                      getNextIndex(4, hotel?.picture_urls.length)
                    ]
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <DetailMenu />
        <div className={styles.detailContent}>
          <div className={styles.leftContainer}>
            {hotel && (
              <>
                <OverviewCard
                  rating={hotel.overall_rating}
                  name={hotel.name}
                  address={hotel.address}
                  description={hotel.description}
                />
                <FacilitiesCard facilities={hotel.facilities} />
              </>
            )}
          </div>
          <div className={styles.rightContainer}>
            {hotel && (
              <RatingCard
                cleanlinessRating={hotel?.cleanliness_rating}
                comfortRating={hotel.comfort_rating}
                locationRating={hotel.location_rating}
                overallRating={hotel.overall_rating}
                serviceRating={hotel.service_rating}
              />
            )}
          </div>
        </div>
        <Header>Select Room Types</Header>
        <div className={styles.roomTypesContainer}>
          <div className={styles.roomTypeFilterBar}>
            <div className={styles.roomTypeDateFilter}>
              <DatePicker setValue={setCheckInDate} label="Check-In Date" />
              <DatePicker setValue={setCheckOutDate} label="Check-Out Date" />
            </div>
            <div className={styles.dateErrLabel}>{dateErr}</div>
          </div>
          {hotel?.room_categories.map((roomType) => (
            <RoomType
              onAddToCart={handleAddCart}
              roomType={roomType}
              key={`${roomType.ID}-type`}
            />
          ))}
        </div>

        {hotel && hotel?.reviews.length > 0 && (
          <div className={styles.reviewsContainer}>
            <Header>Hotel's Review</Header>

            {hotel?.reviews.map((review) => (
              <ReviewCard review={review} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HotelDetailPage;
