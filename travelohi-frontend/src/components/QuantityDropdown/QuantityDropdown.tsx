import React, { useState } from 'react';
import styles from './QuantityDropdown.module.scss';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";


interface QuantityDropdownProps {
    label: string;
    metrics?: string;
    setValue: (value: number) => void;
}

const QuantityDropdown: React.FC<QuantityDropdownProps> = ({ label, metrics, setValue }) => {
    const [quantity, setQuantity] = useState<number>(1);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setValue(newQuantity);
    };

    const handleDecrement = () => {
        const newQuantity = quantity > 1 ? quantity - 1 : 1;
        setQuantity(newQuantity);
        setValue(newQuantity);
    };


    return (
        <div className={styles.dropdown}>
            <label className={styles.label}>{label}</label>
            <div className={styles.quantitySelector}>
                <FaMinusCircle onClick={handleDecrement} className={styles.circleButton}/>
                <div className={styles.quantity}>{quantity} {metrics}</div>
                <FaPlusCircle onClick={handleIncrement} className={styles.circleButton}/>
            </div>
        </div>
    );
};

export default QuantityDropdown;
