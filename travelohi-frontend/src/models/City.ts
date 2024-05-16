import { Airport } from "./Flight";

export interface City {
    ID : string,
    country_id: string,
    name: string,
    airport_code: string,
    airports : Airport[],
}

export interface Country {
    ID: string,
    name : string,
    cities : City[]
}

export const fetchAllCountriesWithCities = async (): Promise<Country[]> => {
    try {
      const response = await fetch('http://localhost:3000/api/places/all');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const countries: Country[] = await response.json();
      return countries;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      return [];
    }
  };