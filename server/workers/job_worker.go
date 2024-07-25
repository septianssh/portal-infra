package workers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"portal-infra-server/config"
	"portal-infra-server/models"
	"portal-infra-server/repository"
	"portal-infra-server/utils"
)

type JobWorker struct {
	jobRepo repository.JobRepository
}

func NewJobWorker(repo repository.JobRepository) *JobWorker {
	return &JobWorker{jobRepo: repo}
}

func (w *JobWorker) Start(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()

	for {
		select {
		case <-ctx.Done():
			log.Println("Job worker stopped")
			return
		default:
			w.processJobs(ctx)
			time.Sleep(1 * time.Minute) // Check every minute
		}
	}
}

func (w *JobWorker) processJobs(ctx context.Context) {
	jobs, err := w.jobRepo.GetJobsByStatus(models.StatusPending)
	if err != nil {
		log.Printf("Error fetching jobs: %v", err)
		return
	}

	var wg sync.WaitGroup
	for _, job := range jobs {
		wg.Add(1)
		go w.trackJobProgress(ctx, &wg, job.JobID)
	}
	wg.Wait()
}

func (w *JobWorker) trackJobProgress(ctx context.Context, wg *sync.WaitGroup, jobID string) {
	defer wg.Done()

	backoff := utils.Backoff(1*time.Second, 1*time.Minute)
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(backoff()):
			status, err := w.checkAndUpdateJobStatus(jobID)
			if err != nil {
				log.Printf("Error tracking job progress: %v", err)
			} else {
				if status == models.StatusSuccessful || status == models.StatusFailed || status == models.StatusCanceled {
					return
				}
			}
		}
	}
}

func (w *JobWorker) checkAndUpdateJobStatus(jobID string) (string, error) {
	url := config.GetConfig().AWXApiURL + "/api/v2/workflow_jobs/" + jobID + "/"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+config.GetConfig().AWXToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var jobDetails map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&jobDetails); err != nil {
		return "", err
	}

	status := jobDetails["status"].(string)
	details, _ := json.Marshal(jobDetails)

	if err := w.jobRepo.UpdateJobStatus(jobID, status); err != nil {
		return "", err
	}
	if err := w.jobRepo.UpdateJobDetails(jobID, string(details)); err != nil {
		return "", err
	}
	return status, nil
}
