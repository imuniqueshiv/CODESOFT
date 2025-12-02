import express from 'express';
// Make sure this path points to the file we just updated above
import { createProject, getProjectsForUser, getProjectById, deleteProject } from '../controllers/projectsController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/', userAuth, createProject);
router.get('/', userAuth, getProjectsForUser);
router.get('/:id', userAuth, getProjectById);
router.delete('/:id', userAuth, deleteProject);

export default router;