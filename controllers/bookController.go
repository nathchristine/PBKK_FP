package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

func BooksCreate (c *gin.Context) {
	// Get data off req body
	var body struct {
		Title  string
		Author string
		Genre  string
		Year   int
		Cover  string
		Status string
	}
	
	c.Bind(&body)

	// Create a book
	book := models.Book{
		Title:  body.Title,
		Author: body.Author,
		Genre:  body.Genre,
		Year:   body.Year,
		Cover:  body.Cover,
		Status: body.Status,
	}

	result := initializers.DB.Create(&book) 

	if result.Error != nil {
		c.Status(400)
		return
	}

	// Return it
	c.JSON(200, gin.H{
		"book": book,
	})
}

func BooksIndex(c *gin.Context) {
	// Get the books
	var books []models.Book
	initializers.DB.Find(&books)

	// Respond with them
	c.JSON(200, gin.H{
		"books": books,
	})

}

func BooksShow(c *gin.Context) {
	// Get id off url
	id := c.Param("id")

	// Get the book
	var book models.Book
	initializers.DB.First(&book, id)

	// Respond with it
	c.JSON(200, gin.H{
		"book": book,
	})
}

func BooksUpdate(c *gin.Context) {
	// Get the id off the url
	id := c.Param("id")

	// Get the data off req body
	var body struct {
		Title  string
		Author string
		Genre  string
		Year   int
		Cover  string
		Status string
	}
	c.Bind(&body)

	// Find the book were updating
	var book models.Book
	initializers.DB.First(&book, id)

	// Update it
	initializers.DB.Model(&book).Updates(models.Book{
		Title:  body.Title,
		Author: body.Author,
		Genre:  body.Genre,
		Year:   body.Year,
		Cover:  body.Cover,
		Status: body.Status,
	})
	
	// Respond with it
	c.JSON(200, gin.H{
		"book": book,
	})	
}

func BooksDelete(c *gin.Context) {
	// Get the id off the url
	id := c.Param("id")

	// Delete the book
	initializers.DB.Delete(&models.Book{}, id)

	// Respond
	c.Status(200)
}