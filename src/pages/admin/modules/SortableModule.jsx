import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/react';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GripVertical, Move, MoreVertical, Check, X } from "lucide-react";

export const SortableModule = ({
                                   id,
                                   module,
                                   isReordering,
                                   groupSlug,
                                   allGroups,
                                   onMoveToGroup,
                                   isDragging
                               }) => {
    const [showMoveMenu, setShowMoveMenu] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging,
    } = useSortable({
        id,
        disabled: !isReordering
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: (isSortableDragging || isDragging) ? 0.5 : 1,
        backgroundColor: isSortableDragging ? 'rgb(243 244 246)' : undefined,
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <Badge className="bg-green-500">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            default:
                return <Badge variant="outline">{status || 'N/A'}</Badge>;
        }
    };

    const getIconColorClass = (color) => {
        return color || 'from-gray-500 to-gray-600';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all ${
                isSortableDragging ? 'shadow-lg' : ''
            }`}
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

            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getIconColorClass(module.color)} flex items-center justify-center text-white text-xs font-bold`}>
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

            {isReordering && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Move className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {allGroups
                            .filter(g => g.slug !== groupSlug)
                            .map(group => (
                                <DropdownMenuItem
                                    key={group.slug}
                                    onClick={() => onMoveToGroup(id, groupSlug, group.slug, group.modules.length)}
                                >
                                    Move to {group.name}
                                </DropdownMenuItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};
