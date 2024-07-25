package controllers

import (
	"net/http"
	"time"

	"portal-infra-server/services"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService services.AuthService
}

func NewAuthController(service services.AuthService) *AuthController {
	return &AuthController{authService: service}
}

func (c *AuthController) SignIn(ctx *gin.Context) {
	var credentials struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := ctx.ShouldBindJSON(&credentials); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, user, err := c.authService.SignIn(credentials.Username, credentials.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	expiryDate := time.Now().Add(1 * time.Hour)
	ctx.SetCookie("access_token", token, 3600, "/", "", true, true)
	ctx.JSON(http.StatusOK, gin.H{
		"user":       user,
		"tokenExpiry": expiryDate,
	})
}

func (c *AuthController) SignOut(ctx *gin.Context) {
	ctx.SetCookie("access_token", "", -1, "/", "", true, true)
	ctx.JSON(http.StatusOK, "Signout Success!")
}

func (c *AuthController) RegisterRoutes(router *gin.Engine) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/signin", c.SignIn)
		auth.GET("/signout", c.SignOut)
	}
}
