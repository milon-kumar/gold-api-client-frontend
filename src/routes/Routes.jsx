import { createBrowserRouter } from "react-router";

// import Home from "@/pages/Home";
// import About from "@/pages/About";
import Login from "@/pages/auth/Login.jsx";
// import Register from "@/pages/Register";
import Dashboard from "@/pages/admin/dashboard/Dashboard.jsx";
import BusinessList from "@/pages/admin/businesss/List.jsx"
import BusinessDetails from "@/pages/admin/businesss/details/index.jsx"
import BusinessSave from "@/pages/admin/businesss/save/Save.jsx"
import ModulesList from "@/pages/admin/modules/List.jsx"
import ModulesSave from "@/pages/admin/modules/Save"

// Business
// Our Information

import PresidentMessage from "@/pages/admin/businesss/modules/president-message/Save.jsx"
import Introduction from "@/pages/admin/businesss/modules/introduction/Save.jsx"
import WhatWeWant from "@/pages/admin/businesss/modules/what-we-want/Save.jsx"
import FoundingPresident from "@/pages/admin/businesss/modules/founding-president/Save.jsx"

import ModuleItems from "@/pages/admin/businesss/modules/module-items/List.jsx"
import ModuleItemsSave from "@/pages/admin/businesss/modules/module-items/Save.jsx"
// 
import StaffList from "@/pages/admin/businesss/modules/staffs/List.jsx"
import StaffSave from "@/pages/admin/businesss/modules/staffs/save/Save.jsx"

import CategoryList from "@/pages/admin/businesss/modules/category/List.jsx"
import CategorySave from "@/pages/admin/businesss/modules/category/Save/Save.jsx"

import OrganizationList from "@/pages/admin/businesss/modules/organization/List.jsx"
import OrganizationSave from "@/pages/admin/businesss/modules/organization/save/Save.jsx"

import SliderList from "@/pages/admin/businesss/modules/slider/List.jsx"
import SliderSave from "@/pages/admin/businesss/modules/slider/save/Save.jsx"

import VideosList from "@/pages/admin/businesss/modules/videos/List.jsx"
import VideosSave from "@/pages/admin/businesss/modules/videos/save/Save.jsx"

import PhotosList from "@/pages/admin/businesss/modules/photo/List.jsx"
import PhotosSave from "@/pages/admin/businesss/modules/photo/save/Save.jsx"

import AudioList from "@/pages/admin/businesss/modules/audio/List.jsx"
import AudioSave from "@/pages/admin/businesss/modules/audio/save/Save.jsx"


import ArchiveList from "@/pages/admin/businesss/modules/archive/List.jsx"
import ArchiveSave from "@/pages/admin/businesss/modules/archive/save/Save.jsx"

import NoticesList from "@/pages/admin/businesss/modules/notices/List.jsx"
import NoticesSave from "@/pages/admin/businesss/modules/notices/save/Save.jsx"

import AnnualPlanList from "@/pages/admin/businesss/modules/annual-plan/List.jsx"
import AnnualPlanSave from "@/pages/admin/businesss/modules/annual-plan/save/Save.jsx"

import RegularActivitieList from "@/pages/admin/businesss/modules/regular-activitie/List.jsx"
import RegularActivitieSave from "@/pages/admin/businesss/modules/regular-activitie/save/Save.jsx"

import SocialActivitiesList from "@/pages/admin/businesss/modules/social-activities/List.jsx"
import SocialActivitiesSave from "@/pages/admin/businesss/modules/social-activities/save/Save.jsx"

import NavigationList from "@/pages/admin/businesss/modules/navigation/List.jsx"
import NavigationSave from "@/pages/admin/businesss/modules/navigation/save/Save.jsx"
import NavigationBuilder from "@/pages/admin/businesss/modules/navigation/builder/Builder.jsx"
import CustomPageBuilder from "@/pages/admin/businesss/modules/navigation/builder/CustomPageBuilder.jsx"

import Settings from "@/pages/admin/businesss/modules/settings";

import Themes from "@/pages/admin/businesss/modules/aperience/Themes";
import ThemeBuilder from "@/pages/admin/businesss/modules/aperience/ThemeBuilder";

