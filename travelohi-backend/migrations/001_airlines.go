package migrations

import (
	"travelohi-backend/models"

	"gorm.io/gorm"
)

func SeedAirlineAndAirplane(db *gorm.DB) {
	airlines := []models.Airline{
		{Name: "Lion Air", ImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-e69e8.appspot.com/o/airline_images%2Flion-air.png?alt=media&token=b9ea5723-fbf6-45ee-a85d-772a2182ee4b"},
		{Name: "Garuda Indonesia", ImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-e69e8.appspot.com/o/airline_images%2Fgaruda-indonesia.png?alt=media&token=271ff3c7-7075-4178-848c-f8e011521bc5"},
		{Name: "Batik Air", ImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-e69e8.appspot.com/o/airline_images%2Fbatik-air.png?alt=media&token=3c840ccf-cee3-43cc-975b-9b9412264461"},
		{Name: "Singapore Airlines", ImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-e69e8.appspot.com/o/airline_images%2Fsingapore-airlines.png?alt=media&token=98af4e8b-f986-458b-a528-c5e8de9849d6"},
		{Name: "Citilink", ImageUrl: "https://firebasestorage.googleapis.com/v0/b/travelohi-e69e8.appspot.com/o/airline_images%2Fcitilink.png?alt=media&token=46f56f1e-282a-41bc-bbbd-f52d46fc92fb"},
	}

	for _, airline := range airlines {
		db.FirstOrCreate(&airline, models.Airline{Name: airline.Name})
	}

	airplanes := []models.Airplane{
		{Name: "Boeing 737-800", AirplaneCode: "B738"},
		{Name: "Airbus A320", AirplaneCode: "A320"},
		{Name: "Boeing 737-900ER", AirplaneCode: "B739"},
		{Name: "Airbus A330", AirplaneCode: "A330"},
		{Name: "Boeing 777", AirplaneCode: "B777"},
		{Name: "Boeing 787 Dreamliner", AirplaneCode: "B787"},
		{Name: "Airbus A350", AirplaneCode: "A350"},
	}

	for _, airplane := range airplanes {
		db.FirstOrCreate(&airplane, models.Airplane{Name: airplane.Name, AirplaneCode: airplane.AirplaneCode})
	}
}
