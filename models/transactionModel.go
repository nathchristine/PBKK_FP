package models

import "gorm.io/gorm"

type Transaction struct {
	gorm.Model
	BookID     uint       `json:"book_id"`
	Book       Book       `gorm:"foreignKey:BookID" json:"book"`
	UserID     uint       `json:"user_id"`
	BorrowDate string     `gorm:"size:255" json:"borrow_date"`
	ReturnDate string     `gorm:"size:255" json:"return_date"`
	Status     string     `gorm:"size:255" json:"status"`
}
