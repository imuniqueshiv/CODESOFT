// import API from '../api/axios';
// export const getTasks = (projectId) => API.get('/projects/' + projectId + '/tasks');
// export const createTask = (projectId, payload) => API.post('/projects/' + projectId + '/tasks', payload);
// export const updateTask = (taskId, patch) => API.patch('/tasks/' + taskId, patch);
// export const deleteTask = (taskId) => API.delete('/tasks/' + taskId);
// // 

import axios from 'axios';

const API_URL = 'http://localhost:4000/api/tasks';

export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData);
  return response.data;
};

export const getTasksByProject = async (projectId) => {
  const response = await axios.get(`${API_URL}/project/${projectId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
    const response = await axios.put(`${API_URL}/${taskId}`, { status });
    return response.data;
};