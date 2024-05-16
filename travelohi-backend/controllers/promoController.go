package controllers

import (
	"strconv"
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
)

// CreatePromo godoc
// @Summary Create a new promotion
// @Description Adds a new promo to the system with the provided details.
// @Tags promo
// @Accept json
// @Produce json
// @Param promo body map[string]string true "Promo Creation"
// @Success 200 {object} models.Promo "Promo successfully created"
// @Failure 400 {object} map[string]string "Bad Request - Cannot parse JSON or validation failed"
// @Failure 409 {object} map[string]string "Conflict - A promo with the same code already exists"
// @Failure 500 {object} map[string]string "Internal Server Error - Could not create promo"
// @Router /api/promo/create [post]
func CreatePromo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	discount, err := strconv.ParseFloat(data["discount"], 32)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	var existingPromo models.Promo

	if data["name"] == "" || data["code"] == "" || data["image_url"] == "" || data["discount"] == "" || data["type"] == "" || data["expiry_date"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All field must be filled",
		})
	}

	res := database.DB.Where("code = ?", data["code"]).First(&existingPromo)
	if res.Error == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "A promo with the same code already exists",
		})
	}

	newPromo := models.Promo{
		Name:       data["name"],
		Discount:   float32(discount),
		ImageURL:   data["image_url"],
		Type:       data["type"],
		Code:       data["code"],
		ExpiryDate: data["expiry_date"],
	}

	result := database.DB.Create(&newPromo)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(newPromo)
}

func GetAllPromos(c *fiber.Ctx) error {
	var promos []models.Promo

	res := database.DB.Find(&promos)

	if res.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"error": "Cannot fetch promos",
		})
	}

	return c.JSON(promos)
}

func UpdatePromo(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	var promo models.Promo

	res := database.DB.Where("id =  ?", c.Params("id")).First(&promo)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Promo not found",
		})
	}

	discount, err := strconv.ParseFloat(data["discount"], 32)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	newPromo := models.Promo{
		Name:       data["name"],
		Discount:   float32(discount),
		ImageURL:   data["image_url"],
		Type:       data["type"],
		Code:       data["code"],
		ExpiryDate: data["expiry_date"],
	}

	if err := database.DB.Model(&promo).Updates(newPromo).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update promo",
			"data":  newPromo,
		})
	}

	return c.JSON(fiber.Map{
		"message": "Promo updated successfully",
		"promo":   promo,
	})
}
