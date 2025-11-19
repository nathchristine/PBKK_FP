package main

import (
	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/controllers"
	"github.com/nathchristine/PBKK_FP/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
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
  
	router.Run() // listens on 0.0.0.0:8080 by default
}