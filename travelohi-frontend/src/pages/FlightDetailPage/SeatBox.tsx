import React from 'react';
import styles from './SeatBox.module.scss';
import { Seat } from '../../models/Seat';


interface SeatProps {
  seat: Seat;
  onSelect: (id: string) => void;
  isSelected : boolean;
  occupied: boolean;
}

const SeatBox: React.FC<SeatProps> = ({ seat, onSelect, isSelected , occupied}) => {
  const handleSelect = () => {
    if (occupied) return;

    onSelect(seat.id)
  }

  const classStyle = seat.class === 'Business' ? styles.businessClass : '';
  const selectedStyle = isSelected ? `${styles.selected} ` : '';
  const occupiedStyle = occupied ? `${styles.occupied}` : '';

  return (
    <div 
      className={`${styles.container} ${classStyle} ${selectedStyle} ${occupiedStyle}`} 
      onClick={handleSelect}>
      {seat.id}
    </div>
  );
};

export default SeatBox;