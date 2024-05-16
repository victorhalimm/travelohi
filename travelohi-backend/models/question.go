package models

type Question struct {
	QID      string `gorm:"unique;not null"`
	Question string `gorm:"type:text;not null"`
}
