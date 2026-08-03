import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiMutation } from "@/hooks/useAppMutation";
import { useApiQuery } from "@/hooks/useAppQuery";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  Boxes,
  Edit,
  GripVertical,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Trash2
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import IconRenderer from "@/components/partials/IconRenderer";
import { IconPicker } from "@/components/ui/icon-picker";
import { ICON_OPTIONS } from "@/store/default/component-placeholder";

const ICONS = ICON_OPTIONS.reduce((acc, { key, icon }) => ({ ...acc, [key]: icon }), {});

const DEFAULT_GROUPS = [
  {
    id: "overview",
    title: "Overview",
    locked: true,
    items: [{ id: "dashboard", label: "Dashboard", iconKey: "dashboard", system: true , url: "/dashboard"}],
  },
  {
    id: "default-content",
    title: "Default Content",
    locked: true,
    // items are always derived from module_type === "system" modules (see syncing effect below)
    items: [],
  },
  {
    id: "content-management",
    title: "Content Management",
    locked: true,
    // items are derived from module_type === "custom" modules (see syncing effect below)
    items: [],
  },
  {
    id: "settings",
    title: "Settings",
    locked: true,
    items: [
      { id: "businessSetting", label: "Business Overview", iconKey: "settings", system: true,url: "/settings?tab=businessSetting" },
      { id: "navigations", label: "Pages", iconKey: "pages", system: true ,url: "/navigations"},
      { id: "builder", label: "Menu Builder", iconKey: "pages", system: true ,url: "/navigations/builder"},
      { id: "sidebarBuilder", label: "Sidebar Builder", iconKey: "pages", system: true ,url: "/settings?tab=sidebarBuilder"},
      { id: "categories", label: "Categories", iconKey: "pages", system: true ,url: "/categories"},
      { id: "manageModule", label: "Modules Manager", iconKey: "pages", system: true ,url: "/settings?tab=manageModule"},
      { id: "accountSetting", label: "Accounts", iconKey: "pages", system: true ,url: "/settings?tab=accountSetting"},
    ],
  },
];

