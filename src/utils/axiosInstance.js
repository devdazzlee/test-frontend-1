import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://test-cookies-server.vercel.app", // Use environment variables
  withCredentials: true,
});

export default axiosInstance;
