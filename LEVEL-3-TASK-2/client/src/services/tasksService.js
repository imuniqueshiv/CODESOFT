import axiosInstance from '../api/axiosInstance'; // Use the smart instance

// Create Task
export const createTask = async (taskData) => {
    try {
        const { data } = await axiosInstance.post('/tasks', taskData);
        return data;
    } catch (error) {
        throw error;
    }
};

// Get Tasks by Project ID
export const getTasks = async (projectId) => {
    try {
        // This was likely hardcoded to localhost before. Now it uses the dynamic URL.
        const { data } = await axiosInstance.get(`/tasks/project/${projectId}`);
        return data;
    } catch (error) {
        throw error;
    }
};

// Update Task Status
export const updateTaskStatus = async (taskId, status) => {
    try {
        const { data } = await axiosInstance.put(`/tasks/${taskId}`, { status });
        return data;
    } catch (error) {
        throw error;
    }
};

// Delete Task
export const deleteTask = async (taskId) => {
    try {
        const { data } = await axiosInstance.delete(`/tasks/${taskId}`);
        return data;
    } catch (error) {
        throw error;
    }
};