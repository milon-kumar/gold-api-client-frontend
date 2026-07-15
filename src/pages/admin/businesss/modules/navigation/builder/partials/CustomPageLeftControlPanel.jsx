import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, GripVertical, Layers, Plus, Trash2 } from "lucide-react";
import {
  getComponentOptions,
  getComponentConfig,
} from "@/store/default/componentRegistry";
import { createComponent, createSection } from "@/lib/builderHelper";

/**
 * =====================================================================
 * LEFT SIDEBAR — Section & Component Manager
 * =====================================================================
 * - Section: add / remove / hide-show / drag-reorder / select
 * - Component: add (registry থেকে) / remove / hide-show / drag-reorder / select
 * সম্পূর্ণ Registry-driven: এখানে কোনো component-এর নাম hard code নেই।
 * =====================================================================
 */
const CustomPageLeftControlPanel = ({
  sections,
  selectedSectionId,
  selectedComponentId,
  onAddSection,
  onRemoveSection,
  onToggleVisibleSection,
  onReorderSection,
  onAddComponent,
  onRemoveComponent,
  onToggleVisibleComponent,
  onReorderComponent,
  setSelectedSectionId,
  setSelectedComponentId,
}) => {
  const componentOptions = getComponentOptions();
  const sectionDragIndex = useRef(null);

  const selectSection = (sectionId) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(null);
  };

  const selectComponent = (sectionId, componentId) => {
    setSelectedSectionId(sectionId);
    setSelectedComponentId(componentId);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Layers className="h-4 w-4" /> Page Structure
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2"
            onClick={() => {
              const section = createSection(`Section ${sections.length + 1}`);
              onAddSection(section);
              selectSection(section.id);
            }}
          >
            <Plus className="h-3 w-3" /> Section
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {sections.length === 0 && (
          <p className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
            No sections yet. Add your first section.
          </p>
        )}

        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => (sectionDragIndex.current = sectionIndex)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (
                sectionDragIndex.current !== null &&
                sectionDragIndex.current !== sectionIndex
              ) {
                onReorderSection(sectionDragIndex.current, sectionIndex);
              }
              sectionDragIndex.current = null;
            }}
            className={cn(
              "rounded-md border transition-colors",
              selectedSectionId === section.id && !selectedComponentId
                ? "border border-primary border-dashed"
                : "border-border",
              !section.is_visible && "opacity-50",
            )}
          >
            {/* ---- Section header ---- */}
            <div
              className="flex cursor-pointer items-center gap-1 p-2"
              onClick={() => selectSection(section.id)}
            >
              <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground" />
              <span className="flex-1 truncate text-xs font-medium">
                {section.name}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibleSection(section);
                }}
              >
                {section.is_visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSection(section);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* ---- Components of this section ---- */}
            <div className="space-y-1 border-t p-2">
              <ComponentList
                section={section}
                selectedComponentId={selectedComponentId}
                onSelect={selectComponent}
                onRemoveComponent={onRemoveComponent}
                onToggleVisibleComponent={onToggleVisibleComponent}
                onReorderComponent={onReorderComponent}
              />

              {/* ---- Add component (registry-driven) ---- */}
              <AddComponentSelect
                options={componentOptions}
                onAdd={(componentKey) => {
                  const component = createComponent(componentKey);
                  if (!component) return;
                  onAddComponent(section.id, component);
                  selectComponent(section.id, component.id);
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/* ---------------- Component list (drag within a section) ---------------- */

const ComponentList = ({
  section,
  selectedComponentId,
  onSelect,
  onRemoveComponent,
  onToggleVisibleComponent,
  onReorderComponent,
}) => {
  const dragIndex = useRef(null);

  return (
    <>
      {section.components.length === 0 && (
        <p className="py-1 text-center text-[11px] text-muted-foreground">
          Empty section
        </p>
      )}

      {section.components.map((component, index) => {
        const config = getComponentConfig(component.component);
        return (
          <div
            key={component.id}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              dragIndex.current = index;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.stopPropagation();
              if (dragIndex.current !== null && dragIndex.current !== index) {
                onReorderComponent(section.id, dragIndex.current, index);
              }
              dragIndex.current = null;
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(section.id, component.id);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-1 rounded border bg-muted/30 px-2 py-1.5",
              selectedComponentId === component.id
                ? "border border-primary border-dashed"
                : "border-transparent",
              !component.is_visible && "opacity-50",
            )}
          >
            <GripVertical className="h-3 w-3 shrink-0 cursor-grab text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium">
                {config?.label || component.component}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {component.type !== "default" ? `${component.type} · ` : ""}
                {component.template}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibleComponent(section.id, component.id);
              }}
            >
              {component.is_visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveComponent(section.id, component.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </>
  );
};

/* ---------------- Add component dropdown ---------------- */

const AddComponentSelect = ({ options, onAdd }) => {
  const [value, setValue] = useState("");

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        onAdd(v);
        setValue(""); // reset so the same component can be added again
      }}
    >
      <SelectTrigger className="mt-1 h-7 text-[11px]">
        <SelectValue placeholder="+ Add component" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomPageLeftControlPanel;
