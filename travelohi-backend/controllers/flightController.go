package controllers

import (
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetAllAirlines(c *fiber.Ctx) error {
	var airlines []models.Airline

	res := database.DB.Find(&airlines)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.JSON(airlines)
}

func GetAllAirplanes(c *fiber.Ctx) error {
	var airplanes []models.Airplane

	res := database.DB.Find(&airplanes)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.JSON(airplanes)
}

func CreateFlight(c *fiber.Ctx) error {
	var flight models.Flight

	if err := c.BodyParser(&flight); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	tx := database.DB.Begin()

	// Attempt to create the hotel
	if result := tx.Create(&flight); result.Error != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	tx.Commit()

	return c.JSON(fiber.Map{
		"message": "Created Flight!",
	})
}

func GetAirportByID(c *fiber.Ctx) error {
	var airport models.Airport

	res := database.DB.Preload("City").Preload("City.Country").Where("id = ?", c.Params("id")).First(&airport)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.JSON(airport)
}

func GetAirlineByID(c *fiber.Ctx) error {
	var airline models.Airline

	res := database.DB.Where("id = ?", c.Params("id")).First(&airline)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.JSON(airline)
}

func GetFlightByID(c *fiber.Ctx) error {
	var flight models.Flight

	res := database.DB.Preload("Airline").Preload("OriginAirport").Preload("DestinationAirport").Preload("Airplane").Where("id = ?", c.Params("id")).First(&flight)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	return c.JSON(flight)
}
