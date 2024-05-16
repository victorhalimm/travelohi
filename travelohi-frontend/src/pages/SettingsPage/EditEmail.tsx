import { useState } from 'react';
import InputTextField from '../../components/InputTextField/InputTextField';
import styles from './EditEmail.module.scss'
import Button from '../../components/Button/Button';
import { EditProps } from './SettingsField';

const EditEmail : React.FC<EditProps>  = ({onCancel, userId}) => {
    const [email, setEmail] = useState<string>();

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/user/${userId}/email`, {
                method: 'PATCH', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "email" : email}),
            });

            if (!response.ok) {
                throw new Error('Failed to update Email');
            }

            const data = await response.json();

            console.log(data);
            alert('Email updated successfully');
        } catch (error) {
            console.error('Error updating Email:', error);
            alert('Error updating Email');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputField}>
                <InputTextField label='New Email' setValue={setEmail}></InputTextField>
            </div>
            <div className={styles.buttonsContainer}>
                <Button onClick={onCancel} outlined>Cancel</Button>
                <Button onClick={handleSubmit}  primary>Submit</Button>
            </div>
        </div>
    )
}

export default EditEmail;