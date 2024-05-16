import Button from '../../components/Button/Button';
import styles from './TotalPricePopup.module.scss';

const TotalPricePopUp = ({ totalPrice }: { totalPrice: number }) => {
    return (
        <div className={styles.container}>
            <div className={styles.totalPricePopUp}>
                <div className={styles.priceHeader}>Total Price</div>
                <div className={styles.priceValue}>Rp{totalPrice}</div>
            </div>
            <Button primary>Check Out</Button>
        </div>
    );
};

export default TotalPricePopUp;