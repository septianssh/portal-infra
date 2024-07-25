import express from 'express';
import taskController from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/tasks_history', authMiddleware, taskController.getTaskHistory);
// router.get('/:id', authMiddleware, taskController.getTaskById);
router.get('/tasks_metrics', authMiddleware, taskController.getTaskMetrics);
router.post('/execute', authMiddleware, taskController.executeTask);
router.post('/fetch_datastores', authMiddleware, taskController.fetchDatastore);

export default router;
