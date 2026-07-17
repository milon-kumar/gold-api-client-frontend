
import FrontendLayout from "@/layouts/frontend/FrontendLayout";
import AboutUs from "@/pages/frontend/about-us/AboutUs";
import Home from "@/pages/frontend/home/Home";
import Organizations from "@/pages/frontend/organizations/Organizations";
import PhotoGallery from "@/pages/frontend/photo-gallery/PhotoGallery";
import VideoGallery from "@/pages/frontend/video-gallery/VideoGallery";
import AllStaffs from "@/pages/frontend/all-staffs/AllStaffs";
import ContactUs from "@/pages/frontend/contact-us/ContactUs";
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
            path:'organizations',
            element:<Organizations/>,
        },
        {
            path:'photo-gallery',
            element:<PhotoGallery/>,
        },
        {
            path:'video-gallery',
            element:<VideoGallery/>,
        },
        {
            path:'all-staffs',
            element:<AllStaffs />,
        },
        {
            path: 'contact-us',
            element: <ContactUs/>
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