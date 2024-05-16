import { Flight } from "../../models/Flight";
import styles from "./FlightCard.module.scss";
import { FaPlane } from "react-icons/fa";
import Button from "../Button/Button";

interface FlightCardProps {
  flight: Flight;
  choosable?: boolean;
  cartPrice?: number;
  cartSeat?: string;
  showDepartureDate ?: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  choosable = false,
  cartPrice = 0,
  cartSeat = "",
  showDepartureDate = false
}) => {
  const departureDate = new Date(flight.departure_date);
  const arrivalDate = new Date(flight.arrival_date);

  function getTimeIn24HourFormat(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  }

  function calculateDuration(departure: Date, arrival: Date) {
    const difference = arrival.getTime() - departure.getTime();
    const hours = Math.abs(Math.floor(difference / (1000 * 60 * 60)));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  }

  function formatDate(date: Date): string {
    // Arrays holding the names of days and months
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Getting the parts of the date
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Formatting the hours and minutes to ensure two digits
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");

    // Assembling the formatted date string
    return `${dayName}, ${day} ${month} - ${formattedHours}:${formattedMinutes}`;
  }
  return (
    <div className={styles.container}>
      <div className={styles.flightInfoContainer}>
        <div className={styles.airlineName}>
          <img src={flight.airline.image_url} alt="" />
          {flight.airline.name}
          <div className={styles.seatContainer}>{cartSeat}</div>
        </div>
        <div className={styles.timeContainer}>
          <div className={styles.timePlaceholder}>
            <div className={styles.timeBold}>
              {getTimeIn24HourFormat(departureDate)}
            </div>
            <div className={styles.airportCode}>
              {flight.origin_airport.airport_code}
            </div>
          </div>
          <div className={styles.durationContainer}>
            <div className={styles.airplaneLogo}>
              <FaPlane />
            </div>
            <div className={styles.durationText}>
              {calculateDuration(departureDate, arrivalDate)}
            </div>
          </div>
          <div className={styles.timePlaceholder}>
            <div className={styles.timeBold}>
              {getTimeIn24HourFormat(arrivalDate)}
            </div>
            <div className={styles.airportCode}>
              {flight.destination_airport.airport_code}
            </div>
          </div>
        </div>
        <div className={styles.discountBar}>
          <div className={styles.redBg}>SLC Discount</div>
          <div className={styles.purpleBg}>
            Include Food & Beverage Discount
          </div>
          {
            showDepartureDate &&
            <div className={styles.departureDate}>{formatDate(departureDate)}</div>
          }
        </div>
      </div>
      <div className={styles.priceAndButtonContainer}>
        <div className={styles.priceContainer}>
          <div className={styles.price}>
            Rp. {cartPrice > 0 ? cartPrice : flight.price}
          </div>
          <div className={styles.perPerson}>/person</div>
        </div>
        {choosable && (
          <div className={styles.buttonContainer}>
            <Button primary>Choose</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;
