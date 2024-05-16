import { useEffect, useState } from 'react';
import { FlightCartPayload } from '../../models/Cart';
import styles from './FlightCartCard.module.scss';
import FlightCard from '../../components/FlightCard/FlightCard';
import Divider from '../../components/Divider/Divider';
import { Flight, defaultFlight, getFlightByID } from '../../models/Flight';

interface FlightCartProps {
    flightCart : FlightCartPayload;
}

const FlightCartCard: React.FC<FlightCartProps & {onSelectionChange: (isSelected: boolean, price: number) => void}> = ({flightCart, onSelectionChange}) => {

    const [isSelected, setIsSelected] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [flight, setFlight] = useState<Flight>(defaultFlight);

    const handleCheckboxChange = () => {
        const newSelectionState = !isSelected;
        setIsSelected(newSelectionState);
        onSelectionChange(newSelectionState, flightCart.flight_cart.total_price);
    };

    const fetchFlight = async () => {
        const resp = await getFlightByID(flightCart.flight_cart.flight_id);
        setFlight(resp);
    }

    useEffect(() => {
        const departureDate = new Date(flight.departure_date);
        const currentDate = new Date();

        departureDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        setIsDisabled(currentDate > departureDate);

        fetchFlight()
    }, [flightCart, flight])

    

    return (
        <>
            <Divider />
            <div className={styles.container}>
                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        disabled={isDisabled}
                    />
                    {isDisabled &&
                        <div className={styles.expired}>Expired</div>
                    }
                </div>

                <FlightCard
                    flight={flight}
                    cartPrice={flightCart.flight_cart.total_price}
                    cartSeat={flightCart.flight_cart.seat_id}
                    showDepartureDate={true}
                />
            </div>
        </>
    )
}

export default FlightCartCard;