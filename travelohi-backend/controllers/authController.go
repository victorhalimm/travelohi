package controllers

import (
	"bytes"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"text/template"
	"time"
	"travelohi-backend/database"
	"travelohi-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

const secretKey = "secret"

func Hello(c *fiber.Ctx) error {
	return c.SendString("Hello, World 👋!")
}

func authenticateMiddleware(c *fiber.Ctx) error {
	token := c.Cookies("jwt")
	if token == "" {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized"})
	}

	claims := &jwt.MapClaims{}
	parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil || !parsedToken.Valid {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{"message": "Unauthorized"})
	}

	return c.Next()
}

func Register(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID != 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Email already exists",
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)
	newUser := models.User{
		FirstName:  data["first_name"],
		Password:   password,
		Email:      data["email"],
		IsBanned:   false,
		LastName:   data["last_name"],
		QuestionID: data["question_id"],
		Answer:     data["answer"],
		Dob:        data["dob"],
		Role:       "User",
	}

	database.DB.Create(&newUser)

	sendRegistrationMail(c, data["email"])

	return c.JSON(user)
}

func sendRegistrationMail(c *fiber.Ctx, email string) error {
	templatePath := "templates/email-registration.html"

	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)

	if err != nil {
		fmt.Println(err)
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	err = t.Execute(&body, nil)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	m := gomail.NewMessage()
	m.SetHeader("From", "victorhalim18@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", "TraveloHI Registration Successful")
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 587, "victorhalim18@gmail.com", "aikcclnxvfbzrbjw")

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	return c.JSON(fiber.Map{
		"message": "Succesfully sends registration confirmation",
	})

}

func Login(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)

	if err != nil {
		return err
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"error": "Invalid email or password.",
		})

	}

	if user.IsBanned {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Your account has been banned.",
		})
	}

	errPass := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"]))

	if errPass != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Invalid email or password.",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(secretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Something went wrong with creating token!",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
		SameSite: "None",
	}

	c.Cookie(&cookie)

	return c.Status(http.StatusOK).JSON(fiber.Map{"success": true})

}

// GetUser godoc
// @Summary Get user by id from cookies
// @Description get user by ID
// @ID get-user-by-int
// @Accept  json
// @Produce  json
// @Success 200 {object} models.User
// @Failure 409 {object} map[string]string
// @Router /api/user [get]
func User(c *fiber.Ctx) error {
	// Cookie -> buat naruh cookie baru
	// Cookies -> Buat ngambil cookie yang udah ada
	cookies := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookies, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "unauthorized",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User

	database.DB.Preload("CreditCard").Where("id = ?", claims.Issuer).First(&user)

	return c.Status(http.StatusOK).JSON(user)
}

func Logout(c *fiber.Ctx) error {

	// disini kita ngeset dia sama cookie kosong aja buat nama jwt terus expirednya set jadi udah lewat biar lngsng ilang
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HTTPOnly: true,
		SameSite: "None",
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Logged out",
	})
}

func generateOTP() string {
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}

func SendOTP(c *fiber.Ctx) error {

	var data map[string]string

	// Parse data from POST/GET req
	err := c.BodyParser(&data)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)
	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"error": "Invalid email or password.",
		})
	}

	otp := generateOTP()
	user.OTPExpiration = time.Now().Add(time.Second * 30)

	user.OTP = otp
	if err := database.DB.Save(&user).Error; err != nil {
		return c.JSON(fiber.Map{
			"error": "Failed to update OTP in database.",
		})
	}

	templatePath := "templates/otp-email.html"

	var body bytes.Buffer
	t, err := template.ParseFiles(templatePath)

	if err != nil {
		fmt.Println(err)
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	err = t.Execute(&body, struct{ OTP string }{OTP: otp})
	if err != nil {
		fmt.Println("Error executing HTML template:", err)
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	m := gomail.NewMessage()
	m.SetHeader("From", "victorhalim18@gmail.com")
	m.SetHeader("To", data["email"])
	m.SetHeader("Subject", "TraveloHI OTP Confirmation")
	m.SetBody("text/html", body.String())

	d := gomail.NewDialer("smtp.gmail.com", 587, "victorhalim18@gmail.com", "aikcclnxvfbzrbjw")

	if err := d.DialAndSend(m); err != nil {
		panic(err)
	}

	return c.JSON(fiber.Map{
		"message": "Succesfully sends OTP",
	})
}

func LoginOTP(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)
	if err != nil {
		return c.JSON(fiber.Map{
			"error": err,
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)
	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"error": "Invalid email or password.",
		})
	}

	if time.Now().After(user.OTPExpiration) {
		return c.JSON(fiber.Map{
			"message": "OTP has expired.",
		})
	}

	if data["otp"] == user.OTP {
		// OTP Matches
		clams := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			Issuer:    strconv.Itoa(int(user.ID)),
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		})

		token, err := clams.SignedString([]byte(secretKey))

		if err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"error": "Something went wrong with creating token!",
			})
		}

		cookie := fiber.Cookie{
			Name:    "jwt",
			Value:   token,
			Expires: time.Now().Add(time.Hour * 24),
			// ini di set true biar mastiin front end gabisa ngakses cookie, hanya distore doang
			HTTPOnly: true,
			SameSite: "None",
		}

		c.Cookie(&cookie)

		return c.JSON(fiber.Map{
			"message": "OTP Matches, Credentials saved to cookies",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Invalid OTP",
	})

}

func ForgotPasswordQuestion(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "BAD POST/GET Request",
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		return c.JSON(fiber.Map{
			"message": "No such user found",
		})
	}

	if user.IsBanned {
		return c.Status(fiber.StatusForbidden).JSON(
			fiber.Map{"message": "Account is Banned!"},
		)
	}

	var question models.Question

	database.DB.Where("q_id = ?", user.QuestionID).First(&question)
	if question.QID == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Security question not found",
		})
	}

	return c.JSON(fiber.Map{
		"question": question.Question,
	})
}

func ForgotPasswordConfirm(c *fiber.Ctx) error {
	var data map[string]string

	err := c.BodyParser(&data)

	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "BAD POST/GET Request",
		})
	}

	var user models.User

	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		return c.JSON(fiber.Map{
			"message": "No such user found",
		})
	}

	var question models.Question

	database.DB.Where("q_id = ?", user.QuestionID).First(&question)
	if question.QID == "" {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Security question not found",
		})
	}

	if user.Answer != data["answer"] {
		return c.Status(fiber.StatusUnauthorized).JSON(
			fiber.Map{"message": "Wrong answer"},
		)
	}

	return c.JSON(fiber.Map{
		"message": "Provided Answer is correct!",
	})
}

func ChangePassword(c *fiber.Ctx) error {
	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid Body")
	}

	var user models.User
	database.DB.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Email does not exist.",
		})
	}

	err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"]))

	if err != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error hashing password")
		}
		user.Password = hashedPassword

		result := database.DB.Save(&user)
		if result.Error != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Error updating password in database")
		}

		return c.JSON(fiber.Map{
			"message": "Password successfully updated.",
		})
	}

	return c.Status(fiber.StatusConflict).JSON(fiber.Map{
		"message": "New password must be different from the current password.",
	})
}
