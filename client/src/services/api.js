import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  adminLogin: (data) => apiClient.post('/auth/admin-login', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const familyMemberService = {
  getAll: (params) => apiClient.get('/family-members', { params }),
  getById: (id) => apiClient.get(`/family-members/${id}`),
  create: (data) => apiClient.post('/family-members', data),
  update: (id, data) => apiClient.put(`/family-members/${id}`, data),
  delete: (id) => apiClient.delete(`/family-members/${id}`),
};

export const albumService = {
  getAll: (params) => apiClient.get('/albums', { params }),
  getById: (id) => apiClient.get(`/albums/${id}`),
  create: (data) => apiClient.post('/albums', data),
  update: (id, data) => {
    if (data instanceof FormData) {
      return apiClient.put(`/albums/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return apiClient.put(`/albums/${id}`, data);
  },
  delete: (id) => apiClient.delete(`/albums/${id}`),
  share: (id, shareData) => apiClient.post(`/albums/${id}/share`, shareData),
  uploadPhoto: (albumId, formData) => apiClient.post(`/albums/${albumId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePhoto: (albumId, photoId) => apiClient.delete(`/albums/${albumId}/photos/${photoId}`),
};

export const videoService = {
  getAll: (params) => apiClient.get('/videos', { params }),
  getById: (id) => apiClient.get(`/videos/${id}`),
  upload: (formData) => apiClient.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => apiClient.put(`/videos/${id}`, data),
  delete: (id) => apiClient.delete(`/videos/${id}`),
};

export const adminService = {
  getStats: () => apiClient.get('/admin/stats'),
  getAllUsers: () => apiClient.get('/admin/users'),
  getAllAlbums: (params) => apiClient.get('/admin/albums', { params }),
  getAllVideos: (params) => apiClient.get('/admin/videos', { params }),
  deleteUser: (userId) => apiClient.delete(`/admin/delete-user/${userId}`),
  deleteAlbum: (albumId) => apiClient.delete(`/admin/albums/${albumId}`),
  deleteVideo: (videoId) => apiClient.delete(`/admin/videos/${videoId}`),
};

export default apiClient;

export const connectionService = {
  searchUsers: (q) => apiClient.get('/connections/search', { params: { q } }),
  sendRequest: (userId) => apiClient.post(`/connections/request/${userId}`),
  acceptRequest: (userId) => apiClient.post(`/connections/accept/${userId}`),
  rejectRequest: (userId) => apiClient.post(`/connections/reject/${userId}`),
  listConnections: () => apiClient.get('/connections'),
  incomingRequests: () => apiClient.get('/connections/requests/incoming'),
};

export const userService = {
  getUserContent: (userId) => apiClient.get(`/users/${userId}/content`),
  getProfile: (userId) => apiClient.get(`/users/${userId}/profile`),
  updateProfile: (formData) => apiClient.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
