import api from './api';

export interface AdminLoginResponse {
  token: string;
  admin: {
    admin_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalVets: number;
  totalAppointments: number;
}

const adminService = {
  login: async (username: string, password: string): Promise<AdminLoginResponse> => {
    const response = await api.post('/admin/login', { username, password });
    const { token, admin } = response.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(admin));
    return response.data;
  },

  getStats: async (): Promise<AdminStats> => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    const response = await api.get('/admin/users');
    return response.data;
  },

  getVets: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    const response = await api.get('/admin/vets');
    return response.data;
  },

  getTrainers: async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('No admin token found');
    }
    const response = await api.get('/admin/trainers');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('adminToken');
  }
};

export default adminService; 