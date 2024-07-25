package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func RBACMiddleware(requiredRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roles := c.GetString("roles")
		for _, requiredRole := range requiredRoles {
			if strings.Contains(roles, requiredRole) {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden"})
		c.Abort()
	}
}
