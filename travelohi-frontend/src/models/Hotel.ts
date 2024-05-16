import { UserData } from "./User";

export interface Hotel {
  ID: number;
  name: string;
  description: string;
  address: string;
  overall_rating: number;
  cleanliness_rating: number;
  comfort_rating: number;
  location_rating: number;
  service_rating: number;
  facilities: string[];
  room_categories: RoomCategory[];
  reviews: Review[];
  picture_urls: string[];
  city_id: number;
}

export interface RoomCategory {
  ID: number;
  hotel_id: number;
  category_name: string;
  price: number;
  facilities: string[];
  picture_urls: string[];
}

export interface Review {
  id: number;
  hotel_id: number;
  user_id: number;
  user : UserData;
  rating: number;
  comment: string;
  anonymous: boolean;
  CreatedAt: Date;
}

export interface Picture {
  id: number;
  image_url: string;
}

export const availableFacilities = [
  "Free WiFi",
  "Parking",
  "Swimming Pool",
  "Fitness Center",
  "Spa",
  "Restaurant",
  "24-hour Front Desk",
  "Business Center",
  "Bar",
  "Laundry Service",
];

export const roomFacilities = [
  "Air Conditioning",
  "Free WiFi",
  "Room Service",
  "Safe Box",
  "Minibar",
  "Television",
  "Private Bathroom",
  "Coffee/Tea Maker",
  "Hair Dryer",
  "Desk",
];

export const availableCountries = ['Brazil', 'Canada', 'Finland', 'Japan', 'United-Kingdom', 'United_States'];


