import React, { useState, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import {
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Search,
    Download,
    Save,
    RefreshCw,
    GripVertical,
    ChevronDown,
    ChevronRight,
    Layers,
    Grid3x3,
    FolderOpen,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useAppQuery.js";
import {useApiMutation} from "@/hooks/useAppMutation.js";
import { toast } from "sonner";

// Sortable Module Component
const SortableModuleItem = ({ module, groupId, isReordering, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `module-${module.id}`,
        data: {
            type: 'module',
            module,
            groupId,
            originalIndex: index,
        },
        disabled: !isReordering,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return <Badge className="bg-green-500">Active</Badge>;
            case 'inactive': return <Badge variant="secondary">Inactive</Badge>;
            default: return <Badge variant="outline">{status || 'N/A'}</Badge>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all ${isDragging ? 'shadow-lg' : ''}`}
        >
            {isReordering && (
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            <div className={`w-8 h-8 rounded-lg bg-linear-to-br ${module.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white text-xs font-bold`}>
                {module.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{module.name}</span>
                    {module.name_bn && (
                        <span className="text-xs text-muted-foreground">({module.name_bn})</span>
                    )}
                    {module.is_core === 1 && (
                        <Badge variant="outline" className="text-xs">Core</Badge>
                    )}
                    {getStatusBadge(module.status)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                    <code className="bg-muted px-1 py-0.5 rounded">{module.slug}</code>
                </div>
            </div>
            {!isReordering && module.sort_order && (
                <Badge variant="outline" className="text-xs">
                    Order: {module.sort_order}
                </Badge>
            )}
        </div>
    );
};

// Sortable Group Component
const SortableGroupItem = ({ group, isReordering, isExpanded, onToggle, onModuleClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `group-${group.slug}`,
        data: {
            type: 'group',
            group,
        },
        disabled: !isReordering,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const moduleIds = group.modules?.map(m => `module-${m.id}`) || [];

    return (
        <div ref={setNodeRef} style={style}>
            <Card className={`border ${isDragging ? 'shadow-lg' : ''}`}>
                <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isReordering && (
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="cursor-grab active:cursor-grabbing"
                                >
                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggle}
                                className="h-8 w-8 p-0"
                            >
                                {isExpanded ?
                                    <ChevronDown className="h-4 w-4" /> :
                                    <ChevronRight className="h-4 w-4" />
                                }
                            </Button>
                            <FolderOpen className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-base">
                                {group.name}
                            </CardTitle>
                            <Badge variant="secondary" className="ml-2">
                                {group.modules?.length || 0} modules
                            </Badge>
                            {!isReordering && group.sort_order && (
                                <Badge variant="outline" className="text-xs">
                                    Order: {group.sort_order}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {isExpanded && (
                    <CardContent className="pt-0 pb-3 px-4">
                        <SortableContext
                            items={moduleIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {group.modules?.map((module, idx) => (
                                    <SortableModuleItem
                                        key={module.id}
                                        module={module}
                                        groupId={group.slug}
                                        index={idx}
                                        isReordering={isReordering}
                                        onModuleClick={onModuleClick}
                                    />
                                ))}
                            </div>
                        </SortableContext>

                        {(!group.modules || group.modules.length === 0) && (
                            <div className="text-center py-4 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                No modules in this group
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

// Main Component
const ModulesManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isReordering, setIsReordering] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [groups, setGroups] = useState([]);
    const [originalGroups, setOriginalGroups] = useState([]);
    const [activeId, setActiveId] = useState(null);

    // API calls
    const { data: modulesResponse, refetch } = useApiQuery({
        url: "/admin/modules",
    });

    const updateOrderMutation = useApiMutation({
        url: "/admin/modules/reorder-all",
        method: "POST",
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Order updated successfully",
            });
            setIsReordering(false);
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update order",
                variant: "destructive",
            });
            console.error("Reorder error:", error);
        }
    });

    // Process API data
    useMemo(() => {
        const responseData = modulesResponse?.data?.data;
        let processedGroups = [];

        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
            processedGroups = Object.entries(responseData).map(([slug, modules]) => ({
                slug: slug,
                name: modules[0]?.group_name || slug.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' '),
                sort_order: modules[0]?.group_sort_order || 0,
                modules: modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            }));
        } else if (Array.isArray(responseData)) {
            const groupsMap = {};
            responseData.forEach(module => {
                const groupKey = module.group_slug;
                if (!groupsMap[groupKey]) {
                    groupsMap[groupKey] = [];
                }
                groupsMap[groupKey].push(module);
            });
            processedGroups = Object.entries(groupsMap).map(([slug, modules]) => ({
                slug: slug,
                name: modules[0]?.group_name || slug,
                sort_order: modules[0]?.group_sort_order || 0,
                modules: modules.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            }));
        }

        processedGroups.sort((a, b) => a.sort_order - b.sort_order);
        setGroups(processedGroups);
        setOriginalGroups(JSON.parse(JSON.stringify(processedGroups)));

        // Auto-expand all groups
        const allExpanded = {};
        processedGroups.forEach(group => {
            allExpanded[group.slug] = true;
        });
        setExpandedGroups(allExpanded);
    }, [modulesResponse]);

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
        if (!searchTerm) return groups;

        const term = searchTerm.toLowerCase();
        return groups.map(group => ({
            ...group,
            modules: group.modules.filter(module =>
                module.name.toLowerCase().includes(term) ||
                module.name_bn?.toLowerCase().includes(term) ||
                module.slug?.toLowerCase().includes(term)
            )
        })).filter(group => group.modules.length > 0);
    }, [groups, searchTerm]);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle drag start
    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    // Handle drag end
    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Handle group reordering
        if (activeId.toString().startsWith('group-') && overId.toString().startsWith('group-')) {
            const oldIndex = groups.findIndex(g => `group-${g.slug}` === activeId);
            const newIndex = groups.findIndex(g => `group-${g.slug}` === overId);

            if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
                setGroups(prev => arrayMove(prev, oldIndex, newIndex));
            }
        }

        // Handle module reordering within same group
        else if (activeId.toString().startsWith('module-') && overId.toString().startsWith('module-')) {
            const activeModuleId = parseInt(activeId.toString().split('-')[1]);
            const overModuleId = parseInt(overId.toString().split('-')[1]);

            // Find which groups contain these modules
            let activeGroupIndex = -1;
            let overGroupIndex = -1;
            let activeModuleIndex = -1;
            let overModuleIndex = -1;

            for (let i = 0; i < groups.length; i++) {
                const activeIdx = groups[i].modules.findIndex(m => m.id === activeModuleId);
                if (activeIdx !== -1) {
                    activeGroupIndex = i;
                    activeModuleIndex = activeIdx;
                }
                const overIdx = groups[i].modules.findIndex(m => m.id === overModuleId);
                if (overIdx !== -1) {
                    overGroupIndex = i;
                    overModuleIndex = overIdx;
                }
            }

            if (activeGroupIndex === overGroupIndex && activeModuleIndex !== overModuleIndex && activeModuleIndex !== -1 && overModuleIndex !== -1) {
                // Same group, reorder modules
                const newGroups = [...groups];
                const newModules = arrayMove(
                    newGroups[activeGroupIndex].modules,
                    activeModuleIndex,
                    overModuleIndex
                );
                newGroups[activeGroupIndex].modules = newModules;
                setGroups(newGroups);
            }
        }
    };

    // Toggle reorder mode
    const toggleReordering = () => {
        if (isReordering) {
            // Cancel reordering, revert to original
            setGroups(JSON.parse(JSON.stringify(originalGroups)));
        } else {
            // Enter reordering mode
            setGroups([...filteredGroups]);
        }
        setIsReordering(!isReordering);
    };

    // Save order
    const saveOrder = async () => {
        const orderData = {
            groups: groups.map((group, index) => ({
                slug: group.slug,
                sort_order: index + 1
            })),
            modules: []
        };

        groups.forEach((group) => {
            group.modules.forEach((module, moduleIndex) => {
                orderData.modules.push({
                    id: module.id,
                    group_slug: group.slug,
                    sort_order: moduleIndex + 1
                });
            });
        });

        await updateOrderMutation.mutateAsync(orderData);
    };

    // Reset order
    const resetOrder = () => {
        setGroups(JSON.parse(JSON.stringify(originalGroups)));
    };

    // Export to CSV
    const handleExport = () => {
        const csvHeaders = ['Group', 'Module ID', 'Module Name', 'Module Name BN', 'Slug', 'Sort Order', 'Status', 'Is Core'];
        const csvRows = [];

        groups.forEach(group => {
            group.modules.forEach(module => {
                csvRows.push([
                    group.name,
                    module.id,
                    module.name,
                    module.name_bn || '',
                    module.slug,
                    module.sort_order,
                    module.status,
                    module.is_core ? 'Yes' : 'No'
                ]);
            });
        });

        const csv = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modules_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const groupIds = filteredGroups.map(g => `group-${g.slug}`);

    return (
        <div className="space-y-4 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Module Manager</h2>
                    <p className="text-muted-foreground">
                        Drag and drop to reorder groups and modules
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={isReordering ? "default" : "outline"}
                        onClick={toggleReordering}
                        className="gap-2"
                    >
                        {isReordering ? "Cancel Reorder" : "Start Reordering"}
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search modules by name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isReordering}
                />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>{filteredGroups.length} Groups</span>
                </div>
                <div className="flex items-center gap-2">
                    <Grid3x3 className="h-4 w-4 text-muted-foreground" />
                    <span>
                        {filteredGroups.reduce((acc, g) => acc + (g.modules?.length || 0), 0)} Modules
                    </span>
                </div>
            </div>

            {/* Reorder Controls */}
            {isReordering && (
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                    <div className="text-sm">
                        <span className="font-semibold">Reorder Mode Active</span>
                        <span className="text-muted-foreground ml-2">
                            Drag groups to reorder | Drag modules within groups to reorder
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={resetOrder}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                        <Button size="sm" onClick={saveOrder} disabled={updateOrderMutation.isPending}>
                            <Save className="mr-2 h-4 w-4" />
                            {updateOrderMutation.isPending ? "Saving..." : "Save All Changes"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Drag and Drop Context */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={groupIds}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {filteredGroups.map((group) => (
                            <SortableGroupItem
                                key={group.slug}
                                group={group}
                                isReordering={isReordering}
                                isExpanded={expandedGroups[group.slug]}
                                onToggle={() => setExpandedGroups(prev => ({
                                    ...prev,
                                    [group.slug]: !prev[group.slug]
                                }))}
                            />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId ? (
                        activeId.toString().startsWith('group-') ? (
                            <Card className="border shadow-lg bg-background p-3">
                                <div className="flex items-center gap-2">
                                    <FolderOpen className="h-5 w-5 text-blue-500" />
                                    <span>
                                        {groups.find(g => `group-${g.slug}` === activeId)?.name}
                                    </span>
                                </div>
                            </Card>
                        ) : (
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-background shadow-lg">
                                <div className="w-8 h-8 rounded-lg bg-gray-500" />
                                <span>
                                    {groups
                                        .flatMap(g => g.modules)
                                        .find(m => `module-${m.id}` === activeId)?.name}
                                </span>
                            </div>
                        )
                    ) : null}
                </DragOverlay>
            </DndContext>

            {(!filteredGroups || filteredGroups.length === 0) && (
                <Card>
                    <CardContent className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'No modules match your search' : 'No modules found'}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ModulesManager;
