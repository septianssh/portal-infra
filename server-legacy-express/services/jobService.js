import {
    createVMGCPForm,
    createVMVMWareForm,
    deleteVMGCPForm,
    deleteVMVMWareForm,
} from "../utils/formsService.js";


const launchJob = async (url, extraVars) => {
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.AWX_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ extra_vars: extraVars }),
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Failed to launch job, status: ${response.status}`);
    }
    return response.json();
};

const getJobStatuses = async (jobId, jobType) => {
    const jobUrl = `${process.env.AWX_API_URL}/api/v2/${jobType}/${jobId}/`;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.AWX_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    };
    const response = await fetch(jobUrl, options);
    const { status } = await response.json();
    return status;
};

const fetchDetails = async (workflowJobId) => {
    let result = "";
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.AWX_API_TOKEN}`,
            "Content-Type": "application/json",
        },
    };

    try {
        const nodesUrl = `${process.env.AWX_API_URL}/api/v2/workflow_jobs/${workflowJobId}/workflow_nodes/`;
        const nodesResponse = await fetch(nodesUrl, options);
        const nodesData = await nodesResponse.json();

        const jobs = nodesData.results
            .map((job) => ({
                id: job.summary_fields.job ? job.summary_fields.job.id : null,
                name: job.summary_fields.job ? job.summary_fields.job.name : "Unknown",
            }))
            .filter((job) => job.id !== null);

        jobs.sort((a, b) => a.id - b.id);
        for (let job of jobs) {
            const jobOutputUrl = `${process.env.AWX_API_URL}/api/v2/jobs/${job.id}/stdout/?format=txt`;
            const outputResponse = await fetch(jobOutputUrl, options);
            const jobOutput = await outputResponse.text();
            result +=
                `--------------------------------\nOutput for Job ID: ${job.id} (Job Name: ${job.name})\n--------------------------------\n` +
                jobOutput +
                `--------------------------------\n\n`;
        }
    } catch (error) {
        console.error("Error fetching job outputs:", error.message);
    }
    return result;
};

const fetchDatastores = async (req, res) => {
    const url = `${process.env.AWX_API_URL}/api/v2/job_templates/165/launch/`;
    const response = await launchJob(url, {});
    const jobId = response.job;
    let status = await getJobStatuses(jobId, 'jobs');

    while (status !== "successful" && status !== "failed") {
        new Promise((resolve) => setTimeout(resolve, 3000));
        status = await getJobStatuses(jobId, 'jobs');
    };

    if (status === "successful") {
        const jobResultUrl = `${process.env.AWX_API_URL}/api/v2/jobs/${jobId}/stdout/?format=json`;
        const jobResultResponse = await fetch(jobResultUrl, {
            headers: {
                Authorization: `Bearer ${process.env.AWX_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        const jobResultData = await jobResultResponse.json();
        return jobResultData;
    } else {
        return `Job completed with status: ${status}`;
    }
};

const processFormData = async (runType, formData) => {
    let workflowJobID;
    let form = {};
    let yamlLikeEntries = "";

    const WORKFLOW_JOB_IDS = {
        CREATE_VM_GCP: 55,
        CREATE_VM_VMWARE: 87,
        DELETE_VM_GCP: 130,
        DELETE_VM_VMWARE: 128,
    };

    const createYamlLikeEntries = (hostname, ipAddress) =>
        `- { Hostname: ${hostname}, Ipaddress: ${ipAddress} }`;

    switch (runType) {
        case "create_vm_GCP":
            workflowJobID = WORKFLOW_JOB_IDS.CREATE_VM_GCP;
            form = createVMGCPForm(formData);
            break;
        case "create_vm_VMWare":
            workflowJobID = WORKFLOW_JOB_IDS.CREATE_VM_VMWARE;
            form = createVMVMWareForm(formData);
            break;
        case "delete_vm_GCP":
            workflowJobID = WORKFLOW_JOB_IDS.DELETE_VM_GCP;
            yamlLikeEntries = createYamlLikeEntries(formData.hostname, formData.ip_address);
            form = deleteVMGCPForm(formData, yamlLikeEntries);
            break;
        case "delete_vm_VMWare":
            workflowJobID = WORKFLOW_JOB_IDS.DELETE_VM_VMWARE;
            yamlLikeEntries = createYamlLikeEntries(formData.hostname, formData.ip_address);
            form = deleteVMVMWareForm(formData, yamlLikeEntries);
            break;
        default:
            throw new Error("Invalid run type specified");
    }
    return [workflowJobID, form];
};

export default { launchJob, getJobStatuses, fetchDetails, fetchDatastores, processFormData };
