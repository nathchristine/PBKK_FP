package models

import "gorm.io/gorm"

type Book struct {
	gorm.Model
	Title       string	`gorm:"size:255" json:"title"`
	Author      string	`gorm:"size:255" json:"author"`
	Genre		string	`gorm:"size:255" json:"genre"`
	Year		int		`gorm:"size:255" json:"year"`
	Cover       string	`gorm:"size:255" json:"cover"`
	Status	  	string	`gorm:"size:255" json:"status"`
}
