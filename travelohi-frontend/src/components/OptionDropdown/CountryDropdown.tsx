import React from "react";
import { Country } from "../../models/City";
import FormLabel from "../FormLabel/FormLabel";
import styles from './CountryDropdown.module.scss';

interface CountryDropdownProps {
    placeholder? : string;
    label : string;
    handleItemChange(idx : number) : void;
    countries : Country[]
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({countries, label, handleItemChange}) => {
    return (
        <div className={styles.selectorField}>
            <FormLabel size={"sm"} text={label} />
            <select
              onChange={(e) => handleItemChange(Number(e.target.value))}
              className={styles.selector}
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={country.ID} value={index}>
                  {country.name}
                </option>
              ))}
            </select>
        </div>
    )
}

export default CountryDropdown;