import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    verify: () => api.get('/auth/verify'),
};

// Attendance API
export const attendanceAPI = {
    mark: (data) => api.post('/attendance', data),
    getStudentAttendance: (studentId, params) =>
        api.get(`/attendance/student/${studentId}`, { params }),
};

// Admin - Batch API
export const batchAPI = {
    getAll: () => api.get('/admin/batches'),
    getById: (id) => api.get(`/admin/batches/${id}`),
    create: (data) => api.post('/admin/batches', data),
    update: (id, data) => api.put(`/admin/batches/${id}`, data),
    delete: (id) => api.delete(`/admin/batches/${id}`),
    getAttendance: (id, params) =>
        api.get(`/admin/batches/${id}/attendance`, { params }),
};

// Admin - Student API
export const studentAPI = {
    getAll: (params) => api.get('/admin/students', { params }),
    getById: (id) => api.get(`/admin/students/${id}`),
    create: (data) => api.post('/admin/students', data),
    update: (id, data) => api.put(`/admin/students/${id}`, data),
    delete: (id) => api.delete(`/admin/students/${id}`),
};

// Admin - QR API
export const qrAPI = {
    generate: (data) => api.post('/admin/qr/generate', data),
    getActive: (params) => api.get('/admin/qr/active', { params }),
    deactivate: (id) => api.put(`/admin/qr/${id}/deactivate`),
};

// Admin - Export API
export const exportAPI = {
    attendance: (params) =>
        api.get('/admin/export/attendance', {
            params,
            responseType: 'blob',
        }),
};

export default api;
