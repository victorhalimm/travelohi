package database

// Inget yang diimport itu package kalo di golang

import (
	"travelohi-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Bikin globa variable DB biar bisa dipake di file lai
var DB *gorm.DB

func Connect() {
	dsn := "host=localhost user=postgres password=postgres dbname=travelohi port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("connection failed")
	}

	DB = db

	db.AutoMigrate(&models.User{})
}