// import Error404 from "@/pages/Error404";


const Register = () => {
    return <h1>Register Page</h1>
}


import GuestRoute from "@/routes/GuestRoute";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layouts/admin/AdminLayout.jsx";
import { frontendRoutes } from "@/routes/FrontendRoutes";
import NotFound from "@/pages/errors/NotFound";

const router = createBrowserRouter([
    frontendRoutes,
    {
        element: <GuestRoute />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    },
    {
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "admin",
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "businesses",
                        element: <BusinessList />
                    },
                    {
                        path: "businesses/:id",
                        element: <BusinessDetails />
                    },
                    {
                        path: "businesses/:id/edit",
                        element: <BusinessSave />
                    },
                    {
                        path: "businesses/new",
                        element: <BusinessSave/>
                    },
                    {
                        path: "modules",
                        element: <ModulesList />
                    },
                    {
                        path: "modules/save/:id?",
                        element: <ModulesSave />
                    },



                    // Business Moudles
                    // Manage Dynamic Modules 
                    {
                        path: "module/:moduleSlug?",
                        element : <ModuleItems />
                    },{
                        path: "module/:moduleSlug?/:id?",
                        element : <ModuleItemsSave />
                    },
                    {
                        path: "president-message",
                        element: <PresidentMessage />
                    },
                    {
                        path: "introduction",
                        element: <Introduction />
                    },
                    {
                        path: "what-we-want",
                        element: <WhatWeWant />
                    },
                    {
                        path: "founding-president",
                        element: <FoundingPresident />
                    },

                    {
                        path: "staffs",
                        element: <StaffList />
                    },
                    {
                        path: "staffs/save/:id?",
                        element: <StaffSave />
                    },

                    // Content Management
                    {
                        path: "categories",
                        element: <CategoryList />
                    },
                    {
                        path: "categories/save/:id?",
                        element: <CategorySave />
                    },
                    {
                        path: "organizations",
                        element: <OrganizationList />
                    },
                    {
                        path: "organizations/save/:id?",
                        element: <OrganizationSave />
                    },

                    {
                        path: "sliders",
                        element: <SliderList />
                    },
                    {
                        path: "sliders/save/:id?",
                        element: <SliderSave />
                    },
                    {
                        path: "videos",
                        element: <VideosList />
                    },
                    {
                        path: "videos/save/:id?",
                        element: <VideosSave />
                    },
                    {
                        path: "audios",
                        element: <AudioList />
                    },
                    {
                        path: "audios/save/:id?",
                        element: <AudioSave />
                    },
                    {
                        path: "archives",
                        element: <ArchiveList />
                    },
                    {
                        path: "archives/save/:id?",
                        element: <ArchiveSave />
                    },
                    {
                        path: "notices",
                        element: <NoticesList />
                    },
                    {
                        path: "notices/save/:id?",
                        element: <NoticesSave />
                    },
                    {
                        path: "annual-plans",
                        element: <AnnualPlanList />
                    },
                    {
                        path: "annual-plans/save/:id?",
                        element: <AnnualPlanSave />
                    },
                    {
                        path: "regular-activities",
                        element: <RegularActivitieList />
                    },
                    {
                        path: "regular-activities/save/:id?",
                        element: <RegularActivitieSave />
                    },
                    {
                        path: "social-activities",
                        element: <SocialActivitiesList />
                    },
                    {
                        path: "social-activities/save/:id?",
                        element: <SocialActivitiesSave />
                    },
                    {
                        path: "photos",
                        element: <PhotosList />
                    },
                    {
                        path: "photos/save/:id?",
                        element: <PhotosSave />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    },
                    {
                        path: "navigations",
                        element:<NavigationList/>
                    },
                    {
                        path: "navigations/save/:id?",
                        element:<NavigationSave/>
                    },
                    {
                        path: "navigations/builder",
                        element:<NavigationBuilder/>
                    },
                    {
                        path: "navigations/custom-page/:id?",
                        element: <CustomPageBuilder/>
                    },
                    {
                        path: "settings/themes",
                        element: <Themes/>
                    },
                    {
                        path: "settings/themes/builder/:id?",
                        element: <ThemeBuilder/>
                    }
                ]
            }
        ]
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
