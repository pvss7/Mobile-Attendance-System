import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:7474/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (id, password) => {
  return api.post('/login', { id, password });
};

export const getClasses = () => {
  return api.get('/classes');
};

export const getStudentClasses = () => {
  return api.get('/student/classes');
};

export const markAttendance = (classId) => {
  return api.post(`/classes/${classId}/attendance`);
};

// Add more functions for different API endpoints
