package controllers

import (
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetCountriesAndCities(c *fiber.Ctx) error {
	var countries []models.Country

	result := database.DB.Preload("Cities.Airports").Find(&countries)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Cannot retrieve countries and cities",
		})
	}

	return c.JSON(countries)
}


