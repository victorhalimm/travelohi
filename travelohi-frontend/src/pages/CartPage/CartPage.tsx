import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import MainLayout from "../Layout/MainLayout";
import styles from "./CartPage.module.scss";
import {
  FlightCartPayload,
  fetchFlightCartsByUser,
} from "../../models/Cart";
import Header from "../../components/Header/Header";
import FlightCartCard from "./FlightCartCard";
import TotalPricePopUp from "./TotalPricePopup";

const CartPage = () => {
  const { user } = useUser();

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

  const [selectedFlightPrices, setSelectedFlightPrices] = useState<number[]>(
    []
  );

  useEffect(() => {
    console.log(selectedFlightPrices)
  }, [selectedFlightPrices])

  const handleFlightSelectionChange = (isSelected: boolean, price: number) => {
    setSelectedFlightPrices((currentPrices) =>
      isSelected
        ? [...currentPrices, price]
        : currentPrices.filter((p) => p !== price)
    );
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <Header>Flight Cart</Header>
        <div className={styles.cartContainer}>
          {flightCarts.map((flightCart) => (
            <FlightCartCard
              onSelectionChange={handleFlightSelectionChange}
              flightCart={flightCart}
            />
          ))}
        </div>
      </div>
      {selectedFlightPrices.length > 0 && (
        <TotalPricePopUp
          totalPrice={selectedFlightPrices.reduce(
            (acc, price) => acc + price,
            0
          )}
        />
      )}
    </MainLayout>
  );
};

export default CartPage;
