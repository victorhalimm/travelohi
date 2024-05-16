import { useCallback, useEffect, useRef, useState } from "react";
import BackgroundImage from "../../components/BackgroundImage/BackgroundImage";
import Navbar from "../../components/Navbar/Navbar";
import HomeImage from "../../assets/traveloka-home-japan.jpg";
import styles from "./HomePage.module.scss";
import SearchBar from "../../components/SearchBar/SearchBar";
import CheckInOut from "../../components/CheckInOut/CheckInOut";
import DatePicker from "../../components/DatePicker/DatePicker";
import QuantityDropdown from "../../components/QuantityDropdown/QuantityDropdown";
import Header from "../../components/Header/Header";
import { FaHotel } from "react-icons/fa";

import PromoSlider from "../../components/PromoSlider/PromoSlider";
import { Promo } from "../../models/Promo";
import { Hotel } from "../../models/Hotel";
import HotelSearchResult from "../../components/HotelSearchResult/HotelSearchResult";
import { City, Country, fetchAllCountriesWithCities } from "../../models/City";
import { useNavigate } from "react-router-dom";
import CountryDropdown from "../../components/OptionDropdown/CountryDropdown";
import { FaWallet, FaHeadset, FaUserCog } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

const HotelSearch = () => {
  const [hotelName, setHotelName] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [passengerCount, setPassengerCount] = useState<number>(1);

  const [hotels, setHotels] = useState<Hotel[]>();

  const [debouncedHotelName, setDebouncedHotelName] = useState(hotelName);

  const [availableCities, setAvailableCities] = useState<City[]>([]);

  const navigate = useNavigate();

  const [isSearch, setIsSearch] = useState<boolean>(false);

  useEffect(() => {
    const fetchCities = async () => {
      const response = await fetch("http://127.0.0.1:3000/api/city/get");

      if (!response.ok) {
        console.error("Failed to fetch promos:", response.statusText);
        return;
      }

      const data = await response.json();
      setAvailableCities(data);
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedHotelName(hotelName);
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [hotelName]);

  const fetchHotels = useCallback(async (name: string) => {
    if (!name) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/api/hotel/search?q=${encodeURIComponent(name)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setHotels(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
  }, []);

  useEffect(() => {
    fetchHotels(debouncedHotelName);
  }, [debouncedHotelName, fetchHotels]);

  const handleSearch = (name: string) => {
    setHotelName(name);
  };

  const DarkBackdrop = () => {
    return <div ref={darkBackdropRef} className={styles.darkBackdrop}></div>;
  };

  const handleSearchSubmit = () => {
    navigate(`/search/hotel?query=${encodeURIComponent(hotelName)}`);
  };

  const darkBackdropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        darkBackdropRef.current &&
        event.target instanceof Node &&
        darkBackdropRef.current.contains(event.target)
      ) {
        setIsSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <div className={`${styles.hotelSearchForm}`}>
        <div className={styles.searchBarContainer}>
          <SearchBar
            onChange={(name) => {
              handleSearch(name);
              setIsSearch(true);
            }}
            placeholder="Enter a hotel's name"
            value={hotelName}
          />
          {isSearch && hotels?.length !== 0 && hotelName && (
            <>
              <DarkBackdrop />
              <div className={styles.hotelsContainer}>
                <div className={`${styles.searchHeader}`}>Search Results</div>
                {hotels?.map((hotel) => (
                  <HotelSearchResult
                    key={hotel.ID}
                    hotelName={hotel.name}
                    hotelAddress={hotel.address}
                    city={availableCities[hotel.city_id - 1].name}
                    onClick={() => handleSearch(hotel.name)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className={styles.searchRow}>
          <CheckInOut
            setValueIn={setCheckInDate}
            setValueOut={setCheckOutDate}
          />
          <QuantityDropdown
            label="Rooms"
            metrics="rooms"
            setValue={setPassengerCount}
          />
        </div>
        <button
          onClick={handleSearchSubmit}
          className={`${styles.submitBtn} button-blue text-lg`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

const FlightSearch = () => {
  const [origin, setOrigin] = useState<Country>();
  const [destination, setDestination] = useState<Country>();
  const [departureDate, setDepartureDate] = useState<string>("");
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [roomCount, setRoomCount] = useState<number>(1);

  const [countries, setCountries] = useState<Country[]>([]);

  const navigate = useNavigate();

  const fetchCountries = async () => {
    const countries = await fetchAllCountriesWithCities();

    if (countries.length > 0) {
      console.log(countries);
      setCountries(countries);
      return;
    }

    console.log("Error:", "Could not load countries");
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleOriginChange = (idx: number) => {
    setOrigin(countries[idx]);
  };

  const handleDestinationChange = (idx: number) => {
    setDestination(countries[idx]);
  };

  const handleFlightSearch = () => {
    const originId = origin?.ID?.toString() || "";
    const destinationId = destination?.ID?.toString() || "";

    const queryParams = new URLSearchParams({
      origin: originId,
      destination: destinationId,
      departureDate,
      arrivalDate,
      roomCount: roomCount.toString(),
    }).toString();

    navigate(`/search/flight?${queryParams}`);
  };

  return (
    <div className={`${styles.searchContainer}`}>
      <div className={`${styles.flightSearchForm}`}>
        <div className={`${styles.searchRow}`}>
          <div className={`${styles.flightSearchLocation}`}>
            <CountryDropdown
              countries={countries}
              handleItemChange={handleOriginChange}
              label="Origin's Country"
            />
          </div>
          <div className={`${styles.flightSearchLocation}`}>
            <CountryDropdown
              countries={countries}
              handleItemChange={handleDestinationChange}
              label="Destination's Country"
            />
          </div>
        </div>
        <div className={`${styles.searchRow}`}>
          <DatePicker label="Departure" setValue={setDepartureDate} />
          <DatePicker label="Arrival" setValue={setArrivalDate} />
          <QuantityDropdown
            label="Passengers"
            metrics="adults"
            setValue={setRoomCount}
          />
        </div>
        <button
          onClick={handleFlightSearch}
          className={`${styles.submitBtn} button-blue text-lg`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [selectedSearch, setSelectedSearch] = useState<string>("Flights");

  const handleSelectSearch = (searchType: string) => {
    setSelectedSearch(searchType);
  };

  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    const fetchPromos = async () => {
      const response = await fetch("http://127.0.0.1:3000/api/promo/get");
  
      if (!response.ok) {
        console.error("Failed to fetch promos:", response.statusText);
        return;
      }
  
      const data = await response.json();
      setPromos(data);
    };
  
    const intervalId = setInterval(() => {
      fetchPromos();
    }, 500);
  
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Navbar />
      <BackgroundImage imageUrl={HomeImage}>
        <div className={styles.navSearch}>
          <div className={styles.navLinks}>
            <div
              className={`nav-link ${
                selectedSearch === "Flights" ? styles.navLinkSelected : ""
              }`}
              onClick={() => handleSelectSearch("Flights")}
            >
              Flights
            </div>
            <div
              className={`nav-link text-md ${
                selectedSearch === "Hotels" ? styles.navLinkSelected : ""
              }`}
              onClick={() => handleSelectSearch("Hotels")}
            >
              Hotels
            </div>
          </div>
        </div>
        {selectedSearch === "Hotels" ? <HotelSearch /> : <FlightSearch />}
      </BackgroundImage>
      <div className={styles.featureContainer}>
        <Header size="big">Why TraveloHI?</Header>
        <div className={styles.featureSubHeader}>Variety of benefits of using our services</div>
        <div className={styles.featuresContainer}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <FaWallet />
              </div>
              <div className={styles.featureTitle}>
                Easy Booking
              </div>
              <div className={styles.featureDesc}>
                Versatile and Easy to use booking system for reservations
              </div>
            </div>
            <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                <FaHeadset />
              </div>
              <div className={styles.featureTitle}>
              24/7 Customer Support
              </div>
              <div className={styles.featureDesc}>
              Always here to help with your travels.
              </div>
            </div>
            <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                <FaUserCog />
              </div>
              <div className={styles.featureTitle}>
              Customized Experiences
              </div>
              <div className={styles.featureDesc}>
              Tailor your trip to your preferences.
              </div>
            </div>
            <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
                <FaTags />
              </div>
              <div className={styles.featureTitle}>
                Exclusive Discounts
              </div>
              <div className={styles.featureDesc}>
                Access unbeatable travel discounts and offers.
              </div>
            </div>
        </div>
      </div>
      <div className={styles.container}>
        <Header>Ongoing Promos</Header>
        <PromoSlider items={promos} itemsPerSlide={3} />
      </div>
      <div className={styles.container}>
        <Header>
          <div className={styles.headerIcon}>
            <FaHotel />
            Hotels
          </div>
        </Header>
        <div className={styles.hotelsContainer}></div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
