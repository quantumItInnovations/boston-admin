import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://52.91.135.217:5000",
  baseURL: "http://localhost:5000",
  //  baseURL: "https://boston-api.adaptable.app",
  //  baseURL: "https://api.bostongexotics.com",
});

export default axiosInstance;
