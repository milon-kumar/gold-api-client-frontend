
import FrontendLayout from "@/layouts/frontend/FrontendLayout";
import AboutUs from "@/pages/frontend/about-us/AboutUs";
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
            path:'about-us',
            element: <AboutUs/>
        },
        {
            path: 'page/:slug',
            element: <Pages />,
        },
        {
            path: '/membership',
            element: <JoinUs/>
        }
    ]
};