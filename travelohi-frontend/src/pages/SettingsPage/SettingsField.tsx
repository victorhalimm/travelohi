import React, { useState } from 'react';
import styles from "./SettingsField.module.scss";
import DefaultImage from "../../assets/7.png";
import Button from "../../components/Button/Button";
import EditName from "./EditName";
import Switch from '../../components/Switch/Switch';
import EditEmail from './EditEmail';
import EditPhone from './EditPhone';
import EditCreditCard from './EditCreditCard';

interface SettingsFieldProps {
  isProfile?: boolean;
  img?: string;
  label?: string;
  content?: string;
  userId?: number;
  isToggle?: boolean;
  toggleValue? : boolean;
  onClick?: (isNewsletter : boolean) => void;
}

export interface EditProps {
    onCancel?: () => void;
    userId?: number;
}

const SettingsField: React.FC<SettingsFieldProps> = ({
  content = "Unspecified",
  label,
  img = DefaultImage,
  isProfile = false,
  userId,
  isToggle = false,
  toggleValue,
  onClick = () => {}
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleEdit = () => {
    setIsEdit((prev) => !prev); 
  };

  if (isEdit) {
    switch(label) {
      case 'Full Name':
        return <EditName userId={userId} onCancel={handleEdit} />; 
      case 'Email':
        return <EditEmail userId={userId} onCancel={handleEdit}/>;
      case 'Phone Number':
        return <EditPhone  userId={userId} onCancel={handleEdit} />;
      case 'Credit Card':
        return <EditCreditCard userId={userId} onCancel={handleEdit} />;
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        {isProfile && (
          <div className={styles.profilePictureContainer}>
            <img src={img} alt="Profile" />
          </div>
        )}
        <div className={styles.fieldContainer}>
          <div className={styles.fieldLabel}>{label}</div>
          <div className={styles.fieldContent}>{content ?  content : "Unspecified"}</div>
        </div>
      </div>
      <div>
        {isToggle && toggleValue != null? (
          <Switch isOn={toggleValue} onToggle={onClick}/>
        ) :

          (<Button textOnly onClick={handleEdit}>Edit</Button>)
        }
      </div>
    </div>
  );
};

export default SettingsField;
