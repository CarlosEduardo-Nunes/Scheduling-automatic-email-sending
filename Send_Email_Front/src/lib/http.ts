import axios from "axios";
import { readToken } from "./storage";

/** Instância base do Axios (lê VITE_API_URL do .env) */
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/** Interceptor de request: injeta Authorization se houver token */
http.interceptors.request.use((config) => {
  const token = readToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Interceptor de response: aqui dá para unificar tratamento de erros */
http.interceptors.response.use(
  (resp) => resp,
  (error) => {
    // Ex.: if (error.response?.status === 401) { ...logout }
    return Promise.reject(error);
  }
);
