import express from 'express';
// UPDATED: Import 'getTasks' (not getTasksByProject) to match the controller
import { createTask, getTasks, updateTaskStatus, deleteTask } from '../controllers/tasksController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createTask);

// UPDATED: Use 'getTasks' here
router.get('/project/:projectId', userAuth, getTasks);

router.put('/:taskId', userAuth, updateTaskStatus);
router.delete('/:taskId', userAuth, deleteTask);

export default router;