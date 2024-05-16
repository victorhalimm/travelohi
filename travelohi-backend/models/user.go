package models

import "time"

type User struct {
	ID            int        `json:"id"`
	FirstName     string     `json:"first_name"`
	LastName      string     `json:"last_name"`
	PhoneNumber   string     `json:"phone_number"`
	Email         string     `json:"email"`
	Password      []byte     `json:"password"`
	IsBanned      bool       `json:"banned"`
	OTP           string     `json:"otp"`
	OTPExpiration time.Time  `json:"otp_expiration"`
	QuestionID    string     `json:"question_id"`
	Answer        string     `json:"answer"`
	Dob           string     `json:"dob"`
	Role          string     `json:"role"`
	IsNewsletter  bool       `json:"newsletter"`
	CreditCardID  string     `json:"credit_card_id"`
	CreditCard    CreditCard `gorm:"foreignKey:CreditCardID;references:ID" json:"credit_card"`
}
