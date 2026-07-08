import React from 'react';
import { useSortable } from '@dnd-kit/react';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, ChevronDown, ChevronRight, FolderOpen } from "lucide-react";
import { SortableModule } from "./SortableModule";

export const SortableGroup = (
    {
      id,
      group,
      isReordering,
      isExpanded,
      onToggle,
      onModuleDragEnd,
      onModuleMoveToGroup,
      allGroups,
      activeId
   }
) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const handleModuleDragEndInternal = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            onModuleDragEnd(group.slug, event);
        }
    };

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
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleModuleDragEndInternal}
                        >
                            <SortableContext
                                items={group.modules?.map(m => m.id.toString()) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {group.modules?.map((module, idx) => (
                                        <SortableModule
                                            key={module.id}
                                            id={module.id.toString()}
                                            module={module}
                                            isReordering={isReordering}
                                            groupSlug={group.slug}
                                            allGroups={allGroups}
                                            onMoveToGroup={onModuleMoveToGroup}
                                            isDragging={activeId === module.id.toString()}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {(!group.modules || group.modules.length === 0) && (
                            <div className="text-center py-4 text-muted-foreground text-sm">
                                No modules in this group
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
};
