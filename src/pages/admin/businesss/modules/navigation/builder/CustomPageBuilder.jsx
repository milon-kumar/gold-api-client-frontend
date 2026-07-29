import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LayoutTemplate, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router";
import { useApiQuery } from "@/hooks/useAppQuery";
import { useApiMutation } from "@/hooks/useAppMutation";
import { setByPath } from "@/lib/builderHelper";
import { migrateComponent, reorderArray } from "@/lib/builderHelper";
import CustomPageLeftControlPanel from "./partials/CustomPageLeftControlPanel";
import CustomPageRightControlPanel from "./partials/CustomPageRightControlPanel";
import CustomPagePreviewControlPanel from "./partials/CustomPagePreviewControlPanel";

const CustomPageBuilder = () => {
  const { id } = useParams();

  const { data: pageResponse, isLoading: pageLoading } = useApiQuery({
    url: `/admin/pages/${id}`,
    enabled: !!id,
  });

  const { mutate: pageMetaMutation,isLoading:pageMetaMutationLoading } = useApiMutation({
    url: "/admin/pages",
    method: "POST",
  });

  const [themeName, setThemeName] = useState("Dynamic Theme");
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  /* Load saved config (useMemo নয় — side effect তাই useEffect) */
  useEffect(() => {
    if (pageResponse?.data?.meta) {
      try {
        const pageMeta = JSON.parse(pageResponse.data.meta);
        if (pageMeta?.page_config) {
          const parsed =
            typeof pageMeta.page_config === "string"
              ? JSON.parse(pageMeta.page_config)
              : pageMeta.page_config;
          setSections(parsed);
        }
      } catch (error) {
        console.error("Failed to parse page meta:", error);
      }
    }
  }, [pageResponse]);

  if (pageLoading) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  const savePage = async () => {
    const page = pageResponse.data;
    const payload = {
      ...page,
      meta: {
        page_config: JSON.stringify(sections),
      },
    };
    await pageMetaMutation(payload);
    toast.success(`Theme saved: ${themeName}`);
  };

  /* ---------------- Section handlers ---------------- */

  const handleAddSection = (section) =>
    setSections((prev) => [...prev, section]);

  const handleRemoveSection = (section) => {
    setSections((prev) => prev.filter((item) => item.id !== section.id));
    if (selectedSectionId === section.id) {
      setSelectedSectionId(null);
      setSelectedComponentId(null);
    }
  };

  const handleToggleVisibleSection = (section) =>
    setSections((prev) =>
      prev.map((item) =>
        item.id === section.id
          ? { ...item, is_visible: !item.is_visible }
          : item,
      ),
    );

  const handleReorderSection = (fromIndex, toIndex) =>
    setSections((prev) => reorderArray(prev, fromIndex, toIndex));

  /* ---------------- Component handlers ---------------- */

  const updateSection = (sectionId, updater) =>
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? updater(section) : section,
      ),
    );

  const handleAddComponent = (sectionId, component) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: [...section.components, component],
    }));

  const handleRemoveComponent = (sectionId, componentId) => {
    updateSection(sectionId, (section) => ({
      ...section,
      components: section.components.filter((item) => item.id !== componentId),
    }));
    if (selectedComponentId === componentId) setSelectedComponentId(null);
  };

  const handleToggleVisibleComponent = (sectionId, componentId) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: section.components.map((component) =>
        component.id === componentId
          ? { ...component, is_visible: !component.is_visible }
          : component,
      ),
    }));

  const handleReorderComponent = (sectionId, fromIndex, toIndex) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: reorderArray(section.components, fromIndex, toIndex),
    }));

  /* ---------------- Property panel handlers ---------------- */

  /** যেকোনো field change: path যেমন "content.title" বা "settings.autoplay" */
  const handleChange = (sectionId, componentId, path, value) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: section.components.map((component) =>
        component.id === componentId
          ? setByPath(component, path, value)
          : component,
      ),
    }));

  /** Type change → template reset to new type's default + fields migrate */
  const handleChangeType = (sectionId, componentId, newType) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: section.components.map((component) =>
        component.id === componentId
          ? migrateComponent(component, newType)
          : component,
      ),
    }));

  /** Template change → নতুন template-এর configuration অনুযায়ী fields migrate */
  const handleChangeTemplate = (sectionId, componentId, newTemplate) =>
    updateSection(sectionId, (section) => ({
      ...section,
      components: section.components.map((component) =>
        component.id === componentId
          ? migrateComponent(component, component.type, newTemplate)
          : component,
      ),
    }));

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <LayoutTemplate className="h-4 w-4" /> Dynamic Theme Builder
              </CardTitle>
              <CardDescription className="text-xs">
                Manage sections, toggle visibility, customize content, and
                preview the full page in one place.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={themeName}
                onChange={(event) => setThemeName(event.target.value)}
                placeholder="Theme name"
                className="h-9 w-48"
              />
              <Button onClick={savePage} disabled={pageMetaMutationLoading}>
                {
                  pageMetaMutationLoading ? <Loader2 className="mr-1 h-4 w-4 animate-spin"/> : <Wand2 className="mr-1 h-4 w-4" />
                }
                 {pageMetaMutationLoading ? 'Saving...' : 'Save Theme'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid h-[calc(100vh-120px)] gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* -------- Left: structure -------- */}
        <div className="hide-scrollbar sticky top-20 h-[calc(100vh-100px)] overflow-y-auto">
          <CustomPageLeftControlPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            onAddSection={handleAddSection}
            onRemoveSection={handleRemoveSection}
            onToggleVisibleSection={handleToggleVisibleSection}
            onReorderSection={handleReorderSection}
            onAddComponent={handleAddComponent}
            onRemoveComponent={handleRemoveComponent}
            onToggleVisibleComponent={handleToggleVisibleComponent}
            onReorderComponent={handleReorderComponent}
            setSelectedSectionId={setSelectedSectionId}
            setSelectedComponentId={setSelectedComponentId}
          />
        </div>

        {/* -------- Middle: live preview -------- */}
        <div className="hide-scrollbar sticky top-20 h-[calc(100vh-100px)] overflow-y-auto">
          <CustomPagePreviewControlPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            setSelectedSectionId={setSelectedSectionId}
            setSelectedComponentId={setSelectedComponentId}
          />
        </div>

        {/* -------- Right: dynamic property panel -------- */}
        <div className="hide-scrollbar sticky top-20 h-[calc(100vh-100px)] overflow-y-auto">
          <CustomPageRightControlPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            handleChange={handleChange}
            onChangeType={handleChangeType}
            onChangeTemplate={handleChangeTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomPageBuilder;
