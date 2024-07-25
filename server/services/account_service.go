package services

import (
	"portal-infra-server/models"
	"portal-infra-server/repository"
	"portal-infra-server/utils"
)

type AccountService interface {
	CreateAccount(account *models.Account) error
	GetAccountByEmail(email string) (*models.Account, error)
	GetAccountByUsername(username string) (*models.Account, error)
	GetAccountByID(id uint) (*models.Account, error)
	UpdateAccount(account *models.Account) error
	DeleteAccount(account *models.Account) error
}

type accountService struct {
	accountRepo repository.AccountRepository
}

func NewAccountService(repo repository.AccountRepository) AccountService {
	return &accountService{accountRepo: repo}
}

func (s *accountService) CreateAccount(account *models.Account) error {
	hashedPassword, err := utils.HashPassword(account.Password)
	if err != nil {
		return err
	}
	account.Password = hashedPassword
	return s.accountRepo.CreateAccount(account)
}

func (s *accountService) GetAccountByEmail(email string) (*models.Account, error) {
	return s.accountRepo.GetAccountByEmail(email)
}

func (s *accountService) GetAccountByUsername(username string) (*models.Account, error) {
	return s.accountRepo.GetAccountByUsername(username)
}

func (s *accountService) GetAccountByID(id uint) (*models.Account, error) {
	return s.accountRepo.GetAccountByID(id)
}

func (s *accountService) UpdateAccount(account *models.Account) error {
	return s.accountRepo.UpdateAccount(account)
}

func (s *accountService) DeleteAccount(account *models.Account) error {
	return s.accountRepo.DeleteAccount(account)
}
