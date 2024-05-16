package main

import (
	"travelohi-backend/database"
	"travelohi-backend/migrations"
	"travelohi-backend/models"
	"travelohi-backend/routes"

	_ "travelohi-backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

// @title Swagger Travelohi API
// @version 1.0
// @description This is TraveloHI's API Documentation.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost
// @BasePath /v2
func main() {
	database.Connect()
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		// INI PENTING BIAR FRONTEND BISA NERIMA DAN NGIRIM BALIK COOKIE
		AllowCredentials: true,
		AllowOrigins:     "http://localhost:5173,http://localhost:3000",
	}))

	// Swagger Route
	app.Get("/swagger/*", swagger.HandlerDefault)

	// app.Get("/swagger/*", swagger.New(swagger.Config{ // custom
	// 	URL:         "http://example.com/doc.json",
	// 	DeepLinking: false,
	// 	// Expand ("list") or Collapse ("none") tag groups by default
	// 	DocExpansion: "none",
	// 	// Prefill OAuth ClientId on Authorize popup
	// 	OAuth: &swagger.OAuthConfig{
	// 		AppName:  "OAuth Provider",
	// 		ClientId: "21bb4edc-05a7-4afc-86f1-2e151e4ba6e2",
	// 	},
	// 	// Ability to change OAuth2 redirect uri location
	// 	OAuth2RedirectUrl: "http://localhost:8080/swagger/oauth2-redirect.html",
	// }))

	routes.Setup(app)

	Migration()

	app.Listen(":3000")

}

func Migration() {
	migrations.MigrateQuestions(database.DB)
	migrations.InsertQuestionData(database.DB)

	// Now includes Airport seeding
	migrations.MigrateCityAndCountries(database.DB)

	database.DB.AutoMigrate(&models.Promo{})
	database.DB.AutoMigrate(&models.Review{})
	database.DB.AutoMigrate(&models.RoomCategory{})
	database.DB.AutoMigrate(&models.Hotel{})
	database.DB.AutoMigrate(&models.Airline{})
	database.DB.AutoMigrate(&models.Airplane{})
	database.DB.AutoMigrate(&models.Flight{})
	database.DB.AutoMigrate(&models.Airport{})
	database.DB.AutoMigrate(&models.FlightCart{})
	database.DB.AutoMigrate(&models.HotelCart{})
	database.DB.AutoMigrate(&models.CreditCard{})

	migrations.SeedAirlineAndAirplane(database.DB)
}
