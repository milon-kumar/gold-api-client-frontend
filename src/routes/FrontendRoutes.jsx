
import FrontendLayout from "@/layouts/frontend/FrontendLayout";
import Home from "@/pages/frontend/home/Home";
import JoinUs from "@/pages/frontend/join-us/JoinUs";
import Pages from "@/pages/frontend/pages/Pages";

export const frontendRoutes = {
    path: '/',
    element: <FrontendLayout />,
    children: [
        {
            index: true,
            element: <Home />
        },
        {
            path: '/page/:slug',
            element: <Pages />,
        },
        {
            path: '/membership',
            element: <JoinUs/>
        }
    ]
};