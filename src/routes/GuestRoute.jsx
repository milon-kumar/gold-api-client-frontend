import { Navigate, Outlet } from "react-router";
import {useAuth} from "@/hooks/useAuth.js";

const GuestRoute = () => {
    const {isAuthenticated} = useAuth();

    return isAuthenticated
        ? <Navigate to="/admin/dashboard" replace />
        : <Outlet />;
};

export default GuestRoute;
