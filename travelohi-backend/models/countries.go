package models

import "gorm.io/gorm"

type Country struct {
	gorm.Model
	Name   string `gorm:"type:varchar(100); not null" json:"name"`
	Cities []City `json:"cities"`
}

type City struct {
	gorm.Model
	CountryID   uint      `gorm:"not null;index;" json:"country_id"`
	Country     Country   `gorm:"foreignKey:CountryID;references:ID" json:"country"`
	Name        string    `gorm:"type:varchar(100)" json:"name"`
	AirportCode string    `gorm:"type:varchar(10); not null" json:"airport_code"`
	Airports    []Airport `gorm:"foreignKey:CityID" json:"airports"`
}

type Airport struct {
	gorm.Model
	CityID      uint   `gorm:"not null;index;" json:"city_id"`
	City        City   `gorm:"foreignKey:CityID;references:ID" json:"city"`
	Name        string `gorm:"type:varchar(100); not null" json:"name"`
	AirportCode string `gorm:"type:varchar(10); not null" json:"airport_code"`
}
