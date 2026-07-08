import * as LucideIcons from "lucide-react";
import {
  Box,
  Layers,
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  Search,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const ModuleRow = ({ module, onEdit, onToggleCore, onToggleActive }) => {
  const IconComponent = LucideIcons[module?.icon] || Box;
  const isCore = module.is_core === 1;
  const isActive = module.status === "active";

  return (
    <TableRow className="group hover:bg-muted/40">
      <TableCell>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-sm bg-linear-to-br ${module.color} text-white shrink-0 shadow-sm`}
          >
            <IconComponent className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">
                {module.name}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {module.slug}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Group */}
      <TableCell>
        <Badge
          variant="secondary"
          className="rounded-sm text-[11px] font-normal"
        >
          {module.group_name || "—"}
        </Badge>
      </TableCell>

      {/* Sort */}
      <TableCell className="text-center">
        <span className="text-xs text-muted-foreground">
          {module.sort_order ?? 0}
        </span>
      </TableCell>

      {/* Core status */}
      <TableCell className="text-center">
        {isCore ? (
          <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Yes
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">No</span>
        )}
      </TableCell>

      {/* Active status + switch */}
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch
                  checked={isActive}
                  disabled={isCore}
                  onCheckedChange={() => onToggleActive?.(module)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="rounded-sm text-xs">
              {isCore
                ? "Core module — always active"
                : isActive
                  ? "Click to deactivate"
                  : "Click to activate"}
            </TooltipContent>
          </Tooltip>
          <span
            className={`text-xs font-medium ${
              isActive ? "text-emerald-600" : "text-muted-foreground"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </TableCell>

      {/* Updated */}
      <TableCell>
        <span className="text-xs text-muted-foreground">
          {formatDate(module.updated_at)}
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-sm w-52">
            <DropdownMenuLabel className="text-xs">
              Module Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="rounded-sm text-xs cursor-pointer"
              onClick={() => onEdit?.(module)}
            >
              <Pencil className="w-3.5 h-3.5 mr-2" />
              Edit Module
            </DropdownMenuItem>

            <DropdownMenuItem
              className="rounded-sm text-xs cursor-pointer"
              onClick={() => onToggleCore?.(module)}
            >
              {isCore ? (
                <>
                  <ShieldOff className="w-3.5 h-3.5 mr-2" />
                  Remove Core Status
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 mr-2" />
                  Make Core Module
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              className="rounded-sm text-xs cursor-pointer"
              onClick={() => onToggleActive?.(module)}
              disabled={isCore}
            >
              {isActive ? (
                <>
                  <PowerOff className="w-3.5 h-3.5 mr-2" />
                  Deactivate
                </>
              ) : (
                <>
                  <Power className="w-3.5 h-3.5 mr-2" />
                  Activate
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

const GroupHeaderRow = ({ group }) => (
  <TableRow className="bg-muted/60 hover:bg-muted/60">
    <TableCell colSpan={7} className="py-2">
      <div className="flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {group.name}
        </span>
        <Badge variant="outline" className="rounded-sm text-[10px] px-1.5">
          {group.modules.length}
        </Badge>
      </div>
    </TableCell>
  </TableRow>
);

const TableSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-sm" />
    ))}
  </div>
);

const List = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/modules",
  });

  const modules = useMemo(
    () => modulesResponse?.data?.data ?? modulesResponse?.data ?? [],
    [modulesResponse],
  );

  const groupedModules = useMemo(() => {
    const filtered = modules.filter(
      (m) =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.slug?.toLowerCase().includes(search.toLowerCase()),
    );

    const groups = {};
    for (const mod of filtered) {
      const key = mod.group_slug || "ungrouped";
      if (!groups[key]) {
        groups[key] = {
          name: mod.group_name || "Ungrouped",
          slug: key,
          sortOrder: mod.group_sort_order ?? 999,
          modules: [],
        };
      }
      groups[key].modules.push(mod);
    }

    return Object.values(groups)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((g) => ({
        ...g,
        modules: g.modules.sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        ),
      }));
  }, [modules, search]);

  const totalCount = modules.length;
  const coreCount = modules.filter((m) => m.is_core === 1).length;
  const activeCount = modules.filter((m) => m.status === "active").length;


  const handleEdit = (module) => {
    navigate(`/admin/modules/save/${module.id}`);
  };

  const handleToggleCore = (module) => {
    // updateModule.mutate({
    //   url: `/admin/modules/${module.id}`,
    //   data: { is_core: module.is_core === 1 ? 0 : 1 },
    // });
    console.log("Toggle core status:", module.id);
  };

  const handleToggleActive = (module) => {
    // updateModule.mutate({
    //   url: `/admin/modules/${module.id}`,
    //   data: { status: module.status === "active" ? "inactive" : "active" },
    // });
    console.log("Toggle active status:", module.id);
  };

  /* --------------------------------------------------------------- */

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Modules</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage system modules, core status and availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-sm text-xs">
            Total: {totalCount}
          </Badge>
          <Badge className="rounded-sm text-xs bg-purple-100 text-purple-700 hover:bg-purple-100 border border-purple-200">
            Core: {coreCount}
          </Badge>
          <Badge className="rounded-sm text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
            Active: {activeCount}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search modules by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 rounded-sm h-9 text-sm"
          />
        </div>
        <div>
          <Button
            onClick={() => navigate("/admin/modules/save")}
          >
            Create Module
          </Button>
        </div>
      </div>
      {/* Table */}
      {modulesLoading ? (
        <TableSkeleton />
      ) : groupedModules.length === 0 ? (
        <Card className="rounded-sm border-dashed">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <Layers className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No modules found</p>
            <p className="text-xs text-muted-foreground mt-1">
              {search
                ? `No results for "${search}". Try a different keyword.`
                : "Modules will appear here once created."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs">Module</TableHead>
                <TableHead className="text-xs">Group</TableHead>
                <TableHead className="text-xs text-center w-16">Sort</TableHead>
                <TableHead className="text-xs text-center w-20">Core</TableHead>
                <TableHead className="text-xs w-36">Status</TableHead>
                <TableHead className="text-xs w-28">Updated</TableHead>
                <TableHead className="text-xs text-right w-16">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedModules.map((group) => (
                <React.Fragment key={group.slug}>
                  <GroupHeaderRow group={group} />
                  {group.modules.map((module) => (
                    <ModuleRow
                      key={module.id}
                      module={module}
                      onEdit={handleEdit}
                      onToggleCore={handleToggleCore}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default List;
