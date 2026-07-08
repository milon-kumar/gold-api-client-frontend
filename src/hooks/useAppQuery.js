import {useQuery} from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export const useApiQuery = ({url, params = {}, enabled = true, queryKey,}) => {
    return useQuery({
        queryKey: queryKey || [url, params],
        queryFn: async () => {
            const res = await apiClient.get(url, {params});
            return res.data;
        },
        enabled,
    });
};
