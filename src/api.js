import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
    }
  },

  getProfile: async () => {
    try {
      const response = await API.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  promoteToAdmin: async (userId) => {
    try {
      const response = await API.put(`/auth/promote/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to promote user');
    }
  }
};

export const feedbackAPI = {
  getAll: async () => {
    try {
      console.log("API: Getting all feedbacks");
      const response = await API.get('/feedback');
      console.log("API: Feedbacks response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error fetching feedbacks:", error);
      console.error("API: Error response:", error.response);
      throw new Error(error.response?.data?.message || 'Failed to fetch feedbacks');
    }
  },

  create: async (feedbackData) => {
    try {
      console.log("API: Creating feedback:", feedbackData);
      const response = await API.post('/feedback', {
        title: feedbackData.title,
        description: feedbackData.description,
        status: feedbackData.status || 'open'
      });
      console.log("API: Create feedback response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error creating feedback:", error);
      console.error("API: Error response:", error.response);
      throw new Error(error.response?.data?.message || 'Failed to create feedback');
    }
  },

  upvote: async (id) => {
    try {
      console.log("API: Upvoting feedback:", id);
      const response = await API.put(`/feedback/${id}/upvote`);
      console.log("API: Upvote response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error upvoting:", error);
      console.error("API: Error response:", error.response);
      throw new Error(error.response?.data?.message || 'Failed to upvote');
    }
  },

  delete: async (id) => {
    try {
      console.log("API: Deleting feedback:", id);
      const response = await API.delete(`/feedback/${id}`);
      console.log("API: Delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error deleting:", error);
      console.error("API: Error response:", error.response);
      throw new Error(error.response?.data?.message || 'Failed to delete feedback');
    }
  },

  updateStatus: async (id, status) => {
    try {
      console.log("API: Updating status for feedback:", id, "to:", status);
      const response = await API.put(`/feedback/${id}/status`, { status });
      console.log("API: Update status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API: Error updating status:", error);
      console.error("API: Error response:", error.response);
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  }
};

export const testConnection = async () => {
  try {
    console.log("Testing backend connection...");
    const response = await fetch('http://localhost:5000/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Backend health check response:", data);
      return data.database === "connected";
    }

    console.log("Backend connection test response:", response.status);
    return response.ok;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return false;
  }
};
