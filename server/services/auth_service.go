package services

import (
	"errors"
	"portal-infra-server/models"
	"portal-infra-server/repository"
	"portal-infra-server/utils"
)

type AuthService interface {
	SignIn(username, password string) (string, *models.Account, error)
}

type authService struct {
	accountRepo repository.AccountRepository
}

func NewAuthService(repo repository.AccountRepository) AuthService {
	return &authService{accountRepo: repo}
}

func (s *authService) SignIn(username, password string) (string, *models.Account, error) {
	account, err := s.accountRepo.GetAccountByUsername(username)
	if err != nil {
		return "", nil, errors.New("user not found")
	}

	err = utils.CheckPasswordHash(password, account.Password)
	if err != nil {
		return "", nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(account.ID, account.Roles)
	if err != nil {
		return "", nil, err
	}

	return token, account, nil
}
