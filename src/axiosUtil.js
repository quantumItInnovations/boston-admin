import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://boston-api.adaptable.app",
});

export default axiosInstance;
