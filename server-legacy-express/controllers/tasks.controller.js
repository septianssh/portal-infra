import jwt from "jsonwebtoken";
import taskService from '../services/taskService.js';

const getTaskHistory = async (req, res) => {
  try {
    const tasks = await taskService.getTaskHistory();
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await taskService.getTaskById(taskId);
    res.json(task);
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getTaskMetrics = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await taskService.getTaskMetrics();
    res.json(task);
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const executeTask = async (req, res) => {
  const { taskType, taskParams } = req.body;
  const userId = jwt.verify(
    req.cookies.access_token,
    process.env.JWT_SECRET_KEY
  ).userId;

  try {
    await taskService.executeTask(userId, taskType, taskParams);
    res.json({ message: `${taskType} task successful` });
  } catch (error) {
    console.error("Error executing task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchDatastore = async (req, res) => {
  try {
    const datastores = await taskService.fetchDatastore(req, res);
    res.end(JSON.stringify({ success: datastores }));
  } catch (error) {
    console.error("Error fetching datastores:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { getTaskHistory, getTaskById, getTaskMetrics, executeTask, fetchDatastore };
