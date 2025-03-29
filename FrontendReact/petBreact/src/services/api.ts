import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // Use env variable with fallback
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

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

export const authService = {
  register: async (userData: UserRegisterData): Promise<AuthResponse> => {
    try {
      console.log("Registering user with data:", userData);
      const response = await api.post<AuthResponse>(
        "/Auth/user-register",
        userData,
      );
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error details:", error);
      throw error;
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log("Attempting login with:", credentials);

      if (!credentials.email && !credentials.username) {
        throw new Error("Either email or username must be provided");
      }

      const response = await api.post<AuthResponse>(
        "/Auth/user-login",
        credentials,
      );
      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Login error details:", error);
      throw error;
    }
  },

  // Google OAuth login
  loginWithGoogle: () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Save the current location before redirecting
    localStorage.setItem("login_redirect", window.location.pathname);

    // Redirect to Google OAuth endpoint
    window.location.href = `${apiUrl}/auth/google`;
  },

  // Handle OAuth callback and token storage
  handleOAuthCallback: () => {
    // Check for token in URL query params (from OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("OAuth callback called, token:", token ? "Found" : "Not found");
    console.log("URL query parameters:", window.location.search);

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);

      // Get the pet ID if available
      const petId = params.get("pet_id");
      if (petId) {
        localStorage.setItem("currentPetId", petId);
      }

      // Determine where to redirect based on user state
      let redirectPath = "/dashboard";

      if (params.get("new_user") === "true") {
        // New user needs to create a profile first
        redirectPath = "/dashboard/create-pet";
      } else if (petId) {
        // Existing user with pets
        redirectPath = `/dashboard?pet=${petId}`;
      } else {
        // Existing user without pets
        redirectPath = "/dashboard/create-pet";
      }

      console.log("Redirecting to:", redirectPath);

      // Redirect to the appropriate page (but don't do it immediately,
      // let the component handle this)
      return {
        success: true,
        redirectPath,
      };
    }

    console.error("No token found in URL params");
    return { success: false };
  },

  // Logout user
  logout: () => {
    // Remove all items stored in localStorage by our site
    localStorage.removeItem("token");
    localStorage.removeItem("cachedPets");
    localStorage.clear();
    localStorage.removeItem("user");
  },

  // Get current user info
  getCurrentUser: (): UserData | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("token");
  },
};

export default api;
