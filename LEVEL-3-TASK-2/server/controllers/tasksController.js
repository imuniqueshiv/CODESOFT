import taskModel from '../models/Task.js';

// --- CREATE TASK ---
export const createTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, dueDate, status } = req.body;
        
        // Handle userId from different middleware versions
        const userId = req.userId || req.body.userId; 

        if (!title || !projectId) {
            return res.status(400).json({ success: false, message: 'Title and Project ID are required' });
        }

        const newTask = new taskModel({
            title,
            description: description || "",
            // CRITICAL FIX 1: Map the body 'projectId' to the DB 'project' field
            project: projectId, 
            assignedTo,
            dueDate,
            // CRITICAL FIX 2: Use 'Pending' as default since 'Todo' failed validation
            status: status || 'Pending', 
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
// CRITICAL FIX 3: Renamed to match your routes file exactly
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // Search by 'project' field
        const tasks = await taskModel.find({ project: projectId });
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