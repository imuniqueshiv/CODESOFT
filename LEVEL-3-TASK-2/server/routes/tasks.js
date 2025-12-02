import express from 'express';
import { createTask, getTasksByProject, updateTaskStatus } from '../controllers/tasksController.js';
import userAuth from '../middleware/userAuth.js'; // Assuming you have this middleware

const router = express.Router();

// Route: /api/tasks
router.post('/', userAuth, createTask);

// Route: /api/tasks/project/:projectId
router.get('/project/:projectId', userAuth, getTasksByProject);

// Route: /api/tasks/:id
router.put('/:id', userAuth, updateTaskStatus);

export default router;