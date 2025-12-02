import axios from 'axios';

const API_URL = 'http://localhost:4000/api/projects';

export const createProject = async (projectData) => {
  const response = await axios.post(API_URL, projectData);
  return response.data;
};

export const getProjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProject = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};