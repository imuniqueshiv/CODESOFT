import Task from '../models/Task.js';
import Project from '../models/Project.js';
import calcProgress from './_utils/progressUtil.js';

// Helper: recalculate progress and update project if needed
async function recalcAndUpdateProjectProgress(projectId) {
  if (!projectId) return null;

  const tasks = await Task.find({ project: projectId }).lean().catch(() => []);
  const progress = calcProgress(tasks); // should return 0-100 integer
  const newStatus = progress === 100 ? 'Completed' : 'Active';
  const completedBool = progress === 100;

  const proj = await Project.findById(projectId).lean();
  if (!proj) return null;

  const needsUpdate =
    proj.progress !== progress ||
    proj.status !== newStatus ||
    !!proj.completed !== completedBool;

  if (needsUpdate) {
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { progress, status: newStatus, completed: completedBool },
      { new: true }
    ).catch(() => null);
    return updated;
  }

  return proj;
}

// Create task
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, status } = req.body;
    const userId = req.userId || req.body.userId;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Title and Project ID are required' });
    }

    const newTask = new Task({
      title,
      description: description || '',
      project: projectId,
      assignedTo,
      dueDate,
      status: status || 'Pending',
      createdBy: userId
    });

    await newTask.save();

    // recalc project progress
    await recalcAndUpdateProjectProgress(projectId);

    return res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Get tasks by project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId }).lean();
    return res.json({ success: true, tasks });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Update task (status or other fields)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // recalc project progress
    await recalcAndUpdateProjectProgress(updatedTask.project);

    return res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const projectId = task.project;
    await Task.findByIdAndDelete(taskId);

    // recalc project progress
    await recalcAndUpdateProjectProgress(projectId);

    return res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
