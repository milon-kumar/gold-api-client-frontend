import axios from "axios";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: false,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("token") || "null");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers["X-Domain"] = window.location.origin;
    config.headers["X-Host"] = window.location.host;

    return config;
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // window.location.href = '/auth/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);

export default apiClient;
