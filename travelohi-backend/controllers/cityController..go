package controllers

import (
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetCity(c *fiber.Ctx) error {
	var city []models.City

	res := database.DB.Find(&city)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "City Not found",
		})
	}

	return c.JSON(city)

}
