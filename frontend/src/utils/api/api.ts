import axios from "axios";
import setupInterceptors from "./interceptors";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

setupInterceptors(api);

export default api;
