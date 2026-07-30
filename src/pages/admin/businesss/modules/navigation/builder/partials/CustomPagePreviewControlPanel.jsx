import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MonitorPlay } from "lucide-react";
import { getComponentConfig } from "@/store/default/componentRegistry";
import { getRenderer } from "@/components/renderers";
import { useApiQuery } from "@/hooks/useAppQuery";
import Loading from "@/components/shear/Loading";
import Navbar from "@/components/frontend/navbar/Navbar";
import Footer from "@/components/frontend/footer/Footer";
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

  // Move ALL hooks to the top, before any conditional returns
  const {
    data: settingsResponse,
    isLoading: settingsLoading,
    refetch: refetchSettings,
  } = useApiQuery({
    url: `/admin/business-settings`,
  });

  // Parse settings meta - do this before conditional returns
  const settingMeta = settingsResponse?.data?.settings?.meta
    ? settingsResponse.data.settings.meta
    : {};

    console.log("settingMeta - ",settingMeta)

  const {
    data: navbarResponse,
    isLoading: navbarLoading,
    refetch: navbarSettings,
  } = useApiQuery({
    url: `/admin/navbars/show/${settingMeta?.navbar_id}`,
    // Skip the query if navbar_id doesn't exist
    enabled: !!settingMeta?.navbar_id,
  });

  const {
    data: footerResponse,
    isLoading: footerLoading,
    refetch: footerSettings,
  } = useApiQuery({
    url: `/admin/footers/show/${settingMeta?.footer_id}`,
    // Skip the query if footer_id doesn't exist
    enabled: !!settingMeta?.footer_id,
  });

  // Now we can use conditional returns after all hooks are called
  if (settingsLoading) {
    return <Loading />;
  }

  if (navbarLoading || footerLoading) {
    return <Loading />;
  }

  const navbar = navbarResponse?.data || {};
  const footer = footerResponse?.data || {};

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
    <div>
      {Navbar ? <Navbar navbar={navbar} /> : null}
      {visibleSections.map((section) => (
        <div
          key={section.id}
          onClick={() => {
            setSelectedSectionId?.(section.id);
            setSelectedComponentId?.(null);
          }}
          className={cn(
            selectedSectionId === section.id && !selectedComponentId
              ? "ring-2 ring-primary"
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
                    "cursor-pointer transition-shadow",
                    selectedComponentId === component.id
                      ? "border border-primary border-dashed"
                      : "hover:border-primary",
                  )}
                >
                  {Renderer ? (
                    <Renderer
                      type={component.type}
                      template={component.template}
                      content={component.content}
                      settings={component.settings}
                      styles={component.styles}
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
      {Footer && <Footer footer={footer} />}
    </div>
  );
};

export default CustomPagePreviewControlPanel;
