import React from "react";
import FormLabel from "../FormLabel/FormLabel";
import styles from './InputTextField.module.scss'

interface InputTextFieldProps {
  setValue: (value: string) => void;
  value?: string;
  label?: string;
  type?: string;
  handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder? : string;
  lblSize? : string;
}

const InputTextField: React.FC<InputTextFieldProps> = ({
  setValue,
  value = undefined,
  label = "",
  type = "text",
  handlePasswordChange,
  error,
  placeholder = "",
  lblSize = "sm",
}) => {
  return (
    <div className="mb-1rem">
      {label &&
        <FormLabel size={lblSize} text={label} />
      }
      <input
        type={type}
        id="securityAnswer"
        className={`${styles.inputField} w-full p-10 rounded-5 thin-border`}
        placeholder={placeholder}
        value={value}
        onChange={(e) =>
          type === "password" && handlePasswordChange
            ? handlePasswordChange(e)
            : setValue(e.target.value)
        }
      />
      {error && (
        <div className="error-message text-sm">{error}</div>
      )}
    </div>
  );
};

export default InputTextField;
