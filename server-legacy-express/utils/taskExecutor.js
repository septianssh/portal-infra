import jobService from '../services/jobService.js';

const Add_Record_DNS = async (params) => {
  const { active_directory, hosts_entries } = params;
  const workflowJobID = "99";

  const url = `${process.env.AWX_API_URL}/api/v2/workflow_job_templates/${workflowJobID}/launch/`;
  const yamlLikeEntries = hosts_entries
    .map(({ hostname, ip, zone }) => `- { Hostname: ${hostname}, Ipaddress: ${ip}, Zone: ${zone} }`)
    .join("\n");

  const extraVars = {
    ad_name: active_directory,
    parsed_data: yamlLikeEntries,
  };

  return [await jobService.launchJob(url, extraVars)];
}

const Provision_VM = async (params) => {
  const { run_type, forms_data } = params;
  const formDataArray = JSON.parse(forms_data);
  const launchResults = [];

  for (const formData of formDataArray) {
    const [workflowJobID, form] = await jobService.processFormData(run_type, formData);
    const url = `${process.env.AWX_API_URL}/api/v2/workflow_job_templates/${workflowJobID}/launch/`;
    launchResults.push(await jobService.launchJob(url, form));
  }
  return launchResults;
};

const Dismantle_VM = async (params) => {
  const { run_type, forms_data } = params;
  const formDataArray = JSON.parse(forms_data);
  const launchResults = [];

  for (const formData of formDataArray) {
    const [workflowJobID, form] = await jobService.processFormData(run_type, formData);
    const url = `${process.env.AWX_API_URL}/api/v2/workflow_job_templates/${workflowJobID}/launch/`;
    launchResults.push(await jobService.launchJob(url, form));
  }
  return launchResults;
};

const taskFunctions = {
  Add_Record_DNS: Add_Record_DNS,
  Provision_VM: Provision_VM,
  Dismantle_VM: Dismantle_VM,
};

const executeTaskFunction = async (taskType, params) => {
  if (!taskFunctions[taskType]) {
    throw new Error(`No strategy found for task type: ${taskType}`);
  }
  return await taskFunctions[taskType](params);
};

export default executeTaskFunction;