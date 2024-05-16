import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.scss";
import Logo from "../../assets/travelohi-logo.png";
import { UserData } from "../../models/User";
import { Link, useNavigate } from "react-router-dom";
import CurrencyDropdown, {
  CurrencyOption,
} from "../CurrencyDropdown/CurrencyDropdown"; // Adjust the path as necessary
import { ID } from "country-flag-icons/react/3x2";
import { US } from "country-flag-icons/react/3x2";
import Button from "../Button/Button";
import { FlightCartPayload, fetchFlightCartsByUser } from "../../models/Cart";

const Navbar  = () => {
  const navbarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  const [user, setUser] = useState<UserData | null>(null);

  const [showMenu, setShowMenu] = useState<boolean>(false);

  const [flightCarts, setFlightCarts] = useState<FlightCartPayload[]>([]);

  const fetchFlightCarts = async () => {
    if (!user) return;

    try {
      const resp = await fetchFlightCartsByUser(user.id);

      console.log(resp);
      setFlightCarts(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFlightCarts();
    }
  }, [user]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const height = `${navbarRef.current?.clientHeight}px`;
      document.documentElement.style.setProperty("--navbar-height", height);
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          console.log(data);
          throw new Error("Failed to fetch user data");
        }

        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const establishConnection = async () => {
      try {
        // Biar cookienya ke load
        await fetch("http://127.0.0.1:3000/");
        await fetchUserData();
      } catch (error) {
        console.log(error);
      }
    };

    establishConnection();

    updateNavbarHeight();

    window.addEventListener("resize", updateNavbarHeight);
    return () => window.removeEventListener("resize", updateNavbarHeight);
  }, []);


  const currencyOptions: CurrencyOption[] = [
    { value: "IDR", label: "IDR", icon: ID },
    { value: "USD", label: "USD", icon: US },
  ];

  const handleCurrencyChange = (option: CurrencyOption): void => {
    console.log("Selected currency:", option.value);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleSignOut = async () => {
    
    try {
      const response = await fetch("http://127.0.0.1:3000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        
        navigate('/home')
        
      } else {
        console.error("Login failed:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    
  }

  return (
    <>
      <nav ref={navbarRef}>
        <div className={`${styles.navbarContainer} bg-white`}>
          <div className={`${styles.navbarLinks} `}>
            <div className="text-lg">
              <img src={Logo} alt="" />
            </div>
            <div className="text-md nav-link">Airplane Tickets</div>
            <div className="text-md nav-link">Hotel</div>
          </div>
          <div className={`${styles.navbarLinks} `}>
            <div className="text-md">{flightCarts.length} Reservations</div>
            <div className="text-md">
              <CurrencyDropdown
                options={currencyOptions}
                onSelect={handleCurrencyChange}
              />
            </div>
            <div className="text-md">Pay</div>
            {user ? (
              <>
                <div onClick={toggleMenu} className={`${styles.profileContainer} text-md`}>
                  {user.first_name}
                  {showMenu && (
                    <div className={styles.floatingMenu}>
                      <Link to="/settings" className={styles.menuItem}>
                        Settings
                      </Link>
                      <Button onClick={handleSignOut} textOnly>Sign Out</Button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link className="clear-style text-black" to={"/login"}>
                  <div className={`${styles.loginBtn} text-md`}>Log in</div>
                </Link>
                <Link className="clear-style text-black" to={"/register"}>
                  <div className={`${styles.registerBtn} text-md`}>
                    Register
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className={styles.navPhysical}></div>
    </>
  );
};

export default Navbar;
