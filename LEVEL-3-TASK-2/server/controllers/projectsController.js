import Project from '../models/Project.js';
import Task from '../models/Task.js';
import calcProgress from './_utils/progressUtil.js';

// Create Project
export const createProject = async (req, res) => {
  try {
    const owner = req.userId;
    if (!owner) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { title, description, startDate, endDate } = req.body;

    if (!title || !description || !endDate) {
        return res.status(400).json({ success: false, message: 'Missing Data: Title, Description or Deadline' });
    }

    const project = await Project.create({
      title, description, startDate: startDate || Date.now(), endDate, owner,
    });

    return res.status(201).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Projects
export const getProjectsForUser = async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    }).sort({ updatedAt: -1 }).lean();

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id }).catch(() => []);
        const progress = calcProgress(tasks);
        return { ...project, progress };
      })
    );

    return res.json({ success: true, projects: projectsWithProgress });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PROJECT (Missing Function Added)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ _id: id, owner: userId });
    
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
    }

    // Delete tasks associated with project
    await Task.deleteMany({ project: id });

    // Delete the project
    await Project.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};