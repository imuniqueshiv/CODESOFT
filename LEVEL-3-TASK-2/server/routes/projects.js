import express from 'express';
// Ensure this path is correct
import { createProject, getProjectsForUser, getProjectById, deleteProject } from '../controllers/projectsController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Route: POST /api/projects/
router.post('/', userAuth, createProject);

// Route: GET /api/projects/
router.get('/', userAuth, getProjectsForUser);

// Route: GET /api/projects/:id
router.get('/:id', userAuth, getProjectById);

// Route: DELETE /api/projects/:id
router.delete('/:id', userAuth, deleteProject);

export default router;