package controllers

import (
	"strings"
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

func CreateHotel(c *fiber.Ctx) error {
	var hotel models.Hotel

	// Parse the request body into the hotel struct
	if err := c.BodyParser(&hotel); err != nil {
		print(err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse request",
		})
	}

	if hotel.Name == "" || hotel.Description == "" || hotel.Address == "" || hotel.CityID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields",
		})
	}

	// Begin a transaction
	tx := database.DB.Begin()

	// Attempt to create the hotel
	if result := tx.Create(&hotel); result.Error != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	// for _, category := range hotel.RoomCategories {
	// 	category.HotelID = hotel.ID

	// 	category.ID = 0
	// 	if result := tx.Create(&category); result.Error != nil {
	// 		tx.Rollback()
	// 		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
	// 			"error": result.Error.Error(),
	// 		})
	// 	}
	// }

	tx.Commit()

	return c.Status(fiber.StatusCreated).JSON(hotel)
}

func SearchHotel(c *fiber.Ctx) error {
	var hotels []models.Hotel

	searchQuery := c.Query("q")

	if err := database.DB.Where("LOWER(name) LIKE ?", "%"+strings.ToLower(searchQuery)+"%").Find(&hotels).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Unable to fetch results"})
	}

	return c.Status(fiber.StatusAccepted).JSON(hotels)
}

func GetRoomCategory(c *fiber.Ctx) error {
	var roomCategory []models.RoomCategory

	id := c.Params("id")

	res := database.DB.Where("hotel_id = ?", id).Find(&roomCategory)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(roomCategory)
}

func GetHotelById(c *fiber.Ctx) error {
	var hotel models.Hotel

	id := c.Params("id")

	// Correct the Preload statements to reflect actual relationships
	// Preload "Reviews.User" to fetch User info for each Review
	res := database.DB.Preload("RoomCategories").Preload("Reviews").Preload("Reviews.User").Where("id = ?", id).First(&hotel)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(hotel)
}

func GetHotelsByCountry(c *fiber.Ctx) error {
	var data map[string]string

	if errr := c.BodyParser(&data); errr != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	var hotels []models.Hotel

	// Perform a query that joins Hotel -> City -> Country tables
	err := database.DB.
		Joins("JOIN cities on cities.id = hotels.city_id").
		Joins("JOIN countries on countries.id = cities.country_id").
		Where("countries.name = ?", data["country_name"]).
		Preload("RoomCategories").
		Preload("Reviews").
		Preload("Reviews.User").
		Find(&hotels).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Unable to fetch hotels for the specified country",
		})
	}

	return c.JSON(hotels)
}
