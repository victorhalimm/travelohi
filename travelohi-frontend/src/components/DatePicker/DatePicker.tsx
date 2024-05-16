import styles from './DatePicker.module.scss'

interface DatePickerProps {
    label ?: string;
    setValue(val : string) : void;
}

const DatePicker : React.FC<DatePickerProps> = ({setValue,  label = ""}) => {
  return (
    <div className={styles.dateInputContainer}>
      <label className={styles.dateLabel}>{label}</label>
      <input
        type="date"
        onChange={(e) => setValue(e.target.value)}
        className={styles.dateInput}
      />
    </div>
  );
};

export default DatePicker;
