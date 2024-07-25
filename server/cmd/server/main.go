package main

import (
	// "context"
	"log"
	// "os"
	// "os/signal"
	// "sync"
	// "syscall"

	"portal-infra-server/config"
	"portal-infra-server/controllers"
	"portal-infra-server/database"
	"portal-infra-server/middleware"
	"portal-infra-server/repository"
	"portal-infra-server/services"
	"portal-infra-server/utils"

	// "portal-infra-server/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadConfig()
	database.ConnectDatabase()
	// utils.InitLogger()

	router := gin.Default()

	router.Use(middleware.CORSMiddleware())
	// router.Use(middleware.LoggerMiddleware())

	jobRepo := repository.NewJobRepository()
	accountRepo := repository.NewAccountRepository()

	jobService := services.NewJobService(jobRepo)
	accountService := services.NewAccountService(accountRepo)
	authService := services.NewAuthService(accountRepo)

	jobController := controllers.NewJobController(jobService)
	accountController := controllers.NewAccountController(accountService)
	authController := controllers.NewAuthController(authService)

	// jobWorker := workers.NewJobWorker(jobRepo)

	jobController.RegisterRoutes(router)
	accountController.RegisterRoutes(router)
	authController.RegisterRoutes(router)

	// ctx, cancel := context.WithCancel(context.Background())
	// var wg sync.WaitGroup
	// wg.Add(1)
	// go jobWorker.Start(ctx, &wg)

	// // Graceful shutdown
	// c := make(chan os.Signal, 1)
	// signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	// go func() {
	// 	<-c
	// 	log.Println("Shutting down...")
	// 	cancel()
	// 	wg.Wait()
	// 	log.Println("Job worker stopped")
	// }()

	log.Println("Server is running on port 5000")
	if err := router.Run(":5000"); err != nil {
		utils.Logger.Fatalf("Failed to start server: %v", err)
	}
}
