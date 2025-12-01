package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

<<<<<<< HEAD
func TransactionCreate(c *gin.Context) {
	var body struct {
		BookID     *uint  `json:"book_id"`
		UserID     *uint  `json:"user_id"`
		BorrowDate string `json:"borrow_date"`
		ReturnDate string `json:"return_date"`
		Status     string `json:"status"`
	}

=======
func TransactionCreate (c *gin.Context) {
	// Get data off req body
	var body struct {
		BookID     *uint	`json:"book_id"`
		UserID     *uint	`json:"user_id"`
		BorrowDate string	`json:"borrow_date"`
		ReturnDate string	`json:"return_date"`
		Status     string	`json:"status"`
	}
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

<<<<<<< HEAD
=======
	// Create a transaction
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	transaction := models.Transaction{
		BookID:     *body.BookID,
		UserID:     *body.UserID,
		BorrowDate: body.BorrowDate,
		ReturnDate: body.ReturnDate,
		Status:     body.Status,
	}

<<<<<<< HEAD
	result := initializers.DB.Create(&transaction)
=======
	result := initializers.DB.Create(&transaction) 

>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	if result.Error != nil {
		c.Status(400)
		return
	}

<<<<<<< HEAD
=======
	// Return it
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	c.JSON(200, gin.H{
		"transaction": transaction,
	})
}

func TransactionIndex(c *gin.Context) {
<<<<<<< HEAD
	var transactions []models.Transaction
	initializers.DB.Preload("Book").Find(&transactions)

	var formatted []map[string]interface{}

	for _, t := range transactions {
		var user models.User
		initializers.DB.First(&user, t.UserID)

		formatted = append(formatted, map[string]interface{}{
			"id":          t.ID,
			"user_name":   user.Name,
			"book_title":  t.Book.Title,
			"borrow_date": t.BorrowDate,
			"return_date": t.ReturnDate,
			"status":      t.Status,
		})
	}

	c.JSON(200, gin.H{
		"transactions": formatted,
	})
}

func TransactionShow(c *gin.Context) {
	id := c.Param("id")

	var transaction models.Transaction
	initializers.DB.Preload("Book").First(&transaction, id)

=======
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
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	c.JSON(200, gin.H{
		"transaction": transaction,
	})
}

func TransactionUpdate(c *gin.Context) {
<<<<<<< HEAD
	id := c.Param("id")

	var body struct {
		BookID     uint   `json:"book_id"`
		UserID     uint   `json:"user_id"`
		BorrowDate string `json:"borrow_date"`
		ReturnDate string `json:"return_date"`
		Status     string `json:"status"`
	}

=======
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
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

<<<<<<< HEAD
	var transaction models.Transaction
	initializers.DB.First(&transaction, id)

=======
	// Find the transaction were updating
	var transaction models.Transaction
	initializers.DB.First(&transaction, id)

	// Update it
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
	initializers.DB.Model(&transaction).Updates(models.Transaction{
		BookID:     body.BookID,
		UserID:     body.UserID,
		BorrowDate: body.BorrowDate,
		ReturnDate: body.ReturnDate,
		Status:     body.Status,
	})
<<<<<<< HEAD

	if body.Status == "returned" {
		var book models.Book
		if err := initializers.DB.First(&book, transaction.BookID).Error; err == nil {
			initializers.DB.Model(&book).Updates(models.Book{Status: "Available"})
		}
	}

	c.JSON(200, gin.H{
		"transaction": transaction,
	})
}

func TransactionDelete(c *gin.Context) {
	id := c.Param("id")
	initializers.DB.Delete(&models.Transaction{}, id)
	c.Status(200)
}

func TransactionBorrow(c *gin.Context) {
	var body struct {
		UserID uint `json:"userId"`
		Books  []struct {
			BookID     uint   `json:"bookId"`
			BorrowDate string `json:"borrowDate"`
			ReturnDate string `json:"returnDate"`
		} `json:"books"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	db := initializers.DB.Begin()
	if db.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to start database transaction"})
		return
	}

	for _, b := range body.Books {
		tx := models.Transaction{
			UserID:     body.UserID,
			BookID:     b.BookID,
			BorrowDate: b.BorrowDate,
			ReturnDate: b.ReturnDate,
			Status:     "borrowed",
		}

		result := db.Create(&tx)

		if result.Error != nil {
			db.Rollback()
			c.JSON(400, gin.H{"error": "Failed to borrow book: " + result.Error.Error()})
			return
		}
	}

	db.Commit()

	c.JSON(200, gin.H{
		"message": "Borrow successful",
	})
}

func TransactionMine(c *gin.Context) {
	userID := c.Query("userId")

	var transactions []models.Transaction
	initializers.DB.Preload("Book").Where("user_id = ?", userID).Find(&transactions)

	c.JSON(200, gin.H{
		"transactions": transactions,
	})
}
=======
	
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
>>>>>>> 8952ca04f1bcdeee897cbb3f4dc61fd815186c8b
