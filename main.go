package main

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/controllers"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()

	initializers.DB.AutoMigrate(&models.User{})
	initializers.DB.AutoMigrate(&models.Book{})
	initializers.DB.AutoMigrate(&models.Transaction{})
}

func main() {
	router := gin.Default()

	// Frontend config
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Backend routes
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
	router.GET("/transactions/mine", controllers.TransactionMine)
	router.PATCH("/transactions/:id", controllers.TransactionUpdate)

	router.POST("/signup", controllers.Signup)
	router.POST("/login", controllers.Login)

	router.GET("/users", controllers.UsersIndex)
	router.DELETE("/users/:id", controllers.UsersDelete)

	router.Run(":8080")
}
