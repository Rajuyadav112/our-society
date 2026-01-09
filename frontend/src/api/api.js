import axios from "axios";

const api = axios.create({
  baseURL: "https://society-app-debug-live.loca.lt/api", // Secure Tunnel URL
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Bypass-Tunnel-Reminder'] = 'true'; // Skip localtunnel warning
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
