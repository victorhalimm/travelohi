import { useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './EditCreditCard.module.scss';
import { EditProps } from './SettingsField';
import { FaCreditCard } from 'react-icons/fa';

const EditCreditCard : React.FC<EditProps> = ({onCancel, userId}) => {
    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/user/add/creditcard`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "number" : cardNumber,
                    "expiry_date" : expiryDate,
                    "cvv" :  cvv,
                    "user_id": userId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update Email');
            }

            const data = await response.json();

            console.log(data);
            alert('Credit Card updated successfully');
        } catch (error) {
            console.error('Error updating Email:', error);
            alert('Error updating Credit Card');
        }
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.inputContainer} thin-border`}>
                <FaCreditCard />
                <input onChange={(e) => setCardNumber(e.target.value)} type="text" placeholder='Credit Card Number'/>
            </div>
            <div className={styles.infoFieldContainer}>
                <div className={`${styles.inputContainer} thin-border`}>
                    <input onChange={(e) => setExpiryDate(e.target.value)} type="text" placeholder='MM/YY' />
                </div>
                <div className={`${styles.inputContainer} thin-border`}>
                    <input onChange={(e) => setCvv(e.target.value)} type="text" placeholder='CVV' />
                </div>
            </div>
            <div className={styles.buttonsContainer}>
                <Button onClick={onCancel} outlined>Cancel</Button>
                <Button onClick={handleSubmit}  primary>Submit</Button>
            </div>
        </div>
    )
}

export default EditCreditCard;