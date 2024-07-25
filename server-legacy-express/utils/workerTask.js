import jobQueue from './queueSetup.js';
import executeTaskFunction from './taskExecutor.js';
import TaskList from '../models/TaskList.js';
import jobService from '../services/jobService.js';

const executeAndSaveTask = async (taskType, taskParams, email) => {
  const executeTask = await executeTaskFunction(taskType, taskParams);

  for (const launchResult of executeTask) {
    const taskName = launchResult.summary_fields.workflow_job_template.name.replace(/[-_]/g, ' ').trim();
    await TaskList.create({
      email,
      taskName,
      jobId: launchResult.id,
    });
  }

  return executeTask;
};

const updateTaskStatus = async (result, status, jobDetails) => {
  await TaskList.update(
    {
      status: `${status[0].toUpperCase()}${status.slice(1)}`,
      details: jobDetails,
    },
    { where: { jobId: result.id } }
  );
};

const pollJobStatuses = async (executeTask, currentDelay) => {
  const statusPromises = executeTask.map(result => jobService.getJobStatuses(result.id, 'workflow_jobs'));
  const statuses = await Promise.all(statusPromises);

  for (let i = 0; i < executeTask.length; i++) {
    const result = executeTask[i];
    const jobStatus = statuses[i];
    const jobDetails = await jobService.fetchDetails(result.id);

    await updateTaskStatus(result, jobStatus, jobDetails);

    if (jobStatus !== 'running' && jobStatus !== 'pending') {
      currentDelay = 1000;
    } else {
      currentDelay = Math.min(10000, currentDelay * 2 * Math.random());
    }
  }

  return { statuses, currentDelay };
};

const pollWithBackoff = async (executeTask, currentDelay) => {
  const { statuses, updatedDelay } = await pollJobStatuses(executeTask, currentDelay);
  if (statuses.every(status => status !== 'running' && status !== 'pending')) {
    return;
  } else {
    setTimeout(() => pollWithBackoff(executeTask, updatedDelay), updatedDelay);
  }
};

const processWaitForJobCompletion = async (job) => {
  const { taskType, taskParams, email } = job.data;
  const executeTask = await executeAndSaveTask(taskType, taskParams, email);
  let initialDelay = 1000;
  await pollWithBackoff(executeTask, initialDelay);
};

jobQueue.process(async (job, done) => {
  try {
    await processWaitForJobCompletion(job);
    done();
  } catch (error) {
    console.error('Error executing task:', error);
    done(error);
  }
});

export default jobQueue;
