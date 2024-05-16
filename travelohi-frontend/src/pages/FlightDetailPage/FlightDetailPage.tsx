import { useEffect, useMemo, useState } from "react";
import FlightCard from "../../components/FlightCard/FlightCard";
import MainLayout from "../Layout/MainLayout";
import styles from "./FlightDetailPage.module.scss";
import { Flight, defaultFlight, getFlightByID } from "../../models/Flight";
import { useParams } from "react-router-dom";
import FlightDetailCard from "./FlightDetailCard";
import Header from "../../components/Header/Header";
import { Seat } from "../../models/Seat";
import SeatBox from "./SeatBox";
import Divider from "../../components/Divider/Divider";
import Button from "../../components/Button/Button";
import { FaCartShopping } from "react-icons/fa6";
import {
  FlightCart,
  defaultFlightCart,
  insertFlightCart,
} from "../../models/Cart";
import { useUser } from "../../contexts/UserContext";
import { FaCheck } from "react-icons/fa";

const FlightDetailPage = () => {
  const { user } = useUser();
  const [flight, setFlight] = useState<Flight>(defaultFlight);
  const { id } = useParams();
  const [baggageOption, setBaggageOption] = useState<number>(0);
  const [seats, setSeats] = useState<Seat[]>([]);

  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);

  const selectedSeat = useMemo(() => {
    return seats.find((seat) => seat.id === selectedSeatId);
  }, [seats, selectedSeatId]);

  const seatPrice = selectedSeat?.class === "Business" ? 100000 : 50000;
  const [cartSuccess, setCartSuccess] = useState<boolean>(false);

  const baggagePrice = useMemo(() => {
    switch (baggageOption) {
      case 5:
        return 100000;
      case 10:
        return 150000;
      default:
        return 0;
    }
  }, [baggageOption]);

  const fetchFlightByID = async () => {
    const temp = await getFlightByID(Number(id));

    if (temp) {
      setFlight(temp);
      console.log(temp);
      return;
    }

    console.log("Something wrong with the fetch");
  };
  useEffect(() => {
    fetchFlightByID();
  }, []);

  useEffect(() => {
    const rows = 30;
    const seatsPerRow = 6;
    const seatLabels = ["A", "B", "C", "D", "E", "F"];

    const generatedSeats: Seat[] = [];

    for (let row = 1; row <= rows; row++) {
      for (let seatIndex = 0; seatIndex < seatsPerRow; seatIndex++) {
        const seatLabel = seatLabels[seatIndex];

        const formattedRow = row < 10 ? `0${row}` : `${row}`;
        generatedSeats.push({
          id: `${seatLabel}${formattedRow}`,
          class: row <= 8 ? "Business" : "Economy",
          isSelected: false,
        });
      }
    }

    setSeats(generatedSeats);
  }, []);

  const handleSelectSeat = (id: string) => {
    console.log(flight);
    setSelectedSeatId(id);
  };

  const handleAddFlightCart = () => {
    if (!flight || !selectedSeatId || !user) {
      alert("User must select a seat!");
      return;
    }

    const flightCart: FlightCart = {
      ...defaultFlightCart,
      flight_id: Number(id),
      baggage_price: baggagePrice,
      seat_id: selectedSeatId,
      user_id: user?.id,
      total_price: totalPrice
    };

    // console.log(flightCart);

    try {
      insertFlightCart(flightCart);
      setCartSuccess(true);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const totalPrice = flight?.price + seatPrice + baggagePrice;

  return (
    <MainLayout>
      <div className={styles.container}>
        {flight && (
          <>
            <FlightCard choosable={false} flight={flight} />
            <div className={styles.detailContainer}>
              <FlightDetailCard flight={flight} />
              <div className={styles.baggageContainer}>
                <Header size="h3">Baggage</Header>
                <div className={`${styles.descriptiveText} mb-10`}>
                  Need additional checked baggage? Buy it now and save time at
                  the airport!
                </div>
                <div className={styles.baggageRadios}>
                  <div className={styles.radioContainer}>
                    <label htmlFor="no">
                      <input
                        onClick={() => setBaggageOption(0)}
                        id="no"
                        type="radio"
                        name="weight"
                      />
                      No Additional Weight
                    </label>
                  </div>
                  <div className={styles.radioContainer}>
                    <label htmlFor="5kg">
                      <input
                        onClick={() => setBaggageOption(5)}
                        id="5kg"
                        type="radio"
                        name="weight"
                      />
                      5 kg
                    </label>
                  </div>
                  <div className={styles.radioContainer}>
                    <label htmlFor="10kg">
                      <input
                        onClick={() => setBaggageOption(10)}
                        id="10kg"
                        type="radio"
                        name="weight"
                      />
                      10 kg
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.seatAndBaggageContainer}>
              <div className={styles.seatContainer}>
                <Header>Seat Selection</Header>
                <div className={styles.seatSelection}>
                  {Array.from({ length: 30 }, (_, rowIndex) => (
                    <div key={rowIndex} className={styles.seatRow}>
                      <div className={styles.seatGroup}>
                        {seats
                          .filter(
                            (seat) =>
                              parseInt(seat.id.slice(1)) === rowIndex + 1 &&
                              ["A", "B", "C"].includes(seat.id[0])
                          )
                          .map((seat) => (
                            <SeatBox
                              isSelected={seat.id === selectedSeatId}
                              key={seat.id}
                              seat={seat}
                              onSelect={() => handleSelectSeat(seat.id)}
                              occupied={flight.occupied_seat && flight.occupied_seat.includes(seat.id)}
                            />
                          ))}
                      </div>
                      <div className={styles.seatGroup}>
                        {seats
                          .filter(
                            (seat) =>
                              parseInt(seat.id.slice(1)) === rowIndex + 1 &&
                              ["D", "E", "F"].includes(seat.id[0])
                          )
                          .map((seat) => (
                            <SeatBox
                              isSelected={seat.id === selectedSeatId}
                              key={seat.id}
                              seat={seat}
                              onSelect={() => handleSelectSeat(seat.id)}
                              occupied={flight.occupied_seat && flight.occupied_seat.includes(seat.id)}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedSeatId && (
                <div className={styles.summaryContainer}>
                  <Header size="h2">Summary</Header>
                  <div className={styles.seatingDisplay}>
                    <div className={`${styles.seatingInfo} mb-10`}>
                      <div className={styles.headerInfoText}>
                        {flight.airline.name}
                      </div>
                      <div className={styles.headerInfoText}>
                        {selectedSeatId}
                      </div>
                    </div>
                    <div className={styles.seatingInfo}>
                      <div className={styles.infoText}>Class</div>
                      <div className={styles.infoText}>
                        {selectedSeat?.class}
                      </div>
                    </div>
                    <div className={styles.seatingInfo}>
                      <div className={styles.infoText}>Seating Price</div>
                      <div className={styles.infoText}>IDR {seatPrice}</div>
                    </div>
                  </div>
                  <div className={styles.priceField}>
                    <div className={styles.priceLabel}>Flight Price</div>
                    <div className={styles.priceAmount}>IDR {flight.price}</div>
                  </div>
                  {baggageOption !== 0 && (
                    <div className={styles.priceField}>
                      <div className={styles.priceLabel}>Baggage Price</div>
                      <div className={styles.priceAmount}>
                        IDR {baggagePrice}
                      </div>
                    </div>
                  )}
                  <div className={styles.priceField}>
                    <div className={styles.priceLabel}>Seating Price</div>
                    <div className={styles.priceAmount}>IDR {seatPrice}</div>
                  </div>
                  <Divider />
                  <div className={styles.priceField}>
                    <div className={styles.totalPriceLabel}>Total Price</div>
                    <div className={styles.totalPriceAmount}>
                      IDR {totalPrice}
                    </div>
                  </div>
                  <div className={styles.buttonsContainer}>
                    <Button success={cartSuccess} onClick={handleAddFlightCart} outlined>
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
                    <Button primary>Book Now</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default FlightDetailPage;
