import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MonitorPlay } from "lucide-react";
import { getComponentConfig } from "@/store/default/componentRegistry";
import { getRenderer } from "../renderers";

/**
 * =====================================================================
 * MIDDLE PANEL — Live Preview
 * =====================================================================
 * - সব visible Section ও Component render করে
 * - Selected Section / Component highlight হয়
 * - State change হলে সাথে সাথে re-render (instant update, no reload)
 * - Preview-তে click করলেও select করা যায় (bonus)
 * =====================================================================
 */
const CustomPagePreviewControlPanel = ({
  sections,
  selectedSectionId,
  selectedComponentId,
  setSelectedSectionId,
  setSelectedComponentId,
}) => {
  const visibleSections = sections.filter((s) => s.is_visible);

  if (!visibleSections.length) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
          <MonitorPlay className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Nothing to preview</p>
          <p className="text-xs text-muted-foreground">
            Add a section and some components to see the live preview.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-50">
      <CardContent className="space-y-6 p-4">
        {visibleSections.map((section) => (
          <div
            key={section.id}
            onClick={() => {
              setSelectedSectionId?.(section.id);
              setSelectedComponentId?.(null);
            }}
            className={cn(
              "space-y-4 rounded-lg p-2 transition-shadow",
              selectedSectionId === section.id && !selectedComponentId
                ? "border border-primary border-dashed"
                : "ring-1 ring-transparent",
            )}
          >
            {section.components
              .filter((c) => c.is_visible)
              .map((component) => {
                const config = getComponentConfig(component.component);
                const Renderer = getRenderer(config?.renderer);

                return (
                  <div
                    key={component.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSectionId?.(section.id);
                      setSelectedComponentId?.(component.id);
                    }}
                    className={cn(
                      "cursor-pointer rounded-lg transition-shadow",
                      selectedComponentId === component.id
                        ? "border border-primary border-dashed"
                        : "hover:ring-1 hover:ring-primary/30",
                    )}
                  >
                    {Renderer ? (
                      <Renderer
                        type={component.type}
                        template={component.template}
                        content={component.content}
                        settings={component.settings}
                      />
                    ) : (
                      <div className="rounded border border-dashed p-6 text-center text-xs text-muted-foreground">
                        No renderer registered for “{component.component}”
                      </div>
                    )}
                  </div>
                );
              })}

            {section.components.filter((c) => c.is_visible).length === 0 && (
              <div className="rounded border border-dashed p-8 text-center text-xs text-muted-foreground">
                {section.name} — empty section
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CustomPagePreviewControlPanel;