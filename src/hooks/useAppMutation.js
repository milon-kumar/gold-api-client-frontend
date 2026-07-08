import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { getCsrfToken } from "@/lib/csrf";
import { parseError } from "@/lib/errorParser";

export const useApiMutation = ({
    url,
    method = "POST",
    invalidate = [],
}) => {
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState({});

    const mutation = useMutation({
        mutationFn: async (payload) => {
            await getCsrfToken();

            const res = await apiClient({
                url,
                method,
                data: payload,
            });

            return res.data;
        },

        onError: (error) => {
            setErrors(parseError(error));
        },

        onSuccess: () => {

            setErrors({});

            invalidate.forEach((key) => {
                queryClient.invalidateQueries(key);
            });

        },
    });

    return {
        mutate: mutation.mutateAsync,
        isLoading: mutation.isPending,
        errors,
    };
};
