import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  MousePointerClick,
  Paintbrush,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import {
  getComponentConfig,
  getStyleFields,
  getTemplateConfig,
  getTemplateOptions,
  getTypeOptions,
} from "@/store/default/componentRegistry";
import FieldRenderer from "@/components/shear/FieldRenderer";
import ResourcePicker from "@/components/shear/ResourcePicker";
import { buildDefaults, mergeIntoShape } from "@/lib/builderHelper";

/**
 * =====================================================================
 * RIGHT SIDEBAR — Dynamic Property Panel (Tab System)
 * =====================================================================
 * Selected Component → Type → Template → Configuration → Form
 *
 * ৩টি Tab:
 *  - Content  : group নেই / group: "content" — টেক্সট, ইমেজ, slides...
 *  - Settings : group: "settings" — autoplay, speed, columns...
 *  - Style    : group: "style" (template-specific) + GLOBAL_STYLE_FIELDS
 *               → component.styles-এ save হয়, Preview-তে live apply হয়
 *
 * এখানে একটিও input hard code নেই। Template change হলেই
 * পুরনো form remove হয়ে নতুন Template-এর form generate হয়।
 * =====================================================================
 */
const CustomPageRightControlPanel = ({
  sections,
  selectedSectionId,
  selectedComponentId,
  handleChange, // (sectionId, componentId, path, value)
  onChangeType, // (sectionId, componentId, newType)
  onChangeTemplate, // (sectionId, componentId, newTemplate)
}) => {
  const section = sections.find((s) => s.id === selectedSectionId);
  const component = section?.components.find(
    (c) => c.id === selectedComponentId,
  );

  /* ---------- Empty state ---------- */
  if (!component) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center justify-center gap-2 py-16 text-center">
          <MousePointerClick className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">Nothing selected</p>
          <p className="text-xs text-muted-foreground">
            Select a component from the left panel to edit its properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  const componentConfig = getComponentConfig(component.component);
  const typeOptions = getTypeOptions(component.component);
  const templateOptions = getTemplateOptions(component.component, component.type);
  const templateConfig = getTemplateConfig(
    component.component,
    component.type,
    component.template,
  );

  const fields = templateConfig?.fields || [];
  const contentFields = fields.filter(
    (f) => f.group !== "settings" && f.group !== "style",
  );
  const settingsFields = fields.filter((f) => f.group === "settings");
  const styleFields = getStyleFields(
    component.component,
    component.type,
    component.template,
  );

  /* group অনুযায়ী value ও state path */
  const groupOf = (field) =>
    field.group === "settings" ? "settings" :
    field.group === "style" ? "styles" :
    "content";

  const fieldValue = (field) => component[groupOf(field)]?.[field.key];
  const fieldPath = (field) => `${groupOf(field)}.${field.key}`;

  const renderFields = (list) =>
    list.map((field) => (
      <FieldRenderer
        key={`${component.template}-${groupOf(field)}-${field.key}`}
        field={field}
        value={fieldValue(field)}
        onChange={(value) =>
          handleChange(section.id, component.id, fieldPath(field), value)
        }
      />
    ));

  const EmptyTab = ({ label }) => (
    <p className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
      This template has no {label} options.
    </p>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings2 className="h-4 w-4" />
          {componentConfig?.label || component.component} Properties
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ---------- Type selector (একাধিক type থাকলেই দেখাবে) ---------- */}
        {typeOptions.length > 1 && (
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select
              value={component.type}
              onValueChange={(newType) =>
                onChangeType(section.id, component.id, newType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ---------- Template selector (type অনুযায়ী auto-filtered) ---------- */}
        <div className="space-y-1.5">
          <Label className="text-xs">Template</Label>
          <Select
            value={component.template}
            onValueChange={(newTemplate) =>
              onChangeTemplate(section.id, component.id, newTemplate)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templateOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ---------- Content Source (existing CRUD data থেকে pick) ---------- */}
        {templateConfig?.sourceKeys?.length > 0 && (
          <div className="flex items-center justify-between rounded-md border border-dashed bg-muted/30 p-2">
            <div>
              <p className="text-[11px] font-medium">Content source</p>
              <p className="text-[10px] text-muted-foreground">
                {component.content?._sourceId
                  ? "Loaded from existing record (still editable)"
                  : "Pick a record or fill in manually below"}
              </p>
            </div>
            <ResourcePicker
              field={{
                moduleType:templateConfig.moduleType || null 
              }}
              sourceKeys={templateConfig.sourceKeys}
              closeOnPick
              pickedIds={
                component.content?._sourceId ? [component.content._sourceId] : []
              }
              onPick={(mapped, rawItem) => {
                /* mapped data-র মধ্যে শুধু এই template-এর field গুলোই বসবে */
                const merged = mergeIntoShape(component.content, mapped);
                merged._sourceId = rawItem?.id;
                handleChange(section.id, component.id, "content", merged);
              }}
              onUnpick={() => {
                /* Picked record-এ আবার click → unselect:
                   content আবার template-এর default-এ ফিরে যাবে */
                const defaults = buildDefaults(
                  component.component,
                  component.type,
                  component.template,
                );
                handleChange(section.id, component.id, "content", defaults.content);
              }}
            />
          </div>
        )}

        <Separator />

        {/* ---------- Content | Settings | Style tabs ---------- */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="gap-1 text-xs">
              <FileText className="h-3 w-3" /> Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-1 text-xs">
              <SlidersHorizontal className="h-3 w-3" /> Settings
            </TabsTrigger>
            <TabsTrigger value="style" className="gap-1 text-xs">
              <Paintbrush className="h-3 w-3" /> Style
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-3 space-y-3">
            {contentFields.length > 0 ? (
              renderFields(contentFields)
            ) : (
              <EmptyTab label="content" />
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-3 space-y-3">
            {settingsFields.length > 0 ? (
              renderFields(settingsFields)
            ) : (
              <EmptyTab label="settings" />
            )}
          </TabsContent>

          <TabsContent value="style" className="mt-3 space-y-3">
            {styleFields.length > 0 ? (
              renderFields(styleFields)
            ) : (
              <EmptyTab label="style" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomPageRightControlPanel;