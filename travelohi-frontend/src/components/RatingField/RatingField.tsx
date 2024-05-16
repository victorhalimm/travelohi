import styles from './RatingField.module.scss'; 

interface RatingFieldProps {
    value: number;
    setValue: (value: number) => void;
  }

const RatingField : React.FC<RatingFieldProps> = ({ value, setValue }) => {
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseFloat(e.target.value));
  };

  return (
    <div className={styles.ratingContainer}>
      <input
        type="number"
        step="0.1"
        min="0"
        max="5"
        value={value}
        onChange={handleChange}
        className={styles.ratingInput}
      />
      <span className={styles.ratingScale}> / 5.0</span>
      <span className={styles.starIcon}>★</span>
    </div>
  );
};

export default RatingField;
