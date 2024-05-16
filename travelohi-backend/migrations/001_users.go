package migrations

import (
	"travelohi-backend/models"

	"gorm.io/gorm"
)

func MigrateQuestions(db *gorm.DB) {
	db.AutoMigrate(&models.Question{})
}

func InsertQuestionData(db *gorm.DB) {
	questions := []models.Question{
		{QID: "Q001", Question: "What is your favorite childhood pet's name?"},
		{QID: "Q002", Question: "In which city were you born?"},
		{QID: "Q003", Question: "What is the name of your favorite book or movie?"},
		{
			QID:      "Q004",
			Question: "What is the name of the elementary school you attended?",
		},
		{
			QID:      "Q005",
			Question: "What is the model of your first car?",
		},
	}

	for _, q := range questions {
		db.FirstOrCreate(&q, models.Question{QID: q.QID})
	}
}
