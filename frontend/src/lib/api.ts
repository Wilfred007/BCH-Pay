import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bch-pay-1.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const merchantApi = {
    register: (data: any) => api.post('/merchant/register', data),
    login: (data: any) => api.post('/merchant/login', data),
    getProfile: (id: string) => api.get(`/merchant/${id}`),
    getInvoices: (id: string) => api.get(`/merchant/${id}/invoices`),
    getSettlements: (id: string) => api.get(`/merchant/${id}/settlements`),
};

export const invoiceApi = {
    create: (data: any) => api.post('/invoice/create', data),
    get: (id: string) => api.get(`/invoice/${id}`),
    getStatus: (id: string) => api.get(`/invoice/${id}/status`),
    confirm: (id: string, txHash: string) => api.post(`/invoice/${id}/confirm`, { txHash }),
};

export default api;