// Builds a locked (non-removable), reorderable item list for a module group.
// `savedItems` (if any) determines order + label/icon overrides; the module list
// itself is always the source of truth for *which* items exist.
const buildLockedItemsFromModules = (modules, savedItems = []) => {
  const savedOrder = (savedItems || []).map((i) => i.id);
  const ordered = [...modules].sort((a, b) => {
    const aIndex = savedOrder.indexOf(a.id);
    const bIndex = savedOrder.indexOf(b.id);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return ordered.map((module) => {
    console.log("module:", module);
    const saved = (savedItems || []).find((i) => i.id === module.id);
    return {
      id: module.id,
      label: saved?.label || module.title,
      iconKey: saved?.icon_key || "module",
      module_slug: module.title_slug,
      system: true, // locked: reorder-only, cannot be removed, never shown in Available Modules
      url: module?.meta?.url || null,
    };
  });
};

// Builds the full groups array from scratch. Pass `savedGroups` (from saved
// settings) to respect existing order/labels/removed-items; pass null/undefined
// to get a completely fresh default layout (used for the Reset action).
const buildGroupsFromModules = (systemModules, customModules, savedGroups) => {
  const hasSavedSidebar = Boolean(savedGroups?.length);

  const savedDefaultContent = savedGroups?.find((g) => g.id === "default-content");
  const savedContentManagement = savedGroups?.find((g) => g.id === "content-management");

  // Default Content: always fully synced from system modules. Order/labels/icons
  // come from saved data if present, but items themselves cannot be removed.
  const defaultContentItems = buildLockedItemsFromModules(systemModules, savedDefaultContent?.items);

  // Content Management: if we already have a saved list, respect it exactly
  // (so removed items stay removed / available). Otherwise default-populate
  // with every custom module.
  const contentManagementItems = savedContentManagement
    ? savedContentManagement.items
      .map((saved) => {
        const module = customModules.find((m) => m.id === saved.id);
        if (!module) return null; // module no longer exists / no longer custom
        return {
          id: module.id,
          label: saved.label || module.title,
          iconKey: saved.icon_key || "module",
          module_slug: module.title_slug,
          system: false,
        };
      })
      .filter(Boolean)
    : customModules.map((module) => ({
      id: module.id,
      label: module.title,
      iconKey: "module",
      module_slug: module.title_slug,
      system: false,
    }));

  const nextGroups = DEFAULT_GROUPS.map((defaultGroup) => {
    if (defaultGroup.id === "default-content") {
      return { ...defaultGroup, items: defaultContentItems };
    }
    if (defaultGroup.id === "content-management") {
      return { ...defaultGroup, items: contentManagementItems };
    }

    // overview / settings: hardcoded system items, reorder + label/icon overrides only
    const savedGroup = savedGroups?.find((g) => g.id === defaultGroup.id);
    if (!savedGroup) return defaultGroup;

    const orderedItems = (savedGroup.items || [])
      .map((saved) => {
        const original = defaultGroup.items.find((item) => item.id === saved.id);
        if (!original) return null;
        return {
          ...original,
          label: saved.label || original.label,
          iconKey: saved.icon_key || original.iconKey,
          url: saved.url || original.url,
        };
      })
      .filter(Boolean);
    return { ...defaultGroup, items: orderedItems.length ? orderedItems : defaultGroup.items };
  });

  if (hasSavedSidebar) {
    const savedGroupOrder = savedGroups.map((g) => g.id);
    nextGroups.sort((a, b) => {
      const aIndex = savedGroupOrder.indexOf(a.id);
      const bIndex = savedGroupOrder.indexOf(b.id);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  }

  return nextGroups;
};

const EditMenuItemDialog = ({ open, onOpenChange, item, onSave }) => {
  const [label, setLabel] = useState("");
  const [iconKey, setIconKey] = useState("module");

  useEffect(() => {
    if (open && item) {
      setLabel(item.label);
      setIconKey(item.iconKey);
    }
  }, [open, item]);

  const handleSubmit = () => {
    if (!label.trim()) {
      toast.error("Title is required");
      return;
    }
    onSave({ label: label.trim(), iconKey });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>Update the title and icon shown in the sidebar</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Menu title" />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <IconPicker
              icon={iconKey}
              setIcon={setIconKey}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

const SortableItem = ({ item, index, groupId, onEdit, onRemove }) => {
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
      className={`flex items-center justify-between p-3 rounded-lg border bg-gray-50 group ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button ref={handleRef} type="button" className="text-muted-foreground cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4" />
        </button>
        <IconRenderer icon={item?.iconKey} className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      <div className="flex items-center gap-2">
        {item.system && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
        {item.module_slug && (
          <Badge variant="outline" className="text-xs">{item.module_slug}</Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(groupId, item)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit className="h-4 w-4" />
        </Button>
        {!item.system && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(groupId, item)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const SidebarBuilderTab = () => {
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [allModules, setAllModules] = useState([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const {
    data: settingsResponse,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useApiQuery({
    url: `/admin/business-settings`,
  });

  const settings = settingsResponse?.data?.settings?.meta || {}

  const { data: modulesResponse, isLoading: modulesLoading } = useApiQuery({
    url: "/admin/business-modules",
  });

  const { mutate: saveOrder, isLoading: saving } = useApiMutation({
    url: "/admin/update-business-meta",
    method: "POST",
  });

  useEffect(() => {
    setAllModules(modulesResponse?.data?.data || []);
  }, [modulesResponse]);

  // Split modules by type: system modules always live in "Default Content",
  // custom modules live in "Content Management".
  const systemModules = useMemo(
    () => allModules.filter((module) => module.module_type === "system"),
    [allModules],
  );
  const customModules = useMemo(
    () => allModules.filter((module) => module.module_type === "custom"),
    [allModules],
  );

  useEffect(() => {
    // wait until modules are loaded so we don't briefly wipe groups with an empty module list
    if (modulesLoading) return;

    const savedGroups = settings?.business_sidebar?.groups;
    setGroups(buildGroupsFromModules(systemModules, customModules, savedGroups));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, systemModules, customModules, modulesLoading]);

  const contentManagementIds = groups.find((g) => g.id === "content-management")?.items.map((i) => i.id) || [];
  // Only custom modules can ever appear in the "Available Modules" panel; system
  // modules are auto-managed and never removable/available.
  const availableModules = customModules.filter((module) => !contentManagementIds.includes(module.id));

  const toggleModuleSelect = (moduleId) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId],
    );
  };

  const handleAddSelected = () => {
    if (selectedModuleIds.length === 0) return;

    const modulesToAdd = customModules.filter((module) => selectedModuleIds.includes(module.id));

    setGroups((prev) =>
      prev.map((group) =>
        group.id === "content-management"
          ? {
            ...group,
            items: [
              ...group.items,
              ...modulesToAdd.map((module) => ({
                id: module.id,
                label: module.title,
                module_slug: module.title_slug,
                iconKey: "module",
                system: false,
              })),
            ],
          }
          : group,
      ),
    );
    setSelectedModuleIds([]);
  };

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

  const handleItemEdit = ({ label, iconKey }) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === editTarget.groupId
          ? {
            ...group,
            items: group.items.map((item) =>
              item.id === editTarget.item.id ? { ...item, label, iconKey } : item,
            ),
          }
          : group,
      ),
    );
  };

  const handleItemRemove = (groupId, item) => {
    // system items (Default Content) never expose a remove button, but guard here too
    if (item.system) return;
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, items: group.items.filter((i) => i.id !== item.id) } : group,
      ),
    );
  };

  const handleReset = () => {
    // Rebuild a fresh default layout, ignoring any saved order/labels/removed items.
    // This only updates local state — nothing is persisted until "Save Order" is clicked.
    setGroups(buildGroupsFromModules(systemModules, customModules, null));
    setSelectedModuleIds([]);
    setResetConfirmOpen(false);
    toast.success("Sidebar reset to default. Click Save Order to apply.");
  };

  const handleSave = async () => {
    try {
      const payload = {
        business_sidebar: {
          groups: groups.map((group) => ({
            id: group.id,
            items: group.items.map((item) => ({
              id: item.id,
              label: item.label,
              icon_key: item.iconKey,
              module_slug: item.module_slug,
              url: item.url,
            })),
          })),
        },
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="shadow-sm lg:col-span-1 p-0 m-0">
        <CardHeader className="border-b bg-linear-to-r from-blue-50 to-indigo-50 pt-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Boxes className="h-4 w-4 text-blue-600" />
            Available Modules
          </CardTitle>
          <CardDescription>Select modules to add to Content Management</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {availableModules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Boxes className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">All modules have been added</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {availableModules.map((module) => (
                <label
                  key={module.id}
                  className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                >
                  <Checkbox
                    checked={selectedModuleIds.includes(module.id)}
                    onCheckedChange={() => toggleModuleSelect(module.id)}
                  />
                  <div className="h-8 w-8 rounded bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {module.image_full_path ? (
                      <img src={module.image_full_path} alt={module.title} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium truncate">{module.title}</span>
                </label>
              ))}
            </div>
          )}

          <Button className="w-full gap-2" disabled={selectedModuleIds.length === 0} onClick={handleAddSelected}>
            <Plus className="h-4 w-4" />
            Add Selected {selectedModuleIds.length > 0 && `(${selectedModuleIds.length})`}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-sm lg:col-span-2 p-0 m-0">
        <CardHeader className="border-b bg-linear-to-r from-slate-50 to-gray-50 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LayoutDashboard className="h-5 w-5 text-slate-600" />
                Sidebar Builder
              </CardTitle>
              <CardDescription>
                Drag a group to reorder it, drag items within a group to rearrange them, or edit an item's title and icon
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                onClick={() => setResetConfirmOpen(true)}
                disabled={saving}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
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
                    <SortableItem
                      key={item.id}
                      item={item}
                      index={itemIndex}
                      groupId={group.id}
                      onEdit={(groupId, item) => setEditTarget({ groupId, item })}
                      onRemove={handleItemRemove}
                    />
                  ))
                )}
              </SortableGroup>
            ))}
          </DragDropProvider>
        </CardContent>
      </Card>

      <EditMenuItemDialog
        open={Boolean(editTarget)}
        onOpenChange={(open) => !open && setEditTarget(null)}
        item={editTarget?.item}
        onSave={handleItemEdit}
      />

      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset sidebar to default?</DialogTitle>
            <DialogDescription>
              This will discard all custom order, labels, icons, and removed items — Default Content and
              Content Management will be rebuilt from scratch. This won't be saved until you click "Save Order".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidebarBuilderTab;