package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nathchristine/PBKK_FP/initializers"
	"github.com/nathchristine/PBKK_FP/models"
)

func UsersIndex(c *gin.Context) {
	var users []models.User

	result := initializers.DB.Find(&users)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to fetch users",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
	})
}

func UsersDelete(c *gin.Context) {
	id := c.Param("id")

	result := initializers.DB.Delete(&models.User{}, id)

	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to delete user",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User deleted successfully",
	})
}
