package migrations

import (
	"travelohi-backend/models"

	"gorm.io/gorm"
)

func MigrateCityAndCountries(db *gorm.DB) {
	if err := db.AutoMigrate(&models.City{}, &models.Country{}); err != nil {
		panic("failed to migrate database")
	}

	seedCountriesAndCities(db)
}

func seedCountriesAndCities(db *gorm.DB) {
	countries := []models.Country{
		{Name: "United States"},
		{Name: "France"},
		{Name: "Spain"},
		{Name: "Italy"},
		{Name: "China"},
		{Name: "Turkey"},
		{Name: "Germany"},
		{Name: "Thailand"},
		{Name: "United Kingdom"},
		{Name: "Indonesia"},
		{Name: "Brazil"},
		{Name: "Canada"},
		{Name: "Finland"},
		{Name: "Japan"},
	}

	for _, country := range countries {
		db.FirstOrCreate(&country, models.Country{Name: country.Name})
	}

	cities := []models.City{
		{CountryID: 1, Name: "New York", AirportCode: "JFK"},
		{CountryID: 1, Name: "Los Angeles", AirportCode: "LAX"},
		{CountryID: 2, Name: "Paris", AirportCode: "CDG"},
		{CountryID: 3, Name: "Barcelona", AirportCode: "BCN"},
		{CountryID: 4, Name: "Rome", AirportCode: "FCO"},
		{CountryID: 5, Name: "Beijing", AirportCode: "PEK"},
		{CountryID: 6, Name: "Istanbul", AirportCode: "IST"},
		{CountryID: 7, Name: "Berlin", AirportCode: "TXL"},
		{CountryID: 8, Name: "Bangkok", AirportCode: "BKK"},
		{CountryID: 9, Name: "London", AirportCode: "LHR"},
		{CountryID: 10, Name: "Bali", AirportCode: "DPS"},
		{CountryID: 10, Name: "Jakarta", AirportCode: "CGK"},
		{CountryID: 11, Name: "São Paulo", AirportCode: "GRU"},
		{CountryID: 12, Name: "Toronto", AirportCode: "YYZ"},
		{CountryID: 13, Name: "Helsinki", AirportCode: "HEL"},
		{CountryID: 14, Name: "Tokyo", AirportCode: "HND"},
	}

	airports := []models.Airport{
		{CityID: 1, Name: "John F. Kennedy International Airport", AirportCode: "JFK"},
		{CityID: 2, Name: "Los Angeles International Airport", AirportCode: "LAX"},
		{CityID: 3, Name: "Charles de Gaulle Airport", AirportCode: "CDG"},
		{CityID: 4, Name: "Barcelona-El Prat Airport", AirportCode: "BCN"},
		{CityID: 5, Name: "Leonardo da Vinci-Fiumicino Airport", AirportCode: "FCO"},
		{CityID: 6, Name: "Beijing Capital International Airport", AirportCode: "PEK"},
		{CityID: 7, Name: "Istanbul Airport", AirportCode: "IST"},
		{CityID: 8, Name: "Berlin Brandenburg Airport", AirportCode: "BER"}, // Updated from TXL to BER, considering TXL's closure and BER's opening
		{CityID: 9, Name: "Suvarnabhumi Airport", AirportCode: "BKK"},
		{CityID: 10, Name: "London Heathrow Airport", AirportCode: "LHR"},
		{CityID: 11, Name: "Ngurah-Rai International Airport", AirportCode: "DPS"},
		{CityID: 12, Name: "Soekarno-Hatta Airport", AirportCode: "CGK"},
		{CityID: 13, Name: "Guarulhos International Airport", AirportCode: "GRU"},       // For São Paulo, Brazil
		{CityID: 14, Name: "Toronto Pearson International Airport", AirportCode: "YYZ"}, // For Toronto, Canada
		{CityID: 15, Name: "Helsinki-Vantaa Airport", AirportCode: "HEL"},               // For Helsinki, Finland
		{CityID: 16, Name: "Tokyo Haneda Airport", AirportCode: "HND"},                  // For Tokyo, Japan
	}

	for _, city := range cities {
		db.FirstOrCreate(&city, models.City{Name: city.Name, CountryID: city.CountryID})
	}

	for _, airport := range airports {
		db.FirstOrCreate(&airport, models.Airport{Name: airport.Name, AirportCode: airport.AirportCode})
	}
}
