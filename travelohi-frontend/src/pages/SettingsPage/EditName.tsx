import { useState } from 'react';
import InputTextField from '../../components/InputTextField/InputTextField';
import styles from './EditName.module.scss'
import Button from '../../components/Button/Button';
import { EditProps } from './SettingsField';

const EditName : React.FC<EditProps> = ({onCancel , userId}) => {
    const [firstName, setFirstName] = useState<string | null>()
    const [lastName, setLastName] = useState<string | null>()
    
    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/user/${userId}/name`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name: firstName, last_name: lastName }),
            });

            if (!response.ok) {
                console.log(await response.json())
                throw new Error('Failed to update user name');
            }

            const data = await response.json();

            console.log(data);
            alert('User name updated successfully');
        } catch (error) {
            console.error('Error updating user name:', error);
            alert('Error updating user name');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputField}>
                <InputTextField label='First Name' setValue={setFirstName}></InputTextField>
            </div>
            <div className={styles.inputField}>
                <InputTextField label='Last Name' setValue={setLastName}></InputTextField>
            </div>
            <div className={styles.buttonsContainer}>
                <Button onClick={onCancel} outlined>Cancel</Button>
                <Button onClick={handleSubmit} primary>Submit</Button>
            </div>
        </div>
    )
}

export default EditName;