package models

import "gorm.io/gorm"

type CreditCard struct {
	gorm.Model
	Number     string `json:"number"`
	ExpiryDate string `json:"expiry_date"`
	CVV        string `json:"cvv"`
}
