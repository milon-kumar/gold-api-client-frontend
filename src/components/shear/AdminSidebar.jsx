import React from 'react';
import {
    Settings,
    Users,
    Home,
    BarChart3,
    Layers2,
    Folder,
    Mail,
    Calendar,
    Package,
    ShoppingCart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth.js";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { getModuleIcon } from "@/lib/accessControll.jsx";
import { useDispatch } from 'react-redux';
import { setModule } from '@/store/features/moudleSlice';

const menus = {
    super_admin: [
        {
            icon: Home,
            label: "Overview",
            to: '/admin/dashboard'
        },
        {
            icon: Users,
            label: "Businesses",
            to: '/admin/businesses'
        },
        {
            icon: Layers2,
            label: "Modules",
            to: '/admin/modules'
        }
    ],
    business: [
        {
            icon: Home,
            label: "Dashboard",
            to: '/admin/dashboard'
        },
    ]
}
const AdminSidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispath = useDispatch()
    const { user } = useAuth()

    const { data: getBusinessModulesResponse } = useApiQuery({
        url: `/admin/business-module-group/${user?.business_id}`,
        enabled: !!user?.business_id,
    });

    const businessModules = getBusinessModulesResponse?.data?.data || []

    const handleModuleSet = (item) => {
        if (user?.type == 'super_admin') {
            navigate(item?.to)
        }

        if (user?.type == 'business') {
            navigate(`/admin/${item.slug}`)
        }

        dispath(setModule(item))
    }

    return (
        <aside className="fixed left-0 top-0 z-20 hidden h-full w-55 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 lg:flex">
            <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
                <div className="flex items-center gap-2 font-semibold">
                    <BarChart3 className="h-5 w-5" />
                    <span>Acme Dashboard</span>
                </div>
            </div>
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto hide-scrollbar">
                {
                    user?.type === 'super_admin' && (
                        <>
                            {menus[user?.type]?.map((item) => (
                                <Button
                                    key={item.label}
                                    variant={location?.pathname === item?.to ? "secondary" : "ghost"}
                                    className="w-full justify-start gap-2"
                                    onClick={() => handleModuleSet(item)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    {item.badge && (
                                        <Badge className="ml-auto">{item.badge}</Badge>
                                    )}
                                </Button>
                            ))}
                        </>
                    )
                }

                {
                    user?.type === "business" && (
                        <>
                            {Object.entries(businessModules || {}).map(
                                ([groupSlug, modules]) => (
                                    <div key={groupSlug} className="mb-5">
                                        <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                                            {modules[0]?.group_name}
                                        </h3>
                                        <div className="space-y-1">
                                            {modules.map((module) => (
                                                <Button
                                                    key={module.id}
                                                    variant={
                                                        location.pathname ===
                                                            `/admin/${module.slug}/*`
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className="w-full justify-start gap-2"
                                                    onClick={() =>
                                                        handleModuleSet(module)
                                                    }
                                                >
                                                    <div className="p-1 rounded">
                                                        {getModuleIcon(module.icon, 4)}
                                                    </div>
                                                    {module.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </>
                    )
                }
            </nav>
        </aside>
    );
};

export default AdminSidebar;
