import axios from 'axios';
import { Expense, Category, ApiResponse } from '../types';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const expenseApi = {
    getAll: () => api.get<ApiResponse<Expense[]>>('/expenses'),
    create: (data: Expense) => api.post<ApiResponse<Expense>>('/expenses', data),
    delete: (id: string) => api.delete<ApiResponse<void>>(`/expenses/${id}`),
};

export const categoryApi = {
    getAll: () => api.get<ApiResponse<Category[]>>('/categories'),
    create: (data: Category) => api.post<ApiResponse<Category>>('/categories', data),
    update: (id: string, data: Category) => api.put<ApiResponse<Category>>(`/categories/${id}`, data),
    delete: (id: string) => api.delete<ApiResponse<void>>(`/categories/${id}`),
};

export default api; 