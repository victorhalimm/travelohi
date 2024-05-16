import { Flight } from "./Flight";

export interface HotelCart {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  user_id: number;
  hotel_id: number;
  room_category_id: number;
  checkin_date: Date;
  checkout_date: Date;
}

export interface FlightCart {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  flight_id: number;
  user_id: number;
  baggage_price: number;
  seat_id: string;
  total_price: number;
}

export interface FlightCartPayload {
  flight_cart : FlightCart;
  flight : Flight;
}

export const defaultHotelCart: HotelCart = {
    id: 0, 
    created_at: new Date(), 
    updated_at: new Date(), 
    deleted_at: null,
    user_id: 0, 
    hotel_id: 0, 
    room_category_id: 0, 
    checkin_date: new Date(), 
    checkout_date: new Date(), 
  };
  
  export const defaultFlightCart: FlightCart = {
    id: 0, 
    created_at: new Date(), 
    updated_at: new Date(), 
    deleted_at: null, 
    flight_id: 0, 
    user_id: 0, 
    baggage_price: 0, 
    seat_id: "", 
    total_price: 0,
  };
  


export const insertHotelCart = async (hotelCart : HotelCart): Promise<void> => {
    const response = await fetch("http://localhost:3000/api/cart/hotel/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotelCart),
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const result = await response.json();
    console.log(result);
  };

  export const insertFlightCart = async (flightCart : FlightCart): Promise<void> => {
    const response = await fetch("http://localhost:3000/api/cart/flight/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flightCart),
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const result = await response.json();
    console.log(result);
  };
  

  export const fetchFlightCartsByUser = async (userId: number): Promise<FlightCartPayload[]> => {
    const response = await fetch(`http://localhost:3000/api/cart/flight/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const flightCarts: FlightCartPayload[] = await response.json();
    return flightCarts;
  };

  export const fetchHotelCartsByUser = async (userId: number): Promise<HotelCart[]> => {
    const response = await fetch(`http://localhost:3000/api/cart/hotel/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const hotelCarts: HotelCart[] = await response.json();
    return hotelCarts;
  };
  