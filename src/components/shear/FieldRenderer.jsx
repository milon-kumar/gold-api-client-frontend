import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eraser, GripVertical, Plus, Trash2 } from "lucide-react";
import { buildArrayItem, mergeIntoShape, reorderArray } from "@/lib/builderHelper";
import ResourcePicker from "./ResourcePicker";
import { useRef } from "react";

/**
 * =====================================================================
 * FIELD RENDERER — Dynamic Form Engine
 * =====================================================================
 * একটি field definition object নেয় এবং সঠিক Input Control render করে।
 * নতুন field type support করতে চাইলে শুধু নিচে একটি case যোগ করুন।
 *
 * Props:
 *  - field  : registry-র field definition
 *  - value  : বর্তমান value
 *  - onChange(newValue) : value change callback
 * =====================================================================
 */
const FieldRenderer = ({ field, value, onChange }) => {
  switch (field.type) {
    case "text":
      return (
        <Wrapper label={field.label}>
          <Input
            value={value ?? ""}
            placeholder={field.placeholder || field.label}
            onChange={(e) => onChange(e.target.value)}
          />
        </Wrapper>
      );

    case "textarea":
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
      return (
        <Wrapper label={field.label}>
          <Input
            type="number"
            value={value ?? ""}
            min={field.min}
            max={field.max}
            step={field.step}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </Wrapper>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between py-1">
          <Label className="text-xs">{field.label}</Label>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      );

    case "color":
      return (
        <Wrapper label={field.label}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="h-9 w-10 cursor-pointer rounded border bg-transparent p-1"
              value={toHex6(value)}
              onChange={(e) => onChange(e.target.value)}
            />
            <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          </div>
        </Wrapper>
      );

    case "image":
      /* আপাতত URL input; আপনার Media Uploader থাকলে এখানে বসান —
         onChange(url) call করলেই বাকি সব কাজ করবে। */
      return (
        <Wrapper label={field.label}>
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
        </Wrapper>
      );

    case "select":
      return (
        <Wrapper label={field.label}>
          <Select value={String(value ?? "")} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
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
      return <ArrayField field={field} value={value} onChange={onChange} />;

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1">
        <Label className="text-xs">{field.label}</Label>
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
          <Button size="sm" variant="outline" className="h-7 px-2" onClick={addItem}>
            <Plus className="h-3 w-3" /> Add
          </Button>
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
    <Label className="text-xs">{label}</Label>
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