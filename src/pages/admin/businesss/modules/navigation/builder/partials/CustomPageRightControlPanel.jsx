import React, { useState, useMemo, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApiQuery } from "@/hooks/useAppQuery";
import {
  Settings2,
  LayoutTemplate,
  Image,
  Check,
  PanelsTopLeft,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Info } from "lucide-react";

import { fullPageConfig } from "@/store/default/page-config";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@base-ui/react";
import { MODULES } from "@/store/default/modules";
import { Badge } from "@/components/ui/badge";

const FONT_OPTIONS = [
  { value: "'Hind Siliguri', sans-serif", label: "Hind Siliguri" },
  { value: "'Noto Sans Bengali', sans-serif", label: "Noto Sans Bengali" },
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
];

const THEME_VARIANTS = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional blue theme",
    style: {
      primary_color: "#1e40af",
      secondary_color: "#0ea5e9",
      background_color: "#ffffff",
      section_alt_bg: "#f8fafc",
      heading_color: "#0f172a",
      text_color: "#334155",
      font_family: FONT_OPTIONS[0].value,
      heading_font: FONT_OPTIONS[0].value,
      border_radius: 12,
      container_width: "7xl",
    },
  },
  {
    id: "dark",
    name: "Dark Aura",
    description: "Deep contrast for premium presentation",
    style: {
      primary_color: "#8b5cf6",
      secondary_color: "#f59e0b",
      background_color: "#0f172a",
      section_alt_bg: "#111827",
      heading_color: "#f8fafc",
      text_color: "#cbd5e1",
      font_family: FONT_OPTIONS[3].value,
      heading_font: FONT_OPTIONS[3].value,
      border_radius: 16,
      container_width: "7xl",
    },
  },
  {
    id: "green",
    name: "Green Focus",
    description: "Fresh, modern and calm",
    style: {
      primary_color: "#047857",
      secondary_color: "#10b981",
      background_color: "#f0fdf4",
      section_alt_bg: "#ecfccb",
      heading_color: "#14532d",
      text_color: "#365314",
      font_family: FONT_OPTIONS[1].value,
      heading_font: FONT_OPTIONS[1].value,
      border_radius: 10,
      container_width: "6xl",
    },
  },
];

const CustomPageRightControlPanel = ({
  sections,
  selectedSectionId,
  selectedComponentId,
  handleChange,
}) => {
  const selectedSection = useMemo(() => {
    return sections.find((section) => section.id === selectedSectionId) ?? null;
  }, [sections, selectedSectionId]);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;

    for (const section of sections) {
      const component = section.components?.find(
        (component) => component.id === selectedComponentId,
      );

      if (component) {
        return component;
      }
    }

    return null;
  }, [sections, selectedComponentId]);

  const EditorRender = () => {
    switch (selectedComponent?.type) {
      case "banner":
      case "carousel":
        return (
          <HeroBannerEditor
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            selectedComponent={selectedComponent}
            handleChange={handleChange}
          />
        );

      case "information":
        return (
          <InformationEditor
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            selectedComponent={selectedComponent}
            handleChange={handleChange}
          />
        );

      case "list":
        return (
          <ListEditor
            selectedSectionId={selectedSectionId}
            selectedComponentId={selectedComponentId}
            selectedComponent={selectedComponent}
            handleChange={handleChange}
          />
        );
      default:
        return <DefaultEditor />;
    }
  };

  return <EditorRender />;
};

export default CustomPageRightControlPanel;

const DefaultEditor = () => {
  return (
    <div className="h-full flex justify-center items-center bg-white">
      <div>No selected Component</div>
    </div>
  );
};

