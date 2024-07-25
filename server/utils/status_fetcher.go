package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"portal-infra-server/config"
	"portal-infra-server/repository"
)

// FetchAndUpdateJobStatus fetches and updates the status of a job.
func FetchAndUpdateJobStatus(jobRepo repository.JobRepository, jobID string) (string, error) {
	url := fmt.Sprintf("%s/api/v2/workflow_jobs/%s/", config.GetConfig().AWXApiURL, jobID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", config.GetConfig().AWXToken))
	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	var jobDetails map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&jobDetails); err != nil {
		return "", fmt.Errorf("error decoding response: %w", err)
	}

	status := jobDetails["status"].(string)
	details, _ := json.Marshal(jobDetails)

	if err := jobRepo.UpdateJobStatus(jobID, status); err != nil {
		return "", fmt.Errorf("error updating job status: %w", err)
	}
	if err := jobRepo.UpdateJobDetails(jobID, string(details)); err != nil {
		return "", fmt.Errorf("error updating job details: %w", err)
	}
	return status, nil
}
