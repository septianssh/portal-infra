package repository

import (
	"portal-infra-server/database"
	"portal-infra-server/models"
)

type AccountRepository interface {
	CreateAccount(account *models.Account) error
	GetAccountByEmail(email string) (*models.Account, error)
	GetAccountByUsername(username string) (*models.Account, error)
	GetAccountByID(id uint) (*models.Account, error)
	UpdateAccount(account *models.Account) error
	DeleteAccount(account *models.Account) error
}

type accountRepository struct{}

func NewAccountRepository() AccountRepository {
	return &accountRepository{}
}

func (r *accountRepository) CreateAccount(account *models.Account) error {
	return database.DB.Create(account).Error
}

func (r *accountRepository) GetAccountByEmail(email string) (*models.Account, error) {
	var account models.Account
	err := database.DB.Where("email = ?", email).First(&account).Error
	return &account, err
}

func (r *accountRepository) GetAccountByUsername(username string) (*models.Account, error) {
	var account models.Account
	err := database.DB.Where("username = ?", username).First(&account).Error
	return &account, err
}

func (r *accountRepository) GetAccountByID(id uint) (*models.Account, error) {
	var account models.Account
	err := database.DB.First(&account, id).Error
	return &account, err
}

func (r *accountRepository) UpdateAccount(account *models.Account) error {
	return database.DB.Save(account).Error
}

func (r *accountRepository) DeleteAccount(account *models.Account) error {
	return database.DB.Delete(account).Error
}
