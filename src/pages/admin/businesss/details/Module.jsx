import { Switch } from "@/components/ui/switch";
import * as LucideIcons from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { Search, Loader2, Shield } from "lucide-react";

import Loading from "@/components/shear/Loading.jsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApiMutation } from "@/hooks/useAppMutation";

const Modules = ({ business, user, businessModules }) => {
  const [search, setSearch] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [pendingIds, setPendingIds] = useState([]);

  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/modules",
  });

  // /admin/modules returns a Laravel paginator wrapped by ApiResponse + axios:
  // modulesResponse.data       -> { data: <paginator> }
  // modulesResponse.data.data  -> <paginator> (current_page, data: [...], total, ...)
  // modulesResponse.data.data.data -> the actual array of modules
  const modules = modulesResponse?.data?.data?.data || [];

  const filteredModules = search.trim()
    ? modules.filter(
        (m) =>
          m.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.slug?.toLowerCase().includes(search.toLowerCase()) ||
          m.group_name?.toLowerCase().includes(search.toLowerCase()),
      )
    : modules;

  const moduleGroups = filteredModules.reduce((acc, module) => {
    const group = module.group_slug;

    if (!acc[group]) {
      acc[group] = {
        group_name: module.group_name,
        group_slug: module.group_slug,
        group_sort_order: module.group_sort_order,
        modules: [],
      };
    }

    acc[group].modules.push(module);
    return acc;
  }, {});

  const businessModuleIds = businessModules?.map((module) => module.id) || [];

  useEffect(() => {
    setSelectedModules(businessModuleIds);
  }, [businessModules]);

  const { mutate: assignModules } = useApiMutation({
    url: "/admin/modules/create",
  });

  // Toggling a switch saves immediately — no separate "Update" step.
  const onToggle = async (moduleId) => {
    const wasSelected = selectedModules.includes(moduleId);
    const nextSelected = wasSelected
      ? selectedModules.filter((id) => id !== moduleId)
      : [...selectedModules, moduleId];

    setSelectedModules(nextSelected);
    setPendingIds((prev) => [...prev, moduleId]);

    try {
      const response = await assignModules({
        tenant_id: business?.id,
        user_id: user?.id,
        module_id: moduleId
      });

      if (response?.success) {
        toast.success(
          wasSelected ? "Module deactivated" : "Module activated",
        );
      } else {
        // Revert on failure
        setSelectedModules(selectedModules);
        toast.error(response?.message || "Failed to update module.");
      }
    } catch (error) {
      setSelectedModules(selectedModules);
      toast.error("Failed to update module.");
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== moduleId));
    }
  };

  if (modulesLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div>
              <h1 className="flex items-center text-2xl font-bold text-slate-900">
                <Shield className="mr-3 h-7 w-7 text-indigo-600" />
                Module Access Management
              </h1>
              <p className="mt-1 text-slate-500">
                Turn modules on or off for this business — changes save instantly.
              </p>
            </div>

            {/* Right */}
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search modules..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-[5px] border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full py-8">
        <div className="space-y-6">
          {Object.keys(moduleGroups).length === 0 && (
            <div className="text-center text-sm text-slate-400 py-16">
              No modules match "{search}".
            </div>
          )}
          {Object.keys(moduleGroups).map((groupSlug) => {
            const group = moduleGroups[groupSlug];
            return (
              <div
                key={groupSlug}
                className="bg-white rounded-[5px] shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800">
                    {group.group_name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {group.modules.length} Modules • Manage your module settings
                  </p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {group.modules.map((module) => {
                      return (
                        <ModuleCard
                          key={module.id}
                          module={module}
                          isAssigned={selectedModules.includes(module.id)}
                          isPending={pendingIds.includes(module.id)}
                          onToggle={onToggle}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ModuleCard = ({ module, isAssigned, isPending, onToggle }) => {
  const IconComponent = LucideIcons[module?.icon] || LucideIcons["Box"];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative rounded-[5px] border transition-all duration-300 overflow-hidden group ${
        isAssigned
          ? "border-emerald-200 bg-linear-to-br from-emerald-50/40 via-white to-white hover:ring-emerald-100"
          : "border-slate-200 bg-white hover:ring-slate-100"
      } ${isHovered ? "shadow-sm -translate-y-0.5 hover:ring-2" : "shadow-sm hover:ring-2"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${module.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none`}
      />
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${module.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="p-4 relative">
        <div className="flex items-start space-x-3">
          <div
            className={`shrink-0 p-2.5 rounded-[5px] bg-linear-to-br ${module.color} text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900 transition-colors">
              {module.name}
            </h3>

            {module.description ? (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 group-hover:text-slate-600 transition-colors">
                {module.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-0.5 italic">
                /{module.slug}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {module.group_name && (
                <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-[3px] border border-slate-100 font-medium">
                  <LucideIcons.FolderOpen className="w-2.5 h-2.5" />
                  {module.group_name}
                </span>
              )}

              {module.sort_order != null && (
                <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-[3px] border border-slate-100">
                  #{module.sort_order}
                </span>
              )}

              <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-[3px] border border-slate-100">
                ID: {module.id}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border ${
              isAssigned
                ? "bg-emerald-50 border-emerald-200/60"
                : "bg-slate-50 border-slate-200/60"
            }`}
          >
            <span className="relative flex h-1.5 w-1.5">
              {isAssigned && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isAssigned ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
            </span>
            <span
              className={`text-[10px] font-medium ${
                isAssigned ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              {isAssigned ? "Active" : "Inactive"}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                ) : (
                  <Switch
                    checked={isAssigned}
                    onCheckedChange={() => onToggle?.(module.id)}
                    className="data-[state=checked]:bg-linear-to-r data-[state=unchecked]:bg-slate-300"
                  />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="rounded-[5px] bg-slate-800 text-white border-0 text-xs px-3 py-1.5">
              <p>{isAssigned ? "Click to deactivate" : "Click to activate"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export { ModuleCard, Modules };