import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import styles from "./ManageFlight.module.scss";
import { City, Country, fetchAllCountriesWithCities } from "../../models/City";
import contentStyle from "./AdminContent.module.scss";
import {
  Airline,
  Airplane,
  Airport,
  Flight,
  defaultFlight,
  fetchAllAirlines,
  fetchAllAirplanes,
  getAirlineByID,
  getAirportByID,
  insertFlight,
} from "../../models/Flight";
import FormLabel from "../../components/FormLabel/FormLabel";
import Button from "../../components/Button/Button";
import FlightCard from "../../components/FlightCard/FlightCard";
import InputTextField from "../../components/InputTextField/InputTextField";

const ManageFlight = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [flight, setFlight] = useState<Flight>(defaultFlight);

  const [originCountry, setOriginCountry] = useState<Country>();
  const [destinationCountry, setDestinationCountry] = useState<Country>();

  const [originCity, setOriginCity] = useState<City>();
  const [destinationCity, setDestinationCity] = useState<City>();

  const [airportOrigin, setAirportOrigin] = useState<Airport>();
  const [airportDestination, setAirportDestination] = useState<Airport>();

  const [airlines, setAirlines] = useState<Airline[]>([]);

  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const formattedDeparture = new Date(`${departureDate}T${departureTime}`);
  const formattedArrival = new Date(`${arrivalDate}T${arrivalTime}`);

  const durationMs = formattedArrival.getTime() - formattedDeparture.getTime();

  const durationHours = durationMs / (1000 * 60 * 60);

  const [airplanes, setAirplanes] = useState<Airplane[]>([]);

  const fetchCountries = async () => {
    const countries = await fetchAllCountriesWithCities();

    if (countries.length > 0) {
      setCountries(countries);
      return;
    }

    console.log("Fetch is Unsuccessful!");
  };

  const fetchAirlines = async () => {
    const airlines = await fetchAllAirlines();

    if (airlines.length > 0) {
      setAirlines(airlines);
      return;
    }

    console.log("Fetch Airlines is Unsuccessful!");
  };

  const fetchAirplanes = async () => {
    const airplanes = await fetchAllAirplanes();

    if (airplanes.length > 0) {
      setAirplanes(airplanes);
      return;
    }

    console.log("Fetch Airplanes is Unsuccessful!");
  };

  useEffect(() => {
    fetchAirplanes();
    fetchCountries();
    fetchAirlines();
  }, []);

  const handleCountryOrigin = (idx: number) => {
    setOriginCountry(countries[idx]);
  };

  const handleCountryDestination = (idx: number) => {
    setDestinationCountry(countries[idx]);
  };

  const handleCityOrigin = (idx: number) => {
    setOriginCity(originCountry?.cities[idx]);
  };

  const handleCityDestination = (idx: number) => {
    setDestinationCity(destinationCountry?.cities[idx]);
  };

  const handleAirportOrigin = (idx: number) => {
    setAirportOrigin(originCity?.airports[idx]);
  };

  const handleAirportDestination = (idx: number) => {
    setAirportDestination(destinationCity?.airports[idx]);
  };

  const handleAirlineSelection = (idx: number) => {
    setFlight({
      ...flight,
      airline_id: airlines[idx].ID,
      airline: airlines[idx],
    });
  };

  const handleAirplaneSelection = (idx: number) => {
    setFlight({
      ...flight,
      airplane_id: airplanes[idx].ID,
      airplane: airplanes[idx],
    });
  };

  const handleFlightCreate = () => {
    if (airportDestination && airportOrigin) {
      //   console.log(tempFlight)
      setFlight({
        ...flight,
        destination_id: airportDestination.ID,
        origin_id: airportOrigin.ID,
        flight_duration: durationHours,
        departure_date: formattedDeparture,
        arrival_date: formattedArrival,
      });

      try {
        insertFlight(flight);
        alert("Successfully created new flight");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Basic validation to check if all required fields are filled
    const validateForm = async () => {
      // Add more conditions based on your form requirements
      const isFilled = Boolean(
        originCountry &&
          destinationCountry &&
          originCity &&
          destinationCity &&
          airportOrigin &&
          airportDestination &&
          departureDate &&
          departureTime &&
          arrivalDate &&
          arrivalTime &&
          flight.airline_id &&
          flight.airplane_id
      );

      if (isFilled && airportDestination && airportOrigin) {
        setFlight({
          ...flight,
          destination_airport: await getAirportByID(airportDestination.ID),
          origin_airport: await getAirportByID(airportOrigin.ID),
          destination_id: airportDestination.ID,
          origin_id: airportOrigin.ID,
          flight_duration: durationHours,
          departure_date: formattedDeparture,
          arrival_date: formattedArrival,
        });
      }

      setIsFormValid(isFilled);
    };

    validateForm();
  }, [
    originCountry,
    destinationCountry,
    originCity,
    destinationCity,
    airportOrigin,
    airportDestination,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime,
    flight.airline_id,
    flight.airplane_id,
  ]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <Header>Manage Flight</Header>
          <div className={styles.rowContainer}>
            <Header size="h3">Countries Origin & Destination</Header>
            <div className={styles.locationFieldContainer}>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Origin Country"} />
                <select
                  onChange={(e) => handleCountryOrigin(Number(e.target.value))}
                  className={contentStyle.selector}
                >
                  <option value="">Select a country</option>
                  {countries.map((country, index) => (
                    <option key={country.ID} value={index}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Destination Country"} />
                <select
                  onChange={(e) =>
                    handleCountryDestination(Number(e.target.value))
                  }
                  className={contentStyle.selector}
                >
                  <option value="">Select a country</option>
                  {countries.map((country, index) => (
                    <option key={country.ID} value={index}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <Header size="h3">Cities Origin & Destination</Header>
            <div className={styles.locationFieldContainer}>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Origin City"} />
                <select
                  onChange={(e) => handleCityOrigin(Number(e.target.value))}
                  className={contentStyle.selector}
                >
                  <option value="">Select a city</option>
                  {originCountry?.cities.map((city, index) => (
                    <option key={city.ID} value={index}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Destination City"} />
                <select
                  onChange={(e) =>
                    handleCityDestination(Number(e.target.value))
                  }
                  className={contentStyle.selector}
                >
                  <option value="">Select a city</option>
                  {destinationCountry?.cities.map((city, index) => (
                    <option key={city.ID} value={index}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <Header size="h3">Airport's Origin & Destination</Header>
            <div className={styles.locationFieldContainer}>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Origin Airport"} />
                <select
                  onChange={(e) => handleAirportOrigin(Number(e.target.value))}
                  className={contentStyle.selector}
                >
                  <option value="">Select an airport</option>
                  {originCity?.airports.map((airport, index) => (
                    <option key={airport.ID} value={index}>
                      {airport.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Destination Airport"} />
                <select
                  onChange={(e) =>
                    handleAirportDestination(Number(e.target.value))
                  }
                  className={contentStyle.selector}
                >
                  <option value="">Select an airport</option>
                  {destinationCity?.airports.map((airport, index) => (
                    <option key={airport.ID} value={index}>
                      {airport.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.rowContainer}>
            <Header size="h2">Flight Information</Header>
            <div className={contentStyle.fieldContainer}>
              <FormLabel size={"sm"} text={"Airline"} />
              <select
                onChange={(e) => handleAirlineSelection(Number(e.target.value))}
                className={contentStyle.selector}
              >
                <option value="">Select an airline</option>
                {airlines.map((airline, index) => (
                  <option key={airline.ID} value={index}>
                    {airline.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={contentStyle.fieldContainer}>
              <FormLabel size={"sm"} text={"Airplane Model"} />
              <select
                onChange={(e) =>
                  handleAirplaneSelection(Number(e.target.value))
                }
                className={contentStyle.selector}
              >
                <option value="">Select an airplane model</option>
                {airplanes.map((airplane, index) => (
                  <option key={airplane.ID} value={index}>
                    {airplane.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.priceField}>
              <InputTextField
                label="Flight Price"
                setValue={(val) =>
                  setFlight((prevFlight) => ({
                    ...prevFlight,
                    price: Number(val),
                  }))
                }
                type="number"
              />
            </div>
            <Header size="h3">Departure Date & Time</Header>
            <div className={styles.locationFieldContainer}>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Departure Date"} />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className={contentStyle.selector}
                />
              </div>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Departure Time"} />
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className={contentStyle.selector}
                />
              </div>
            </div>
            <Header size="h3">Arrival Date & Time</Header>
            <div className={styles.locationFieldContainer}>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Arrival Date"} />
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className={contentStyle.selector}
                />
              </div>
              <div className={styles.selectorField}>
                <FormLabel size={"sm"} text={"Arrival Time"} />
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className={contentStyle.selector}
                />
              </div>
            </div>
          </div>
          <Button onClick={handleFlightCreate} primary>
            Create New Flight
          </Button>
        </div>
        {isFormValid && (
          <div className={styles.flightCardContainer}>
            <FlightCard flight={flight} />
          </div>
        )}
      </div>
    </>
  );
};

export default ManageFlight;
