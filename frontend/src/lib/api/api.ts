import axios, { Axios, InternalAxiosRequestConfig } from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
(function (api: Axios) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (err) => {
      throw new Error(err.message);
    },
  );
})(api);

export default api;
