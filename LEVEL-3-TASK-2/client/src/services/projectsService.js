import axiosInstance from '../api/axiosInstance'; // Use the smart instance

// Get all projects
export const getProjects = async () => {
    try {
        const { data } = await axiosInstance.get('/projects');
        return data;
    } catch (error) {
        throw error;
    }
};

// Get a single project
export const getProject = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/projects/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

// Create a new project
export const createProject = async (projectData) => {
    try {
        const { data } = await axiosInstance.post('/projects', projectData);
        return data;
    } catch (error) {
        throw error;
    }
};

// Delete a project
export const deleteProject = async (id) => {
    try {
        const { data } = await axiosInstance.delete(`/projects/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

// Update a project
export const updateProject = async (id, updateData) => {
    try {
        const { data } = await axiosInstance.put(`/projects/${id}`, updateData);
        return data;
    } catch (error) {
        throw error;
    }
};