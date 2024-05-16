import React from "react";
import FormLabel from "../FormLabel/FormLabel";
import styles from "./InputTextField.module.scss";

interface TextAreaProps {
  setValue: (value: string) => void;
  value?: string;
  label?: string;
  type?: string;
  handlePasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  lblSize?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  setValue,
  value = undefined,
  label = "",
  error,
  placeholder = "",
  lblSize = "sm",
}) => {
  return (
    <div className="mb-1rem">
      {label && <FormLabel size={lblSize} text={label} />}
      <textarea
        id="securityAnswer"
        className={`${styles.inputField} w-full p-10 rounded-5 thin-border`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {error && <div className="error-message text-sm">{error}</div>}
    </div>
  );
};

export default TextArea;
