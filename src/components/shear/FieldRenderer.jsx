import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ValueSlider } from "@/components/ui/value-slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useImageUpload from "@/hooks/use-image-upload";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eraser, GripVertical, Plus, Trash2, Upload } from "lucide-react";
import {
  buildArrayItem,
  mergeIntoShape,
  reorderArray,
} from "@/lib/builderHelper";
import ResourcePicker from "./ResourcePicker";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";


const FieldRenderer = ({ field, value, onChange }) => {
  const fileInputRef = useRef(null);

  const { setting } = useSelector((state) => state);
  const {
    image: imageBase64,
    preview,
    error: imageError,
    handleImageChange,
    resetImage,
    setImageUrl,
  } = useImageUpload(setting?.setting?.item?.image_size || 5);


  switch (field.type) {
    case "text":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <Input
            value={value ?? ""}
            placeholder={field.placeholder || field.label}
            onChange={(e) => onChange(e.target.value)}
          />
          {
            field?.helpText && (
              <small className="leading-none">{field?.helpText}</small>
            )
          }
        </Wrapper>
      );

    case "textarea":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <Textarea
            rows={3}
            value={value ?? ""}
            placeholder={field.placeholder || field.label}
            onChange={(e) => onChange(e.target.value)}
          />
        </Wrapper>
      );

    case "number":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <Input
            type="number"
            value={value ?? ""}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) =>
              onChange(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </Wrapper>
      );

    case "boolean":
      if (field?.visible === false) {
        return null;
      }
      return (
        <div className="flex items-center justify-between py-1">
          <Label className="text-xs">{field.label}</Label>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );

    case "color":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <div className="flex items-center gap-3">
            <label className="group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-border bg-background shadow-sm transition hover:border-primary hover:shadow">
              <input
                type="color"
                value={toHex6(value)}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />

              <span
                className="h-6 w-6 rounded-md border border-white shadow"
                style={{ backgroundColor: toHex6(value) }}
              />
            </label>

            <Input
              value={value ?? ""}
              placeholder="#2563EB"
              onChange={(e) => onChange(e.target.value)}
              className="font-mono uppercase"
            />
          </div>
        </Wrapper>
      );

    case "image":
      if (field?.visible === false) {
        return null;
      }

      useEffect(() => {
        if (imageBase64) {
          onChange(imageBase64);
        }
      }, [imageBase64]);
      return (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="text-xs">{field.label} </Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <Input
            value={value ?? ""}
            placeholder="https://... image url"
            onChange={(e) => onChange(e.target.value)}
          />
          {value ? (
            <img
              src={value}
              alt={field.label}
              className="mt-2 h-20 w-full rounded border object-cover"
            />
          ) : null}
        </div>
      );

    case "select":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <Select value={String(value ?? "")} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>

            <SelectContent className="min-w-(--radix-select-trigger-width)">
              {(field.options || []).map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Wrapper>
      );

    case "array":
      if (field?.visible === false) {
        return null;
      }

      return <ArrayField field={field} value={value} onChange={onChange} />;

    case "slider":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <ValueSlider
            value={[value ?? field.default ?? 75]}
            onValueChange={(val) => onChange(val[0])}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            className="w-full"
          />
        </Wrapper>
      );
    case "radio":
      if (field?.visible === false) {
        return null;
      }

      return (
        <Wrapper label={field.label}>
          <RadioGroup
            value={value ?? field.default ?? field.options?.[0]?.value}
            onValueChange={onChange}
            className="grid grid-cols-2 gap-1.5"
          >
            {(field.options ?? []).map((option) => {
              const checked =
                (value ?? field.default ?? field.options?.[0]?.value) ===
                option.value;

              return (
                <Label
                  key={option.value}
                  htmlFor={`${field.key}-${option.value}`}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1.5",
                    "text-xs font-medium leading-none transition-colors",
                    checked
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-input text-muted-foreground hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  <RadioGroupItem
                    id={`${field.key}-${option.value}`}
                    value={option.value}
                    className="h-3.5 w-3.5"
                  />
                  <span className="truncate">{option.label}</span>
                </Label>
              );
            })}
          </RadioGroup>
        </Wrapper>
      );

    default:
      return (
        <p className="text-xs text-destructive">
          Unknown field type: {field.type} ({field.key})
        </p>
      );
  }
};

/* ---------------- Array / Repeater field ---------------- */

const ArrayField = ({ field, value, onChange }) => {
  const items = Array.isArray(value) ? value : [];
  const dragIndex = useRef(null);

  const updateItem = (index, key, itemValue) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [key]: itemValue } : item,
    );
    onChange(next);
  };

  const addItem = () => onChange([...items, buildArrayItem(field.itemFields)]);
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index));

  /* Existing CRUD data থেকে item append —
     mapped data-র মধ্যে শুধু itemFields-এর key-গুলোই নেওয়া হয় */
  const addFromSource = (mapped, rawItem) => {
    const fresh = buildArrayItem(field.itemFields);
    const merged = mergeIntoShape(fresh, mapped);
    merged._id = fresh._id;
    merged._sourceId = rawItem?.id; // কোন record থেকে এসেছে, track রাখার জন্য
    onChange([...items, merged]);
  };

  /* Picker-এ picked item-এ আবার click → toggle করে remove */
  const removeFromSource = (rawItem) =>
    onChange(items.filter((item) => item._sourceId !== rawItem.id));

  /* Clear — সব item একসাথে মুছে ফেলা */
  const clearAll = () => onChange([]);

  const handleDrop = (toIndex) => {
    if (dragIndex.current === null || dragIndex.current === toIndex) return;
    onChange(reorderArray(items, dragIndex.current, toIndex));
    dragIndex.current = null;
  };

  const isHideAddButton = ['imageGallery'].includes(field?.key)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1">
        <Label className="text-xs">{field.label}
          {
            field?.limit && (
              <span>{field?.limit - items?.length}</span>
            )
          }
        </Label>
        <div className="flex items-center gap-1">
          {field.sourceKeys?.length > 0 && (
            <ResourcePicker
              sourceKeys={field.sourceKeys}
              onPick={addFromSource}
              onUnpick={removeFromSource} /* picked item-এ click = unselect */
              closeOnPick={false} /* একসাথে একাধিক pick করা যাবে */
              pickedIds={items.map((i) => i._sourceId).filter(Boolean)}
              triggerLabel="Pick"
            />
          )}
          {
            !isHideAddButton && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2"
                onClick={addItem}
                disabled={items?.length === field?.limit ? true : false}
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            )
          }

          {items.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-destructive hover:text-destructive"
              onClick={clearAll}
            >
              <Eraser className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <p className="rounded border border-dashed p-3 text-center text-xs text-muted-foreground">
          No items yet. Click “Add”.
        </p>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item._id || index}
            draggable
            onDragStart={() => (dragIndex.current = index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="space-y-2 rounded-md border bg-muted/30 p-2"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <GripVertical className="h-3 w-3 cursor-grab" />
                Item {index + 1}
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {(field.itemFields || []).map((itemField) => (
              <FieldRenderer
                key={itemField.key}
                field={itemField}
                value={item[itemField.key]}
                onChange={(v) => updateItem(index, itemField.key, v)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Small helpers ---------------- */

const Wrapper = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs">{label} </Label>
    {children}
  </div>
);

const toHex6 = (value) => {
  if (typeof value === "string" && /^#([0-9a-f]{6})/i.test(value)) {
    return value.slice(0, 7);
  }
  return "#000000";
};

export default FieldRenderer;
