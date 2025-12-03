import express from 'express';
import { createTask, getTasksByProject, updateTaskStatus, deleteTask } from '../controllers/tasksController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createTask);
router.get('/project/:projectId', userAuth, getTasksByProject);
router.put('/:taskId', userAuth, updateTaskStatus);
router.delete('/:taskId', userAuth, deleteTask);

export default router;