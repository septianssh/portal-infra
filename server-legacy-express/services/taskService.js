import jobService from './jobService.js';
import TaskList from '../models/TaskList.js';
import User from '../models/User.js';
import jobQueue from '../utils/workerTask.js';

const getTaskHistory = async () => {
    return await TaskList.findAll();
};

const getTaskById = async (taskId) => {
    return await TaskList.findByPk(taskId);
};

const getTaskMetrics = async () => {
    const totalTasks = await TaskList.count();
    const successfulTasks = await TaskList.count({
        where: { status: 'Successful' },
    });
    const failedTasks = await TaskList.count({
        where: { status: 'Failed' },
    });
    const runningTasks = await TaskList.count({
        where: { status: 'Running' },
    });
    const pendingTasks = await TaskList.count({
        where: { status: 'Pending' },
    });
    return {
        totalTasks,
        successfulTasks,
        failedTasks,
        runningTasks,
        pendingTasks,
    };
};

const executeTask = async (userId, taskType, taskParams) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
    const { email } = user.dataValues;

    // Run ./utils/workerTask.js to queueing task process
    jobQueue.add({ taskType, taskParams, email });
};

const fetchDatastore = async (req, res) => {
    return await jobService.fetchDatastores(req, res);
};

export default {
    getTaskHistory,
    getTaskById,
    getTaskMetrics,
    executeTask,
    fetchDatastore
};
