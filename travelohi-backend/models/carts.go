package models

import (
	"time"

	"gorm.io/gorm"
)

type HotelCart struct {
	gorm.Model
	UserID         uint      `json:"user_id"`
	HotelID        uint      `json:"hotel_id"`
	RoomCategoryID uint      `json:"room_category_id"`
	CheckInDate    time.Time `json:"checkin_date"`
	CheckOutDate   time.Time `json:"checkout_date"`
}

type FlightCart struct {
	gorm.Model
	FlightID     uint    `json:"flight_id"`
	UserID       uint    `json:"user_id"`
	BaggagePrice float64 `json:"baggage_price"`
	SeatID       string  `json:"seat_id"`
	TotalPrice   float64 `json:"total_price"`
}
