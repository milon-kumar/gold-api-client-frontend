import React, { useEffect, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Lock, LayoutDashboard, Settings, FileStack, Boxes, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";

const ICONS = {
  dashboard: LayoutDashboard,
  settings: Settings,
  pages: FileStack,
  module: Boxes,
};

const DEFAULT_GROUPS = [
  {
    id: "overview",
    title: "Overview",
    locked: true,
    items: [{ id: "dashboard", label: "Dashboard", iconKey: "dashboard", system: true }],
  },
  {
    id: "management",
    title: "Management",
    locked: true,
    items: [
      { id: "settings", label: "Settings", iconKey: "settings", system: true },
      { id: "pages", label: "Pages", iconKey: "pages", system: true },
    ],
  },
  {
    id: "content-management",
    title: "Content Management",
    locked: true,
    items: [],
  },
];

const SortableGroup = ({ group, index, children }) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: group.id,
    index,
    type: "group",
    accept: ["group"],
  });

  return (
    <div ref={ref} className={`p-4 rounded-lg border bg-white ${isDragging ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <button ref={handleRef} type="button" className="text-muted-foreground cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex-1">{group.title}</p>
        {group.locked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

const SortableItem = ({ item, index, groupId }) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    type: "item",
    accept: ["item"],
    group: groupId,
    data: { groupId },
  });

  const Icon = ICONS[item.iconKey] || Boxes;

  return (
    <div
      ref={ref}
      className={`flex items-center justify-between p-3 rounded-lg border bg-gray-50 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button ref={handleRef} type="button" className="text-muted-foreground cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <Icon className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      {item.system ? (
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <Badge variant="outline" className="text-xs">{item.module_slug}</Badge>
      )}
    </div>
  );
};

const SidebarBuilderTab = () => {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);

  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/modules",
  });

  const { data: sidebarResponse } = useApiQuery({
    url: "/admin/sidebar-order",
  });

  const { mutate: saveOrder, isLoading: saving } = useApiMutation({
    url: "/admin/sidebar-order",
    method: "POST",
  });

  useEffect(() => {
    const modules = modulesResponse?.data || [];
    const moduleItems = modules?.length > 0 ? modules.map((module) => ({
      id: module.id,
      label: module.title,
      module_slug: module.module_slug,
      iconKey: "module",
      system: false,
    })) : [];

    const savedGroups = sidebarResponse?.data?.groups;

    if (savedGroups?.length) {
      const nextGroups = DEFAULT_GROUPS.map((defaultGroup) => {
        const savedGroup = savedGroups.find((g) => g.id === defaultGroup.id);
        if (defaultGroup.id === "content-management") {
          const savedOrder = savedGroup?.items || [];
          const ordered = savedOrder.map((id) => moduleItems.find((item) => item.id === id)).filter(Boolean);
          const remaining = moduleItems.filter((item) => !savedOrder.includes(item.id));
          return { ...defaultGroup, items: [...ordered, ...remaining] };
        }
        if (!savedGroup) return defaultGroup;
        const orderedItems = savedGroup.items
          .map((id) => defaultGroup.items.find((item) => item.id === id))
          .filter(Boolean);
        return { ...defaultGroup, items: orderedItems.length ? orderedItems : defaultGroup.items };
      });

      const savedGroupOrder = savedGroups.map((g) => g.id);
      nextGroups.sort((a, b) => {
        const aIndex = savedGroupOrder.indexOf(a.id);
        const bIndex = savedGroupOrder.indexOf(b.id);
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
      });

      setGroups(nextGroups);
    } else {
      setGroups((prev) =>
        prev.map((group) => (group.id === "content-management" ? { ...group, items: moduleItems } : group)),
      );
    }
  }, [modulesResponse, sidebarResponse]);

  const handleDragEnd = (event) => {
    const { source } = event.operation;
    if (!source) return;

    if (source.type === "group") {
      setGroups((prev) => move(prev, event));
      return;
    }

    if (source.type === "item") {
      const groupId = source.data?.groupId;
      setGroups((prev) =>
        prev.map((group) => (group.id === groupId ? { ...group, items: move(group.items, event) } : group)),
      );
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        groups: groups.map((group) => ({
          id: group.id,
          items: group.items.map((item) => item.id),
        })),
      };
      const response = await saveOrder(payload);
      if (response?.success) {
        toast.success("Sidebar order saved successfully");
      } else {
        toast.error(response?.message || "Failed to save sidebar order");
      }
    } catch (error) {
      toast.error("Error saving sidebar order");
    }
  };

  if (modulesLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-linear-to-r from-slate-50 to-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LayoutDashboard className="h-5 w-5 text-slate-600" />
                Sidebar Builder
              </CardTitle>
              <CardDescription>Drag a group to reorder it, or drag items within a group to rearrange them</CardDescription>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Order
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <DragDropProvider onDragEnd={handleDragEnd}>
            {groups.map((group, groupIndex) => (
              <SortableGroup key={group.id} group={group} index={groupIndex}>
                {group.items.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items in this group</p>
                  </div>
                ) : (
                  group.items.map((item, itemIndex) => (
                    <SortableItem key={item.id} item={item} index={itemIndex} groupId={group.id} />
                  ))
                )}
              </SortableGroup>
            ))}
          </DragDropProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarBuilderTab;