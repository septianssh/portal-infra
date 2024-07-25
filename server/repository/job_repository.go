package repository

import (
	"portal-infra-server/database"
	"portal-infra-server/models"
)

type JobRepository interface {
	CreateJob(job *models.Job) error
	GetJobs() ([]models.Job, error)
	GetJobsByStatus(status string) ([]models.Job, error)
	UpdateJobStatus(jobID string, status string) error
	UpdateJobDetails(jobID string, details string) error
	CountJobsByStatus(status string) (int64, error)
}

type jobRepository struct{}

func NewJobRepository() JobRepository {
	return &jobRepository{}
}

func (r *jobRepository) CreateJob(job *models.Job) error {
	return database.DB.Create(job).Error
}

func (r *jobRepository) GetJobs() ([]models.Job, error) {
	var jobs []models.Job
	err := database.DB.Find(&jobs).Error
	return jobs, err
}

func (r *jobRepository) GetJobsByStatus(status string) ([]models.Job, error) {
	var jobs []models.Job
	err := database.DB.Where("status = ?", status).Find(&jobs).Error
	return jobs, err
}

func (r *jobRepository) UpdateJobStatus(jobID string, status string) error {
	var job models.Job
	err := database.DB.Where("job_id = ?", jobID).First(&job).Error
	if err != nil {
		return err
	}
	job.Status = status
	return database.DB.Save(&job).Error
}

func (r *jobRepository) UpdateJobDetails(jobID string, details string) error {
	var job models.Job
	err := database.DB.Where("job_id = ?", jobID).First(&job).Error
	if err != nil {
		return err
	}
	job.Details = details
	return database.DB.Save(&job).Error
}

func (r *jobRepository) CountJobsByStatus(status string) (int64, error) {
	var count int64
	query := database.DB.Model(&models.Job{})
	if status != "" {
		query = query.Where("status = ?", status)
	}
	err := query.Count(&count).Error
	return count, err
}