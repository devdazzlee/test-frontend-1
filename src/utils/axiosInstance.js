import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://test-cookies-server-production.up.railway.app",
  withCredentials: true,
});

// Automatically refresh token if request fails due to 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/refresh-token");
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Session expired. Please log in again.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
