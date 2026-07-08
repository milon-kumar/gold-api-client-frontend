import {useLocalStorage} from "@/hooks/useLocalStorage.js";
import {useApiQuery} from "@/hooks/useAppQuery.js";
import {useApiMutation} from "@/hooks/useAppMutation.js";

export const useAuth = () => {
    const [token, setToken, removeToken] = useLocalStorage("token");
    const [user, setUser, removeUser] = useLocalStorage("user");

    const { data: currentUser } = useApiQuery({
        url: "/admin/user",
        enabled: !!token,
    });

    const loginMutation = useApiMutation({
        url: "/login",
    });

    const login = async (credentials) => {
        const response = await loginMutation.mutate(credentials);
        if(response.success){
            if(response?.data?.token && response?.data?.user){
                setToken(response?.data?.token);
                setUser(response?.data?.user);
            }
        }

        return response;
    };

    const logoutMutation = useApiMutation({
        url: "/admin/logout",
    });

    const logout = async () => {
        try {
            const response = await logoutMutation.mutate({})
            if(response.success){
                removeToken();
                removeUser();

                return response
            }
        } catch (e) { }
    };

    const isAuthenticated = !!token;
    const role = user?.role ?? null;

    return {
        user,
        token,
        role,
        isAuthenticated,

        login,
        logout,

        isLoading: loginMutation.isLoading,
        errors: loginMutation.errors,
    };
};
