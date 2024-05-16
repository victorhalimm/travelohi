import styles from './CheckInOut.module.scss'; 

interface CheckInOutProps {
    setValueIn(value : string) : void;
    setValueOut(value : string) : void;
    enterLabel ?: string;
    outLabel ?: string;
}

const CheckInOut : React.FC<CheckInOutProps> = ({setValueIn, setValueOut, enterLabel="Check-in", outLabel="Check-out"}) => {


    return (
        <div className={styles.datePickerContainer}>
            <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>{enterLabel}</label>
                <input
                    type="date"
                    onChange={(e) => setValueIn(e.target.value)}
                    className={styles.dateInput}
                />
            </div>
            <div className={styles.dateInputContainer}>
                <label className={styles.dateLabel}>{outLabel}</label>
                <input
                    type="date"
                    onChange={(e) => setValueOut(e.target.value)}
                    className={styles.dateInput}
                />
            </div>
        </div>
    );
};

export default CheckInOut;
