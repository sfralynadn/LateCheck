import { Axios, InternalAxiosRequestConfig } from "axios";

export default function setupInterceptors(api: Axios) {
  return api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      throw new Error(error);
    },
  );
}
