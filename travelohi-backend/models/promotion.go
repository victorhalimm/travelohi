package models

import (
	"gorm.io/gorm"
)

type Promo struct {
	gorm.Model
	Name       string  `json:"name"`
	Discount   float32 `json:"discount"`
	Code       string  `json:"code"`
	Type       string  `json:"type"`
	ExpiryDate string  `gorm:"type:date" json:"expiry_date"`
	ImageURL   string  `json:"image_url"`
}
