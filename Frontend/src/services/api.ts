import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export const taskApi = {
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>('/todos');
    return response.data;
  },

  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await api.post<Task>('/todos', data);
    return response.data;
  },

  completeTask: async (id: number): Promise<void> => {
    await api.patch(`/todos/${id}/complete`);
  },
};

export default api;