const HeroBannerEditor = ({
  selectedSectionId,
  selectedComponentId,
  selectedComponent,
  handleChange,
}) => {
  const setSelectedTemplate = () => {};
  const HERO_TYPES = [
    {
      id: "carousel",
      label: "Hero Slider",
      icon: PanelsTopLeft,
    },
    {
      id: "banner",
      label: "Hero Banner",
      icon: Image,
    },
  ];

  const HERO_TEMPLATES = {
    carousel: [
      "classicCarousel",
      "simpleCarousel",
      "modernCarousel",
      "imageCarousel",
      "immersiveSlider",
      "simpleImageSlider",
    ],

    banner: ["classicBanner", "stellarBanner", "simpleBanner"],
  };

  const heroType =
    selectedComponent?.type === "carousel" ? "carousel" : "banner";
  const selectedTemplate =
    selectedComponent?.template ||
    (heroType === "carousel" ? "classicCarousel" : "classicBanner");

  return (
    <Card className="shadow-none rounded-xl border-border/50 bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <LayoutTemplate className="h-5 w-5 text-primary" />
          Hero Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Hero Type */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            Hero Type
          </h4>

          <div className="flex gap-2 flex-wrap">
            {HERO_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={heroType === item.id ? "default" : "outline"}
                  size="sm"
                  className={`
                    gap-2 px-4 py-2 h-auto rounded-[5px]
                    ${
                      heroType === item.id
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-secondary hover:text-secondary-foreground"
                    }
                  `}
                  onClick={() => setHeroType(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">
            Templates
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {HERO_TEMPLATES[heroType].map((template) => (
              <button
                key={template}
                className={`
                  group relative rounded-xl border-2 p-4 text-left
                  transition-all duration-200
                  hover:border-primary hover:shadow-md hover:-translate-y-0.5
                  ${
                    selectedTemplate === template
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border/60 bg-card hover:bg-secondary/50"
                  }
                `}
                onClick={() => setSelectedTemplate(template)}
              >
                {/* Checkmark badge */}
                {selectedTemplate === template && (
                  <div className="absolute right-3 top-3 rounded-full bg-primary p-1 shadow-sm">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}

                {/* Preview area */}
                <div
                  className={`
                  aspect-video rounded-lg mb-3 
                  flex items-center justify-center
                  transition-colors duration-200
                  ${
                    selectedTemplate === template
                      ? "bg-primary/10"
                      : "bg-muted/50 group-hover:bg-muted"
                  }
                `}
                >
                  <LayoutTemplate
                    className={`
                    h-8 w-8 transition-colors duration-200
                    ${
                      selectedTemplate === template
                        ? "text-primary"
                        : "text-muted-foreground/60 group-hover:text-muted-foreground"
                    }
                  `}
                  />
                </div>

                {/* Template info */}
                <p className="font-medium text-sm text-foreground">
                  {template}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Responsive hero layout
                </p>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InformationEditor = ({
  selectedSectionId,
  selectedComponent,
  handleChange,
}) => {
  const template = selectedComponent.template;
  const content = selectedComponent?.[template]?.content || {};

  const [form, setForm] = useState(content);
  const [slug, setSlug] = useState("");

  // Sync form when selected component changes
  useEffect(() => {
    setForm(content);
  }, [content]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handelSave = () => {
    handleChange(
      selectedSectionId,
      selectedComponent.id,
      `${template}.content`,
      form,
    );
  };

  const { data: moduleResponse, isLoading } = useApiQuery({
    url: `/admin/business-modules/${slug}`,
    enabled: !!slug,
  });

  const handleSelectModule = (module) => {
    setSlug(module);
  };

  useEffect(() => {
    if (!moduleResponse?.data) return;

    const d = moduleResponse.data;

    const newForm = {
      title: d.title,
      subTitle: d.sub_title,
      shortDescription: d.short_description,
      fullDescription: d.description,
      image: d.image_full_path,
      buttonText: d.button_text || "আরও জানুন",
      slug: d.title_slug,
    };

    setForm(newForm);

    handleChange(
      selectedSectionId,
      selectedComponent.id,
      `${template}.content`,
      newForm,
    );
  }, [moduleResponse]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            Information Section
          </div>

          <Button className={'bg-primary text-white rounded-[5px] px-2 cursor-pointer'} size="sm" onClick={handelSave}>
            Save
          </Button>
        </CardTitle>

        <div className="flex flex-wrap gap-1 mt-2">
          {[
            MODULES.PRESIDENT_MESSAGE,
            MODULES.INTRODUCTION,
            MODULES.WHAT_WE_WANT,
            MODULES.FOUNDING_PRESIDENT,
          ].map((module) => (
            <Badge
              key={module}
              variant={slug === module ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => handleSelectModule(module)}
            >
              {module}
            </Badge>
          ))}
        </div>

        {isLoading && (
          <p className="text-xs text-muted-foreground mt-1">
            Loading module...
          </p>
        )}
      </CardHeader>

      <CardContent>
        <Accordion
          type="multiple"
          defaultValue={["content"]}
          className="w-full"
        >
          <AccordionItem value="content">
            <AccordionTrigger>Content Settings</AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={form.title || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Sub Title</Label>
                  <Input
                    name="subTitle"
                    value={form.subTitle || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Short Description</Label>
                  <Textarea
                    rows={3}
                    name="shortDescription"
                    value={form.shortDescription || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Full Description</Label>
                  <Textarea
                    rows={6}
                    name="fullDescription"
                    value={form.fullDescription || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Button Text</Label>
                  <Input
                    name="buttonText"
                    value={form.buttonText || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Slug</Label>
                  <Input
                    name="slug"
                    value={form.slug || ""}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <Label>Image URL</Label>
                  <Input
                    name="image"
                    value={form.image || ""}
                    onChange={onChange}
                    placeholder="https://..."
                  />

                  {form.image && (
                    <img
                      src={form.image}
                      alt={form.title}
                      className="mt-2 w-full h-40 rounded-md object-cover border"
                    />
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
const ListEditor = ({
  selectedSectionId,
  selectedComponentId,
  selectedComponent,
  handleChange,
}) => {
  return <div>List Editor</div>;
};
