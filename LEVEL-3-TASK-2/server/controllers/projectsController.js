import Project from '../models/Project.js';
import Task from '../models/Task.js';
import calcProgress from './_utils/progressUtil.js'; // must return integer 0-100

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
      title,
      description,
      startDate: startDate || Date.now(),
      endDate,
      owner
    });

    return res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Create Project Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Projects for user (computes progress and syncs DB if mismatch)
export const getProjectsForUser = async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    })
      .sort({ updatedAt: -1 })
      .lean();

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id }).lean().catch(() => []);
        const progress = calcProgress(tasks);

        const expectedStatus = progress === 100 ? 'Completed' : (project.status === 'On Hold' ? 'On Hold' : 'Active');
        const completedBool = progress === 100;

        // update DB only if mismatch
        if (project.progress !== progress || project.status !== expectedStatus || !!project.completed !== completedBool) {
          try {
            await Project.findByIdAndUpdate(
              project._id,
              { progress, status: expectedStatus, completed: completedBool },
              { new: true }
            );
          } catch (err) {
            console.error('Project sync update failed for', project._id, err && err.message);
          }
          return { ...project, progress, status: expectedStatus, completed: completedBool };
        }

        // reflect progress (in case progress was undefined)
        return { ...project, progress: project.progress ?? progress };
      })
    );

    return res.json({ success: true, projects: projectsWithProgress });
  } catch (error) {
    console.error('Get Projects Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name email');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    return res.json({ success: true, project });
  } catch (error) {
    console.error('Get Project Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete project (owner only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const project = await Project.findOne({ _id: id, owner: userId });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found or unauthorized' });
    }

    // delete tasks for project
    await Task.deleteMany({ project: id });

    // delete project
    await Project.findByIdAndDelete(id);

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
