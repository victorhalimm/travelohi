import React from 'react';
import styles from './ImageUploadField.module.scss'
import { FaUpload } from 'react-icons/fa';

interface ImageUploadFieldProps {
    setImage: (image: File) => void;
    id: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ setImage, id }) => {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className={styles.imageUploadField}>
            <input 
                type="file" 
                onChange={handleImageChange} 
                accept="image/*" 
                id={id} 
                style={{ display: 'none' }} 
            />
            <label htmlFor={id} className={styles.uploadButton}>
                <FaUpload />
                Upload Image
            </label>
        </div>
    );
}

export default ImageUploadField;