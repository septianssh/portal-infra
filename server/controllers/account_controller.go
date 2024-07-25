package controllers

import (
	"net/http"
	"portal-infra-server/models"
	"portal-infra-server/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AccountController struct {
	accountService services.AccountService
}

func NewAccountController(service services.AccountService) *AccountController {
	return &AccountController{accountService: service}
}

func (c *AccountController) CreateAccount(ctx *gin.Context) {
	var account models.Account
	if err := ctx.ShouldBindJSON(&account); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.accountService.CreateAccount(&account)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, account)
}

func (c *AccountController) GetAccount(ctx *gin.Context) {
	accountID := ctx.Param("accountID")
	id, err := strconv.ParseUint(accountID, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account, err := c.accountService.GetAccountByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, account)
}

func (c *AccountController) UpdateAccount(ctx *gin.Context) {
	var account models.Account
	if err := ctx.ShouldBindJSON(&account); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.accountService.UpdateAccount(&account)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, account)
}

func (c *AccountController) DeleteAccount(ctx *gin.Context) {
	accountID := ctx.Param("accountID")
	id, err := strconv.ParseUint(accountID, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account, err := c.accountService.GetAccountByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	err = c.accountService.DeleteAccount(account)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}

func (c *AccountController) RegisterRoutes(router *gin.Engine) {
	accounts := router.Group("/api/users")
	{
		accounts.POST("/", c.CreateAccount)
		accounts.GET("/:accountID", c.GetAccount)
		accounts.PUT("/", c.UpdateAccount)
		accounts.DELETE("/:accountID", c.DeleteAccount)
	}
}
