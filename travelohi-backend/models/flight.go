package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

type Airline struct {
	gorm.Model
	Name     string `json:"name"`
	ImageUrl string `json:"image_url"`
}

type Airplane struct {
	gorm.Model
	Name         string `json:"name"`
	AirplaneCode string `json:"airplane_code"`
}

type Flight struct {
	gorm.Model
	OriginID           uint          `json:"origin_id"`
	DestinationID      uint          `json:"destination_id"`
	AirlineID          uint          `json:"airline_id"`
	AirplaneID         uint          `json:"airplane_id"`
	OriginAirport      Airport       `gorm:"foreignKey:OriginID;references:ID" json:"origin_airport"`
	DestinationAirport Airport       `gorm:"foreignKey:DestinationID;references:ID" json:"destination_airport"`
	Airline            Airline       `gorm:"foreignKey:AirlineID;references:ID" json:"airline"`
	FlightDuration     time.Duration `json:"flight_duration"`
	DepartureDate      time.Time     `json:"departure_date"`
	ArrivalDate        time.Time     `json:"arrival_date"`
	Price              float64       `json:"price"`
	OccupiedSeatData   string        `gorm:"type:text"`
	OccupiedSeat       []string      `gorm:"-" json:"occupied_seat"`
	Airplane           Airplane      `json:"airplane" gorm:"foreignKey:AirplaneID;references:ID"`
}

func (f *Flight) BeforeSave(tx *gorm.DB) (err error) {
	// Marshal OccupiedSeat into OccupiedSeatData
	occupiedSeatData, err := json.Marshal(f.OccupiedSeat)
	if err != nil {
		return err
	}
	f.OccupiedSeatData = string(occupiedSeatData)
	return nil
}

func (f *Flight) AfterFind(tx *gorm.DB) (err error) {
	// Unmarshal OccupiedSeatData into OccupiedSeat
	if f.OccupiedSeatData != "" {
		err = json.Unmarshal([]byte(f.OccupiedSeatData), &f.OccupiedSeat)
		if err != nil {
			return err
		}
	}
	return nil
}
