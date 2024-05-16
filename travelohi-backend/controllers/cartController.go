package controllers

import (
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

func InsertHotelCart(c *fiber.Ctx) error {
	var data models.HotelCart

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if !data.CheckOutDate.After(data.CheckInDate) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Checkout date must be after check-in date",
		})
	}

	if result := database.DB.Create(&data); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Successfully created a new Hotel Cart!",
	})
}

func InsertFlightCart(c *fiber.Ctx) error {
	var data models.FlightCart

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot parse JSON",
		})
	}

	if data.SeatID == "" {
		return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
			"error": "No Seat Selected",
		})
	}

	var flight models.Flight

	res := database.DB.Where("ID = ?", data.FlightID).First(&flight)

	if res.Error != nil {
		return c.Status(fiber.ErrBadRequest.Code).JSON(fiber.Map{
			"error": "Flight is not found",
		})
	}

	for _, seat := range flight.OccupiedSeat {
		if seat == data.SeatID {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Seat already occupied",
			})
		}
	}

	// Add the SeatID to the OccupiedSeat slice
	flight.OccupiedSeat = append(flight.OccupiedSeat, data.SeatID)

	// Save the updated flight information
	if err := database.DB.Save(&flight).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update flight information",
		})
	}

	// Insert the Flight Cart (assuming this is your existing logic)
	if result := database.DB.Create(&data); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": result.Error.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Flight cart inserted successfully and seat added to occupied seats.",
	})
}

func GetFlightCartByUser(c *fiber.Ctx) error {
	var flightCarts []models.FlightCart

	res := database.DB.Where("user_id", c.Params("id")).Find(&flightCarts)

	type FlightCartWithFlight struct {
		FlightCart models.FlightCart `json:"flight_cart"`
		Flight     models.Flight     `json:"flight"`
	}

	var response []FlightCartWithFlight

	if res.Error != nil || len(flightCarts) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No flights found for user with given ID.",
		})
	}

	// Iterate over fetched FlightCarts to fetch corresponding Flight for each
	for _, cart := range flightCarts {
		var flight models.Flight
		database.DB.Preload("Airline").Preload("OriginAirport").Preload("DestinationAirport").Preload("Airplane").Where("id = ?", cart.FlightID).First(&flight)
		// Append to response slice with combined FlightCart and Flight information
		response = append(response, FlightCartWithFlight{
			FlightCart: cart,
			Flight:     flight,
		})
	}

	return c.JSON(response)
}

func GetHotelCartByUser(c *fiber.Ctx) error {
	var hotelCarts []models.HotelCart

	res := database.DB.Where("user_id = ?", c.Params("id")).Find(&hotelCarts)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "No flights found for user with given ID.",
		})
	}

	return c.JSON(hotelCarts)
}
