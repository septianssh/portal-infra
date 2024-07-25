package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	AWXApiURL		string
	AWXToken		string
	DBHost			string
	DBPort			string
	DBUser			string
	DBPassword		string
	DBName			string
	JWTSecret		string
	AllowOrigins	[]string
}

var config Config

func GetConfig() *Config {
	return &config
}

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	config = Config{
		AWXApiURL:		os.Getenv("AWX_API_URL"),
		AWXToken:		os.Getenv("AWX_API_TOKEN"),
		DBHost:			os.Getenv("DB_HOST"),
		DBPort:     	os.Getenv("DB_PORT"),
		DBUser:     	os.Getenv("DB_USER"),
		DBPassword: 	os.Getenv("DB_PASSWORD"),
		DBName:     	os.Getenv("DB_NAME"),
		JWTSecret:		os.Getenv("JWT_SECRET"),
		AllowOrigins:	strings.Split(os.Getenv("ALLOW_ORIGINS"), ","),
	}
}