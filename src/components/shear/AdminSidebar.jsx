import { useMemo, useState } from "react";
import {
  BarChart3,
  Home,
  Layers2,
  Search,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconRenderer } from "@/components/ui/icon-renderer";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { useAuth } from "@/hooks/useAuth.js";
import { setModule } from "@/store/features/moudleSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { setActiveTab } from "@/store/features/businessSettingSlice.js";
import DynamicIconRender from "./DynamicIconRender";
import { cn } from "@/lib/utils";

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
  'default-content': "Default Content",
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

const SidebarMenuSkeleton = ({ groupCount = 3, itemsPerGroup = 3 }) => (
  <div className="space-y-6" aria-hidden="true">
    {Array.from({ length: groupCount }).map((_, groupIndex) => (
      <div key={groupIndex} className="space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-1.5">
          {Array.from({ length: itemsPerGroup }).map((_, itemIndex) => (
            <div key={itemIndex} className="flex items-center gap-2 rounded-md px-3 py-2">
              <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div
                className="h-3 animate-pulse rounded bg-gray-200 dark:bg-gray-800"
                style={{ width: `${55 + ((itemIndex * 17) % 35)}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispath = useDispatch();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const {
    data: settingsResponse,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useApiQuery({
    url: `/admin/business-settings`,
  });


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
    const settingTabs = ["businessSetting", "manageModule", "sidebarBuilder", "accountSetting"];
    let to;
    if (item?.url) {
      if (settingTabs.includes(item.id)) {
        dispath(
          setActiveTab(item.id)
        )
      }
      to = item.url;
    } else {
      if (item.module_slug === "about-us") {
        to = `/${item.module_slug || item.id}`
      } else {
        to = `/module/${item.module_slug || item.id}`
      }
    }
    handleModuleSet({
      ...item,
      slug: to,
    });
  };
const getItemPath = (item) => {
  if (item?.url) return item.url;
  if (item.module_slug === "about-us") return "/about-us";
  return `/module/${item.module_slug || item.id}`;
};
const isSidebarItemActive = (item) => {
  const targetPath = getItemPath(item);
  const [targetPathname, targetSearch] = targetPath.split("?");
  const fullTargetPathname = `/admin${targetPathname}`;

  const pathMatches =
    location.pathname === fullTargetPathname ||
    location.pathname.startsWith(`${fullTargetPathname}/`);

  if (!pathMatches) return false;

  if (!targetSearch) return true;
  const targetParams = new URLSearchParams(targetSearch);
  const currentParams = new URLSearchParams(location.search);

  return Array.from(targetParams.entries()).every(
    ([key, value]) => currentParams.get(key) === value
  );
};


  const {
    data: modulesResponse,
    isLoading: modulesLoading,
    refetch: refetchModules,
  } = useApiQuery({
    url: "/admin/business-modules",
  });

  const modules = modulesResponse?.data?.data || [];

  const defaultModules = modules.filter((module) => module.module_type === "system" && module.status === "active");
  const customModules = modules.filter((module) => module.module_type !== "system");

    const businessMenus = {
    overview: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon_key: "LayoutDashboard",
        url:"/dashboard",
      }
    ],

    'default-content': defaultModules.map((module) => ({
      id: module.id,
      label: module.title,
      icon_key: module.meta?.sidebar_menu_icon || "folder",
      url : `/${module.title_slug}?slug=${module.title_slug}`,
    })),
    'content-management': customModules.map((module) => ({
      id: module.id,
      label: module.title,
      icon_key: module.meta?.sidebar_menu_icon || "folder",
      module_slug: module.title_slug,
    })),
    management: [
      { id: "businessSetting", label: "Business Overview", icon_key: "Building2", system: true,url: "/settings?tab=businessSetting" },
      { id: "navigations", label: "Pages", icon_key: "FileStack", system: true ,url: "/navigations"},
      { id: "builder", label: "Menu Builder", icon_key: "TableOfContents", system: true ,url: "/navigations/builder"},
      { id: "categories", label: "Categories", icon_key: "Tags", system: true ,url: "/categories"},
      { id: "manageModule", label: "Modules Manager", icon_key: "Package", system: true ,url: "/settings?tab=manageModule"},
      { id: "accountSetting", label: "Accounts", icon_key: "UserRoundCog", system: true ,url: "/settings?tab=accountSetting"},
    ],
  }

  const isBusinessMenuLoading = settingsLoading || modulesLoading;

  const query = search.trim().toLowerCase();
  const filteredBusinessMenus = useMemo(() => {
    if (!query) return businessMenus;
    return Object.fromEntries(
      Object.entries(businessMenus).map(([groupId, items]) => [
        groupId,
        items.filter((item) => item.label.toLowerCase().includes(query)),
      ])
    );
  }, [query, modules]);

  const filteredSuperAdminMenu = useMemo(() => {
    const list = menus[user?.type] || [];
    if (!query) return list;
    return list.filter((item) => item.label.toLowerCase().includes(query));
  }, [query, user?.type]);

  return (
    <aside className="fixed left-0 top-0 z-20 hidden h-full w-55 flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 lg:flex">
      <div className="flex h-14 items-center border-b px-4 dark:border-gray-800">
        <div className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5" />
          <span>{settingsResponse?.data?.business?.name || "Dashboard"}</span>
        </div>
      </div>

      {/* Compact search box, sits above the menu list */}
      <div className="border-b px-3 py-2 dark:border-gray-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search menu…"
            className={cn("h-8 pl-8 text-xs", search && "pr-7")}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto hide-scrollbar">
        {user?.type === "super_admin" && (
          <>
            {filteredSuperAdminMenu.map((item) => (
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
            {isBusinessMenuLoading ? (
              <SidebarMenuSkeleton />
            ) : (
              filteredBusinessMenus && Object.keys(filteredBusinessMenus).map((groupId) => {
                const group = filteredBusinessMenus[groupId];
                if (group.length === 0) return null;
                return (
                  <div key={groupId} className="mb-5">
                    <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground">
                      {GROUP_LABELS[groupId] || groupId}
                    </h3>
                    <div className="space-y-1">
                      {group.map((item) => {
                        return (
                          <Button
                            key={item.id}
                            variant={isSidebarItemActive(item) ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => handleSidebarItemClick(item)}
                          >
                            <div className="p-1 rounded">
                              <DynamicIconRender name={item?.icon_key} className="h-4 w-4 text-blue-600" />
                            </div>
                            {item.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
            {!isBusinessMenuLoading &&
              query &&
              Object.values(filteredBusinessMenus).every((group) => group.length === 0) && (
                <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No menu items match &quot;{search}&quot;
                </p>
              )}
          </>
        )}
      </nav>
    </aside>
  );
};

export default AdminSidebar;