import React from "react";
import Header from "../../components/Header/Header";
import { Flight } from "../../models/Flight";
import styles from "./FlightDetailCard.module.scss";

interface DetailProps {
  flight: Flight;
}

const FlightDetailCard: React.FC<DetailProps> = ({ flight }) => {
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

  function calculateDuration(departure: Date, arrival: Date) {
    const difference = arrival.getTime() - departure.getTime();
    const hours = Math.abs(Math.floor(difference / (1000 * 60 * 60)));
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    return `${hours}h ${minutes}m`;
  }

  return (
    <div className={styles.container}>
      <Header size="h2">Details</Header>
      <div className={styles.detailContainer}>
        <div className={styles.timeline}></div>
        <div className={styles.flightInformation}>
          <div className={styles.headerInformation}>
            <div className={styles.dateInformation}>
                {formatDate(flight.departure_date)}
            </div>
            <div className={styles.airportInformation}>
                {flight.origin_airport.name} ({flight.origin_airport.airport_code})
            </div>
          </div>
          <div className={styles.airplaneInformation}>
            <div className={styles.airlineInformation}>
                <img src={flight.airline.image_url} alt="" />
                {flight.airline.name}
            </div>
            <div className={styles.modelInformation}>
                {flight.airplane.name} - {calculateDuration(flight.departure_date, flight.arrival_date)}
            </div>
          </div>
          <div className={styles.headerInformation}>
            <div className={styles.dateInformation}>
                {formatDate(flight.arrival_date)}
            </div>
            <div className={styles.airportInformation}>
                {flight.destination_airport.name} ({flight.destination_airport.airport_code})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailCard;
