import apiClient from "@/lib/apiClient";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getCsrfToken = async () => {
    await apiClient.get(`${BASE_URL}/sanctum/csrf-cookie`);
};
