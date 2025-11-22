package main

import (
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/controllers"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()

	initializers.DB.AutoMigrate(&models.User{})
}
func main() {
	router := gin.Default()

	router.POST("/books", controllers.BooksCreate)
	router.PUT("/books/:id", controllers.BooksUpdate)
	router.GET("/books", controllers.BooksIndex)
	router.GET("/books/:id", controllers.BooksShow)
	router.DELETE("/books/:id", controllers.BooksDelete)

	router.POST("/transactions", controllers.TransactionCreate)
	router.PUT("/transactions/:id", controllers.TransactionUpdate)
	router.GET("/transactions", controllers.TransactionIndex)
	router.GET("/transactions/:id", controllers.TransactionShow)
	router.DELETE("/transactions/:id", controllers.TransactionDelete)

	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)

	router.Run(":3000")
}
