package controllers

import (
	"net/http"
	"portal-infra-server/middleware"
	"portal-infra-server/models"
	"portal-infra-server/services"

	"github.com/gin-gonic/gin"
)

type JobController struct {
	jobService services.JobService
}

func NewJobController(service services.JobService) *JobController {
	return &JobController{jobService: service}
}

func (c *JobController) SubmitJob(ctx *gin.Context) {
	var job models.Job
	if err := ctx.ShouldBindJSON(&job); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.jobService.SubmitWorkflowJob(&job)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusCreated, job)
}

func (c *JobController) ListJobs(ctx *gin.Context) {
	jobs, err := c.jobService.GetJobs()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, jobs)
}

func (c *JobController) GetTaskMetrics(ctx *gin.Context) {
	metrics, err := c.jobService.GetTaskMetrics()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, metrics)
}

func (c *JobController) RegisterRoutes(router *gin.Engine) {
	jobs := router.Group("/api/tasks")
	jobs.Use(middleware.AuthMiddleware())
	{
		jobs.POST("/execute", c.SubmitJob)
		jobs.GET("/tasks_history", c.ListJobs)
		jobs.GET("/tasks_metrics", c.GetTaskMetrics)
	}
}
