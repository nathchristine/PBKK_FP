package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

func TransactionCreate (c *gin.Context) {
	// Get data off req body
	var body struct {
		BookID     *uint	`json:"book_id"`
		UserID     *uint	`json:"user_id"`
		BorrowDate string	`json:"borrow_date"`
		ReturnDate string	`json:"return_date"`
		Status     string	`json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Create a transaction
	transaction := models.Transaction{
		BookID:     *body.BookID,
		UserID:     *body.UserID,
		BorrowDate: body.BorrowDate,
		ReturnDate: body.ReturnDate,
		Status:     body.Status,
	}

	result := initializers.DB.Create(&transaction) 

	if result.Error != nil {
		c.Status(400)
		return
	}

	// Return it
	c.JSON(200, gin.H{
		"transaction": transaction,
	})
}

func TransactionIndex(c *gin.Context) {
	// Get the transactions
	var transaction []models.Transaction
	initializers.DB.Preload("Book").Find(&transaction)

	// Respond with them
	c.JSON(200, gin.H{
		"transactions": transaction,
	})

}

func TransactionShow(c *gin.Context) {
	// Get id off url
	id := c.Param("id")

	// Get the transaction
	var transaction models.Transaction
	initializers.DB.Preload("Book").First(&transaction, id)

	// Respond with it
	c.JSON(200, gin.H{
		"transaction": transaction,
	})
}

func TransactionUpdate(c *gin.Context) {
	// Get the id off the url
	id := c.Param("id")

	// Get the data off req body
	var body struct {
		BookID     uint	`json:"book_id"`
		UserID     uint	`json:"user_id"`
		BorrowDate string	`json:"borrow_date"`
		ReturnDate string	`json:"return_date"`
		Status     string	`json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find the transaction were updating
	var transaction models.Transaction
	initializers.DB.First(&transaction, id)

	// Update it
	initializers.DB.Model(&transaction).Updates(models.Transaction{
		BookID:     body.BookID,
		UserID:     body.UserID,
		BorrowDate: body.BorrowDate,
		ReturnDate: body.ReturnDate,
		Status:     body.Status,
	})
	
	// Respond with it
	c.JSON(200, gin.H{
		"transaction": transaction,
	})	
}

func TransactionDelete(c *gin.Context) {
	// Get the id off the url
	id := c.Param("id")

	// Delete the transaction
	initializers.DB.Delete(&models.Transaction{}, id)

	// Respond
	c.Status(200)
}