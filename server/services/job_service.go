package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"portal-infra-server/config"
	"portal-infra-server/models"
	"portal-infra-server/repository"
	"portal-infra-server/utils"
	"time"
)

type JobService interface {
	SubmitWorkflowJob(job *models.Job) error
	GetJobs() ([]models.Job, error)
	TrackJobProgress(jobID string)
	GetTaskMetrics() (map[string]int64, error)
}

type jobService struct {
	jobRepo repository.JobRepository
}

func NewJobService(repo repository.JobRepository) JobService {
	return &jobService{jobRepo: repo}
}

func (s *jobService) SubmitWorkflowJob(job *models.Job) error {
	var payload map[string]interface{}
	err := json.Unmarshal([]byte(job.Payload), &payload)
	if err != nil {
		return err
	}

	switch job.TaskType {
	case "Add_Record_DNS":
		return s.submitAddRecordDNSJob(job, payload)
	case "Manage_VM":
		return s.submitManageVMJob(job, payload)
	default:
		return fmt.Errorf("unsupported task type: %s", job.TaskType)
	}
}

func (s *jobService) submitAddRecordDNSJob(job *models.Job, payload map[string]interface{}) error {
	taskParams := payload["taskParams"].(map[string]interface{})
	activeDirectory := taskParams["active_directory"].(string)
	hostsEntries := taskParams["hosts_entries"].([]interface{})

	yamlLikeEntries := ""
	for _, entry := range hostsEntries {
		entryMap := entry.(map[string]interface{})
		hostname := entryMap["hostname"].(string)
		ip := entryMap["ip"].(string)
		zone := entryMap["zone"].(string)
		yamlLikeEntries += fmt.Sprintf("- { Hostname: %s, Ipaddress: %s, Zone: %s }\n", hostname, ip, zone)
	}

	extraVars := map[string]interface{}{
		"ad_name":    activeDirectory,
		"parsed_data": yamlLikeEntries,
	}

	extraVarsJSON, _ := json.Marshal(extraVars)
	reqBody := map[string]interface{}{
		"extra_vars": string(extraVarsJSON),
	}

	reqBodyJSON, _ := json.Marshal(reqBody)
	url := fmt.Sprintf("%s/api/v2/workflow_job_templates/%s/launch/", config.GetConfig().AWXApiURL, job.JobID)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqBodyJSON))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().AWXToken))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var awxResp map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&awxResp); err != nil {
		return err
	}

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("failed to launch workflow job: %s", awxResp)
	}

	jobID := fmt.Sprintf("%v", awxResp["id"])
	job.JobID = jobID
	job.Status = models.StatusRunning

	if err := s.jobRepo.CreateJob(job); err != nil {
		return err
	}

	go s.TrackJobProgress(jobID)
	return nil
}

func (s *jobService) submitManageVMJob(job *models.Job, payload map[string]interface{}) error {
	taskParams := payload["taskParams"].(map[string]interface{})
	formsData := taskParams["forms_data"].([]interface{})

	for _, formData := range formsData {
		formDataJSON, _ := json.Marshal(formData)
		taskPayload := map[string]interface{}{
			"taskType":   "Manage_VM",
			"taskParams": formData,
		}
		taskPayloadJSON, _ := json.Marshal(taskPayload)
		newJob := models.Job{
			Email:    job.Email,
			TaskName: job.TaskName,
			Status:   models.StatusPending,
			TaskType: "Manage_VM",
			Payload:  string(taskPayloadJSON),
		}

		err := s.jobRepo.CreateJob(&newJob)
		if err != nil {
			return err
		}

		url := fmt.Sprintf("%s/api/v2/workflow_job_templates/%s/launch/", config.GetConfig().AWXApiURL, job.JobID)
		req, err := http.NewRequest("POST", url, bytes.NewBuffer(formDataJSON))
		if err != nil {
			return err
		}

		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().AWXToken))
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		var awxResp map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&awxResp); err != nil {
			return err
		}

		if resp.StatusCode != http.StatusCreated {
			return fmt.Errorf("failed to launch workflow job: %s", awxResp)
		}

		jobID := fmt.Sprintf("%v", awxResp["id"])
		newJob.JobID = jobID
		newJob.Status = models.StatusRunning

		if err := s.jobRepo.UpdateJobStatus(newJob.JobID, models.StatusRunning); err != nil {
			return err
		}

		go s.TrackJobProgress(newJob.JobID)
	}

	return nil
}

func (s *jobService) TrackJobProgress(jobID string) {
	backoff := utils.Backoff(1*time.Second, 1*time.Minute)
	for {
		status, err := utils.FetchAndUpdateJobStatus(s.jobRepo, jobID)
		if err != nil {
			fmt.Printf("Error tracking job progress: %v\n", err)
			time.Sleep(backoff())
			continue
		}

		if status == models.StatusSuccessful || status == models.StatusFailed || status == models.StatusCanceled {
			return
		}

		time.Sleep(1 * time.Minute)
	}
}

func (s *jobService) GetJobs() ([]models.Job, error) {
	return s.jobRepo.GetJobs()
}

func (s *jobService) GetTaskMetrics() (map[string]int64, error) {
	totalTasks, err := s.jobRepo.CountJobsByStatus("")
	if err != nil {
		return nil, err
	}
	successfulTasks, err := s.jobRepo.CountJobsByStatus(models.StatusSuccessful)
	if err != nil {
		return nil, err
	}
	failedTasks, err := s.jobRepo.CountJobsByStatus(models.StatusFailed)
	if err != nil {
		return nil, err
	}
	runningTasks, err := s.jobRepo.CountJobsByStatus(models.StatusRunning)
	if err != nil {
		return nil, err
	}
	pendingTasks, err := s.jobRepo.CountJobsByStatus(models.StatusPending)
	if err != nil {
		return nil, err
	}

	return map[string]int64{
		"totalTasks":       totalTasks,
		"successfulTasks":  successfulTasks,
		"failedTasks":      failedTasks,
		"runningTasks":     runningTasks,
		"pendingTasks":     pendingTasks,
	}, nil
}
