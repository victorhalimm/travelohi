export interface Airline {
  ID: number;
  name: string;
  image_url: string;
}

export interface Airplane {
  ID: number;
  name: string;
  airplane_code: string;
}

export interface Airport {
  ID: number;
  name: string;
  airport_code: string;
}

export interface Flight {
  id: number;
  origin_id: number;
  destination_id: number;
  airline_id: number;
  airplane_id: number;
  origin_airport: Airport;
  destination_airport: Airport;
  airplane : Airplane;
  airline: Airline;
  flight_duration: number;
  departure_date: Date;
  arrival_date: Date;
  occupied_seat : string[];
  price : number;
}

const defaultAirline: Airline = {
  ID: 0,
  name: "",
  image_url: "",
};

const defaultAirport: Airport = {
  ID: 0,
  name: "",
  airport_code: "",
};

const defaultAirplane : Airplane = {
  ID: 0,
  airplane_code: "",
  name: "",
}

export const defaultFlight: Flight = {
  id: 0,
  origin_id: 0,
  destination_id: 0,
  airline_id: 0,
  airplane_id: 0,
  origin_airport: defaultAirport,
  destination_airport: defaultAirport,
  airline: defaultAirline,
  flight_duration: 0,
  departure_date: new Date(),
  arrival_date: new Date(),
  occupied_seat: [],
  airplane: defaultAirplane,
  price: 0
};

export const fetchAllAirlines = async (): Promise<Airline[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/airline/get");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const airlines: Airline[] = await response.json();
    return airlines;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

export const fetchAllAirplanes = async (): Promise<Airplane[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/airplane/get");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const airplanes: Airplane[] = await response.json();
    return airplanes;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
};

export const insertFlight = async (flight: Flight): Promise<void> => {
  const response = await fetch("http://localhost:3000/api/flight/create", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flight),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  console.log("Flight created successfully:", result);
};

export const getAirlineByID = async (id : number): Promise<Airline> => {
  try {
    const response = await fetch(`http://localhost:3000/api/airline/get/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const airline: Airline = await response.json();
    return airline;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return defaultAirline;
  }
};

export const getAirportByID = async (id : number): Promise<Airport> => {
  try {
    const response = await fetch(`http://localhost:3000/api/airport/get/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const airport: Airport = await response.json();
    return airport;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return defaultAirport;
  }
};

export const getFlightByID = async (id : number): Promise<Flight> => {
  try {
    const response = await fetch(`http://localhost:3000/api/flight/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const flight: Flight = {
      ...data,
      departure_date: new Date(data.departure_date),
      arrival_date: new Date(data.arrival_date),
    };
    return flight;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return defaultFlight;
  }
};
