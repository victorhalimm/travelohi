// src/components/CurrencyDropdown.tsx
import { useState, FunctionComponent } from "react";
import styles from "./CurrencyDropdown.module.scss";
import { FlagComponent } from "country-flag-icons/react/3x2";

export interface CurrencyOption {
  value: string;
  label: string;
  icon: FlagComponent;
}

export interface CurrencyDropdownProps {
  options: CurrencyOption[];
  onSelect: (option: CurrencyOption) => void;
}

const CurrencyDropdown: FunctionComponent<CurrencyDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<CurrencyOption>(
    options[0]
  );

  const handleSelect = (option: CurrencyOption) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={`${styles.icon}`}>
          <selectedOption.icon style={{ width: "24px", height: "24px" }} />
        </div>
        <div>{selectedOption.label}</div>
      </div>
      {isOpen && (
        <div className={styles.dropdownList}>
          {options.map((option) => (
            <div
              className={`${styles.dropdownElement} flex`}
              key={option.value}
              onClick={() => handleSelect(option)}
            >
              <div className={`${styles.icon}`}>
                <option.icon style={{ width: "24px", height: "24px" }} />
              </div>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
