import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  LayoutTemplate,
  Palette,
  Plus,
  Settings2,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useAppQuery";
import CustomPageLeftControl from "./partials/CustomPageLeftControlPanel";
import CustomPageRightControlPanel from "./partials/CustomPageRightControlPanel";
import CustomPagePreviewControlPanel from "./partials/CustomPagePreviewControlPanel";
import { setByPath } from "@/lib/helper";
import { useParams } from "react-router";
import { useApiMutation } from "@/hooks/useAppMutation";

const CustomPageBuilder = () => {
  // All hooks must be called unconditionally at the top level
  const { data: navs } = useApiQuery({
    url: "/admin/navbars/list",
  });

  const { id } = useParams();
  const { data: pageResponse, isLoading: pageLoading } = useApiQuery({
    url: `/admin/pages/${id}`,
    enabled: !!id,
  });

  const { mutate: pageMetaMutation, isLoading: pageMetaLoading } =
    useApiMutation({
      url: "/admin/pages",
      method: "POST",
    });

  const [themeName, setThemeName] = useState("Dynamic Theme");
  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  useMemo(() => {
    if (pageResponse?.data?.meta) {
      try {
        const pageMeta = JSON.parse(pageResponse.data.meta);
        console.log("pageMeta", pageMeta);
        if (pageMeta?.page_config) {
          setSections(pageMeta.page_config);
        }
      } catch (error) {
        console.error("Failed to parse page meta:", error);
      }
    }
  }, [pageResponse]);

  if (pageLoading) {
    return (
      <div className="h-full flex justify-center items-center">Loading...</div>
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

    const response = await pageMetaMutation(payload);
    console.log("clicked on save theme - ", {
      payload,
      response,
    });

    toast.success(`Theme saved: ${themeName}`);
  };

  const handleAddSection = (section) => {
    setSections((prev) => [...prev, section]);
  };

  const handleRemoveSection = (section) => {
    setSections((prev) => prev.filter((item) => item.id !== section.id));
  };

  const handleToggleVisibleSection = (section) => {
    setSections((prev) =>
      prev.map((item) =>
        item.id === section.id
          ? {
              ...item,
              is_visible: !item.is_visible,
            }
          : item,
      ),
    );
  };

  const handleAddComponent = (sectionId, component) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              components: [...section.components, component],
            }
          : section,
      ),
    );
  };

  const handleRemoveComponent = (sectionId, componentId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              components: section.components.filter(
                (item) => item.id !== componentId,
              ),
            }
          : section,
      ),
    );
  };

  const handleToggleVisibleComponent = (sectionId, componentId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              components: section.components.map((component) =>
                component.id === componentId
                  ? {
                      ...component,
                      is_visible: !component.is_visible,
                    }
                  : component,
              ),
            }
          : section,
      ),
    );
  };

  const handleChange = (sectionId, componentId, path, value) => {
    console.log("handleChange - builder - ", {
      sectionId,
      componentId,
      path,
      value,
    });
    setSections((prev) =>
      prev.map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          components: section.components.map((component) => {
            if (component.id !== componentId) return component;

            console.log("bulder handel change - ", {
              component,
              path,
              value,
            });
            return setByPath(component, path, value);
          }),
        };
      }),
    );
  };

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
              <Button onClick={savePage}>
                <Wand2 className="mr-2 h-4 w-4" /> Save Theme
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px] h-[calc(100vh-120px)]">
        <div className="sticky top-20 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
            <CustomPageLeftControl
              sections={sections}
              onAddSection={handleAddSection}
              onRemoveSection={handleRemoveSection}
              onToggleVisibleSection={handleToggleVisibleSection}
              onAddComponent={handleAddComponent}
              onRemoveComponent={handleRemoveComponent}
              onToggleVisibleComponent={handleToggleVisibleComponent}
              setSelectedSectionId={setSelectedSectionId}
              setSelectedComponentId={setSelectedComponentId}
            />
        </div>

        {/* <div className="sticky top-20 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
          <CustomPagePreviewControlPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
          />
        </div>
        <div className="sticky top-20 h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar">
          <CustomPageRightControlPanel
            sections={sections}
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            handleChange={handleChange}
          />
        </div> */}
      </div>
    </div>
  );
};

export default CustomPageBuilder;
