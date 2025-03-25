import axios, { InternalAxiosRequestConfig } from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Use env variable with fallback
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add a request interceptor to include the token in headers for authenticated requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Types
export interface PetDetails {
  pet_name: string;
  breed: string;
  age: number;
  weight: number;
  pet_photo?: null;
  medical_condition?: string | null;
}

export interface UserRegisterData {
  username: string;
  password: string;
  email: string;
  pets?: PetDetails[];
}

export interface LoginCredentials {
  username?: string | null;
  email?: string | null;
  password: string;
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  msg: string;
  token?: string;
  user?: UserData;
  newUser?: any;
}

// Auth service functions
export const authService = {
  // Register a new user
  register: async (userData: UserRegisterData): Promise<AuthResponse> => {
    try {
      console.log("Registering user with data:", userData);
      const response = await api.post<AuthResponse>('/Auth/user-register', userData);
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error details:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log("Attempting login with:", credentials);
      
      // Make sure we have at least email OR username defined, but not both null
      if (!credentials.email && !credentials.username) {
        throw new Error("Either email or username must be provided");
      }
      
      const response = await api.post<AuthResponse>('/Auth/user-login', credentials);
      console.log("Login response:", response.data);
      
      // Store token in localStorage if login is successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user info
  getCurrentUser: (): UserData | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default api; 