import { useState } from 'react';
import InputTextField from '../../components/InputTextField/InputTextField';
import styles from './EditPhone.module.scss'
import Button from '../../components/Button/Button';
import { EditProps } from './SettingsField';

const EditPhone : React.FC<EditProps> = ({onCancel, userId}) => {
    const [phone, setPhone] = useState<string>('')

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/user/${userId}/phone`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "phone_number" : phone}),
            });

            if (!response.ok) {
                throw new Error('Failed to update Phone Number');
            }

            const data = await response.json();

            console.log(data);
            alert('Phone Number updated successfully');
        } catch (error) {
            console.error('Error updating Phone Number:', error);
            alert('Error updating Phone Number');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputField}>
                <InputTextField label='Phone Number' setValue={setPhone}/>
            </div>
            <div className={styles.buttonsContainer}>
                <Button onClick={onCancel} outlined>Cancel</Button>
                <Button onClick={handleSubmit}  primary>Submit</Button>
            </div>
        </div>
    )
}

export default EditPhone;