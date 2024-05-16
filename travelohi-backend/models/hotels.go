package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Hotel struct {
	gorm.Model
	Name              string         `gorm:"not null" json:"name"`
	Description       string         `gorm:"type:text" json:"description"`
	Address           string         `json:"address"`
	OverallRating     float64        `gorm:"default:0" json:"overall_rating"`
	CleanlinessRating float64        `gorm:"default:0" json:"cleanliness_rating"`
	ComfortRating     float64        `gorm:"default:0" json:"comfort_rating"`
	LocationRating    float64        `gorm:"default:0" json:"location_rating"`
	ServiceRating     float64        `gorm:"default:0" json:"service_rating"`
	FacilitiesData    string         `gorm:"type:text" json:"facilities_data"` // Stored in DB
	Facilities        []string       `gorm:"-" json:"facilities"`
	CityID            uint           `json:"city_id"`
	RoomCategories    []RoomCategory `json:"room_categories" gorm:"foreignKey:HotelID"`
	Reviews           []Review       `json:"reviews" gorm:"foreignKey:HotelID"`
	PictureURLsData   string         `gorm:"type:text"`
	PictureURLs       []string       `gorm:"-" json:"picture_urls"`
}

type RoomCategory struct {
	gorm.Model
	HotelID         uint     `json:"hotel_id"`
	CategoryName    string   `json:"category_name"`
	Price           float64  `json:"price"`
	FacilitiesData  string   `gorm:"type:text"`
	Facilities      []string `gorm:"-" json:"facilities"`
	PictureURLsData string   `gorm:"type:text"`
	PictureURLs     []string `gorm:"-" json:"picture_urls"`
}

type Review struct {
	gorm.Model
	HotelID   uint    `json:"hotel_id"`
	UserID    uint    `json:"user_id"`
	User      User    `gorm:"foreignKey:UserID" json:"user"`
	Rating    float64 `json:"rating"`
	Comment   string  `gorm:"type:text" json:"comment"`
	Anonymous bool    `json:"anonymous"`
}

func (h *Hotel) BeforeSave(tx *gorm.DB) (err error) {
	// Marshal Facilities
	facilitiesData, err := json.Marshal(h.Facilities)
	if err != nil {
		return err
	}
	h.FacilitiesData = string(facilitiesData)

	// Marshal PictureURLs
	pictureURLsData, err := json.Marshal(h.PictureURLs)
	if err != nil {
		return err
	}
	h.PictureURLsData = string(pictureURLsData)

	return nil
}

func (h *Hotel) AfterFind(tx *gorm.DB) (err error) {
	// Unmarshal Facilities
	if h.FacilitiesData != "" {
		err = json.Unmarshal([]byte(h.FacilitiesData), &h.Facilities)
		if err != nil {
			return err
		}
	}

	// Unmarshal PictureURLs
	if h.PictureURLsData != "" {
		err = json.Unmarshal([]byte(h.PictureURLsData), &h.PictureURLs)
		if err != nil {
			return err
		}
	}

	return nil
}

func (rc *RoomCategory) BeforeSave(tx *gorm.DB) (err error) {
	// Marshal Facilities into FacilitiesData
	facilitiesData, err := json.Marshal(rc.Facilities)
	if err != nil {
		return err
	}
	rc.FacilitiesData = string(facilitiesData)

	// Marshal PictureURLs into PictureURLsData
	pictureURLsData, err := json.Marshal(rc.PictureURLs)
	if err != nil {
		return err
	}
	rc.PictureURLsData = string(pictureURLsData)

	return nil
}

func (rc *RoomCategory) AfterFind(tx *gorm.DB) (err error) {
	// Unmarshal FacilitiesData into Facilities
	if rc.FacilitiesData != "" {
		err = json.Unmarshal([]byte(rc.FacilitiesData), &rc.Facilities)
		if err != nil {
			return err
		}
	}

	// Unmarshal PictureURLsData into PictureURLs
	if rc.PictureURLsData != "" {
		err = json.Unmarshal([]byte(rc.PictureURLsData), &rc.PictureURLs)
		if err != nil {
			return err
		}
	}

	return nil
}
