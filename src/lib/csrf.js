import apiClient from "@/lib/apiClient";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getCsrfToken = async () => {
    console.log("What is the get csrf token request - ",{
        requestURL:`${BASE_URL}/sanctum/csrf-cookie`
    })
    await apiClient.get(`${BASE_URL}/sanctum/csrf-cookie`);
};
