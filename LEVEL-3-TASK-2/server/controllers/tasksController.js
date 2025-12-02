import Task from '../models/Task.js';
import Project from '../models/Project.js'; // Import Project model so we can update it

// Create a new Task
export const createTask = async (req, res) => {
  try {
    const { title, project, assignedTo, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ success: false, message: 'Title and Project ID are required' });
    }

    const task = await Task.create({
      title,
      project,
      assignedTo,
      dueDate
    });

    // Reset project to Active if a new task is added
    await Project.findByIdAndUpdate(project, { status: 'Active' });

    return res.status(201).json({ success: true, task });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Tasks by Project ID
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
    return res.json({ success: true, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Task Status & Auto-Update Project Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // 1. Update the Task
    const task = await Task.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    // 2. Check if all tasks for this project are now completed
    const projectId = task.project;
    const allTasks = await Task.find({ project: projectId });

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;

    // 3. Determine new Project Status
    let newProjectStatus = 'Active';
    if (totalTasks > 0 && totalTasks === completedTasks) {
        newProjectStatus = 'Completed';
    }

    // 4. Update the Project in the Database
    await Project.findByIdAndUpdate(projectId, { status: newProjectStatus });

    return res.json({ success: true, task, projectStatus: newProjectStatus });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};