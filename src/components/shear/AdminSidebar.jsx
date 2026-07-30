import {
  BarChart3,
  Home,
  Layers2,
  Loader2,
  Users
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconRenderer } from "@/components/ui/icon-renderer";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { useAuth } from "@/hooks/useAuth.js";
import { setModule } from "@/store/features/moudleSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";

const businessDefaultSidebar = [
  {
    id: "overview",
    items: [{ id: "dashboard", label: "Dashboard", icon_key: "dashboard" }],
  },
  {
    id: "content-management",
    title: "Content Management",
    locked: true,
    items: [
      { id: "categories", label: "Categories", iconKey: "tag", system: true },
    ],
  },
  {
    id: "management",
    items: [
      { id: "settings", label: "Settings", icon_key: "settings" },
      { id: "pages", label: "Pages", icon_key: "pages" },
    ],
  },
];

const GROUP_LABELS = {
  overview: "Overview",
  management: "Management",
  "content-management": "Content Management",
};

const menus = {
  super_admin: [
    { icon: Home, label: "Overview", to: "/admin/dashboard" },
    { icon: Users, label: "Businesses", to: "/admin/businesses" },
    { icon: Layers2, label: "Modules", to: "/admin/modules" },
  ],
  business: [{ icon: Home, label: "Dashboard", to: "/admin/dashboard" }],
};

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispath = useDispatch();
  const { user } = useAuth();

  const { data: getBusinessModulesResponse } = useApiQuery({
    url: `/admin/business-module-group/${user?.business_id}`,
    enabled: !!user?.business_id,
  });

  const {
    data: settingsResponse,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useApiQuery({
    url: `/admin/business-settings`,
  });

  const rawSidebar = settingsResponse?.data?.settings?.meta?.business_sidebar;
  const settings = Array.isArray(rawSidebar)
    ? rawSidebar
    : Array.isArray(rawSidebar?.groups) && rawSidebar.groups.length > 0
      ? rawSidebar.groups
      : businessDefaultSidebar;

  const handleModuleSet = (item) => {
    if (user?.type === "super_admin") {
      navigate(item?.to);
    }

    if (user?.type === "business") {
      navigate(`/admin/${item.slug}`);
    }

    dispath(setModule(item));
  };

  const handleSidebarItemClick = (item) => {
    const defaultRoutes = ['dashboard','categories', 'settings','navigations',]
    let to;
    if (defaultRoutes?.includes(item?.id)) {
      to = item.module_slug || item.id;
    } else {
      to = `/module/${item.module_slug || item.id}`
    }
    handleModuleSet({
      ...item,
      slug: to,
    });
  };

  const isSidebarItemActive = (item) => {
    const slug = item.module_slug || item.id;
    return location.pathname === `/admin/${slug}` || location.pathname.startsWith(`/admin/${slug}/`);
  };

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-full w-55 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 lg:flex">
      <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
        <div className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5" />
          <span>Acme Dashboard</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto hide-scrollbar">
        {user?.type === "super_admin" && (
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
                {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
              </Button>
            ))}
          </>
        )}

        {user?.type === "business" && (
          <>
            {settingsLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              settings.map((group) => (
                <div key={group.id} className="mb-5">
                  <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    {GROUP_LABELS[group.id] || group.id}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      return (
                        <Button
                          key={item.id}
                          variant={isSidebarItemActive(item) ? "secondary" : "ghost"}
                          className="w-full justify-start gap-2"
                          onClick={() => handleSidebarItemClick(item)}
                        >
                          <div className="p-1 rounded">
                            <IconRenderer icon={item?.icon_key} className="h-4 w-4 text-blue-600" />
                          </div>
                          {item.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;