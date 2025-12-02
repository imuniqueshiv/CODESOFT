import api from '../api/axios'; // <-- CRITICAL: This holds the dynamic Render URL

// NOTE: We no longer need the API_URL constant, as the base URL is handled by 'api'.

export const createProject = async (projectData) => {
  // api.post uses the base URL (Render) + the route ('/projects')
  const response = await api.post('/projects', projectData); 
  return response.data;
};

export const getProjects = async () => {
  // api.get uses the base URL (Render) + the route ('/projects')
  const response = await api.get('/projects'); 
  return response.data;
};

export const getProject = async (id) => {
  // api.get uses the base URL (Render) + the route (`/projects/${id}`)
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const deleteProject = async (id) => {
  // api.delete uses the base URL (Render) + the route (`/projects/${id}`)
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};

// FIX: Added comment to force Render rebuild cache for secure cookie settings.