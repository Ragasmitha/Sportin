import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sportin-backend.onrender.com/api'
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('sportinUser');
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return req;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = (id) => API.get(`/profile/${id}`);
export const updateProfile = (data) => API.put('/profile/update', data);
export const getOpportunities = () => API.get('/opportunities');
export const createOpportunity = (data) => API.post('/opportunities/create', data);
export const applyToOpportunity = (id) => API.post(`/opportunities/apply/${id}`);
export const getApplicants = (id) => API.get(`/opportunities/applicants/${id}`);
export const followUser = (id) => API.put(`/users/follow/${id}`);
export const unfollowUser = (id) => API.put(`/users/unfollow/${id}`);
export const getFeedPosts = () => API.get('/posts/feed');
export const getAllPosts = () => API.get('/posts/all');
export const createPost = (data) => API.post('/posts/create', data);
export const likePost = (id) => API.put(`/posts/like/${id}`);
export const deletePost = (id) => API.delete(`/posts/${id}`);