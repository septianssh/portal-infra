package models

import (
	"gorm.io/gorm"
)

const (
	StatusPending    = "pending"
	StatusRunning    = "running"
	StatusSuccessful = "successful"
	StatusFailed     = "failed"
	StatusCanceled   = "canceled"
)

type Job struct {
	gorm.Model
	JobID     string `json:"job_id"`
	Email     string `json:"email"`
	TaskName  string `json:"task_name"`
	Status    string `json:"status"`
	TaskType  string `json:"task_type"`
	Payload   string `json:"payload"`
	Details   string `json:"details"`
}

func (Job) TableName() string {
	return "portal_task_list"
}