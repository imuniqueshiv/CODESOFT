import taskModel from '../models/Task.js';
import projectModel from '../models/Project.js';

// --- CREATE TASK ---
export const createTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, dueDate, status } = req.body;
        
        // Use req.userId from middleware (or req.body.userId if you used my previous fix)
        const userId = req.userId || req.body.userId; 

        if (!title || !projectId) {
            return res.status(400).json({ success: false, message: 'Title and Project ID are required' });
        }

        const newTask = new taskModel({
            title,
            description: description || "", // Make description optional
            projectId,
            assignedTo,
            dueDate,
            status: status || 'To Do',
            createdBy: userId
        });

        await newTask.save();
        return res.status(201).json({ success: true, task: newTask });

    } catch (error) {
        console.error("Create Task Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
}

// --- GET TASKS BY PROJECT ---
export const getTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await taskModel.find({ projectId });
        return res.json({ success: true, tasks });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

// --- UPDATE TASK STATUS ---
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const updatedTask = await taskModel.findByIdAndUpdate(
            taskId, 
            { status }, 
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        return res.json({ success: true, task: updatedTask });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

// --- DELETE TASK ---
export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await taskModel.findByIdAndDelete(taskId);
        return res.json({ success: true, message: "Task Deleted" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}