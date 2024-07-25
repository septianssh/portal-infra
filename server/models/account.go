package models

import (
	"gorm.io/gorm"
)

type Account struct {
	gorm.Model
	Username string `gorm:"unique;not null" json:"username"`
	Email    string `gorm:"unique;not null" json:"email"`
	Password string `gorm:"not null" json:"-"`
	Roles    string `gorm:"default:user" json:"roles"`
}

func (Account) TableName() string {
	// return "portal_users"
	return "portal_users_go"
}