package controllers

import (
	"bytes"
	"regexp"
	"strings"
	"text/template"
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
	"gopkg.in/gomail.v2"
)

func UpdateUserName(c *fiber.Ctx) error {
	userID := c.Params("id")

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	reg := regexp.MustCompile(`^[a-zA-Z]+$`)

	firstName := strings.TrimSpace(data["first_name"])
	lastName := strings.TrimSpace(data["last_name"])

	// Validate first name and last name
	if len(firstName) < 6 || !reg.MatchString(firstName) || len(lastName) < 6 || !reg.MatchString(lastName) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "First name and last name must only contain alphabets and be more than 5 characters long",
			"data":  data,
		})
	}

	result := database.DB.Where("id = ?", userID).Updates(models.User{FirstName: firstName, LastName: lastName})

	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not Found",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Successfully updated username!",
	})
}

// UpdateEmail godoc
// @Summary Update user email
// @Description Update email of the user by user ID
// @Tags user
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param email body object true "Email Object" { "email": "string" }
// @Success 202 {object} map[string]interface{} "message: Success"
// @Failure 400 {object} map[string]string "error: Bad Request / Email cannot be empty / Email is the same as previous one"
// @Failure 404 {object} map[string]string "error: Not Found"
// @Router /user/{id}/email [put]
func UpdateEmail(c *fiber.Ctx) error {
	userID := c.Params("id")

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	var user models.User

	res := database.DB.Where("id = ?", userID).First(&user)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not Found",
		})
	}

	if data["email"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email cannot be empty",
		})
	}

	if user.Email == data["email"] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email is the same as previous one",
		})
	}

	user.Email = data["email"]

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})
}

func UpdatePhone(c *fiber.Ctx) error {
	userID := c.Params("id")

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Bad Request",
		})
	}

	var user models.User

	res := database.DB.Where("id = ?", userID).First(&user)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not Found",
		})
	}

	if data["phone_number"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number is empty",
		})
	}

	if user.PhoneNumber == data["phone_number"] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Phone number is the same as previous one",
		})
	}

	user.PhoneNumber = data["phone_number"]

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})

}

func GetAllUser(c *fiber.Ctx) error {
	var user []models.User

	res := database.DB.Find(&user)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Not Found",
		})
	}

	return c.Status(fiber.StatusAccepted).JSON(user)
}

// BanUser godoc
// @Summary Ban a user
// @Description Bans a user by setting their IsBanned status to true
// @Tags users
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Success 202 {object} map[string]interface{} "message: Success"
// @Failure 400 {object} map[string]string "error: Bad Request"
// @Failure 404 {object} map[string]string "error: User not found"
// @Failure 500 {object} map[string]string "error: Internal Server Error"
// @Router /api/user/ban/{id} [patch]
func BanUser(c *fiber.Ctx) error {
	var user models.User

	database.DB.Where("id = ?", c.Params("id")).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.IsBanned = true

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})
}

func UnbanUser(c *fiber.Ctx) error {
	var user models.User

	database.DB.Where("id = ?", c.Params("id")).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.IsBanned = false

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})
}

func EnableNewsletter(c *fiber.Ctx) error {
	var user models.User

	database.DB.Where("id = ?", c.Params("id")).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.IsNewsletter = true

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})
}

func DisableNewsletter(c *fiber.Ctx) error {
	var user models.User

	database.DB.Where("id = ?", c.Params("id")).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	user.IsNewsletter = false

	database.DB.Save(&user)

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Success",
	})
}

func SendNewsletter(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	var usersSubscribed []models.User

	res := database.DB.Where("is_newsletter = true").Find(&usersSubscribed)

	if res.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": res.Error.Error(),
		})
	}

	templatePath := "templates/newsletter-email.html"
	t, err := template.ParseFiles(templatePath)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	for _, user := range usersSubscribed {
		var body bytes.Buffer

		err = t.Execute(&body, map[string]string{
			"Content": data["content"],
		})
		if err != nil {
			continue
		}

		m := gomail.NewMessage()
		m.SetHeader("From", "victorhalim18@gmail.com")
		m.SetHeader("To", user.Email)
		m.SetHeader("Subject", data["header"])
		m.SetBody("text/html", body.String())

		// Send email
		d := gomail.NewDialer("smtp.gmail.com", 587, "victorhalim18@gmail.com", "aikcclnxvfbzrbjw")
		if err := d.DialAndSend(m); err != nil {
			continue
		}
	}

	// Return success response
	return c.JSON(fiber.Map{
		"message": "Successfully sent newsletter to subscribed users",
	})

}

func AddCreditCardToUser(c *fiber.Ctx) error {
	type request struct {
		UserID     uint   `json:"user_id"`
		Number     string `json:"number"`
		ExpiryDate string `json:"expiry_date"`
		CVV        string `json:"cvv"`
	}

	var req request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot parse request"})
	}

	if req.Number == "" || req.ExpiryDate == "" || req.CVV == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Number, expiry date, and CVV must not be empty"})
	}

	creditCard := models.CreditCard{
		Number:     req.Number,
		ExpiryDate: req.ExpiryDate,
		CVV:        req.CVV,
	}

	if err := database.DB.Create(&creditCard).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot save credit card"})
	}

	if err := database.DB.Model(&models.User{}).Where("id = ?", req.UserID).Update("credit_card_id", creditCard.ID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Cannot assign credit card to user"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Credit card added successfully and assigned to user",
	})
}
