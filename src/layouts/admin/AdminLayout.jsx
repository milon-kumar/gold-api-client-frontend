import React from 'react';
import AdminSidebar from "@/components/shear/AdminSidebar.jsx";
import AdminHeader from "@/components/shear/AdminHeader.jsx";
import {Outlet} from "react-router";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <AdminSidebar/>
            <div className="flex-1 flex flex-col lg:ml-55">
                <AdminHeader/>
                <main className="flex-1 sm:p-4 space-y-6">
                    <Outlet/>
                </main>
            </div>
        </div>
        );
};

export default AdminLayout;
